/**
 * Agent Monitoring Component
 * 
 * A visual monitoring interface for tracking agent performance and metrics.
 * Provides a ReactFlow-based visualization of agent nodes and their performance
 * metrics, with support for different node types (model, tool, deployment) and
 * color-coded status indicators based on performance thresholds.
 */

'use client';

import * as React from 'react';
import ReactFlow, { Background, Controls, ControlButton, MiniMap } from 'reactflow';

import 'reactflow/dist/style.css';

import { Card, Dialog, DialogContent, Grid, IconButton, Skeleton } from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { X as XIcon, ArrowsOut } from '@phosphor-icons/react';

import { EntryDetails } from './entry-details';
import { MonitoringNode } from './monitoring-node';
import { DeploymentMonitoringNode } from './deployment-monitoring-node';
import { ToolMonitoringNode } from './tool-monitoring-node';

// Register custom node types for different monitoring scenarios
const nodeTypes = {
  custom: MonitoringNode,
  deploymentCustom: DeploymentMonitoringNode,
  toolCustom: ToolMonitoringNode,
};

/**
 * AgentMonitoring Component
 * 
 * A visual monitoring interface for tracking agent performance and metrics.
 * Displays agent nodes with performance indicators and supports fullscreen mode
 * for detailed analysis.
 * 
 * @param {Object} props - Component props
 * @param {Array} [props.initialNodes=[]] - Initial nodes for the flow visualization
 * @param {Array} [props.initialEdges=[]] - Initial edges for the flow visualization
 * @param {Object} [props.metrics={}] - Performance metrics data for nodes
 * @param {Function} [props.setSelectedNode=()=>{}] - Callback for node selection
 * @param {Object} [props.selectedNode=null] - Currently selected node
 * @param {boolean} [props.isLoading=false] - Loading state indicator
 * @param {string} props.agentId - ID of the agent being monitored
 * @returns {JSX.Element} The agent monitoring component
 */
export const AgentMonitoring = ({
  initialNodes = [],
  initialEdges = [],
  metrics = {},
  setSelectedNode = () => { },
  selectedNode = null,
  isLoading = false,
  agentId,
}) => {
  // Flow state
  const [nodes, setNodes] = React.useState([]);
  const [edges, setEdges] = React.useState(initialEdges);
  const [selectedEntry, setSelectedEntry] = React.useState(null);
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  // Viewport configuration for initial node centering
  const [initialViewport, setInitialViewport] = React.useState({ x: 100, y: 100, zoom: 0.5 });
  React.useEffect(() => {
    if (initialNodes && initialNodes.length > 0) {
      const first = initialNodes[0];
      if (first && first.position) {
        setInitialViewport({
          x: first.position.x + 100,
          y: first.position.y + 100,
          zoom: 0.5,
        });
      }
    }
  }, [initialNodes]);

  /**
   * Determines node color based on performance metrics
   * @param {Object} node - The node to evaluate
   * @param {Object} nodeMetrics - Performance metrics for the node
   * @returns {string|null} Color code for the node or null for default
   */
  const getNodeColor = (node, nodeMetrics) => {
    if (!nodeMetrics) return null;

    let value = null;
    if (node.data.type === 'model') {
      // Get last daily metric where sum/count > 0
      const day = Object.keys(nodeMetrics).find(key => nodeMetrics[key].count > 0);
      value = nodeMetrics[day].sum / nodeMetrics[day].count;
    }
    if (node.data.type === 'tool') {
      const day = Object.keys(nodeMetrics).find(key => (nodeMetrics[key].success_count + nodeMetrics[key].error_count) > 0);
      value = nodeMetrics[day].success_count / (nodeMetrics[day].success_count + nodeMetrics[day].error_count);
    }

    if (value === null) return null;
    if (node.data.type === 'model') {
      if (value < 0.7) return '#D32F2F'; // Red for poor performance
      if (value < 0.8) return '#FFA726'; // Orange for moderate performance
      return null; // Green for good performance
    }

    if (node.data.type === 'tool') {
      if (value < 0.7) return '#D32F2F'; // Red for poor performance
      if (value < 0.8) return '#FFA726'; // Orange for moderate performance
      return null; // Green for good performance
    }

    return null;
  };

  // Initialize nodes with monitoring data and metrics
  React.useEffect(() => {
    if (!initialNodes.length) return;
    const verticalSpacing = 30; 

    const nodesWithData = initialNodes.sort((a,b) => a.position.y - b.position.y).map((node, idx) => {
      let nodeMetrics = metrics;
      if (node.data.type === 'model') {
        nodeMetrics = nodeMetrics?.modelMetrics?.metricsByModel?.[node.data.modelId]?.accuracy?.daily;
      } else if (node.data.type === 'tool') {
        nodeMetrics = nodeMetrics?.toolMetrics?.metricsByTool?.[node.data.id]?.daily;
      }
      const nodeColor = getNodeColor(node, nodeMetrics);
      return {
        ...node,
        type: node.data.type === 'model' ? 'deploymentCustom' : node.data.type === 'tool' ? 'toolCustom' : 'custom',
        position: {
          ...node.position,
          y: node.position.y + idx * verticalSpacing, // or just idx * verticalSpacing if starting from 0
        },
        data: {
          ...node.data,
          metrics: nodeMetrics,
          problemType: node.data.type === 'model' ? node.data.problemType : null,
          onClick: () => setSelectedNode(node),
          selected: selectedNode?.id === node.id,
          color: nodeColor,
        },
        style: nodeColor ? {
          borderColor: nodeColor,
          borderWidth: 2,
        } : undefined,
      };
    });

    setNodes(nodesWithData);
  }, [initialNodes, metrics, selectedNode]);

  // Update edges when initial edges change
  React.useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges]);

  /**
   * Handles toggling fullscreen mode
   */
  const handleFullscreen = () => {
    setIsFullscreen(true);
  };

  /**
   * Handles pane click to deselect current node
   */
  const handlePaneClick = () => {
    setSelectedNode(null);
  };

  // Loading state UI
  if (isLoading) {
    return (
      <Stack spacing={4}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ height: '70vh' }}>
              <Skeleton variant="rectangular" height="100%" />
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <Skeleton variant="rectangular" height={200} />
            </Card>
          </Grid>
        </Grid>
      </Stack>
    );
  }

  // Main monitoring interface
  return (
    <Stack style={{ padding: '0px !important' }}>
      <Stack direction="row" spacing={4}>
        <Grid container style={{ height: '100%' }} alignItems="stretch">
          <Grid
            md={12}
            xs={12}
            sx={{ display: 'flex', flexDirection: 'column' }}
            style={{ display: 'flex', flexDirection: 'column', height: '460px' }}
          >
            <Card sx={{ flex: 2, height: '100vh' }}>
              <ReactFlow
                key={agentId}
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                nodesDraggable={false}
                nodesConnectable={false}
                minZoom={0.1}
                maxZoom={4}
                onPaneClick={handlePaneClick}
                defaultViewport={initialViewport}
              >
                <Background />
                <MiniMap
                  style={{ position: 'absolute', top: 10, right: 10, height: 70, width: 100, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.25)', background: '#181c20' }}
                  nodeColor={n => n.data && n.data.type === 'tool' ? '#00bcd4' : '#00f7aa'}
                  nodeStrokeColor={() => '#222'}
                  nodeStrokeWidth={2}
                  maskColor="rgba(24,28,32,0.85)"
                  pannable
                  zoomable
                />
                <Controls
                  showZoom={true}
                  showFitView={false}
                  showInteractive={false}
                >
                  <ControlButton onClick={handleFullscreen} title="Fullscreen">
                    <ArrowsOut />
                  </ControlButton>
                </Controls>
              </ReactFlow>
            </Card>
          </Grid>
        </Grid>
      </Stack>

      {/* Fullscreen monitoring view */}
      <Dialog
        fullScreen
        open={isFullscreen}
        onClose={() => setIsFullscreen(false)}
        sx={{
          '& .MuiDialog-paper': {
            bgcolor: 'background.default'
          }
        }}
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          <IconButton
            onClick={() => setIsFullscreen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              zIndex: 2,
              bgcolor: 'background.paper',
              '&:hover': {
                bgcolor: 'action.hover'
              }
            }}
          >
            <XIcon />
          </IconButton>
          <ReactFlow
            key={`${agentId}-fullscreen`}
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
            nodesDraggable={false}
            nodesConnectable={false}
            minZoom={0.1}
            maxZoom={4}
            onPaneClick={handlePaneClick}
            defaultViewport={initialViewport}
          >
            <Background />
            <MiniMap
              style={{ position: 'absolute', top: 10, right: 10, height: 70, width: 100, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.25)', background: '#181c20' }}
              nodeColor={n => n.data && n.data.type === 'tool' ? '#00bcd4' : '#00f7aa'}
              nodeStrokeColor={() => '#222'}
              nodeStrokeWidth={2}
              maskColor="rgba(24,28,32,0.85)"
              pannable
              zoomable
            />
            <Controls
              showZoom={true}
              showFitView={false}
              showInteractive={false}
            />
          </ReactFlow>
        </DialogContent>
      </Dialog>

      {/* Entry Flow Dialog */}
      <Dialog fullWidth maxWidth="lg" open={Boolean(selectedEntry)} onClose={() => setSelectedEntry(null)}>
        <DialogContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6">Entry Flow Details</Typography>
            <IconButton onClick={() => setSelectedEntry(null)}>
              <XIcon />
            </IconButton>
          </Stack>
          {selectedEntry && <EntryDetails entry={selectedEntry} nodes={nodes} edges={edges} />}
        </DialogContent>
      </Dialog>
    </Stack>
  );
};
