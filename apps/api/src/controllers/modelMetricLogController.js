import db from '../../models/index.js';
import { isCorrect } from '../services/entries/correctnessEvaluatorService.js';
import { evaluateSamples, singleEvaluate, summaryEvaluation, checkBatchStatus, batchEvaluate } from '../services/evaluationService.js';
import { Op } from 'sequelize';

import { executeCalculateMetricsForModel } from '../services/modelMetricLogCalulatorService.js';
import { detectError } from '../services/trackService.js';
import { detectProblemType } from '../services/problemTypeDetectorService.js';

const { ModelMetricLog, Model, ModelLog, AgentLog, AgentNodeLog, AgentNode } = db;
export const createModelMetricLog = async (req, res) => {
  try {
    const modelMetricLog = await ModelMetricLog.create(req.body);
    res.status(201).json(modelMetricLog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const detectProblemTypeFunc = async (req, res) => {
  try {
    const modelId = req.params.id;
    const model = await Model.findByPk(modelId);
    const logs = await ModelLog.findAll({
      where: { modelId: modelId },
      order: [['createdAt', 'DESC']],
      limit: 10
    });
    const problemType = await detectProblemType(model, logs);
    console.log(problemType);
    res.status(201).json(problemType);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const summaryEvaluations = async (req, res) => {
  try {
    const modelId = req.params.id;
    const logs = await db.sequelize.query(`
      SELECT id, actual FROM "ModelLogs" WHERE model_id = ${modelId} AND actual IS NOT NULL
      `)

    for (let i = 0; i < logs[0].length; i++) {
      const log = logs[0][i];
      const summary = await summaryEvaluation(log);
      const actual = log.actual;
      actual.summary = summary;
      await ModelLog.update({ actual }, { where: { id: log.id } });
    }
    res.status(200).json({ message: 'Evaluations summarized successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const fixModelLogsStatus = async (req, res) => {
  try {
    const modelId = req.params.id;

    const modelLogs = await db.sequelize.query(`
      SELECT actual, id, status FROM "ModelLogs" WHERE model_id = ${modelId} AND actual IS NOT NULL
      `)

    for (let i = 0; i < modelLogs[0].length; i++) {
      const log = modelLogs[0][i];
      console.log('log', log);
      const correct = log.actual.metrics.correctness > 8;
      const actual = log.actual;

      actual.correct = correct;

      await ModelLog.update({ actual, status: correct ? 'success' : 'error' }, { where: { id: log.id } });
    }
    res.status(200).json({ message: 'Model logs status fixed successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const fixNodeStatusForModel = async (req, res) => {
  try {
    const modelId = req.params.id;
    const model = await Model.findByPk(modelId);
    
    const modelLogs = await model.getModelLogs('2025-02-25');

    for (let i = 0; i < modelLogs.length; i++) {
      const error = detectError(modelLogs[i]);
      if (error) {
        await modelLogs[i].update({ status: 'crash' });
      }
    }
    res.status(200).json({ message: 'Model logs status fixed successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const fixAgentLogStatus = async (req, res) => {
  try {
    const agentId = req.params.id;
    
    const logs = await AgentLog.findAll({
      where: {
        agentId: agentId,
        createdAt: {
          [Op.gt]: '2025-03-05',
        },
        status: {
          [Op.not]: 'processing',
        }
      },
    });

    const agentNodes = await AgentNode.findAll({
      where: {
        agentId: agentId,
        deletedAt: null,
      },
    });

    const validModelIds = agentNodes.map((node) => node.modelId).filter((id) => id !== null);
    
    

    for (let i = 0; i < logs.length; i++) {
      let errorExists = false;

      const modelLogs = await ModelLog.findAll({
        where: {
          agentLogId: logs[i].id,
          modelId: {
            [Op.in]: validModelIds,
          },
        },
      });
      const agentNodeLogs = await AgentNodeLog.findAll({
        where: {
          parentLogId: logs[i].id,
        },
      });
      for (let j = 0; j < modelLogs.length; j++) {
        const crash = modelLogs[j].status === 'crash';
        if (crash) {
          await AgentLog.update({ status: 'failed' }, { where: { id: logs[i].id } });
          errorExists = true;
        } else if (modelLogs[j].status === 'error') {
          await AgentLog.update({ status: 'failed_model' }, { where: { id: logs[i].id } });
          errorExists = true;
        }
      }
      for (let j = 0; j < agentNodeLogs.length; j++) {
        if (agentNodeLogs[j].status === 'error') {
          await AgentLog.update({ status: 'failed' }, { where: { id: logs[i].id } });
          errorExists = true;
        }
      }
      if (!errorExists) {
        await AgentLog.update({ status: 'success' }, { where: { id: logs[i].id } });
      }
    }
    res.status(200).json({ message: 'Agent logs status fixed successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



export const fixSuccessForModel = async (req, res) => {
  try {
    const modelId = req.params.id;
    const model = await Model.findByPk(modelId);
    const notProcessedLogs = await model.getMetricUnprocessedLogs();
    for (let i = 0; i < notProcessedLogs.length; i++) {
      const log = notProcessedLogs[i];
      const correct = isCorrect(log);
      await log.update({ success: correct ? 'success' : 'error' });
    }
    res.status(200).json({ message: 'Success fixed successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
export const generateInsightsForModel = async (req, res) => {
  try {
    const modelId = req.params.id;
    const model = await Model.findByPk(modelId);
    const insights = await model.generateInsights();
    res.status(200).json(insights);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllModelMetricLogs = async (req, res) => {
  try {
    const modelMetricLogs = await ModelMetricLog.findAll();
    res.status(200).json(modelMetricLogs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getModelMetricLogById = async (req, res) => {
  try {
    const modelMetricLog = await ModelMetricLog.findByPk(req.params.id);
    if (!modelMetricLog) {
      return res.status(404).json({ error: 'Model Metric Log not found' });
    }
    res.status(200).json(modelMetricLog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateModelMetricLog = async (req, res) => {
  try {
    const modelMetricLog = await ModelMetricLog.findByPk(req.params.id);
    if (!modelMetricLog) {
      return res.status(404).json({ error: 'Model Metric Log not found' });
    }
    await modelMetricLog.update(req.body);
    res.status(200).json(modelMetricLog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteModelMetricLog = async (req, res) => {
  try {
    const modelMetricLog = await ModelMetricLog.findByPk(req.params.id);
    if (!modelMetricLog) {
      return res.status(404).json({ error: 'Model Metric Log not found' });
    }
    await modelMetricLog.destroy();
    res.status(204).json();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const fixCorrectnessForModel = async (req, res) => {
  try {
    const modelId = req.params.id;
    const model = await Model.findByPk(modelId);

    const modelLogs = await model.getModelLogs();
    const processedLogs = modelLogs.filter((log) => log.processed);

    if (processedLogs.length === 0) {
      console.log(`No logs found for model: ${model.name}`);
      return res.status(200).json({ message: 'No logs found for model' });
    }

    for (let i = 0; i < processedLogs.length; i++) {
      const log = processedLogs[i];
      const modelOutput = log.dataValues.actual['modelClass'];
      const correctOutput = log.dataValues.actual['class'];

      await log.update({ isCorrect: modelOutput == correctOutput });
    }

    res.status(200).json({ message: 'Correctness fixed successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const autoEvaluateBatch = async (req, res) => {
  try {
    const modelId = req.params.id;
    const model = await Model.findByPk(modelId);
    const reviewers = await model.getReviewers();
    for (let i = 0; i < reviewers.length; i++) {
      const reviewer = reviewers[i].dataValues;

      const reviewerInstance = await Model.findOne({
        where: {
          id: reviewer.reviewerId,
        },
      });
      const unprocessedLogs = await model.getUnprocessedLogs(1);
      const modelLog = unprocessedLogs[0];


      await batchEvaluate(
        [modelLog],
        reviewerInstance,
        ModelLog
      );
    }

    res.status(200).json({ message: 'Model auto evaluated successfully' });
    
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const autoEvaluateSingleInstance = async (req, res) => {
  try {
    const modelId = req.params.id;
    const model = await Model.findByPk(modelId);
    const reviewers = await model.getReviewers();
    for (let i = 0; i < reviewers.length; i++) {
      const reviewer = reviewers[i].dataValues;

      const reviewerInstance = await Model.findOne({
        where: {
          id: reviewer.reviewerId,
        },
      });
      const unprocessedLogs = await model.getUnprocessedLogs(1);
      const modelLog = unprocessedLogs[0];

      const evaluationPercentage = reviewer.evaluationPercentage;

      const randomNumberFrom0To100 = Math.floor(Math.random() * 101);
      if (randomNumberFrom0To100 <= evaluationPercentage) {
        await singleEvaluate(
          modelLog,
          reviewerInstance,
          ModelLog
        );
      }
    }

    res.status(200).json({ message: 'Model auto evaluated successfully' });
    
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const autoEvaluateModel = async (req, res) => {
  try {
    const modelId = req.params.id;
    const model = await Model.findByPk(modelId);

    const reviewers = await model.getReviewers();
    for (let i = 0; i < reviewers.length; i++) {
      const reviewer = reviewers[i].dataValues;
      const threshold = reviewer.activationThreshold;
      const unprocessedLogsCount = await model.getUnprocessedLogsCount();
      console.log('unprocessedLogsCount', unprocessedLogsCount);
      const reviewerInstance = await Model.findOne({
        where: {
          id: reviewer.reviewerId,
        },
      });

      if (unprocessedLogsCount >= threshold) {
        const unprocessedLogs = await model.getUnprocessedLogs(reviewer.limit);
        console.log('unprocessedLogs', unprocessedLogs.length);
        await evaluateSamples(
          unprocessedLogs,
          unprocessedLogsCount,
          reviewer.evaluationPercentage,
          reviewerInstance,
          ModelLog,
          reviewer.limit
        );
        //await executeCalculateMetricsForModel(model, ModelMetricLog);
      }
    }
    res.status(200).json({ message: 'Model auto evaluated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const calculateMetricsForModel = async (req, res) => {
  try {
    const modelId = req.params.id;
    const model = await Model.findByPk(modelId);
    await executeCalculateMetricsForModel(model, ModelMetricLog);

    res.status(200).json({ message: 'Metrics calculated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const checkBatchStatusController = async (req, res) => {
  try {
    const { batchId } = req.params;
    
    if (!batchId) {
      return res.status(400).json({ error: 'Batch ID is required' });
    }
    
    const status = await checkBatchStatus(batchId, ModelLog);
    
    res.status(200).json(status);
  } catch (error) {
    console.error('Error checking batch status:', error);
    res.status(500).json({ error: error.message });
  }
};
