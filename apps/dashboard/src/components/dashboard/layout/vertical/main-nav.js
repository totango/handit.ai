'use client';

import * as React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useGetAgentByIdQuery, useGetAgentsQuery } from '@/services/agentsService';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { List as ListIcon } from '@phosphor-icons/react/dist/ssr/List';
import { onModelChange } from '@/lib/routeHelper';
import { usePopover } from '@/hooks/use-popover';
import { useUser } from '@/hooks/use-user';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';

import { TerminalWindow } from '@phosphor-icons/react';
import { FloppyDisk } from '@phosphor-icons/react';
import { Plus } from '@phosphor-icons/react';
import { Upload as UploadIcon } from '@phosphor-icons/react';

import { AgentSwitch } from '../agent-switch';
import { MobileNav } from '../mobile-nav';
import { UserPopover } from '../user-popover/user-popover';
import { XCircle } from '@phosphor-icons/react';
import { useGetUserQuery } from '@/services/auth/authService';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { DialogActions, DialogContentText } from '@mui/material';
import { ModelsSwitch } from '../models-switch';
import { paths } from '@/paths';
import { ConnectAgentDialog } from '@/components/dashboard/agents/connect-agent-dialog';

export function MainNav({ items, title, onNewEvaluator, onUploadAgent, uploadLoading }) {
  const [openNav, setOpenNav] = React.useState(false);
  const path = usePathname();
  const { data: agents = [] } = useGetAgentsQuery();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [connectDialogOpen, setConnectDialogOpen] = React.useState(false);
  const [tabValue, setTabValue] = React.useState(1);
  const { data: userData, error, isLoading } = useGetUserQuery();
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
  const [showSaveDialog, setShowSaveDialog] = React.useState(false);
  const [pendingNavigation, setPendingNavigation] = React.useState(null);
  const [isBackNavigation, setIsBackNavigation] = React.useState(false);
  const fileInputRef = React.useRef(null);

  // Get current environment
  const environment = React.useMemo(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('environment') || 'production';
    }
    return 'production';
  }, []);

  // Get the appropriate API token based on environment
  const apiToken = React.useMemo(() => {
    if (environment === 'staging') {
      return userData?.company?.stagingApiToken;
    }
    return userData?.company?.apiToken;
  }, [environment, userData?.company]);

  const handleAgentChange = (newAgent) => {
    const params = new URLSearchParams(searchParams);
    if (newAgent) {
      params.set('agentId', newAgent.id);
    } else {
      params.delete('agentId');
    }
    router.push(`${path}?${params.toString()}`);
  };

  const agentId = searchParams.get('agentId');
  const modelId = searchParams.get('modelId');
  const { data: currentAgent, isLoading: isLoadingDetails } = useGetAgentByIdQuery(agentId, {
    skip: !agentId,
  });
  
  const handleSave = React.useCallback(async () => {
    try {
      // Call the save function exposed by AgentEditor
      if (window.saveAgent) {
        window.saveAgent();
        
        // Show success feedback (you can use your preferred notification system)
        // For example, if you're using a toast notification:
        // toast.success('Agent saved successfully');
        
        
      }
    } catch (error) {
      console.error('Error saving agent:', error);
      // Show error feedback
      // toast.error('Failed to save agent');
    }
  }, [path, router]);

  // Check for unsaved changes
  React.useEffect(() => {
    const checkUnsavedChanges = () => {
      setHasUnsavedChanges(window.hasUnsavedChanges || false);
    };

    checkUnsavedChanges();
    const interval = setInterval(checkUnsavedChanges, 1000);

    return () => clearInterval(interval);
  }, []);

  // Handle navigation with unsaved changes
  const handleNavigation = React.useCallback((e, href) => {
    if (hasUnsavedChanges) {
      e.preventDefault();
      setPendingNavigation(href);
      setIsBackNavigation(false);
      setShowSaveDialog(true);
    } else {
      router.push(href);
    }
  }, [hasUnsavedChanges, router]);

  // Handle browser back button and tab closing
  React.useEffect(() => {
    // Handle browser back/forward
    const handlePopState = (event) => {
      if (hasUnsavedChanges) {
        event.preventDefault();
        window.history.pushState(null, '', window.location.href);
        setIsBackNavigation(true);
        setShowSaveDialog(true);
      }
    };

    // Handle tab/window closing
    const handleBeforeUnload = (event) => {
      if (hasUnsavedChanges) {
        event.preventDefault();
        event.returnValue = "You have unsaved changes. Are you sure you want to leave?";
        return event.returnValue;
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Push current state to enable popstate handling
    window.history.pushState(null, '', window.location.href);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  // Add onClick to all navigation links
  React.useEffect(() => {
    const links = document.querySelectorAll('a[href]');
    
    const handleClick = (e) => {
      const href = e.currentTarget.getAttribute('href');
      if (href && href !== '#') {
        handleNavigation(e, href);
      }
    };

    links.forEach(link => {
      link.addEventListener('click', handleClick);
    });

    return () => {
      links.forEach(link => {
        link.removeEventListener('click', handleClick);
      });
    };
  }, [handleNavigation]);

  return (
    <React.Fragment>
      
      <Box
        component="header"
        sx={{
          '--MainNav-background': 'var(--mui-palette-background-default)',
          '--MainNav-divider': 'var(--mui-palette-divider)',
          bgcolor: 'var(--MainNav-background)',
          left: 0,
          position: 'sticky',
          pt: { lg: 'var(--Layout-gap)' },
          top: 0,
          width: '100%',
          zIndex: 'var(--MainNav-zIndex)',
        }}
      >
        <Box
          sx={{
            borderBottom: '1px solid var(--MainNav-divider)',
            display: 'flex',
            flex: '1 1 auto',
            minHeight: '74px',
            px: { xs: 2, lg: 3 },
            py: 1,
          }}
        >
          {/* Left side - Title */}
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flex: '1 1 auto' }}>
            <IconButton
              onClick={() => {
                setOpenNav(true);
              }}
              sx={{ display: { lg: path?.includes('smart-review-tool') ? '' : 'none' } }}
            >
              <ListIcon />
            </IconButton>
            {path.includes('agents/create') && (
              <Typography variant="h4" component="h1" sx={{ pl: 5 }}>
                Create Agent
              </Typography>
            )}
            {path.includes('evaluation-hub') && (
              <Typography variant="h4" component="h1" sx={{ pl: 5 }}>
                Evaluation Hub
              </Typography>
            )}
            {path === '/agents' && (
              <Typography variant="h4" component="h1" sx={{ pl: 5 }}>
                Agents
              </Typography>
            )}
            {path.includes('agents/edit') && (
              <Typography variant="h4" component="h1" sx={{ pl: 5 }}>
                Update Agent
              </Typography>
            )}
            {(path.includes('ag-monitoring') || path.includes('ag-tracing') || path.includes('model-versions') || path.includes('prompt-versions')) && (
            <AgentSwitch onAgentChange={handleAgentChange} agentId={agentId} agents={agents} />
          )}
          {(path.includes('automated-insights') || path.includes('dynamic-review')) && (
            <ModelsSwitch onModelChange={(model) => onModelChange(path, router, model)} modelId={modelId} />
          )}
          </Stack>

          {/* Right side - Actions */}
          <Stack
            direction="row"
            spacing={2}
            sx={{ alignItems: 'center', flex: '1 1 auto', justifyContent: 'flex-end' }}
          >
            {/* Show New Evaluator button only on evaluation-hub page */}
            {path.includes('evaluation-hub') && (
              <Button
                variant="contained"
                startIcon={<Plus weight="bold" />}
                onClick={onNewEvaluator}
                sx={{
                  backgroundImage: 'none',
                  backgroundColor: 'primary.main',
                  '&:hover': {
                    backgroundImage: 'none',
                    backgroundColor: 'primary.light',
                  },
                }}
              >
                New Evaluator
              </Button>
            )}
            {/* Show Create Agent and Upload Agent File buttons only on /agents page */}
            {path === '/agents' && (
              <>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".json"
                  style={{ display: 'none' }}
                  onChange={onUploadAgent}
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  startIcon={<UploadIcon />}
                  variant="outlined"
                  disabled={uploadLoading}
                  sx={{
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      color: 'primary.contrastText',
                    },
                  }}
                >
                  {uploadLoading ? 'Uploading...' : 'Upload Agent File'}
                </Button>
                <Button
                  onClick={() => router.push('/agents/create')}
                  startIcon={<Plus />}
                  variant="contained"
                  sx={{
                    backgroundImage: 'none',
                    backgroundColor: 'primary.main',
                    '&:hover': {
                      backgroundImage: 'none',
                      backgroundColor: 'primary.light',
                    },
                  }}
                >
                  Create Agent
                </Button>
              </>
            )}
            {(path.includes('agents/create') || path.includes('agents/edit')) && (
              <Button
                variant={hasUnsavedChanges ? 'contained' : 'outlined'}
                onClick={handleSave}
                startIcon={<FloppyDisk />}
                sx={hasUnsavedChanges ? {
                  backgroundImage: 'none',  // Remove gradient
                  backgroundColor: hasUnsavedChanges ? 'primary.main' : 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: hasUnsavedChanges ? 'primary.main' : 'primary.dark',
                  },
                  '&:active': {
                    backgroundColor: hasUnsavedChanges ? 'primary.main' : 'primary.main',
                  },
                  animation: hasUnsavedChanges ? 'pulse 2s infinite' : 'none',
                  '@keyframes pulse': {
                    '0%': {
                      boxShadow: '0 0 0 0 rgba(255, 152, 0, 0.4)',
                    },
                    '70%': {
                      boxShadow: '0 0 0 10px rgba(255, 152, 0, 0)',
                    },
                    '100%': {
                      boxShadow: '0 0 0 0 rgba(255, 152, 0, 0)',
                    },
                  },
                } : {
                  borderColor: 'transparent',
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                  },
                  backgroundColor: 'rgba(117,120,255, 0.2)',
                }}
              >
                {hasUnsavedChanges ? '* Save Changes' : 'Save Changes'}
              </Button>
            )}
            
            {/* Existing buttons */}
            {(path.includes('ag-monitoring') || path.includes('ag-tracing')) && (
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setConnectDialogOpen(true)}
                startIcon={<TerminalWindow size={16} />}
                sx={{
                  borderColor: 'transparent',
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                  },
                  backgroundColor: 'rgba(117,120,255, 0.2)',
                }}
              >
                Connect Agent
              </Button>
            )}
            <Divider
              flexItem
              orientation="vertical"
              sx={{ borderColor: 'var(--MainNav-divider)', display: { xs: 'none', lg: 'block' } }}
            />
            <UserButton />
          </Stack>
        </Box>
      </Box>
      <MobileNav
        items={items}
        onClose={() => {
          setOpenNav(false);
        }}
        open={openNav}
      />

      {/* Connect Agent Dialog */}
      <ConnectAgentDialog
        agentId={agentId}
        currentAgent={currentAgent}
        apiToken={apiToken}
        onClose={() => setConnectDialogOpen(false)}
        open={connectDialogOpen}
      />

      <Dialog
        open={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
      >
        <DialogTitle>Unsaved Changes</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have unsaved changes. Do you want to save before continuing?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button 
            onClick={() => {
              if (isBackNavigation) {
                router.push(paths.dashboard.agents);
              } else if (pendingNavigation) {
                router.push(pendingNavigation);
              }
              window.hasUnsavedChanges = false; // Clear the flag before navigation

              setShowSaveDialog(false);
            }}
            variant="outlined"
          >
            Continue Without Saving
          </Button>
          <Button 
            onClick={() => {
              if (window.saveAgent) {
                window.saveAgent();
              }
              setShowSaveDialog(false);
            }}
            variant="contained"
            color="primary"
            autoFocus
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

function UserButton() {
  const popover = usePopover();
  const { user } = useUser();

  return (
    <React.Fragment>
      <Box
        component="button"
        onClick={popover.handleOpen}
        ref={popover.anchorRef}
        sx={{ border: 'none', background: 'transparent', cursor: 'pointer', p: 0 }}
      >
        <Badge
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          color="success"
          sx={{
            '& .MuiBadge-dot': {
              border: '2px solid var(--MainNav-background)',
              borderRadius: '50%',
              bottom: '6px',
              height: '12px',
              right: '6px',
              width: '12px',
            },
          }}
        >
          <Avatar src={user?.company?.icon && user?.company?.icon?.length > 0 ? user?.company?.icon : user?.avatar} />
        </Badge>
      </Box>
      <UserPopover anchorEl={popover.anchorRef.current} onClose={popover.handleClose} open={popover.open} />
    </React.Fragment>
  );
}

// Add a new CodeBlock component

