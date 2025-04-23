/**
 * Agent Metrics Card Component
 * 
 * A comprehensive metrics visualization component that displays agent performance data
 * through charts, summaries, and trend indicators. Supports both model and tool metrics,
 * with comparison between base and optimized performance.
 */

'use client';

import * as React from 'react';
import { useGetReferenceLinesQuery } from '@/services/monitoringService';
import { Avatar, Box, Card, CardContent, Divider, Skeleton, Stack, Typography } from '@mui/material';
import { ChartLine, Gear, Target, TrendDown, TrendUp } from '@phosphor-icons/react';
import dayjs from 'dayjs';
import {
  Area,
  AreaChart,
  ComposedChart,
  Label,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { parseTitle } from '@/lib/text';
import { NoSsr } from '@/components/core/no-ssr';
import { MetricsSwitch } from '@/components/dashboard/layout/metrics-switch';

/**
 * Available metrics for different node types
 */
const MODEL_METRICS = ['accuracy', 'f1', 'precision', 'recall'];
const TOOL_METRICS = ['success_rate', 'error_rate'];

/**
 * Icon mapping for different metric types
 */
const icons = {
  accuracy: Target,
  f1: ChartLine,
  precision: TrendUp,
  recall: ChartLine,
  success_rate: TrendUp,
  error_rate: TrendDown,
  avg_duration: ChartLine,
  total_calls: Gear,
};

/**
 * Legend Component
 * Displays the legend for the metrics chart, showing different performance lines
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isToolMetrics - Whether tool metrics are being displayed
 * @param {Object} props.selectedNode - Currently selected node
 * @returns {JSX.Element} The legend component
 */
function Legend({ isToolMetrics, selectedNode }) {
  return (
    <Stack direction="row" spacing={2}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Box sx={{ bgcolor: 'var(--mui-palette-primary-main)', borderRadius: '2px', height: '4px', width: '16px' }} />
        <Typography color="text.secondary" variant="caption">
          {isToolMetrics ? 'Tool Performance' : selectedNode ? 'Base Model' : 'Agent Performance'}
        </Typography>
      </Stack>
      {((selectedNode && selectedNode.data.type == 'model') || !selectedNode) && (
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Box sx={{ bgcolor: 'var(--mui-palette-primary-400)', borderRadius: '2px', height: '4px', width: '16px' }} />
          <Typography color="text.secondary" variant="caption">
            {selectedNode ? 'Optimized Model' : 'Optimized Agent'}
          </Typography>
        </Stack>
      )}
    </Stack>
  );
}

/**
 * TooltipContent Component
 * Custom tooltip for the metrics chart showing detailed values
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.active - Whether the tooltip is active
 * @param {Array} props.payload - Data payload for the tooltip
 * @param {string} props.label - Label for the tooltip
 * @param {Object} props.metric - Current metric being displayed
 * @returns {JSX.Element|null} The tooltip content component
 */
function TooltipContent({ active, payload, label, metric }) {
  if (!active || !payload) return null;
  return (
    <Card sx={{ p: 2 }}>
      <Stack spacing={1}>
        <Typography variant="caption" color="text.secondary">
          {dayjs(label).format('MMM D, YYYY')}
        </Typography>
        <Typography key={'Optimized ' + metric?.name} variant="body2">
          Optimized {parseTitle(metric?.name) + ' '}
          {payload[0]?.payload?.optimized?.toFixed(2)}
          {metric?.name === 'avg_duration' ? ' ms' : '%'}
        </Typography>
        <Typography key={'Base Model ' + metric?.name} variant="body2">
          Based {parseTitle(metric?.name) + ' '}
          {payload[0]?.payload?.value?.toFixed(2)}
          {metric?.name === 'avg_duration' ? ' ms' : '%'}
        </Typography>
      </Stack>
    </Card>
  );
}

/**
 * Summary Component
 * Displays a summary card for a specific metric with current and optimized values
 * 
 * @param {Object} props - Component props
 * @param {number} props.index - Index of the summary card
 * @param {React.ComponentType} props.icon - Icon component for the metric
 * @param {string} props.title - Title of the metric
 * @param {number} props.regularValue - Base value of the metric
 * @param {number} props.optimizedValue - Optimized value of the metric
 * @param {Object} props.selectedNode - Currently selected node
 * @param {Object} props.metric - Current metric being displayed
 * @returns {JSX.Element} The summary component
 */
function Summary({ index, icon: Icon, title, regularValue, optimizedValue, selectedNode, metric }) {
  return (
    <Stack direction="row" spacing={3} sx={{ alignItems: 'center' }}>
      <div>
        <Typography
          color="text.primary"
          variant="overline"
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'start',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <Avatar
            sx={{
              '--Avatar-size': '48px',
              '--Icon-fontSize': 'var(--icon-fontSize-lg)',
              bgcolor: 'var(--mui-palette-background-paper)',
              boxShadow: 'var(--mui-shadows-8)',
              color: 'var(--mui-palette-text-primary)',
            }}
          >
            <Icon fontSize="var(--Icon-fontSize)" />
          </Avatar>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {' ' + ((title || '').toLowerCase().includes('average') ? ' ' : 'Average ') + title}
            <Typography
              variant="caption"
              color={'rgba(255,255,255,0.6)'}
              style={{
                display: 'inline',
                fontSize: '0.6rem',
                marginTop: '-6px',
              }}
            >
              Last 30 days
            </Typography>
          </div>
        </Typography>

        <Typography
          variant="h5"
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'end',
            gap: '10px',
            marginTop: '16px',
            marginLeft: '8px',
          }}
        >
          {new Intl.NumberFormat('en-US', {
            style: metric.name !== 'avg_duration' ? 'percent' : 'decimal',
            maximumFractionDigits: 2,
          }).format(optimizedValue)}

          {((selectedNode && selectedNode.data.type == 'model') || !selectedNode) && (
            <Typography
              variant="caption"
              color={optimizedValue >= regularValue ? 'success.main' : 'error.main'}
              style={{
                display: 'inline',
                fontSize: '0.9rem',
              }}
            >
              {optimizedValue >= regularValue ? (
                <TrendUp color="var(--mui-palette-success-main)" fontSize="var(--icon-fontSize-xs)" />
              ) : (
                <TrendDown color="var(--mui-palette-error-main)" fontSize="var(--icon-fontSize-xs)" />
              )}

              {new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 2 }).format(
                !selectedNode
                  ? (metric.name == 'recall'
                    ? 0
                    : metric.name == 'precision'
                      ? 0
                      : metric.name == 'accuracy'
                        ? 0
                        : metric.name == 'f1'
                          ? 0
                          : 0) / 100.0
                  : optimizedValue - regularValue || 0
              )}
            </Typography>
          )}
        </Typography>
      </div>
    </Stack>
  );
}

/**
 * AgentMetricsCard Component
 * 
 * A comprehensive metrics visualization component that displays agent performance data.
 * Shows performance trends, comparisons between base and optimized metrics, and
 * detailed summaries for different metric types.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.data - Metrics data object containing performance metrics
 * @param {Object} [props.selectedNode] - Currently selected node in the agent flow
 * @param {boolean} [props.isLoading=false] - Whether the component is in a loading state
 * @param {Object} props.agent - Agent data object
 * @returns {JSX.Element} The agent metrics card component
 */
export function AgentMetricsCard({ data, selectedNode, isLoading, agent }) {
  // Fetch reference lines for performance comparison
  const { data: referenceLines, isLoading: isLoadingReferenceLines } = useGetReferenceLinesQuery(
    selectedNode
      ? selectedNode?.data?.modelId
      : agent?.AgentNodes?.find((n) => n.type == 'model')?.modelId
  );

  // State management
  const [transformedReferenceLines, setTransformedReferenceLines] = React.useState([]);
  const chartHeight = 190;
  const [metric, setMetric] = React.useState(null);
  const [metrics, setMetrics] = React.useState([]);
  const [transformedData, setTransformedData] = React.useState([]);
  const [currentValue, setCurrentValue] = React.useState(0);
  const [changeValue, setChangeValue] = React.useState(0);

  // Determine if we're showing tool or model metrics
  const isToolMetrics = selectedNode && selectedNode?.data?.type !== 'model';
  let availableMetrics = isToolMetrics
    ? TOOL_METRICS
    : Object.keys(data?.modelMetrics?.metricsByModel?.[selectedNode?.data?.modelId] || {}).filter((m) => m != 'Healtcheck') || MODEL_METRICS;

  if (availableMetrics.length == 0) {
    availableMetrics = MODEL_METRICS;
  }

  // Initialize metrics based on node type
  React.useEffect(() => {
    const metricsList = availableMetrics.map((name) => ({
      id: name,
      name: name,
    }));
    setMetrics(metricsList);
    setMetric(metricsList[0]);
  }, [selectedNode]);

  // Transform reference lines data
  React.useEffect(() => {
    if (referenceLines) {
      setTransformedReferenceLines(referenceLines.map((line) => ({
        ...line,
        date: new Date(parseInt(line.date.split('-')[0]) + '-' + parseInt(line.date.split('-')[1]) + '-' + parseInt(line.date.split('-')[2])).getTime(),
      })));
    }
  }, [referenceLines]);

  // Transform metrics data for visualization
  React.useEffect(() => {
    if (!metric || !data) return;
    let metricsData;
    if (selectedNode) {
      // Node-specific metrics
      metricsData = isToolMetrics
        ? data?.toolMetrics?.metricsByTool[selectedNode.data.id]
        : data?.modelMetrics?.metricsByModel[selectedNode.data.modelId]?.[metric.id];
    } else {
      // General metrics
      metricsData = data?.modelMetrics?.aggregatedMetrics[metric.id];
    }
    if (!metricsData) {
      setTransformedData([]);
      setCurrentValue(0);
      setChangeValue(0);
      return;
    }

    // Transform daily metrics data
    let transformedDataVl = [];
    if (metricsData.daily) {
      transformedDataVl = Object.entries(metricsData.daily).map(([date, value]) => {
        let numValue = 0;
        if (isToolMetrics) {
          let totalCount = value.success_count + value.error_count;
          if (totalCount == 0) {
            numValue = 0;
          } else if (metric.id == 'success_rate') {
            numValue = value.success_count / totalCount;
          } else if (metric.id == 'error_rate') {
            numValue = value.error_count / totalCount;
          } else {
            numValue = value[metric.id];
          }
        } else {
          numValue = value.count > 0 ? (value.sum / value.count) : 0;
        }
        return {
          baseDate: date,
          date: new Date(date.split('-')[2] + '-' + date.split('-')[1] + '-' + date.split('-')[0]).getTime(),
          value: numValue * 100.0,
        };
      });

      // Add optimized metrics if available
      if (metricsData.optimizedDaily) {
        transformedDataVl = transformedDataVl.map((d) => ({
          ...d,
          optimized:
            metricsData?.optimizedDaily?.[d.baseDate]?.count > 0
              ? (metricsData?.optimizedDaily?.[d.baseDate].sum / metricsData?.optimizedDaily?.[d.baseDate].count) * 100.0
              : 0,
        }));
      }
    }

    // Add reference values
    transformedDataVl = transformedDataVl.map((d) => ({
      ...d,
      referenceValue: transformedReferenceLines?.some((line) => d.date == line.date) ? d.value : null,
      referenceOptimizedValue: transformedReferenceLines?.some((line) => d.date == line.date) ? d.optimized : null,
    }));

    // Sort and process data
    transformedDataVl.sort((a, b) => a.date - b.date);
    let lastValue = 0;
    let lastOptimizedValue = 0;

    transformedDataVl = transformedDataVl.map((d) => {
      if (d.value) {
        lastValue = d.value;
      }
      if (d.optimized) {
        lastOptimizedValue = d.optimized;
      }
      return {
        ...d,
        value: lastValue,
        optimized: lastOptimizedValue,
      }
    });

    setTransformedData(transformedDataVl);

    // Calculate current value and change
    setChangeValue('0.0');
    if (isToolMetrics) {
      let currentValue = 0;
      const lastValue = transformedDataVl[transformedDataVl.length - 1];
      if (lastValue) {
        currentValue = lastValue.value / 100.0;
      }
      setCurrentValue(currentValue);
    } else {
      const lastValue = transformedDataVl[transformedDataVl.length - 1];
      let currentValue = 0;
      if (lastValue) {
        currentValue = lastValue.value / 100.0;
      }
      setCurrentValue(currentValue);

      // Calculate improvement value
      let improvedValue = 0;
      for (let i = transformedDataVl.length - 1; i >= 0; i--) {
        if (transformedDataVl[i].optimized) {
          improvedValue = transformedDataVl[i].optimized / 100.0;
          break;
        }
      }
      if (improvedValue > 0) {
        setChangeValue(((improvedValue) * 100.0).toFixed(1));
      }
    }
  }, [metric, data, selectedNode, isToolMetrics, transformedReferenceLines]);

  // Loading state UI
  if (isLoading) {
    return (
      <Card
        style={{ paddingTop: '8px', paddingBottom: '8px', position: 'relative', overflow: 'hidden', height: '460px' }}
      >
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} marginBottom={3}>
            <Stack spacing={0} sx={{ flex: '0 0 auto', justifyContent: 'space-between', width: '280px' }}>
              <Skeleton variant="text" width={120} />
              <Box sx={{ marginTop: '100px' }}>
                <Skeleton variant="text" width={180} height={60} />
              </Box>
            </Stack>
            <Stack spacing={2} sx={{ flex: '1 1 auto' }}>
              <Skeleton variant="text" width={200} />
              <Skeleton variant="rectangular" height={chartHeight} />
              <Box sx={{ display: 'flex', justifyContent: 'end', marginRight: 20 }}>
                <Skeleton variant="text" width={100} />
              </Box>
            </Stack>
          </Stack>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            sx={{ justifyContent: 'space-between', marginRight: '24px' }}
          >
            {[1, 2, 3].map((index) => (
              <Stack key={index} direction="row" spacing={1} alignItems="center" sx={{ minWidth: '200px' }}>
                <Skeleton variant="circular" width={40} height={40} />
                <Stack spacing={0.5}>
                  <Skeleton variant="text" width={120} />
                  <Skeleton variant="text" width={80} />
                </Stack>
              </Stack>
            ))}
          </Stack>
        </CardContent>
      </Card>
    );
  }

  // Main metrics visualization UI
  return (
    <Card
      style={{ paddingTop: '8px', paddingBottom: '8px', position: 'relative', overflow: 'hidden', height: '460px' }}
    >
      <Box sx={{ filter: 'none', pointerEvents: 'auto', height: '100%', transition: 'filter 0.3s' }}>
        <CardContent>
          {/* Header and Current Value Section */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} marginBottom={3}>
            <Stack spacing={0} sx={{ flex: '0 0 auto', justifyContent: 'space-between', width: '290px' }}>
              <Stack sx={{ paddingTop: '10px' }}>
                <Typography variant="h6">
                  {selectedNode ? selectedNode.data.label : 'Overall Agent'} Performance
                  <Typography variant="caption" color="text.secondary" display="block">
                    {dayjs().format('MMM D, YYYY')}
                  </Typography>
                </Typography>
                <Typography variant="h2" sx={{ marginTop: '100px' }} color="white">
                  {(
                    currentValue *
                    (!selectedNode ||
                      (selectedNode && selectedNode.data.type == 'model') ||
                      parseTitle(metric?.name || '') == 'Success Rate' ||
                      parseTitle(metric?.name || '') == 'Error Rate'
                      ? 100
                      : 1)
                  ).toFixed(1)}
                  {!selectedNode ||
                    (selectedNode && selectedNode.data.type == 'model') ||
                    parseTitle(metric?.name || '') == 'Success Rate' ||
                    parseTitle(metric?.name || '') == 'Error Rate'
                    ? '%'
                    : ' ms'}
                  {((selectedNode && selectedNode.data.type == 'model') || !selectedNode) && changeValue !== '0.0' && parseFloat(changeValue) > 0 && (
                    <Typography
                      variant="caption"
                      color={parseFloat(changeValue) >= 0 ? 'var(--mui-palette-primary-400)' : 'error.main'}
                      style={{ display: 'inline', fontSize: '1.5rem', marginLeft: '10px' }}
                    >
                      {parseFloat(changeValue) >= 0 ? (
                        <TrendUp color="var(--mui-palette-primary-400)" fontSize="var(--icon-fontSize-md)" />
                      ) : (
                        <TrendDown color="var(--mui-palette-error-main)" fontSize="var(--icon-fontSize-md)" />
                      )}
                      {' ' + changeValue}%
                    </Typography>
                  )}
                </Typography>
                {selectedNode && selectedNode.data.type == 'model' && (
                  <Typography color="white">
                    {changeValue ? 'Base vs. Optimized ' + parseTitle(selectedNode.data.label) + ' ' : 'Base ' + parseTitle(selectedNode.data.label) + ' '}
                    {parseTitle(metric?.name || '')}
                  </Typography>
                )}
                {selectedNode && selectedNode?.data?.type !== 'model' && (
                  <Typography color="white">{parseTitle(metric?.name || '')} of Tool.</Typography>
                )}
                {!selectedNode && (
                  <Typography color="white">
                    {changeValue ? 'Base vs. Optimized ' : ''}
                    {parseTitle(metric?.name || '')} across your Agent.
                  </Typography>
                )}
              </Stack>
            </Stack>

            {/* Chart Section */}
            <Stack spacing={2} sx={{ flex: '1 1 auto' }}>
              <MetricsSwitch onMetricChange={setMetric} metric={metric} metrics={metrics} />
              <NoSsr fallback={<Box sx={{ height: `${chartHeight}px` }} />}>
                <ResponsiveContainer width="100%" height={chartHeight}>
                  <ComposedChart data={transformedData} margin={{ right: 25, top: 10 }}>
                    <defs>
                      <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0" stopColor="var(--mui-palette-primary-400)" stopOpacity={0.1} />
                        <stop offset="100%" stopColor="var(--mui-palette-primary-400)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis axisLine={false} hide dataKey="date" tickLine={false} />
                    <YAxis domain={metric?.name === 'avg_duration' ? [0, 500] : [0, 100]} />

                    {/* Reference Lines */}
                    {(transformedReferenceLines || []).map((line) => (
                      <ReferenceLine
                        key={line.date}
                        x={line.date}
                        stroke="var(--mui-palette-primary-400)"
                        strokeDasharray="3 3"
                        strokeWidth={2}
                        color={'var(--mui-palette-neutral-50)'}
                        label={
                          <Label position="insideTopLeft" style={{ fontSize: '11px', color: 'var(--mui-palette-primary-50)' }} fill={'var(--mui-palette-primary-50)'}>
                            {'Self-Improved ' + (selectedNode ? '' : 'Agent') + ' ' + line.label}
                          </Label>
                        }
                      />
                    ))}

                    {/* Performance Areas */}
                    <Area
                      animationDuration={300}
                      dataKey={'value'}
                      stroke="var(--mui-palette-primary-main)"
                      strokeWidth={2}
                      xAxisId={0}
                      yAxisId={0}
                      fillOpacity={1}
                      type={'monotone'}
                      fill="url(#white)"
                    />
                    <Area
                      animationDuration={300}
                      dataKey={'optimized'}
                      strokeWidth={2}
                      stroke="var(--mui-palette-primary-400)"
                      xAxisId={0}
                      yAxisId={0}
                      fillOpacity={1}
                      type={'monotone'}
                      fill="url(#grad)"
                    />

                    {/* Reference Points */}
                    <Scatter
                      fill="var(--mui-palette-background-paper)"
                      stroke="var(--mui-palette-primary-main)"
                      strokeWidth={2}
                      dataKey="referenceValue"
                      xAxisId={0}
                      yAxisId={0}
                      r={4}
                    />
                    <Scatter
                      fill="var(--mui-palette-background-paper)"
                      stroke="var(--mui-palette-primary-400)"
                      strokeWidth={2}
                      dataKey="referenceOptimizedValue"
                      xAxisId={0}
                      yAxisId={0}
                      r={4}
                    />
                    <Tooltip content={<TooltipContent metric={metric} />} />
                  </ComposedChart>
                </ResponsiveContainer>
              </NoSsr>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'end',
                  marginRight: 20,
                }}
              >
                <Legend isToolMetrics={isToolMetrics} selectedNode={selectedNode} />
              </div>
            </Stack>
          </Stack>

          {/* Metrics Summary Section */}
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            marginLeft={'auto'}
            marginRight={'auto'}
            divider={<Divider flexItem orientation="vertical" sx={{ borderBottomWidth: { xs: '1px', md: 0 } }} />}
            sx={{ justifyContent: 'space-between', marginRight: '24px' }}
          >
            {metrics.map((m, index) => {
              let metricsData;
              if (selectedNode) {
                // Node-specific metrics
                metricsData = isToolMetrics
                  ? data?.toolMetrics?.metricsByTool[selectedNode.data.id]
                  : data?.modelMetrics?.metricsByModel[selectedNode.data.modelId]?.[m.id];
              } else {
                // General metrics
                metricsData = data?.modelMetrics?.aggregatedMetrics[m.id];
              }

              let value = 0;
              let optimizedValue = 0;
              if (isToolMetrics) {
                if (m.id == 'success_rate') {
                  value = metricsData?.success_count / (metricsData?.success_count + metricsData?.error_count);
                } else if (m.id == 'error_rate') {
                  value = metricsData?.error_count / (metricsData?.success_count + metricsData?.error_count);
                } else {
                  value = metricsData?.[metric.id] || 0;
                }
              } else {
                value = metricsData?.count > 0 ? metricsData?.sum / metricsData?.count : 0;
              }

              if (metricsData?.optimizedCount > 0) {
                optimizedValue = metricsData?.optimizedSum / metricsData?.optimizedCount || value;
              } else {
                optimizedValue = value;
              }

              return (
                <Summary
                  index={index}
                  key={m.id}
                  icon={icons[m.name] || Target}
                  title={parseTitle(m.name)}
                  regularValue={value || 0}
                  optimizedValue={optimizedValue || 0}
                  selectedNode={selectedNode}
                  metric={m}
                />
              );
            })}
          </Stack>
        </CardContent>
      </Box>
    </Card>
  );
}
