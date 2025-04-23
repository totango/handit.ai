'use client';

import * as React from 'react';
import { Divider } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { Bell as BellIcon } from '@phosphor-icons/react/dist/ssr/Bell';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { format } from 'date-fns';

const CustomTooltip = ({ active, payload, label, coordinate }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          position: 'absolute',
          left: `${coordinate.x}px`, // Tooltip follows the x-coordinate of the cursor
          top: `${coordinate.y - 100}px`, // Offset by 70px to position above the cursor
          transform: 'translateX(-50%)', // Center it horizontally
          background: 'white',
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '10px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          pointerEvents: 'none', // Make sure the tooltip doesn't interfere with hovering
          zIndex: 999, // Ensure the tooltip appears on top
        }}
      >
        <div>
          {payload.map((payloadElement) => {
            const payloadTimestamp = new Date(payloadElement?.payload?.timestamp);
            const formattedDate = format(payloadTimestamp, 'MMM d, yyyy h:mm a');
            return (
              <div key={payloadElement.name} style={{ width: '160px' }}>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '4px', paddingRight: '4px' }}
                >
                  <span style={{ color: payloadElement.fill, fontSize: '14px', fontWeight: 'bold' }}>Alerts</span>
                  <span style={{ color: '#333', fontSize: '12px', fontWeight: 'normal' }}>{payloadElement.value}</span>
                </div>
                <Divider sx={{ my: 1 }}></Divider>
                <p
                  style={{
                    margin: 0,
                    color: '#6e6e6e',
                    fontSize: '13px',
                    fontWeight: 'bold',
                  }}
                >
                  {formattedDate}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
};

const renderBarOrLine = (props) => {
  const { x, y, width, height, fill, payload, onMouseEnter, onMouseLeave, onClick } = props;
  const lineLength = 10; // Total width of the line
  const centerX = x + width / 2;

  if (payload.value === 0) {
    const startX = centerX - lineLength / 2;
    const endX = centerX + lineLength / 2;
    const centerY = y; // Adjust if necessary
    return (
      <line
        x1={startX}
        y1={centerY}
        x2={endX}
        y2={centerY}
        stroke={'#eaeaed'}
        strokeWidth={2}
        fill='#eaeaed'
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      />
    );
  } else {
    return (
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      />
    );
  }
};

export function VehiclesOverview({ model, type, fullData = null }) {
  let data =  Object.entries(fullData ? fullData : (type === 'hour' ? model?.lastAlertsByHour :model?.lastAlerts30Days) || {}).map(([timestamp, value]) => ({
    timestamp: new Date(timestamp),
    value,
  }));
  data?.reverse();

  data = data.map((item, index) => ({
    ...item,
  }));

  return (
    <Card style={{ overflow: 'visible' }}>
      <CardHeader
        avatar={
          <Avatar>
            <BellIcon fontSize="var(--Icon-fontSize)" />
          </Avatar>
        }
        title={type === 'hour' ? "Last 24 Hours Errors" : "Last 30 Days Total Alerts"}
      />

      <Box height={223}>
        <ResponsiveContainer height={"100%"} width="100%">
          <BarChart 
          data={data} margin={{ top: 0, right: 20, bottom: 0, left: 20 }}>
            <XAxis axisLine={false} dataKey="indexHours" tickLine={false} type="category" xAxisId={0} />
            <Bar dataKey="value" fill="var(--mui-palette-primary-600)" shape={renderBarOrLine} />
            <Tooltip content={<CustomTooltip></CustomTooltip>} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Card>
  );
}
