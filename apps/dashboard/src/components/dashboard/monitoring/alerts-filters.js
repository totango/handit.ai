'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { paths } from '@/paths';
import { useFilterContext } from '@/components/core/filter-button';

import { useCustomersSelection } from './customers-selection-context';

export function AlertsFilters({ filters = {}, sortDir = 'desc', data, setPage, id }) {
  const tabs = [
    { label: 'Performance Alerts', value: 'metric', count: data.filter((item) => item.type === 'metric').length },
    { label: 'System Failure Alerts', value: 'error', count: data.filter((item) => item.type === 'error').length },
  ];

  const { type, initDate, endDate } = filters;

  const router = useRouter();

  const selection = useCustomersSelection();

  const updateSearchParams = React.useCallback(
    (newFilters, newSortDir) => {
      const searchParams = new URLSearchParams();

      if (newSortDir === 'asc') {
        searchParams.set('sortDir', newSortDir);
      }

      if (newFilters.type) {
        searchParams.set('type', newFilters.type);
      }

      if (newFilters.initDate) {
        searchParams.set('initDate', newFilters.initDate);
      }

      if (newFilters.endDate) {
        searchParams.set('endDate', newFilters.endDate);
      }

      router.push(`${paths.dashboard.monitoring.details(id)}?${searchParams.toString()}`, {
        scroll: false
      });
    },
    [router, id]
  );

  const handleClearFilters = React.useCallback(() => {
    updateSearchParams({}, sortDir);
  }, [updateSearchParams, sortDir]);

  const handleTypeChange = React.useCallback(
    (_, value) => {
      updateSearchParams({ ...filters, type: value }, sortDir);
      setPage(0);
    },
    [updateSearchParams, filters, sortDir, setPage]
  );

  const handleSortChange = React.useCallback(
    (event) => {
      updateSearchParams(filters, event.target.value);
    },
    [updateSearchParams, filters]
  );

  const [timeRange, setTimeRange] = React.useState('last_14_days');
  const [startDate, setStartDate] = React.useState(null);
  const [endDateValue, setEndDateValue] = React.useState(null);

  const handleTimeRangeChange = (event) => {
    const value = event.target.value;
    setTimeRange(value);

    if (value === 'custom') {
      // User will select custom range
    } else {
      const now = new Date();
      let startDate = null;

      switch (value) {
        case 'last_hour':
          startDate = new Date(now.getTime() - 60 * 60 * 1000);
          break;
        case 'last_24_hours':
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case 'last_7_days':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'last_14_days':
          startDate = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
          break;
        case 'last_30_days':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          break;
      }

      updateSearchParams({ ...filters, initDate: startDate?.toISOString(), endDate: now.toISOString() }, sortDir);
    }
  };

  const handleDateRangeApply = () => {
    if (startDate && endDateValue) {
      updateSearchParams({ ...filters, initDate: startDate.toISOString(), endDate: endDateValue.toISOString() }, sortDir);
    }
  };

  return (
    <div>
      <Tabs onChange={handleTypeChange} sx={{ px: 3, borderRadius: 0 }} value={type ?? ''} variant="scrollable">
        {tabs.map((tab) => (
          <Tab
            icon={<Chip label={tab.count} size="small" variant="soft" />}
            iconPosition="end"
            key={tab.value}
            label={tab.label}
            sx={{ minHeight: 'auto', borderRadius: 0 }}
            tabIndex={0}
            value={tab.value}
          />
        ))}
      </Tabs>
      <Divider />
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flexWrap: 'wrap', px: 3, py: 2 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flex: '1 1 auto', flexWrap: 'wrap' }}>
          <Select
            name="timeRange"
            onChange={handleTimeRangeChange}
            sx={{ minWidth: '150px' }}
            value={timeRange}
          >
            <MenuItem value="last_hour">Last hour</MenuItem>
            <MenuItem value="last_24_hours">Last 24 hours</MenuItem>
            <MenuItem value="last_7_days">Last 7 days</MenuItem>
            <MenuItem value="last_14_days">Last 14 days</MenuItem>
            <MenuItem value="last_30_days">Last 30 days</MenuItem>
            {/*<MenuItem value="custom">Absolute date</MenuItem>*/}
          </Select>

          {timeRange === 'custom' && (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Stack direction="row" spacing={2} alignItems="center">
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  renderInput={(params) => <TextField {...params} sx={{ minWidth: '150px' }} />}
                />
                <DatePicker
                  label="End Date"
                  value={endDateValue}
                  onChange={(newValue) => setEndDateValue(newValue)}
                  renderInput={(params) => <TextField {...params} sx={{ minWidth: '150px' }} />}
                />
                <Button onClick={handleDateRangeApply} variant="contained" sx={{ ml: 2 }}>
                  Apply
                </Button>
              </Stack>
            </LocalizationProvider>
          )}

          {type || initDate || endDate ? (
            <Button onClick={handleClearFilters}>Clear filters</Button>
          ) : null}
        </Stack>

        {selection.selectedAny ? (
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Typography color="text.secondary" variant="body2">
              {selection.selected.size} selected
            </Typography>
            <Button color="error" variant="contained">
              Delete
            </Button>
          </Stack>
        ) : null}

        <Select name="sort" onChange={handleSortChange} sx={{ maxWidth: '100%', width: '120px' }} value={sortDir}>
          <MenuItem value="desc">Newest</MenuItem>
          <MenuItem value="asc">Oldest</MenuItem>
        </Select>
      </Stack>
    </div>
  );
}
