'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { isCorrect } from '@/lib/evaluation';

import { paths } from '@/paths';

export function EntriesFilters({ filters = {}, sortDir = 'desc', data, setPage, id, enabledVerified = true, reviewed = false, verified = 0, unverified = 0, paginated = false }) {
  let tabs = []
  if (enabledVerified && !reviewed) {
    tabs = [
      { label: 'Verified', value: 'verified', count: paginated ? verified : data.filter((item) => item.processed).length },
      { label: 'Unverified', value: 'unverified', count: paginated ? unverified : data.filter((item) => !item.processed).length },
    ];
  } else {
    if (reviewed) {
      tabs = [
        { label: 'Correct', value: 'correct', count: data.filter((item) => isCorrect(item)).length },
        { label: 'Incorrect', value: 'incorrect', count: data.filter((item) => !isCorrect(item)).length },
      ];
    } else {
      tabs = [
        { label: 'Unverified', value: 'unverified', count: data.filter((item) => !item.processed).length },
      ];
    }
    
  }
  

  const { type } = filters;

  const router = useRouter();

  const updateSearchParams = React.useCallback(
    (newFilters, newSortDir) => {
      const originalParams = new URLSearchParams(window.location.search);
      originalParams.delete('type');
      originalParams.delete('sortDir');
      if (paginated) {
        originalParams.delete('page');
        originalParams.set('page', 1);
      }

      if (newSortDir === 'asc') {
        originalParams.set('sortDir', newSortDir);
      }

      if (newFilters.type) {
        originalParams.set('type', newFilters.type);
      }

     
      if (reviewed) {
        // get original route
        const originalRoute = window.location.pathname;

        return router.push(`${originalRoute}?${originalParams.toString() ? `${originalParams.toString()}&` : ''}`, {
          scroll: false,
        });
      }
      router.push(`${paths.dashboard.smartFeedbackLoop}?${
        originalParams.toString() ? `${originalParams.toString()}&` : ''
      }`, {
        scroll: false,
      });
    },
    [router, id]
  );

  const handleTypeChange = React.useCallback(
    (_, value) => {
      updateSearchParams({ ...filters, type: value }, sortDir);
      if (!paginated) {
        setPage(0);
      }
    },
    [updateSearchParams, filters, sortDir, setPage]
  );


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
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flexWrap: 'wrap', px: 3, py: 2 }}></Stack>
    </div>
  );
}
