'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Chip, Stack } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Eye, Warning } from '@phosphor-icons/react';
import { format } from 'date-fns';

import { isCorrect } from '@/lib/evaluation';
import { DataTable } from '@/components/core/data-table';

import { CustomersPagination } from '../monitoring/customers-pagination';
import { CustomersSelectionProvider } from '../monitoring/customers-selection-context';
import { EntriesFilters } from './entries-filters';

const columns = (type, router, modelId, reviewed = false) => {
  const cols = [
    {
      name: 'Input',
      width: '40%',
      formatter: (row) => (
        <Typography color="text.secondary" variant="body2">
          {JSON.stringify(row?.input).slice(0, 100) || 'No input'}
        </Typography>
      ),
    },
    {
      name: 'Output',
      width: '30%',
      formatter: (row) => (
        <Typography color="text.secondary" variant="body2">
          {JSON.stringify(row?.output).slice(0, 50) || 'No output'}
        </Typography>
      ),
    },
    {
      name: 'Date',
      width: '15%',
      formatter: (row) => (
        <Typography color="text.secondary" variant="body2">
          {format(row?.createdAt, 'MMM d, yyyy h:mm')}
        </Typography>
      ),
    },
  ];

  if (reviewed) {
    cols.push({
      name: 'Correctness',
      width: '10%',
      formatter: (row) => (
        <Chip
          label={isCorrect(row) ? 'Correct' : 'Incorrect'}
          color={isCorrect(row) ? 'success' : 'error'}
          sx={{
            fontWeight: 'bold',
          }}
          variant="soft"
        />
      ),
    });
  } else if (type === 'verified') {
    cols.push({
      name: 'Correctness',
      width: '10%',
      formatter: (row) => (
        <Chip
          label={row?.is_correct || isCorrect(row) ? 'Correct' : 'Incorrect'}
          color={row?.is_correct || isCorrect(row) ? 'success' : 'error'}
          sx={{
            fontWeight: 'bold',
          }}
          variant="soft"
        />
      ),
    });
  }

  if (!reviewed && type !== 'verified') {
    cols.push({
      name: 'Action',
      width: '10',
      formatter: (row) => (
        <Stack direction="row" spacing={1}>
          <Chip
            label={type === 'verified' ? 'View' : 'Review'}
            onClick={() => {
              router.push(`/smart-review-tool?modelId=${modelId}&entryId=${row?.id}`);
            }}
            sx={{
              bgcolor: 'var(--mui-palette-primary-400)',
              color: 'white',
              ':hover': {
                bgcolor: 'var(--mui-palette-primary-500)',
              },
            }}
          />
        </Stack>
      ),
    });
  }

  return cols;
};

function applySort(row, sortDir) {
  return row.sort((a, b) => {
    if (sortDir === 'asc') {
      return a?.createdAt?.getTime() - b?.createdAt?.getTime();
    }

    return b?.createdAt?.getTime() - a?.createdAt?.getTime();
  });
}

function applyFilters(row, { type, reviewed }) {
  if (reviewed) {
    return row.filter((item) => {
      if (type) {
        if (type == 'correct') {
          return isCorrect(item);
        } else {
          return !isCorrect(item);
        }
      }

      return true;
    });
  }
  return row.filter((item) => {
    if (type) {
      if (type === 'verified') {
        return item?.processed;
      } else {
        return !item?.processed;
      }
    }

    return true;
  });
}

export function EntriesTable({
  rows,
  id,
  searchParams,
  modelId,
  enabledVerified = true,
  reviewed = false,
  total,
  verified,
  unverified,
  paginated = false,
}) {
  const router = useRouter();
  let { type, sortDir, page: realPage, rowsPerPage: realPageSize } = searchParams;
  if (paginated) {
    realPage = (realPage - 1) >= 0 ? realPage - 1 : 0;
    realPageSize = realPageSize >= 0 ? realPageSize : 5;
  }

  type = type || (reviewed ? 'incorrect' : rows.filter((dt) => !dt.processed).length > 0 ? 'unverified' : 'verified');

  if (!enabledVerified) {
    type = 'unverified';
  }
  const entries =
    rows?.map((entry) => {
      return {
        ...entry,
        createdAt: new Date(entry?.createdAt),
        updatedAt: new Date(entry?.updatedAt),
      };
    }) || [];

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const sortedEntries = applySort(entries || [], sortDir);
  const filteredEntries = paginated ? sortedEntries : applyFilters(sortedEntries, { type, reviewed });

  const dataToShow = paginated
    ? filteredEntries
    : filteredEntries.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  return (
    <Card id="alerts-table" style={enabledVerified ? { overflow: 'visible' } : null}>
      {!reviewed && entries && enabledVerified && (
        <CardHeader
          avatar={
            <Avatar>
              <Eye fontSize="var(--Icon-fontSize)" />
            </Avatar>
          }
          title="Entries"
          action={
            enabledVerified && (
              <Button
                variant="outlined"
                sx={{
                  maxWidth: '200px',
                }}
                onClick={() => {
                  router.push(
                    `/smart-review-tool?modelId=${modelId}&entryId=${entries.filter((entry) => !entry.processed)[0].id}`
                  );
                }}
              >
                Start Reviewing
              </Button>
            )
          }
        />
      )}
      {enabledVerified && <Divider />}
      <Box sx={{ overflowX: 'auto' }}>
        <CustomersSelectionProvider customers={[]}>
          {enabledVerified && (
            <EntriesFilters
            verified={verified}
            unverified={unverified}
            paginated={paginated}
              filters={{ type }}
              sortDir={sortDir}
              data={entries}
              setPage={(value) => {
                if (paginated) {
                  const originalParams = new URLSearchParams(window.location.search);
                  originalParams.delete('page');
                  originalParams.set('page', value + 1);
                  const originalRoute = window.location.pathname;

                  return router.push(
                    `${originalRoute}?${originalParams.toString() ? `${originalParams.toString()}&` : ''}`,
                    {
                      scroll: false,
                    }
                  );
                } else {
                  setPage(value);
                }
              }}
              id={id}
              enabledVerified={enabledVerified}
              reviewed={reviewed}
            />
          )}
          {enabledVerified && <Divider />}
          <Box sx={{ overflowX: 'auto', overflow: 'visible' }}>
            <DataTable
              rows={dataToShow}
              columns={columns(type, router, modelId, reviewed)}
              onClick={(event, entry) => {
                if (reviewed) {
                  const originalParams = new URLSearchParams(window.location.search);
                  const originalUrl = window.location.pathname;
                  originalParams.set('modal', 'true');
                  originalParams.set('entryId', entry.id);
                  router.push(`${originalUrl}?${originalParams.toString()}`, {
                    scroll: false,
                  });
                  return;
                }
                router.push(`/smart-review-tool?modelId=${modelId}&entryId=${entry.id}`);
              }}
            />
          </Box>
          <Divider />
          <CustomersPagination
            count={paginated ? total : filteredEntries?.length}
            page={paginated ? realPage : page}
            rowsPerPage={paginated ? realPageSize : rowsPerPage}
            setPage={(value) => {
              if (paginated) {
                const originalParams = new URLSearchParams(window.location.search);
                originalParams.delete('page');
                originalParams.set('page', value + 1);
                const originalRoute = window.location.pathname;

                return router.push(
                  `${originalRoute}?${originalParams.toString() ? `${originalParams.toString()}&` : ''}`,
                  {
                    scroll: false,
                  }
                );
              } else {
                setPage(value);
              }
            }}
            setRowsPerPage={(value) => {
              if (paginated) {
                const originalParams = new URLSearchParams(window.location.search);
                originalParams.delete('rowsPerPage');
                originalParams.set('rowsPerPage', value);
                const originalRoute = window.location.pathname;
                return router.push(
                  `${originalRoute}?${originalParams.toString() ? `${originalParams.toString()}&` : ''}`,
                  {
                    scroll: false,
                  }
                );
              } else {
                setRowsPerPage(value);
              }
            }}
          />
        </CustomersSelectionProvider>
      </Box>
    </Card>
  );
}
