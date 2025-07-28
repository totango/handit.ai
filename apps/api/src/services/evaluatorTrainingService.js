import fs from 'fs';
import path from 'path';
import os from 'os';
import OpenAI from 'openai';
import db from '../../models/index.js';
import { redisService } from './redisService.js';
import { parseInput } from './parseInput.js';
import { Op } from 'sequelize';
import {
  parseAttachments,
  parseContext,
  parseInputContent,
  parseOutputContent,
} from './parser.js';
import {
  classificationEvaluationSystemPrompt,
  classificationEvaluationUserPrompt,
  LLMEvaluationSystemPrompt,
  LLMEvaluationUserPrompt,
} from './evaluationPrompts.js';

const { Model, ModelLog, ModelGroup } = db;
const openAi = new OpenAI({
  baseURL: process?.env?.BEDROCK_URL,
  apiKey: process?.env?.BEDROCK_API_KEY,
  maxRetries: 10,
  timeout: 3600000, // 1 hour timeout
  defaultHeaders: {
    Authorization: `Bearer ${process?.env?.BEDROCK_API_KEY}`,
  },
});

const createTrainingFile = async (trainingData) => {
  // Create temp file path
  const tempFilePath = path.join(os.tmpdir(), `training_${Date.now()}.jsonl`);

  // Write each training example as a JSON line
  const fileStream = fs.createWriteStream(tempFilePath);
  for (const example of trainingData) {
    fileStream.write(JSON.stringify(example) + '\n');
  }
  await new Promise((resolve) => fileStream.end(resolve));

  // Upload file to OpenAI
  const file = await openAi.files.create({
    file: fs.createReadStream(tempFilePath),
    purpose: 'fine-tune',
  });

  // Delete temp file
  fs.unlinkSync(tempFilePath);

  return file.id;
};

export const createEvaluatorTrainingJob = async (modelId, sequelize) => {
  try {
    const model = await Model.findByPk(modelId);
    const isLLMEvaluation = model.problemType === 'text_generation';

    // Get labeled data
    let labeledLogs = await ModelLog.findAll({
      where: {
        modelId,
        processed: true,
        actual: { [Op.not]: null },
        environment: 'production',
      },
      order: [['createdAt', 'DESC']],
      limit: 2000,
    });

    if (labeledLogs.length < 10) {
      throw new Error(
        'Insufficient labeled data for training (minimum 10 required)'
      );
    }

    // Prepare training data based on model type
    let trainingData = await Promise.all(
      labeledLogs.map(async (log, index) => {
        let attachments = await parseAttachments(log.input);
        attachments = attachments.filter(
          (att) =>
            att.includes('https://') ||
            att.includes('http://') ||
            att.includes('www.') ||
            att.includes('base64')
        );
        const imageAttachments = attachments.map((att) => ({
          type: 'image_url',
          image_url: {
            url: att,
          },
        }));

        const userContent =
          imageAttachments.length > 0
            ? [
                {
                  type: 'text',
                  text: parseInputContent(log.input),
                },
                ...imageAttachments.sort(() => Math.random() - 0.5).slice(0, 3),
              ]
            : parseInputContent(log.input);

        return {
          messages: [
            {
              role: 'system',
              content: isLLMEvaluation
                ? LLMEvaluationSystemPrompt
                : classificationEvaluationSystemPrompt,
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: `System Prompt: ${parseContext(log.input)}`,
                },
                {
                  type: 'text',
                  text: 'User Input:',
                },
                ...(Array.isArray(userContent)
                  ? userContent
                  : [
                      {
                        type: 'text',
                        text: userContent,
                      },
                    ]),
                {
                  type: 'text',
                  text: `Generated Output: ${parseOutputContent(log.output)}`,
                },
                {
                  type: 'text',
                  text: isLLMEvaluation
                    ? LLMEvaluationUserPrompt
                    : classificationEvaluationUserPrompt,
                },
              ],
            },
            {
              role: 'assistant',
              content: isLLMEvaluation
                ? JSON.stringify({
                    metrics: {
                      relevance: log.actual.relevance,
                      coherence: log.actual.coherence,
                      correctness: log.actual.correct ? 10 : 0,
                    },
                    confidenceLevel: 'High',
                  })
                : JSON.stringify({
                    classificationAccuracy: {
                      modelOutput: log.actual?.class,
                      expectedOutput: log.actual?.modelClass,
                    },
                    reasoningQuality: { score: 9 },
                    outputFormatting: { score: 9 },
                    confidenceLevel: 'High',
                  }),
            },
          ],
        };
      })
    );

    trainingData = trainingData.filter((data) => data !== null);

    // Create training file
    const fileId = await createTrainingFile(trainingData);

    // Create fine-tuning job
    const fineTuningJob = await openAi.fineTuning.jobs.create({
      model: 'gpt-4o-2024-08-06',
      training_file: fileId,
      hyperparameters: {
        n_epochs: 3,
      },
    });

    // Store training job info in Redis
    await redisService.set(`evaluator-training:${modelId}`, {
      jobId: fineTuningJob.id,
      fileId,
      status: 'pending',
      createdAt: new Date(),
      modelId,
      dataPoints: labeledLogs.length,
      evaluationType: isLLMEvaluation ? 'LLM' : 'Classification',
      hasImages: trainingData.some((data) =>
        data.messages.some(
          (msg) =>
            Array.isArray(msg.content) &&
            msg.content.some((content) => content.type === 'image_url')
        )
      ),
    });

    return fineTuningJob.id;
  } catch (error) {
    console.error('Error creating evaluator training job:', error);
    throw error;
  }
};

export const checkTrainingStatus = async (modelId) => {
  const trainingInfo = await redisService.get(`evaluator-training:${modelId}`);
  if (!trainingInfo) {
    throw new Error('No training job found for this model');
  }

  const status = await openAi.fineTuning.jobs.retrieve(trainingInfo.jobId);

  // Update status in Redis
  await redisService.set(`evaluator-training:${modelId}`, {
    ...trainingInfo,
    status: status.status,
    fineTunedModel: status.fine_tuned_model,
    updatedAt: new Date(),
  });

  return status;
};

export const createEvaluatorModel = async (
  modelId,
  fineTunedModelId,
  sequelize
) => {
  const originalModel = await Model.findByPk(modelId);
  if (!originalModel) {
    throw new Error('Original model not found');
  }

  const trainingInfo = await redisService.get(`evaluator-training:${modelId}`);
  if (!trainingInfo) {
    throw new Error('Training information not found');
  }
  const originalModelGroup = await ModelGroup.findOne({
    where: {
      id: originalModel.dataValues.modelGroupId,
    },
  });
  const modelGroup = await ModelGroup.create({
    name: `${originalModel.name}_evaluator`,
    description: `Automated evaluator for ${originalModel.name}`,
    companyId: originalModelGroup.dataValues.companyId,
  });
  const evaluatorModel = await Model.create({
    name: `${originalModel.name}_evaluator`,
    type: 'largeLanguageModel',
    problemType: originalModel.dataValues.problemType,
    isReviewer: true,
    parameters: {
      fineTunedModelId,
      originalModelId: modelId,
      lastTrainingDate: new Date(),
      outputStyle: trainingInfo.evaluationType,
      evaluationType: trainingInfo.evaluationType,
    },
    modelGroupId: modelGroup.id,
  });

  // Link evaluator to original model
  await originalModel.addReviewer(evaluatorModel);

  return evaluatorModel;
};
