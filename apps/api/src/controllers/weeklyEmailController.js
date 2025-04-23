import db from '../../models/index.js';
import { sendWeeklyPerformanceEmail } from '../services/emailService.js';
import { Op } from 'sequelize';
import { generateAgentWeeklySummary, generateHeader } from '../services/emailGeneratorService.js';

const {
  Company,
  Model,
  Email,
  ModelGroup,
  MetricRange,
  User,
  Agent,
  AgentNode,
  Insights,
} = db;

export const sendWeeklyEmails = async (req, res) => {
  try {
    // Get all companies with email notifications enabled
    const companies = await Company.findAll({
      where: {
        activeMessages: true,
      },
    });

    if (companies.length === 0) {
      return res.status(200).json({
        message: 'No companies found with email notifications enabled',
      });
    }

    // Calculate date range for the past week
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    startDate.setHours(0, 0, 0, 0); // Start of the day, 7 days ago
    endDate.setHours(23, 59, 59, 999); // End of the current day

    // Process each company
    for (const company of companies) {
      console.log(`Processing company: ${company.name} (ID: ${company.id})`);
      try {
        // 1. Get all agents for the company
        const agents = await Agent.findAll({
          where: { companyId: company.id, deletedAt: null },
          include: [
            {
              model: AgentNode,
              where: { type: 'model', deletedAt: null }, // Only include model nodes
              required: false, // Agents might not have model nodes yet
              include: [
                {
                  model: Model,
                  as: 'Model',
                  required: true, // Ensure the node has a valid associated model
                },
              ],
            },
          ],
        });

        if (agents.length === 0) {
          console.log(`No agents found for company ${company.id}`);
          continue; // Skip to the next company
        }

        const agentDataForEmail = [];
        let fullAgentSummary = ''
        // 2. Process each agent
        for (const agent of agents) {
          console.log(`  Processing agent: ${agent.name} (ID: ${agent.id})`);
          const modelsData = [];
          const modelIds = agent.AgentNodes.map((node) => node.Model.id);

          if (modelIds.length === 0) {
            console.log(`    No model nodes found for agent ${agent.id}`);
            continue; // Skip if agent has no model nodes
          }

          // 3. Fetch Metrics and Insights for agent's models
          const metricRanges =
            await // Fetch current metric ranges for all models (original and optimized) in one go
            MetricRange.findAll({
              where: {
                entityType: 'model',
                entityId: { [Op.in]: modelIds },
                startDate: { [Op.lte]: endDate }, // Use endDate for current range
                endDate: { [Op.gte]: endDate }, // Use endDate for current range
              },
            });

          // Organize metrics and insights by model ID for easier lookup
          const metricsByModelId = metricRanges.reduce((acc, range) => {
            acc[range.entityId] = range.dataValues;
            return acc;
          }, {});

          const baseAgentAccuracy = []
          const optimizedAgentAccuracy = []

          // 4. Prepare data structure for each model within the agent
          for (const node of agent.AgentNodes) {
            const modelInsights = await Insights.findAll({
              where: {
                modelId: node.Model.id,
              },
              limit: 2,
              order: [['createdAt', 'DESC']],
            });

            const model = node.Model;
            const originalMetrics = metricsByModelId[model.id];
            const optimizedModel = await model.getPrincipalABTestModel(); // Assuming this still fetches the optimized one
            let optimizedMetrics = null;

            if (optimizedModel) {
              optimizedMetrics = await MetricRange.findOne({
                where: {
                  entityType: 'model',
                  entityId: optimizedModel.id,
                  startDate: { [Op.lte]: endDate }, // Use endDate for current range
                  endDate: { [Op.gte]: endDate }, // Use endDate for current range
                },
              });
              if (optimizedMetrics) {
                optimizedMetrics = optimizedMetrics.dataValues;
              } else {
                optimizedMetrics = null;
              }
            }

            if (originalMetrics && originalMetrics.metrics['accuracy']) {
              baseAgentAccuracy.push(originalMetrics.metrics['accuracy']);
            }

            if (optimizedMetrics && optimizedMetrics.metrics['accuracy']) {
              optimizedAgentAccuracy.push(optimizedMetrics.metrics['accuracy']);
            }
            


            if (originalMetrics || modelInsights.length > 0) {
              // Only include if we have metrics
              modelsData.push({
                name: model.name,
                modelId: model.id,
                agentId: agent.id,
                originalMetricRange: originalMetrics,
                optimizedMetricRange: optimizedMetrics,
                insights: modelInsights.map((insight) => {
                  return {
                    problem: insight.dataValues.problem,
                    solution: insight.dataValues.solution,
                    agentLogId: insight.dataValues?.entry?.agentLogId,
                    modelId: insight.dataValues.modelId,
                    createdAt: insight.dataValues.createdAt,
                    updatedAt: insight.dataValues.updatedAt,
                  }
                }), // Add insights for the model
              });
            } else {
              console.log(
                `    Skipping model ${model.name} (ID: ${model.id}) due to missing metrics.`
              );
            }
          }

          const baseAgentAccuracyValue = baseAgentAccuracy.reduce((acc, curr) => acc + curr, 0) / baseAgentAccuracy.length;
          const optimizedAgentAccuracyValue = optimizedAgentAccuracy.reduce((acc, curr) => acc + curr, 0) / optimizedAgentAccuracy.length;

          if (modelsData.length === 0) {
            console.log(
              `    No valid model data found for agent ${agent.id} after filtering.`
            );
            continue; // Skip agent if no models have data
          }

          // 5. Generate Agent Summary Text
          console.log(`    Generating summary for agent ${agent.id}...`);
          let agentSummary = '';
          try {
            // Pass agent name and the prepared modelsData to the generator service
            agentSummary = await generateAgentWeeklySummary(
              agent.name,
              modelsData,
              baseAgentAccuracyValue,
              optimizedAgentAccuracyValue
            );
            fullAgentSummary += agentSummary + '\n\n';
            agentDataForEmail.push({
              id: agent.id,
              name: agent.name,
              agent_summary: agentSummary, // Use the generated summary
            });
            console.log(`    Summary generated for agent ${agent.id}.`);
          } catch (genError) {
            console.error(
              `    Error generating summary for agent ${agent.id}:`,
              genError
            );
          }

          // 6. Add agent data to the list for the email
          
        } // End of agent loop

        const header = await generateHeader(company.name, fullAgentSummary);
        if (agentDataForEmail.length === 0) {
          console.log(`No valid agent data to email for company ${company.id}`);
          continue; // Skip company if no agents have data to report
        }

        // 7. Send weekly performance email for the company
        console.log(`Sending email for company ${company.id}...`);
        await sendWeeklyPerformanceEmail({
          companyId: company.id,
          startDate,
          endDate,
          header,
          // models: [], // We are not sending model-specific data directly anymore
          agents: agentDataForEmail, // Send the list with summaries
          clientName: company.name, // Use company name for personalization
          tracingUrl: `https://dashboard.handit.ai/ag-monitoring`, // Example tracing URL
          Email,
          User,
        });

        console.log(`Weekly performance email sent for company ${company.id}`);
      } catch (error) {
        console.error(`Error processing company ${company.id}:`, error);
        // Continue with next company even if one fails
        continue;
      }
    } // End of company loop

    res.status(200).json({
      message: 'Weekly performance emails processing initiated.', // Changed message as it's async
    });
  } catch (error) {
    console.error('Error sending weekly emails:', error);
    res.status(500).json({
      error: 'Failed to send weekly performance emails',
    });
  }
};
