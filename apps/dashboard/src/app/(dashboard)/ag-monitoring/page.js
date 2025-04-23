/**
 * Agent Monitoring Page Component
 * 
 * This page displays a comprehensive monitoring interface for AI agents, showing:
 * - A visual representation of the agent's node structure
 * - Real-time metrics and performance data
 * - Historical metrics comparison
 * - Detailed metrics cards for selected nodes
 * 
 * The page uses RTK Query for data fetching and React Flow for node visualization.
 */
'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import {
  useGetAgentByIdQuery,
  useGetAgentMetricsQuery,
} from '@/services/agentsService';
import { Box, Grid, Stack } from '@mui/material';

import { AgentMetricsCard } from '@/components/dashboard/agents/agent-metrics-card';
import { AgentMonitoring } from '@/components/dashboard/agents/agent-monitoring';
import { useGetMetricsComparisonLastMonthQuery, useGetToolMetricsComparisonLastMonthQuery } from '@/services/modelMetricsService';
import { useGetAgentMetricsComparisonLastMonthQuery } from '@/services/agentsService';
import { AgentCurrentMetricsChart } from '@/components/dashboard/agents/agent-current-metrics-chart';

export default function MonitoringPage() {
  // Get agentId from URL query parameters
  const searchParams = useSearchParams();
  const agentId = searchParams.get('agentId');
  const [selectedNode, setSelectedNode] = React.useState(null);

  // Fetch agent details and metrics using RTK Query
  const { data: agentDetails } = useGetAgentByIdQuery(agentId, {
    skip: !agentId,
  });
  const { data: metrics = {}, isLoading: metricsLoading } = useGetAgentMetricsQuery(agentId, {
    skip: !agentId,
  });



  // Fetch comparison metrics for different node types
  const { data: metricsComparisonLastMonth, isLoading: isLoadingMetricsComparisonLastMonth } =
    useGetMetricsComparisonLastMonthQuery(selectedNode?.data?.modelId, { skip: !selectedNode?.data?.modelId });

  const { data: agentMetricsComparisonLastMonth, isLoading: isLoadingAgentMetricsComparisonLastMonth } =
    useGetAgentMetricsComparisonLastMonthQuery(agentId, { skip: !agentId });

  const { data: toolMetricsComparisonLastMonth, isLoading: isLoadingToolMetricsComparisonLastMonth } =
    useGetToolMetricsComparisonLastMonthQuery(selectedNode?.data?.id, { skip: !selectedNode || selectedNode?.data?.type !== 'tool' });

    // Reset selected node when agent changes
  React.useEffect(() => {
    setSelectedNode(null)
  }, [agentId])



  /**
   * Transform agent data into nodes and edges for visualization
   * This function processes the agent details to create a graph structure
   * where nodes represent components (models/tools) and edges represent connections
   */
  const { nodes, edges } = React.useMemo(() => {
    if (!agentDetails) {
      return { nodes: [], edges: [] };
    }

    // Process each node in the agent
    const nodes = agentDetails.AgentNodes.map((node) => {

      // Get only the unique connections
      const uniqueIncomingConnections = [...new Set(agentDetails.AgentConnections.filter((conn) => conn.to_node_id === node.id).map((conn) => (conn.inputName)))];
      const uniqueOutgoingConnections = [...new Set(agentDetails.AgentConnections.filter((conn) => conn.from_node_id === node.id).map((conn) => (conn.outputName)))];

      // Create input handles based on connections
      const inputs =
        uniqueIncomingConnections.length > 0
          ? uniqueIncomingConnections.map((conn) => ({
            id: conn,
            label: conn,
          }))
          : [{ id: 'input', label: 'Input' }];

      // Create output handles based on connections
      const outputs =
        uniqueOutgoingConnections.length > 0
          ? uniqueOutgoingConnections.map((conn) => ({
            id: conn,
            label: conn,
          }))
          : [{ id: 'output', label: 'Output' }];
          
      // Return formatted node data
      console.log('----- metrics -----', metrics)
        console.log(node.model_id)
      
      return {
        id: node.id.toString(),
        type: 'custom',
        position: node.config.position,
        data: {
          id: node.id,
          label: node.type === 'model' ? node.Model?.name : node.name,
          type: node.type,
          model: node.config.model,
          accuracy: metrics?.modelMetrics?.metricsByModel?.[node.model_id]?.accuracy?.count > 0 ? metrics?.modelMetrics?.metricsByModel?.[node.model_id]?.accuracy?.sum * 1.0 / metrics?.modelMetrics?.metricsByModel?.[node.model_id]?.accuracy?.count : 0,
          problemType: node.Model?.problemType,
          modelId: node.model_id,
          description: node.config?.description,
          toolType: node.config?.toolType,
          inputs,
          outputs,
          modelCategory: node.Model?.modelCategory,
        },
      };
    });

    // Create edges from connections
    const edges = agentDetails.AgentConnections.map((conn) => ({
      id: conn.id.toString(),
      source: conn.from_node_id.toString(),
      target: conn.to_node_id.toString(),
      sourceHandle: conn.outputName || 'output',
      targetHandle: conn.inputName || 'input',
    }));

    return { nodes, edges };
  }, [agentDetails, metrics]);

  React.useEffect(() => {
    // set first node as default
    if (nodes.length > 0 && !selectedNode) {
      setSelectedNode(nodes[0])
    }
  }, [nodes])

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
      <Stack spacing={4} sx={{ flex: 1, marginTop: '24px' }}>
        <Grid container style={{ height: '100%' }} alignItems="stretch">
          {/* Main monitoring visualization area */}
          <Grid
            md={8}
            xs={12}
            sx={{
              paddingLeft: '1vmax',
              display: 'flex',
              flexDirection: 'column',
              paddingRight: '2vmax',
            }}
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <AgentMonitoring
              initialNodes={nodes}
              initialEdges={edges}
              metrics={metrics}
              loading={metricsLoading}
              setSelectedNode={setSelectedNode}
              selectedNode={selectedNode}
              agentId={agentDetails?.id}
            />
          </Grid>
          {/* Metrics comparison chart area */}
          <Grid
            md={4}
            xs={12}
            sx={{
              paddingRight: '1vmax',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '460px',
              marginBottom: '30px',
            }}
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <AgentCurrentMetricsChart
              data={selectedNode ? selectedNode?.data?.type === 'model' ? metricsComparisonLastMonth : toolMetricsComparisonLastMonth : agentMetricsComparisonLastMonth}
              setOpen={() => { }}
              selectedNode={selectedNode}
              agentId={agentDetails?.id}
            />
          </Grid>
          {/* Detailed metrics card area */}
          <Grid
            md={12}
            xs={12}
            sx={{
              paddingRight: '1vmax',
              paddingLeft: '1vmax',
              display: 'flex',
              flexDirection: 'column',
              marginBottom: '30px',
            }}
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <AgentMetricsCard selectedNode={selectedNode} isLoading={metricsLoading} data={metrics} agent={agentDetails} />
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
}
