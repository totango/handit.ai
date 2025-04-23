/**
 * Agent Edit Page Component
 * 
 * This page provides an interface for editing existing AI agents with:
 * - A visual editor for modifying agent architecture
 * - Support for updating nodes (models/tools) and their connections
 * - Unsaved changes protection with confirmation dialog
 * - Automatic handling of node/connection creation, updates, and deletion
 * 
 * The component uses RTK Query for data management and provides
 * a comprehensive editing experience with change tracking.
 */
'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

import { AgentEditor } from '@/components/dashboard/agents/agent-editor';
import {
  useGetAgentByIdQuery,
  useUpdateAgentMutation,
  useCreateAgentNodeMutation,
  useCreateAgentConnectionMutation,
  useUpdateAgentNodeMutation,
  useDeleteAgentNodeMutation,
  useDeleteAgentConnectionMutation
} from '@/services/agentsService';

/**
 * Main page component for agent editing
 * @returns {JSX.Element} The agent editing interface
 */
export default function Page() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  // RTK Query hooks for data fetching and mutations
  const { data: agent, isLoading } = useGetAgentByIdQuery(id);
  const [updateAgent] = useUpdateAgentMutation();
  const [createNode] = useCreateAgentNodeMutation();
  const [createConnection] = useCreateAgentConnectionMutation();
  const [updateNode] = useUpdateAgentNodeMutation();
  const [deleteNode] = useDeleteAgentNodeMutation();
  const [deleteConnection] = useDeleteAgentConnectionMutation();

  // State for unsaved changes dialog
  const [showUnsavedDialog, setShowUnsavedDialog] = React.useState(false);
  const [pendingRoute, setPendingRoute] = React.useState(null);

  /**
   * Handle route changes to prevent navigation with unsaved changes
   */
  React.useEffect(() => {
    const handleRouteChange = (url) => {
      if (window.hasUnsavedChanges) {
        router.events.emit('routeChangeError');
        setPendingRoute(url);
        setShowUnsavedDialog(true);
        throw 'routeChange aborted.';
      }
    };

    router.events?.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events?.off('routeChangeStart', handleRouteChange);
    };
  }, [router]);

  /**
   * Handle browser refresh/close with unsaved changes
   */
  React.useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (window.hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  /**
   * Transform agent data into initial nodes for the editor
   * @returns {Array} Array of node objects for the flow editor
   */
  const initialNodes = React.useMemo(() => {
    if (!agent) return [];

    return agent.AgentNodes.map(node => {
      // Count inputs and outputs based on connections
      const incomingConnections = agent.AgentConnections.filter(
        conn => conn.to_node_id === node.id
      );
      const outgoingConnections = agent.AgentConnections.filter(
        conn => conn.from_node_id === node.id
      );

      // Create unique inputs based on connections
      const inputs = incomingConnections.length > 0
        ? incomingConnections.map((conn) => ({
          id: conn.inputName || 'input',
          label: conn.inputName || 'Input',
        }))
        : [{ id: 'input', label: 'Input' }];

      // Create unique outputs based on connections
      const outputs = outgoingConnections.length > 0
        ? outgoingConnections.map((conn) => ({
          id: conn.outputName || 'output',
          label: conn.outputName || 'Output',
        }))
        : [{ id: 'output', label: 'Output' }];

      return {
        id: node.id.toString(),
        type: 'custom',
        position: node.config.position,
        data: {
          id: node.id,
          label: node.name,
          type: node.type,
          model: node.config.model,
          slug: node.Model?.slug ? agent.slug + '-' + node.Model?.slug : agent.slug + '-' + node?.slug,
          modelId: node.model_id,
          description: node.config?.description,
          toolType: node.config?.toolType,
          inputs: inputs.filter((input, index, self) =>
            self.findIndex(t => t.label === input.label) === index
          ),
          outputs: outputs.filter((output, index, self) =>
            self.findIndex(t => t.label === output.label) === index
          ),
          onModelChange: (model) => {
            // This will be handled by the AgentEditor
          },
          onEditLabel: (newLabel) => {
            // This will be handled by the AgentEditor
          },
          onDelete: () => {
            // TODO: Implement node deletion
          },
        },
      };
    });
  }, [agent]);

  /**
   * Transform agent connections into initial edges for the editor
   * @returns {Array} Array of edge objects for the flow editor
   */
  const initialEdges = React.useMemo(() => {
    if (!agent) return [];
    return agent.AgentConnections.map(conn => ({
      id: conn.id.toString(),
      source: conn.from_node_id.toString(),
      target: conn.to_node_id.toString(),
      sourceHandle: conn.outputName || 'output',
      targetHandle: conn.inputName || 'input',
    }));
  }, [agent]);

  /**
   * Handle the complete agent update process
   * @param {Object} params - The update parameters
   * @param {Object} params.agentData - Updated agent information
   * @param {Array} params.nodes - Updated node definitions
   * @param {Array} params.edges - Updated connection definitions
   */
  const handleSave = async ({ agentData, nodes, edges }) => {
    try {
      // Step 1: Update the base agent
      await updateAgent({ id, ...agentData }).unwrap();

      // Get existing node and edge IDs for comparison
      const existingNodeIds = agent.AgentNodes.map(n => n.id.toString());
      const existingEdgeIds = agent.AgentConnections.map(c => c.id.toString());

      // Step 2: Handle node changes
      const nodesToCreate = nodes.filter(node => !existingNodeIds.includes(node.id));
      const nodesToUpdate = nodes.filter(node => existingNodeIds.includes(node.id));
      const nodesToDelete = agent.AgentNodes.filter(node =>
        !nodes.find(n => n.id === node.id.toString())
      );

      // Create new nodes
      const createdNodes = await Promise.all(
        nodesToCreate.map(node =>
          createNode({
            agent_id: id,
            name: node.data.label,
            type: node.data.type,
            config: {
              position: node.position,
              model: node.data.model,
              description: node.data.description,
              toolType: node.data.toolType,
            },
            modelId: node.data.modelId,
          }).unwrap()
        )
      );

      // Update existing nodes
      await Promise.all(
        nodesToUpdate.map(node =>
          updateNode({
            id: node.id,
            name: node.data.label,
            type: node.data.type,
            modelId: node.data.modelId,
            config: {
              position: node.position,
              model: node.data.model,
              description: node.data.description,
              toolType: node.data.toolType,
            },
          }).unwrap()
        )
      );

      // Delete removed nodes
      await Promise.all(
        nodesToDelete.map(node =>
          deleteNode(node.id).unwrap()
        )
      );

      // Step 3: Handle connection changes
      const edgesToCreate = edges.filter(edge => !existingEdgeIds.includes(edge.id));
      const edgesToDelete = agent.AgentConnections.filter(conn =>
        !edges.find(e => e.id === conn.id.toString())
      );

      // Create new connections
      await Promise.all(
        edgesToCreate.map(edge => {
          const fromNode = createdNodes.find(n => n.name === nodes.find(node => node.id === edge.source)?.data.label) ||
            agent.AgentNodes.find(n => n.id.toString() === edge.source);
          const toNode = createdNodes.find(n => n.name === nodes.find(node => node.id === edge.target)?.data.label) ||
            agent.AgentNodes.find(n => n.id.toString() === edge.target);

          return createConnection({
            agentId: id,
            fromNodeId: fromNode.id,
            toNodeId: toNode.id,
            inputName: edge.targetHandle,
            outputName: edge.sourceHandle,
          }).unwrap();
        })
      );

      // Delete removed connections
      await Promise.all(
        edgesToDelete.map(conn =>
          deleteConnection(conn.id).unwrap()
        )
      );

      // Navigate based on pending route or default to agents list
      if (pendingRoute) {
        router.push(pendingRoute);
      } else {
        router.push('/agents');
      }
    } catch (error) {
      console.error('Error updating agent:', error);
      // TODO: Show error message to user
    }
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

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
        title={`Edit Agent: ${agent?.name}`}
        initialNodes={initialNodes}
        initialEdges={initialEdges}
        onSave={handleSave}
        isEdit={true}
        initialData={{
          name: agent?.name,
          description: agent?.description,
        }}
      />

      {/* Unsaved Changes Dialog */}
      <Dialog
        open={showUnsavedDialog}
        onClose={() => setShowUnsavedDialog(false)}
      >
        <DialogTitle>
          Unsaved Changes
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have unsaved changes in your agent. What would you like to do?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => {
              setShowUnsavedDialog(false);
              setPendingRoute(null);
            }}
            variant="outlined"
          >
            Continue Editing
          </Button>
          <Button
            onClick={() => {
              if (pendingRoute) {
                window.hasUnsavedChanges = false;
                router.push(pendingRoute);
              }
              setShowUnsavedDialog(false);
            }}
            color="error"
            variant="outlined"
          >
            Discard Changes
          </Button>
          <Button
            onClick={() => {
              if (window.saveAgent) {
                window.saveAgent();
              }
            }}
            variant="contained"
            color="primary"
            autoFocus
          >
            Save & Continue
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 