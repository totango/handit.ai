'use client';

import * as React from 'react';
import { Box, CardContent, CardHeader, Divider, Paper, Skeleton } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ChartLine, ChartPie, Target, TrendDown, TrendUp } from '@phosphor-icons/react';
import { format } from 'date-fns';
import dayjs from 'dayjs';
import { Area, AreaChart, Label, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { parseTitle } from '@/lib/text';
import { NoSsr } from '@/components/core/no-ssr';
import { MetricsSwitch } from '@/components/dashboard/layout/metrics-switch.js';

const icons = {
  accuracy: Target,
  f1: ChartLine,
  recall: ChartPie,
  precision: TrendUp,
  average_relevance: TrendUp,
  average_coherence: ChartPie,
};

function Legend() {
  return (
    <Stack direction="row" spacing={2}>
      <Stack direction="row" key={'base'} spacing={1} sx={{ alignItems: 'center' }}>
        <Box sx={{ bgcolor: 'rgba(255,255,255,0.6)', borderRadius: '2px', height: '4px', width: '16px' }} />
        <Typography color="text.secondary" variant="caption">
          Base Model
        </Typography>
      </Stack>
      <Stack direction="row" key={'base'} spacing={1} sx={{ alignItems: 'center' }}>
        <Box sx={{ bgcolor: 'var(--mui-palette-primary-main)', borderRadius: '2px', height: '4px', width: '16px' }} />
        <Typography color="text.secondary" variant="caption">
          Optimized Model
        </Typography>
      </Stack>
    </Stack>
  );
}

function Summary({ index, icon: Icon, title, regularValue, optimizedValue }) {
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
          {new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 2 }).format(optimizedValue)}

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
              optimizedValue - regularValue
            )}
          </Typography>
        </Typography>
      </div>
    </Stack>
  );
}

function TooltipContent({ active, payload }) {
  if (!active) {
    return null;
  }

  let time = payload[0]?.payload.date;
  // the date shows as the day before, so fix it
  time = new Date(time);
  time.setDate(time.getDate() + 1);
  let formattedDate = '';
  try {
    formattedDate = time ? format(time, 'MMM d, yyyy') : '';
  } catch (error) {
    console.error('Error formatting date:', error);
  }

  return (
    <Paper sx={{ border: '1px solid var(--mui-palette-divider)', boxShadow: 'var(--mui-shadows-16)', p: 1 }}>
      <Stack spacing={2}>
        <p
          style={{
            marginLeft: '4px',
            marginTop: '4px',
            marginBottom: '0px',
            color: '#6e6e6e',
            fontSize: '13px',
            fontWeight: 'bold',
          }}
        >
          {formattedDate}
        </p>
        {payload?.map((entry) => (
          <Stack direction="row" key={entry.name} spacing={3} sx={{ alignItems: 'center' }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flex: '1 1 auto' }}>
              <Box sx={{ bgcolor: entry.fill, borderRadius: '2px', height: '8px', width: '8px' }} />
              <Typography sx={{ whiteSpace: 'nowrap' }}>
                {entry?.dataKey === 'based' ? 'Base Model' : 'Optimized Model'}
              </Typography>
            </Stack>
            <Typography color="text.secondary" variant="body2">
              {new Intl.NumberFormat('en-US', {
                style: 'percent',
                maximumFractionDigits: 2,
              }).format(entry.value / 100.0)}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
}


export function StatABCard({ model, data, isLoading, optimizedModel, referenceLines = null }) {
  const chartHeight = 190;
  const [metric, setMetric] = React.useState(null);
  const [metrics, setMetrics] = React.useState(null);
  const [transformedData, setTransformedData] = React.useState([]);
  const [optimizedModelMetricAvg, setOptimizedModelMetricAvg] = React.useState(0);
  const [differenceModelMetricAvg, setDifferenceModelMetricAvg] = React.useState(0);

  let deploymentDate = optimizedModel?.versionDate || optimizedModel?.createdAt;
  // parse deplyment date in the following format Fri, 27 Dec 2024 00:00:00 GMT
  deploymentDate = new Date(deploymentDate);
  // set hours to 0 UTC
  deploymentDate.setUTCHours(0, 0, 0, 0);

  React.useEffect(() => {
    const metricsList = (data?.baseModelMetric?.modelMetrics || [])
      .filter((m) => m.name !== 'Healtcheck')
      .map((m) => ({
        ...m,
        optimizedId: (data?.optimizedModelMetric?.modelMetrics || []).find((om) => om.name === m.name)?.id,
      }));
    setMetrics(metricsList);
    setMetric(metricsList[0]);
  }, [data]);

  if (!referenceLines || referenceLines.length === 0) {
    referenceLines = [
      {
        date: deploymentDate.getTime(),
        label: 'V2',
        color: 'var(--mui-palette-primary-main)',
      },
    ];
  }

  React.useEffect(() => {
    if (metric && data) {
      const baseKey = metric.id;
      const optimizedKey = (data?.optimizedModelMetric?.modelMetrics || []).find((m) => m.name === metric.name)?.id;
      const keys = Object.keys(data?.baseModelMetric?.lastMetricLogs || {});
      keys.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
      let lastValueBased = 0;
      let lastValueOptimized = 0;
      setTransformedData(
        keys.map((key, index) => {
          const basedValue =
            (data?.baseModelMetric?.lastMetricLogs[key]
              ? data?.baseModelMetric?.lastMetricLogs[key][baseKey] || 0
              : 0) * 100;

          const optimizedValue =
            (data?.optimizedModelMetric?.lastMetricLogs?.[key]
              ? data?.optimizedModelMetric?.lastMetricLogs?.[key]?.[optimizedKey] || 0
              : 0) * 100;

          if (basedValue > 0) {
            lastValueBased = basedValue;
          }
          if (optimizedValue > 0) {
            lastValueOptimized = optimizedValue;
          }
          return {
            date: new Date(key).getTime(),
            based: basedValue || lastValueBased,
            optimized: optimizedValue || lastValueOptimized,
          };
        })
      );
      const optimizedMetric = data?.optimizedModelMetric?.avgModelMetricsCurrentMonth?.[optimizedKey] || 0;
      const baseMetricVal = data?.baseModelMetric?.avgModelMetricsCurrentMonth?.[baseKey] || 0;

      setOptimizedModelMetricAvg(optimizedMetric);
      setDifferenceModelMetricAvg(parseInt((optimizedMetric - baseMetricVal) * 100));
    }
  }, [metric, data]);

  if (isLoading) {
    return (
      <Card
        style={{ paddingTop: '8px', paddingBottom: '8px', position: 'relative', overflow: 'hidden', height: '460px' }}
      >
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} marginBottom={3}>
            <Stack spacing={0} sx={{ flex: '0 0 auto', justifyContent: 'space-between', width: '280px' }}>
              <Stack sx={{ paddingTop: '10px' }}>
                <Skeleton variant="text" width="60%" height={32} />
                <Skeleton variant="text" width="40%" height={20} />
                <Box sx={{ marginTop: '100px' }}>
                  <Skeleton variant="text" width="80%" height={60} />
                  <Skeleton variant="text" width="50%" height={24} />
                </Box>
              </Stack>
            </Stack>
            <Stack spacing={2} sx={{ flex: '1 1 auto' }}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Skeleton variant="rectangular" width={200} height={32} />
              </Box>
              <Skeleton variant="rectangular" height={chartHeight} />
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                {[1, 2].map((item) => (
                  <Stack key={item} direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <Skeleton variant="rectangular" width={16} height={4} />
                    <Skeleton variant="text" width={60} />
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </Stack>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={3}
            divider={<Divider flexItem orientation="vertical" />}
            sx={{ justifyContent: 'space-between' }}
          >
            {[1, 2, 3].map((item) => (
              <Stack key={item} direction="row" spacing={3} sx={{ alignItems: 'center' }}>
                <Skeleton variant="circular" width={48} height={48} />
                <Stack spacing={1}>
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

  return (
    <Card
      style={{ paddingTop: '8px', paddingBottom: '8px', position: 'relative', overflow: 'hidden', height: '460px' }}
    >
      <Box
        sx={{
          filter: 'none',
          pointerEvents: 'auto',
          height: '100%',
          transition: 'filter 0.3s',
        }}
      >
        <CardContent>
          {data && (
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} marginBottom={3}>
              <Stack spacing={0} sx={{ flex: '0 0 auto', justifyContent: 'space-between', width: '280px' }}>
                <Stack sx={{ paddingTop: '10px' }}>
                  <Typography variant="h6">
                    Performance Comparison
                    <br />
                    <Typography variant="caption" color="text.secondary">
                      {model ? dayjs(model.createdAt).format('MMM D, YYYY hh:mm A') : ''}
                    </Typography>
                  </Typography>
                  <Typography
                    variant="h2"
                    sx={{
                      marginTop: '100px',
                    }}
                  >
                    {parseInt(optimizedModelMetricAvg * 100)}%{' '}
                    <Typography
                      variant="caption"
                      color={differenceModelMetricAvg >= 0 ? 'success.main' : 'error.main'}
                      style={{
                        display: 'inline',
                        fontSize: '1.5rem',
                      }}
                    >
                      {differenceModelMetricAvg >= 0 ? (
                        <TrendUp color="var(--mui-palette-success-main)" fontSize="var(--icon-fontSize-md)" />
                      ) : (
                        <TrendDown color="var(--mui-palette-error-main)" fontSize="var(--icon-fontSize-md)" />
                      )}
                      {' ' + differenceModelMetricAvg}%
                    </Typography>
                  </Typography>
                  <Typography color="text.secondary">Change from base model.</Typography>
                </Stack>
              </Stack>

              <Stack spacing={2} sx={{ flex: '1 1 auto' }}>
                <MetricsSwitch onMetricChange={setMetric} metric={metric} metrics={metrics} />
                <NoSsr fallback={<Box sx={{ height: `${chartHeight}px` }} />}>
                  <ResponsiveContainer width={'100%'} height={chartHeight}>
                    <AreaChart data={transformedData} margin={{ right: 25, top: 10 }}>
                      <defs>
                        <linearGradient id={'grad'} x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0" stopColor={'var(--mui-palette-primary-main)'} stopOpacity={0.1} />
                          <stop offset="100%" stopColor={'var(--mui-palette-primary-main)'} stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id={'white'} x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0" stopColor={'var(--mui-palette-primary-main)'} stopOpacity={0} />
                        </linearGradient>
                      </defs>

                      <XAxis axisLine={false} hide dataKey="date" tickLine={false} scale={'time'} />
                      <YAxis axisLine={false} domain={[0, 100]} type="number" />

                      {referenceLines.map((line) => (
                        <ReferenceLine
                          x={line.date}
                          stroke={line.color}
                          strokeDasharray="3 3"
                          strokeWidth={2}
                          label={
                            <Label position="insideTopLeft" style={{ fontSize: '11px' }}>
                              {line.label}
                            </Label>
                          }
                        />
                      ))}

                      <Area
                        animationDuration={300}
                        dataKey={'optimized'}
                        strokeWidth={2}
                        stroke="var(--mui-palette-primary-main)"
                        xAxisId={0}
                        yAxisId={0}
                        fillOpacity={1}
                        type={'monotone'}
                        fill="url(#grad)"
                      />
                      <Area
                        animationDuration={300}
                        dataKey={'based'}
                        stroke="rgba(255,255,255,0.6)"
                        strokeWidth={2}
                        xAxisId={0}
                        yAxisId={0}
                        fillOpacity={1}
                        type={'monotone'}
                        fill="url(#white)"
                      />
                      <Tooltip animationDuration={50} content={<TooltipContent />} cursor={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </NoSsr>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'end',
                    marginRight: 20,
                  }}
                >
                  <Legend />
                </div>
              </Stack>
            </Stack>
          )}
          {!data && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(0, 0, 0, 0.8)',
                zIndex: 10,
                p: 10,
                textAlign: 'center',
              }}
            >
              <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>
                No data available yet. You'll begin to see data within 24 hours after the validation of your first
                model's entries starts.
              </Typography>
            </Box>
          )}

          <Stack
            direction={{ xs: 'column', md: 'row' }}
            marginLeft={'auto'}
            marginRight={'auto'}
            divider={<Divider flexItem orientation="vertical" sx={{ borderBottomWidth: { xs: '1px', md: 0 } }} />}
            sx={{ justifyContent: 'space-between', marginRight: '24px' }}
          >
            {(metrics || []).map((m, index) => (
              <Summary
                index={index}
                key={m.id}
                icon={icons[m.name]}
                title={parseTitle(m.name)}
                regularValue={data?.baseModelMetric?.avgModelMetricsCurrentMonth?.[m.id] || 0}
                optimizedValue={data?.optimizedModelMetric?.avgModelMetricsCurrentMonth?.[m.optimizedId] || 0}
              />
            ))}
          </Stack>
        </CardContent>
      </Box>
    </Card>
  );
}
