'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class AgentConnection extends Model {
    static associate(models) {
      AgentConnection.belongsTo(models.Agent, { foreignKey: 'agent_id' });
      AgentConnection.belongsTo(models.AgentNode, { 
        foreignKey: 'from_node_id',
        as: 'fromNode'
      });
      AgentConnection.belongsTo(models.AgentNode, { 
        foreignKey: 'to_node_id',
        as: 'toNode'
      });
    }

    static async updateNodeTypes(agentId) {
      try {
        // Get all nodes and connections for this agent
        const nodes = await sequelize.models.AgentNode.findAll({
          where: { agentId },
        });

        const connections = await AgentConnection.findAll({
          where: { agentId },
        });

        // Create sets of nodes with incoming and outgoing connections
        const nodesWithIncoming = new Set(connections.map(conn => conn.toNodeId));
        const nodesWithOutgoing = new Set(connections.map(conn => conn.fromNodeId));

        // Update all nodes
        const updatePromises = nodes.map(async node => {
          const hasIncoming = nodesWithIncoming.has(node.id);
          const hasOutgoing = nodesWithOutgoing.has(node.id);

          await node.update({
            initialNode: !hasIncoming && hasOutgoing, // Initial nodes have no incoming but have outgoing
            endNode: hasIncoming && !hasOutgoing     // End nodes have incoming but no outgoing
          });
        });

        await Promise.all(updatePromises);
      } catch (error) {
        console.error('Error updating node types:', error);
        throw error;
      }
    }
  }

  AgentConnection.init({
    agentId: {
      type: DataTypes.INTEGER,
      field: 'agent_id'
    },
    fromNodeId: {
      type: DataTypes.INTEGER,
      field: 'from_node_id'
    },
    toNodeId: {
      type: DataTypes.INTEGER,
      field: 'to_node_id'
    },
    outputName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'output',
      field: 'output_name'
    },
    inputName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'input',
      field: 'input_name'
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'deleted_at'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'updated_at'
    }
  }, {
    sequelize,
    modelName: 'AgentConnection',
    timestamps: true,
    paranoid: true,
    hooks: {
      afterCreate: async (connection, options) => {
        await AgentConnection.updateNodeTypes(connection.agentId);
      },
      afterUpdate: async (connection, options) => {
        await AgentConnection.updateNodeTypes(connection.agentId);
      },
      afterDestroy: async (connection, options) => {
        await AgentConnection.updateNodeTypes(connection.agentId);
      },
      afterRestore: async (connection, options) => {
        await AgentConnection.updateNodeTypes(connection.agentId);
      }
    }
  });

  return AgentConnection;
};
