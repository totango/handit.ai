'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { useGetModelsQuery } from '@/services/modelsService';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Triangle } from '@phosphor-icons/react';
import { CaretDown as CaretDownIcon } from '@phosphor-icons/react/dist/ssr/CaretDown';
import dayjs from 'dayjs';

import { parseTitle } from '@/lib/text';
import { usePopover } from '@/hooks/use-popover';

import { ModelsPopover } from './models-popover';

export function ModelsSwitch({ onModelChange, modelId }) {
  const popover = usePopover();
  const path = usePathname();

  const { data, error, isLoading } = useGetModelsQuery();
  const [model, setModel] = React.useState(null);
  const [items, setItems] = React.useState([]);
  const [models, setModels] = React.useState([]);

  React.useEffect(() => {
    if (data) {
      setModels(data.filter((model) => !model.isOptimized && !model.isReviewer));
    }
  }, [data, path]);

  React.useEffect(() => {
    if (items && path?.includes('/monitoring/')) {
      const modelId = path.split('/').pop();
      const model = items.find((item) => item.id === parseInt(modelId));
      return setModel(model);
    }

    if (items && !modelId) {
      setModel(items[0]);
      onModelChange(items[0]);
    } else if (items) {
      const foundModel = items.find((item) => item.id === parseInt(modelId));
      setModel(foundModel);
    }
  }, [items, modelId, path]);

  React.useEffect(() => {
    if (models) {
      setItems([...models]);
    }
  }, [models]);

  const onChange = (id) => {
    const selectedModel = items.find((item) => item.id === id);
    setModel(selectedModel);
    onModelChange(selectedModel);
    popover.handleClose();
  };
  return (
    <React.Fragment>
      {items && items.length >= 1 && (
        <Stack
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'row',
            paddingLeft: '1vh',
            paddingTop: '1vh',
          }}
        >
          <Stack
            direction="row"
            onClick={popover.handleOpen}
            spacing={2}
            sx={{
              alignItems: 'center',
              cursor: 'pointer',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Typography color="var(--Workspaces-name-color)"
                  variant="h5"
                  sx={{ fontWeight: 600, fontSize: '1.4rem' }}>
                  {parseTitle(model?.name)}
                </Typography>
                <Box
                  sx={{
                    height: '24px',
                    width: '24px',
                    backgroundColor: 'rgba(117, 120, 255, 0.2)',
                    marginLeft: '12px',
                    marginTop: '2px',
                    borderRadius: '5px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CaretDownIcon
                    style={{
                      fontSize: '14px',
                      color: 'var(--mui-palette-primary-main)',
                      fontWeight: 'bold',
                    }}
                    ref={popover.anchorRef}
                  />
                </Box>
              </Box>
            </Box>
          </Stack>
        </Stack>
      )}
      <ModelsPopover
        anchorEl={popover.anchorRef?.current}
        open={popover?.open}
        onClose={popover?.handleClose}
        models={items || []}
        onChange={onChange}
      />
    </React.Fragment>
  );
}
