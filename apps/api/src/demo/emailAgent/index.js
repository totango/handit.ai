import { emailAgentConfig } from './config.js';
import { preprocessEmailInfo, sendEmail } from './tools.js';
import { generateEmail } from './llm.js';
import db from '../../../models/index.js';

const { Model, AgentNode } = db;

export const emailAgent = {
  config: emailAgentConfig,
  tools: {
    preprocessEmailInfo,
    sendEmail,
  },
  llm: {
    generateEmail,
  },
  execute: async ({ input, environment = 'production', prompt = null, optimized = false }) => {
    try {
      // Find the initial node
      const initialNode = await Model.findOne({
        where: {
          id: 254,
        },
      });
      if (!initialNode) {
        throw new Error('No initial node found in agent configuration');
      }

      // Execute the preprocessing step
      const preprocessResult = await emailAgent.tools.preprocessEmailInfo(
        initialNode,
        {
          input,
          environment,
        }
      );

      const agentLogId = preprocessResult.agentLogId;

      if (preprocessResult.error) {
        throw new Error(`Preprocessing failed: ${preprocessResult.error}`);
      }

      // Find the generate node
      let generateNode = await Model.findOne({
        where: {
          id: 255,
        },
      });

      if (optimized) {
        generateNode = await generateNode.getPrincipalABTestModel();
      }
      if (!generateNode) {
        throw new Error('Generate node not found in agent configuration');
      }

      // Execute the email generation step
      const generateResult = await emailAgent.llm.generateEmail(
        generateNode,
        preprocessResult,
        agentLogId,
        prompt ? prompt : optimized ? generateNode.parameters.prompt : null
      );
      if (generateResult.error) {
        throw new Error(`Email generation failed: ${generateResult.error}`);
      }

      // Find the send node
      const sendNode = await AgentNode.findOne({
        where: {
          id: 296,
        },
      });
      if (!sendNode) {
        throw new Error('Send node not found in agent configuration');
      }

      // Execute the email sending step
      const sendResult = await emailAgent.tools.sendEmail(
        sendNode,
        generateResult,
        agentLogId
      );

      if (sendResult.error) {
        throw new Error(`Email sending failed: ${sendResult.error}`);
      }

      return { ...sendResult.output, modelLogId: generateResult.modelLogId };
    } catch (error) {
      console.error('Error executing email agent:', error);
      throw error;
    }
  },
};
