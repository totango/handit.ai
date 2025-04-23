import db from '../../models/index.js';
import { Op } from 'sequelize';
import { redisService } from './redisService.js';

const { Agent, AgentNode, AgentConnection, Model } = db;

export const createAgent = async (data) => {
  const agent = await Agent.create(data);
  return agent;
};

export const getAgentById = async (id) => {
  const agent = await Agent.findByPk(id, {
    include: [
      {
        model: AgentNode,
        include: [
          {
            model: Model,
          },
          {
            model: AgentConnection,
            as: 'outgoingConnections',
            include: [
              {
                model: AgentNode,
                as: 'toNode',
              },
            ],
            attributes: ['id', 'input_name', 'output_name'],
          },
        ],
      },
    ],
  });
  return agent;
};

export const updateAgent = async (id, data) => {
  const agent = await Agent.findByPk(id);
  if (!agent) throw new Error('Agent not found');
  await agent.update(data);
  return agent;
};

export const createAgentNode = async (data) => {
  const node = await AgentNode.create(data);
  return node;
};

export const createAgentConnection = async (data) => {
  const connection = await AgentConnection.create({
    agentId: data.agentId,
    fromNodeId: data.fromNodeId,
    toNodeId: data.toNodeId,
    inputName: data.inputName || 'input',
    outputName: data.outputName || 'output',
  });
  return connection;
};

export const updateAgentConnection = async (id, data) => {
  const connection = await AgentConnection.findByPk(id);
  if (!connection) throw new Error('Connection not found');

  await connection.update({
    input_name: data.inputName,
    output_name: data.outputName,
  });

  return connection;
};

export const updateAgentNode = async (nodeId, data) => {
  try {
    const node = await db.AgentNode.findByPk(nodeId);
    if (!node) {
      throw new Error('Node not found');
    }

    // Validate model if it's a model type node
    if (data.type === 'model' && data.modelId) {
      const model = await db.Model.findByPk(data.modelId);
      if (!model) {
        throw new Error('Model not found');
      }
    }

    // Update the node
    await node.update({
      name: data.name,
      type: data.type,
      config: data.config,
      modelId: data.type === 'model' ? data.modelId : null,
    });

    return node;
  } catch (error) {
    console.error('Error updating agent node:', error);
    throw error;
  }
};

export const deleteAgentNode = async (nodeId) => {
  try {
    const node = await db.AgentNode.findByPk(nodeId);
    if (!node) {
      throw new Error('Node not found');
    }

    // Delete associated connections first
    await db.AgentConnection.destroy({
      where: {
        [Op.or]: [{ fromNodeId: nodeId }, { toNodeId: nodeId }],
      },
    });

    // Delete the node
    await node.destroy();
  } catch (error) {
    console.error('Error deleting agent node:', error);
    throw error;
  }
};

export const deleteAgentConnection = async (connectionId) => {
  try {
    const connection = await db.AgentConnection.findByPk(connectionId);
    if (!connection) {
      throw new Error('Connection not found');
    }

    await connection.destroy();
  } catch (error) {
    console.error('Error deleting agent connection:', error);
    throw error;
  }
};

export const updateAgentEntryFlowCache = async (
  agentLogId,
  environment = 'production'
) => {
  try {
    // Find the agent log and its associated agent
    const agentLog = await db.AgentLog.findOne({
      where: {
        id: agentLogId,
        environment,
      },
      include: [
        {
          model: db.Agent,
          include: [
            {
              model: db.Company,
            },
            {
              model: db.AgentNode,
              include: [
                {
                  model: db.Model,
                  as: 'Model',
                  required: false,
                },
              ],
            },
          ],
        },
      ],
    });

    if (!agentLog || !agentLog.Agent) {
      return null;
    }

    // Get all related logs
    const [modelLogs, agentNodeLogs] = await Promise.all([
      db.ModelLog.findAll({
        where: {
          agentLogId,
          environment,
        },
        include: [
          {
            model: db.Model,
            include: [
              {
                model: db.AgentNode,
                as: 'AgentNodes',
                where: { agentId: agentLog.Agent.id },
                required: false,
              },
            ],
          },
        ],
        order: [['createdAt', 'ASC']],
      }),
      db.AgentNodeLog.findAll({
        where: {
          parentLogId: agentLogId,
          environment,
        },
        include: [
          {
            model: db.AgentNode,
            where: {
              agentId: agentLog.Agent.id,
              type: 'tool',
            },
          },
        ],
        order: [['createdAt', 'ASC']],
      }),
    ]);

    // Combine all steps and sort by creation date
    const allSteps = [
      ...modelLogs.map((log) => {
        const agentNode = log.Model?.AgentNodes?.find(
          (node) => node.agentId === agentLog.Agent.id
        );
        return {
          type: 'model',
          nodeId: agentNode?.id,
          nodeName: agentNode?.name,
          modelId: log.Model?.id,
          modelName: log.Model?.name,
          timestamp: log.createdAt,
          duration: log.duration,
          status: log.status,
          input: log.input,
          output: log.output,
        };
      }),
      ...agentNodeLogs.map((log) => ({
        type: 'tool',
        nodeId: log.AgentNode?.id,
        nodeName: log.AgentNode?.name,
        operationType: log.operationType,
        timestamp: log.createdAt,
        duration: log.duration,
        status: log.status,
        input: log.input,
        output: log.output,
        metadata: log.metadata,
      })),
    ].sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    const flow = {
      entryId: parseInt(agentLogId),
      agentId: agentLog.Agent.id,
      agentName: agentLog.Agent.name,
      input: agentLog.input,
      output: agentLog.output,
      status: agentLog.status,
      duration: agentLog.duration,
      createdAt: agentLog.createdAt,
      steps: allSteps,
      nodes: agentLog.Agent.AgentNodes,
    };

    // Update cache key to include environment
    const cacheKey = `agent-entry-flow:${agentLog.agentId}:${agentLogId}:${environment}`;
    await redisService.set(cacheKey, flow); // Cache for 1 hour

    return flow;
  } catch (error) {
    console.error('Error updating agent entry flow cache:', error);
    return null;
  }
};

export const updateAgentEntriesCache = async (
  agentId,
  page = 1,
  limit = 10,
  environment = 'production',
  status = 'all',
  query = null,
  filteredNode = null,
  filteredNodeType = null,
  date = null,
) => {
  try {
    query = query === '' ? null : query;
    let entries = [];
    let count = [];

    // Convert date to UTC format
    const getUTCDates = (dateStr) => {
      if (!dateStr) return { startDate: null, endDate: null };
      const date = new Date(dateStr);
      // Ensure we're working with UTC
      const startDate = date.toISOString();
      const endDate = new Date(date.getTime() + 24 * 60 * 60 * 1000).toISOString();
      return { startDate, endDate };
    };

    const { startDate, endDate } = getUTCDates(date);

    if (filteredNode && filteredNodeType) {
      if (filteredNodeType === 'model') {
          entries = await db.sequelize.query(
            `SELECT 
              DISTINCT ON ("AgentLogs"."id") "AgentLogs"."id",
              "AgentLogs"."status",
              "AgentLogs"."duration",
              "AgentLogs"."created_at" as "createdAt",
              COALESCE(to_json("AgentLogs"."summary"), "AgentLogs"."input") AS "summary"
              FROM "AgentLogs" INNER JOIN 
              "ModelLogs" ON "AgentLogs"."id" = "ModelLogs"."agent_log_id"
              INNER JOIN "AgentNodes" ON "ModelLogs"."model_id" = "AgentNodes"."model_id" AND "AgentNodes"."id" = :filteredNode
              WHERE "AgentNodes"."agent_id" = :agentId 
              AND "AgentNodes"."deleted_at" IS NULL
              AND "AgentLogs"."environment" = :environment 
              ${query ? `AND "summary" ILIKE :query` : ''}
              ${
                status === 'evaluation_success'
                  ? 'AND "ModelLogs"."processed" = true AND "ModelLogs"."actual" IS NOT NULL'
                  : ''
              }
              ${date ? `AND "AgentLogs"."created_at" >= :startDate::timestamp AND "AgentLogs"."created_at" < :endDate::timestamp` : ''}
              AND "ModelLogs"."status" IN (:status)
              ORDER BY "AgentLogs"."id" DESC, "AgentLogs"."created_at" DESC
              LIMIT :limit OFFSET :offset
            `,
            {
              replacements: {
                agentId,
                environment,
                query: '%' + query + '%',
                limit,
                filteredNode,
                offset: (page - 1) * limit,
                startDate,
                endDate,
                status:
                status === 'failed' ?
                  ['crash'] :
                  status === 'evaluation_success'
                    ? ['success']
                    : status === 'all'
                    ? ['success', 'error']
                    : status === 'success'
                    ? ['success']
                    : ['error'],
              },
              type: db.sequelize.QueryTypes.SELECT,
            }
          );

        count = await db.sequelize.query(
          `SELECT COUNT(DISTINCT "AgentLogs"."id") AS "totalEntries",
          COUNT(DISTINCT CASE WHEN "ModelLogs"."processed" = true AND "ModelLogs"."actual" IS NOT NULL THEN "AgentLogs"."id" END) AS "totalEvaluated",
          COUNT(DISTINCT CASE WHEN  "ModelLogs"."status" = 'crash' THEN "AgentLogs"."id" END) AS "totalFailedEntries", COUNT(DISTINCT CASE WHEN  "ModelLogs"."status" = 'error' THEN "AgentLogs"."id" END) AS "totalFailedModelEntries",
          COUNT(DISTINCT CASE WHEN "ModelLogs"."status" = 'success' THEN "AgentLogs"."id" END) AS "successEntries"
           FROM "AgentLogs" INNER JOIN 
           "ModelLogs" ON "AgentLogs"."id" = "ModelLogs"."agent_log_id"
           INNER JOIN "AgentNodes" ON "ModelLogs"."model_id" = "AgentNodes"."model_id" AND "AgentNodes"."id" = :filteredNode
           WHERE "AgentNodes"."agent_id" = :agentId AND "AgentLogs"."environment" = :environment AND "AgentNodes"."deleted_at" IS NULL
           ${query ? `AND "summary" ILIKE :query` : ''} 
           ${date ? `AND "AgentLogs"."created_at" >= :startDate::timestamp AND "AgentLogs"."created_at" < :endDate::timestamp` : ''}`,
          {
            replacements: {
              agentId,
              environment,
              query: '%' + query + '%',
              filteredNode,
              startDate,
              endDate,
            },
          }
        );
      } else {
        entries = await db.sequelize.query(
          `SELECT 
            DISTINCT ON ("AgentLogs"."id") "AgentLogs"."id",
            "AgentLogs"."status",
            "AgentLogs"."duration",
            "AgentLogs"."created_at" as "createdAt",
            COALESCE(to_json("AgentLogs"."summary"), "AgentLogs"."input") AS "summary"
            FROM "AgentLogs" INNER JOIN 
            "AgentNodeLogs" ON "AgentLogs"."id" = "AgentNodeLogs"."parent_log_id"
            INNER JOIN "AgentNodes" ON "AgentNodeLogs"."agent_node_id" = "AgentNodes"."id" AND "AgentNodes"."id" = :filteredNode
            WHERE "AgentNodes"."agent_id" = :agentId 
            AND "AgentNodes"."deleted_at" IS NULL
            AND "AgentLogs"."environment" = :environment 
            ${query ? `AND "summary" ILIKE :query` : ''}
            ${date ? `AND "AgentLogs"."created_at" >= :startDate::timestamp AND "AgentLogs"."created_at" < :endDate::timestamp` : ''}
            AND "AgentNodeLogs"."status" IN (:status)
            ORDER BY "AgentLogs"."id" DESC, "AgentLogs"."created_at" DESC
            LIMIT :limit OFFSET :offset
          `,
          {
            replacements: {
              agentId,
              environment,
              query: '%' + query + '%',
              limit,
              offset: (page - 1) * limit,
              startDate,
              endDate,
              status:
                status === 'all'
                  ? ['success', 'error']
                  : status === 'success'
                  ? ['success']
                  : ['error'],
              filteredNode,
            },
            type: db.sequelize.QueryTypes.SELECT,
          }
        );

        count = await db.sequelize.query(
          `SELECT COUNT(DISTINCT "AgentLogs"."id") AS "totalEntries", COUNT(DISTINCT CASE WHEN "AgentNodeLogs"."status" = 'error' THEN "AgentLogs"."id" END) AS "totalFailedEntries",
         0 AS "totalFailedModelEntries",
          COUNT(DISTINCT CASE WHEN "AgentNodeLogs"."status" = 'success' THEN "AgentLogs"."id" END) AS "successEntries"
           FROM "AgentLogs" INNER JOIN "AgentNodeLogs" ON "AgentLogs"."id" = "AgentNodeLogs"."parent_log_id" 
           INNER JOIN "AgentNodes" ON "AgentNodeLogs"."agent_node_id" = "AgentNodes"."id" AND "AgentNodes"."id" = :filteredNode
           WHERE "AgentNodes"."agent_id" = :agentId AND "AgentLogs"."environment" = :environment 
           AND "AgentNodes"."deleted_at" IS NULL
           ${query ? `AND "summary" ILIKE :query` : ''} 
           ${date ? `AND "AgentLogs"."created_at" >= :startDate::timestamp AND "AgentLogs"."created_at" < :endDate::timestamp` : ''}`,
          {
            replacements: {
              agentId,
              environment,
              query: '%' + query + '%',
              filteredNode,
              startDate,
              endDate,
            },
          }
        );
      }
    } else {
      entries = await db.sequelize.query(
        `SELECT 
          DISTINCT ON ("AgentLogs"."id") "AgentLogs"."id",
          "AgentLogs"."status",
          "AgentLogs"."duration",
          "AgentLogs"."created_at" as "createdAt",
          COALESCE(to_json("AgentLogs"."summary"), "AgentLogs"."input") AS "summary"
          FROM "AgentLogs" 
          LEFT JOIN ("ModelLogs" 
                      INNER JOIN "AgentNodes"  ON "ModelLogs"."model_id" = "AgentNodes"."model_id" AND "AgentNodes"."deleted_at" IS NULL
                ) ON "AgentLogs"."id" = "ModelLogs"."agent_log_id" AND "ModelLogs"."status" = 'error'
          LEFT JOIN ("AgentNodeLogs"
                      INNER JOIN "AgentNodes" AS "an" ON "AgentNodeLogs"."parent_log_id" = "an"."id" AND "an"."deleted_at" IS NULL
                ) ON "AgentNodeLogs"."parent_log_id" = "AgentLogs"."id" AND "AgentNodeLogs"."status" = 'error'
          WHERE "AgentLogs"."agent_id" = :agentId 
          AND "AgentLogs"."environment" = :environment 
          ${query ? `AND "summary" ILIKE :query` : ''}
          ${date ? `AND "AgentLogs"."created_at" >= :startDate::timestamp AND "AgentLogs"."created_at" < :endDate::timestamp` : ''}
          ${status === 'failed_model' ? 'AND "ModelLogs"."id" IS NOT NULL' : 
            status === 'failed' ? 'AND ("AgentNodeLogs"."id" IS NOT NULL OR "AgentLogs"."error_details" IS NOT NULL)' : ''}
          AND "AgentLogs"."status" IN (:status)
          ORDER BY "AgentLogs"."id" DESC, "AgentLogs"."created_at" DESC
          LIMIT :limit OFFSET :offset
        `,
        {
          replacements: {
            agentId,
            environment,
            query: '%' + query + '%',
            limit,
            offset: (page - 1) * limit,
            startDate,
            endDate,
            status:
              status === 'all'
                ? ['success', 'failed', 'processing', 'failed_model']
                : status === 'failed'
                ? ['success', 'failed', 'processing', 'failed_model'] 
                : status === 'failed_model' ?
                ['success', 'failed', 'processing', 'failed_model'] :
                status,
          },
          type: db.sequelize.QueryTypes.SELECT,
        }
      );
      count = await db.sequelize.query(
        `SELECT COUNT(DISTINCT "AgentLogs"."id") AS "totalEntries", COUNT(DISTINCT CASE WHEN "AgentLogs"."status" = 'failed_model' THEN "AgentLogs"."id" END) AS "totalEvaluated", COUNT(DISTINCT CASE WHEN ("AgentNodeLogs"."id" IS NOT NULL OR "AgentLogs"."error_details" IS NOT NULL) THEN "AgentLogs"."id" END) AS "totalFailedEntries",
          COUNT(DISTINCT CASE WHEN "ModelLogs"."id" IS NOT NULL THEN "AgentLogs"."id" END) AS "totalFailedModelEntries",
          COUNT(DISTINCT CASE WHEN "AgentLogs"."status" = 'success' THEN "AgentLogs"."id" END) AS "successEntries"
         FROM "AgentLogs" 
         LEFT JOIN ("ModelLogs" 
                      INNER JOIN "AgentNodes" ON "ModelLogs"."model_id" = "AgentNodes"."model_id" AND "AgentNodes"."deleted_at" IS NULL
                ) ON "AgentLogs"."id" = "ModelLogs"."agent_log_id" AND "ModelLogs"."status" = 'error'
         LEFT JOIN ("AgentNodeLogs"
                      INNER JOIN "AgentNodes" AS "an" ON "AgentNodeLogs"."parent_log_id" = "an"."id" AND "an"."deleted_at" IS NULL
                ) ON "AgentNodeLogs"."parent_log_id" = "AgentLogs"."id" AND "AgentNodeLogs"."status" = 'error'
         WHERE "AgentLogs"."agent_id" = :agentId AND "AgentLogs"."environment" = :environment 
         ${query ? `AND "summary" ILIKE :query` : ''} 
         ${date ? `AND "AgentLogs"."created_at" >= :startDate::timestamp AND "AgentLogs"."created_at" < :endDate::timestamp` : ''}`,
        {
          replacements: { 
            agentId, 
            environment, 
            query: '%' + query + '%',
            startDate,
            endDate,
          },
        }
      );
    }
    

    const totalEntries = parseInt(count[0][0].totalEntries);
    const totalFailedEntries = parseInt(count[0][0].totalFailedEntries);
    const totalEvaluated = parseInt(count[0][0].totalEvaluated || 0);
    const totalFailedModelEntries = parseInt(
      count[0][0].totalFailedModelEntries
    );
    const successEntries = parseInt(count[0][0].successEntries || 0);
    // Calculate pagination
    const totalPages = Math.ceil(totalEntries / limit);

    // Cache metadata about the entries
    const metadataKey = `agent-entries-metadata:${agentId}:${environment}:${status}`;
    await redisService.set(
      metadataKey,
      {
        total: totalEntries,
        successEntries,
        totalPages,
        totalFailedEntries,
        totalFailedModelEntries,
        totalEvaluated,
        lastUpdated: new Date().toISOString(),
      },
      3600
    ); // Cache for 1 hour
    // Cache the current page
    if (!query || query === '') {
      const pageKey = `agent-entries:${agentId}:page:${page}:limit:${limit}:${environment}:${status}`;
      await redisService.set(pageKey, entries); // Cache for 1 hour
    }

    return {
      entries,
      pagination: {
        page,
        limit,
        total: totalEntries,
        totalPages,
        totalEvaluated,
        totalFailedModelEntries,
        totalFailedEntries,
        successEntries,
      },
    };
  } catch (error) {
    console.error('Error updating agent entries cache:', error);
  }
};
