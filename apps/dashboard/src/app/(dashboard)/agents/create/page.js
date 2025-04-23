/**
 * Agent Creation Page Component
 * 
 * This page provides an interface for creating new AI agents with:
 * - A visual editor for designing agent architecture
 * - Support for creating nodes (models/tools) and their connections
 * - Automatic handling of agent, node, and connection creation
 * 
 * The component uses RTK Query mutations for data persistence and
 * provides a seamless flow from creation to agent listing.
 */
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';

import { AgentEditor } from '@/components/dashboard/agents/agent-editor';
import {
  useCreateAgentMutation,
  useCreateAgentNodeMutation,
  useCreateAgentConnectionMutation
} from '@/services/agentsService';

/**
 * Main page component for agent creation
 * @returns {JSX.Element} The agent creation interface
 */
export default function Page() {
  const router = useRouter();

  // RTK Query mutations for creating agent components
  const [createAgent] = useCreateAgentMutation();
  const [createNode] = useCreateAgentNodeMutation();
  const [createConnection] = useCreateAgentConnectionMutation();

  /**
   * Handles the complete agent creation process
   * @param {Object} params - The creation parameters
   * @param {Object} params.agentData - Basic agent information
   * @param {Array} params.nodes - Array of node definitions
   * @param {Array} params.edges - Array of connection definitions
   */
  const handleSave = async ({ agentData, nodes, edges }) => {
    try {
      // Step 1: Create the base agent
      const agent = await createAgent(agentData).unwrap();

      // Step 2: Create all nodes for the agent
      const createdNodes = await Promise.all(
        nodes.map(node =>
          createNode({
            agentId: agent.id,
            name: node.data.label,
            type: node.data.type,
            config: {
              position: node.position,
              model: node.data.model,
              description: node.data.description,
              toolType: node.data.toolType,
            },
            modelId: node.data.model,
          }).unwrap()
        )
      );

      // Step 3: Create connections between nodes
      await Promise.all(
        edges.map(edge => {
          // Find the corresponding created nodes using their labels
          const fromNode = createdNodes.find(n => n.name === nodes.find(node => node.id === edge.source)?.data.label);
          const toNode = createdNodes.find(n => n.name === nodes.find(node => node.id === edge.target)?.data.label);

          return createConnection({
            agentId: agent.id,
            fromNodeId: fromNode.id,
            toNodeId: toNode.id,
            inputName: edge.targetHandle || 'input',
            outputName: edge.sourceHandle || 'output',
          }).unwrap();
        })
      );

      // Navigate to agents list on successful creation
      router.push('/agents');
    } catch (error) {
      console.error('Error creating agent:', error);
      // TODO: Show error message to user
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 'var(--Content-maxWidth)',
        m: 'var(--Content-margin)',
        p: 'var(--Content-padding)',
        width: 'var(--Content-width)',
        minHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <AgentEditor
        title="Create Agent"
        onSave={handleSave}
        isEdit={false}
      />
    </Box>
  );
} 