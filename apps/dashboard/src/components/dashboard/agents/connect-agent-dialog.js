/**
 * Connect Agent Dialog Component
 * 
 * A dialog component that provides multiple methods for connecting and setting up
 * an agent in different environments. Supports MCP server setup, AI assistant setup,
 * and manual configuration options with code examples in both Python and JavaScript.
 */

import * as React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Typography,
  Paper,
} from '@mui/material';
import { XCircle, Download, Cursor, Code, Robot } from '@phosphor-icons/react';
import {
  useDownloadMCPSetupMutation,
  useDownloadContextSetupMutation,
  useDownloadConfigSetupMutation,
  handleBlobDownload
} from '@/services/setupService';
import { atomDark, materialDark, materialLight, vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { XIcon } from '@phosphor-icons/react/dist/ssr/X';
import { Copy as CopyIcon } from '@phosphor-icons/react';

/**
 * Converts a string to camelCase format
 * @param {string} str - The string to convert
 * @returns {string} The camelCase formatted string
 */
const toCamelCase = (str) => {
  return str?.toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
    .replace(/^[A-Z]/, c => c.toLowerCase());
};

/**
 * Converts a string to snake_case format
 * @param {string} str - The string to convert
 * @returns {string} The snake_case formatted string
 */
const toSnakeCase = (str) => {
  return str?.replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '')
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => '_' + chr.toLowerCase())
    .replace(/^_/, '');
};

/**
 * CodeBlock Component
 * A reusable component for displaying code snippets with copy functionality
 * 
 * @param {Object} props - Component props
 * @param {string} props.code - The code to display
 * @param {string} props.language - The programming language for syntax highlighting
 * @returns {JSX.Element} The code block component
 */
const CodeBlock = ({ code, language }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        backgroundColor: 'grey.900',
        borderRadius: 1,
        overflow: 'hidden',
        marginTop: 3,
        marginBottom: 3,
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          zIndex: 1,
        }}
      >
        <Button
          size="small"
          variant="text"
          onClick={handleCopy}
          startIcon={<CopyIcon />}
          sx={{
            color: 'grey.300',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </Stack>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: '16px',
          background: '#1e1e1e',
          borderRadius: '4px',
          fontSize: '14px',
        }}
      >
        {code}
      </SyntaxHighlighter>
    </Box>
  );
};

/**
 * Formats agent configuration for different programming languages
 * 
 * @param {Object} agent - The agent object containing configuration data
 * @param {string} [language='javascript'] - The target programming language
 * @returns {Object|null} The formatted configuration object
 */
const formatAgentConfig = (agent, language = 'javascript') => {
  if (!agent) return null;

  const transformCase = language === 'javascript' ? toCamelCase : toSnakeCase;

  // Create an object with model names as keys and their slugs as values
  const models = agent.AgentNodes.map(node => {
    if (node.type === 'model') {
      const modelName = transformCase(node.Model?.name);
      return {
        [modelName]: agent.slug + '-' + node.Model?.slug
      }
    } else {
      return {
        [transformCase(node.name)]: agent.slug + '-' + node.slug
      }
    }
  });
  const modelConfig = models.reduce((acc, node) => {
    return {
      ...acc,
      ...node
    }
  }, {});

  // Format the configuration object with transformed agent name
  const config = {
    [transformCase(agent.name)]: {
      ...modelConfig
    }
  };

  return config;
};

/**
 * Generates implementation examples for different programming languages
 * 
 * @param {number} tabValue - The selected tab index
 * @param {Object} currentAgent - The current agent object
 * @param {string} apiToken - The API token for authentication
 * @returns {string} The implementation example code
 */
const getImplementationExample = (tabValue, currentAgent, apiToken) => {
  if (tabValue === 0) {
    return `from handit import HanditTracker
from openai import OpenAI

# Initialize OpenAI client
client = OpenAI(api_key="your-api-key")

# Initialize Handit tracker
tracker = HanditTracker()
tracker.config(api_key="${apiToken}")

# Define your agent class
class MyAgent:
    def __init__(self):
        self.client = OpenAI(api_key="your-api-key")
    
    @tracker.start_agent_tracing()
    async def process(self, input_data):
        """Main agent processing function wrapped with tracing"""
        # Define node execution (e.g., GPT call)
        async def execute_gpt_node(messages):
            response = await self.client.chat.completions.create(
                messages=messages,
                model="gpt-4"
            )
            return response
        
        # Option 1: Using decorator for node tracing
        @tracker.trace_agent_node(agent_config["${toSnakeCase(currentAgent?.name)}"]["${currentAgent?.AgentNodes[0]?.name ?
        toSnakeCase(currentAgent.AgentNodes[0].name) :
        'gpt_four_model'
      }"])
        async def traced_gpt_node(messages):
            return await execute_gpt_node(messages)
        
        # Option 2: Using wrapper function for synchronous nodes
        traced_gpt_sync = tracker.trace_agent_node_func_sync(
            execute_gpt_node,
            key=agent_config["${toSnakeCase(currentAgent?.name)}"]["${currentAgent?.AgentNodes[0]?.name ?
        toSnakeCase(currentAgent.AgentNodes[0].name) :
        'gpt_four_model'
      }"]
        )
        
        # Execute node with tracing
        result = await traced_gpt_node(input_data)
        return result

# Initialize and use the agent
agent = MyAgent()
response = await agent.process({"messages": messages})`;
  }

  return `import { startAgentTracing, traceAgentNode } from '@handit.ai/node';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define your agent function
async function myAgent(inputData) {
  // Define node execution (e.g., GPT call)
  const executeGptNode = async (messages) => {
    const response = await openai.chat.completions.create({
      messages,
      model: "gpt-4"
    });
    return response;
  };
  
  // Wrap node execution with tracing
  const tracedGpt = traceAgentNode({
    agentNodeId: agentsTrackingConfig.${toCamelCase(currentAgent?.name)}.${currentAgent?.AgentNodes[0]?.name ?
      toCamelCase(currentAgent.AgentNodes[0].name) :
      'gptFourModel'
    },
    callback: executeGptNode
  });
  
  // Execute node with tracing
  const result = await tracedGpt(inputData);
  return result;
}

// Wrap the entire agent with tracing
const tracedAgent = startAgentTracing(myAgent);

// Use the traced agent
const response = await tracedAgent({ messages });`;
};

/**
 * ConnectAgentDialog Component
 * 
 * A dialog component that provides multiple methods for connecting and setting up
 * an agent in different environments. Includes three main setup options:
 * 1. MCP Server Setup - For Cursor or Claude Code users
 * 2. AI Assistant Setup - For AI-guided configuration
 * 3. Manual Setup - For advanced customization with code examples
 * 
 * @param {Object} props - Component props
 * @param {string} props.agentId - The ID of the agent to connect
 * @param {Object} props.currentAgent - The current agent object
 * @param {string} props.apiToken - The API token for authentication
 * @param {Function} props.onClose - Callback function when dialog is closed
 * @param {boolean} props.open - Whether the dialog is open
 * @returns {JSX.Element} The connect agent dialog component
 */
export function ConnectAgentDialog({ agentId, currentAgent, apiToken, onClose, open }) {
  // State management
  const [tabValue, setTabValue] = React.useState(0);
  const [loading, setLoading] = React.useState({
    mcp: false,
    context: false,
    config: false
  });
  const [codeTabValue, setCodeTabValue] = React.useState(1); // 0 for Python, 1 for JavaScript

  /**
   * Handles the download of setup files
   * @param {string} type - The type of setup to download ('mcp', 'context', or 'config')
   */
  const handleDownload = async (type) => {
    setLoading(prev => ({ ...prev, [type]: true }));
    try {
      let url;
      let filename;

      console.log(`Starting download for ${type}...`);

      switch (type) {
        case 'mcp':
          url = `${process.env.NEXT_PUBLIC_API_URL}setup/mcp/${agentId}`;
          filename = 'mcp-setup.zip';
          break;
        case 'context':
          url = `${process.env.NEXT_PUBLIC_API_URL}setup/context/${agentId}`;
          filename = 'context-setup.zip';
          break;
        case 'config':
          url = `${process.env.NEXT_PUBLIC_API_URL}setup/config/${agentId}`;
          filename = 'config-setup.json';
          break;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to download ${type} setup: ${response.statusText}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      // Create a temporary link element
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;

      // Append to body, click, and cleanup
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);

      console.log(`Download completed for ${type}`);
    } catch (error) {
      console.error(`Error downloading ${type} setup:`, error);
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          maxHeight: '85%',
        }
      }}
    >
      {/* Dialog Header */}
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            Connect {currentAgent?.name || 'Agent'}
          </Typography>
          <IconButton onClick={onClose}>
            <XCircle />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent>
        {/* API Token Display */}
        <Paper
          sx={{
            p: 2,
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: 1
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
            Your API Token:
          </Typography>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            px: 2,
            py: 1,
            borderRadius: 1
          }}>
            <Typography
              variant="body2"
              sx={{
                fontFamily: 'monospace',
                letterSpacing: '0.5px'
              }}
            >
              {apiToken}
            </Typography>
            <IconButton
              size="small"
              onClick={() => {
                navigator.clipboard.writeText(apiToken);
              }}
              sx={{
                color: 'inherit',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.2)'
                }
              }}
            >
              <CopyIcon size={16} />
            </IconButton>
          </Box>
        </Paper>

        {/* Setup Method Tabs */}
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{
            mb: 3,
            '& .MuiTab-root': {
              minHeight: 56,
              px: 3,
            },
          }}
        >
          <Tab
            icon={<Cursor />}
            label="MCP Server"
            iconPosition="start"
            sx={{ flexDirection: 'row', gap: 1 }}
          />
          <Tab
            icon={<Robot />}
            label="AI Assistant"
            iconPosition="start"
            sx={{ flexDirection: 'row', gap: 1 }}
          />
          <Tab
            icon={<Code />}
            label="Manual Setup"
            iconPosition="start"
            sx={{ flexDirection: 'row', gap: 1 }}
          />
        </Tabs>

        {/* MCP Server Setup Section */}
        {tabValue === 0 && (
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle1" color="text.primary" gutterBottom>
                Recommended for Cursor or Claude Code users
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                This method provides the most streamlined setup experience through an MCP server.
              </Typography>
              <Button
                variant="contained"
                startIcon={<Download />}
                onClick={() => handleDownload('mcp')}
                disabled={loading?.mcp}
                sx={{ mb: 2 }}
              >
                {loading?.mcp ? 'Downloading...' : 'Download MCP Server Files'}
              </Button>
              <Box sx={{ bgcolor: 'background.neutral', p: 2, borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Setup Instructions:
                </Typography>
                <Stack component="ol" spacing={1} sx={{ pl: 2 }}>
                  <Typography component="li" variant="body2">Extract the zip file to your project directory</Typography>
                  <Typography component="li" variant="body2">Open Cursor Settings - Features - MCP</Typography>
                  <Typography component="li" variant="body2">The MCP server will be automatically detected and listed</Typography>
                  <Typography component="li" variant="body2">Click the enable button to load the available tools</Typography>
                  <Typography component="li" variant="body2">Type in Cursor: "configure my agent on these files ... based on the MCP handit://context"</Typography>
                </Stack>
              </Box>
            </Box>
          </Stack>
        )}

        {/* AI Assistant Setup Section */}
        {tabValue === 1 && (
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle1" color="text.primary" gutterBottom>
                AI-Guided Setup Process
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Let our AI assistant guide you through the setup process and automatically configure your agent.
              </Typography>
              <Button
                variant="contained"
                startIcon={<Download />}
                onClick={() => handleDownload('context')}
                disabled={loading?.context}
                sx={{ mb: 2 }}
              >
                {loading?.context ? 'Downloading...' : 'Download Context Files'}
              </Button>
              <Box sx={{ bgcolor: 'background.neutral', p: 2, borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Setup Instructions:
                </Typography>
                <Stack component="ol" spacing={1} sx={{ pl: 2 }}>
                  <Typography component="li" variant="body2">Extract the context files to your project directory</Typography>
                  <Typography component="li" variant="body2">Open your AI assistant (Cursor, Claude, or similar)</Typography>
                  <Typography component="li" variant="body2">Type: "configure my agent on these files ... based on the context"</Typography>
                  <Typography component="li" variant="body2">Review and accept the suggested changes</Typography>
                </Stack>
              </Box>
            </Box>
          </Stack>
        )}

        {/* Manual Setup Section */}
        {tabValue === 2 && (
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle1" color="text.primary" gutterBottom>
                Advanced customization for specific requirements
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                The most customizable method, allowing you to manually configure Handit.AI in your codebase.
              </Typography>

              {/* Installation Instructions */}
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ fontSize: '0.875rem' }}>
                    1. Install Handit SDK for AI monitoring and tracking
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant={codeTabValue === 0 ? "contained" : "outlined"}
                      onClick={() => setCodeTabValue(0)}
                      sx={{
                        borderRadius: 1,
                        minWidth: '100px',
                        backgroundColor: codeTabValue === 0 ? 'primary.main' : 'transparent',
                        borderColor: 'primary.main',
                        color: codeTabValue === 0 ? 'primary.contrastText' : 'primary.main',
                        '&:hover': {
                          backgroundColor: codeTabValue === 0 ? 'primary.dark' : 'primary.main',
                          color: 'primary.contrastText',
                        }
                      }}
                    >
                      Python
                    </Button>
                    <Button
                      variant={codeTabValue === 1 ? "contained" : "outlined"}
                      onClick={() => setCodeTabValue(1)}
                      sx={{
                        borderRadius: 1,
                        minWidth: '100px',
                        backgroundColor: codeTabValue === 1 ? 'primary.main' : 'transparent',
                        borderColor: 'primary.main',
                        color: codeTabValue === 1 ? 'primary.contrastText' : 'primary.main',
                        '&:hover': {
                          backgroundColor: codeTabValue === 1 ? 'primary.dark' : 'primary.main',
                          color: 'primary.contrastText',
                        }
                      }}
                    >
                      JavaScript
                    </Button>
                  </Stack>
                </Stack>
                <CodeBlock
                  language={codeTabValue === 0 ? "python" : "javascript"}
                  code={codeTabValue === 0 ? "pip install -U \"handit-sdk>=1.9.0\"" : "npm install @handit.ai/node"}
                />
              </Box>

              {/* Configuration Instructions */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, fontSize: '0.875rem' }}>
                  2. Set up your environment with API keys and configuration
                </Typography>
                <CodeBlock
                  language={codeTabValue === 0 ? "python" : "javascript"}
                  code={codeTabValue === 0 ?
                    `from handit import HanditTracker

tracker = HanditTracker()
tracker.config(api_key="${apiToken}")` :
                    `import { config } from '@handit.ai/node';

// Configure with your API key
config({
  apiKey: '${apiToken}',  // Required: your API key
});`
                  }
                />
              </Box>

              {/* Agent Configuration */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, fontSize: '0.875rem' }}>
                  3. Configure your agent models with tracking identifiers
                </Typography>
                <CodeBlock
                  language={codeTabValue === 0 ? "python" : "javascript"}
                  code={codeTabValue === 0 ?
                    `# Agent configuration for ${currentAgent?.name || 'Agent'}
agent_config = ${JSON.stringify(formatAgentConfig(currentAgent, 'python'), null, 4)}` :
                    `// Agent configuration for ${currentAgent?.name || 'Agent'}
const agentsTrackingConfig = ${JSON.stringify(formatAgentConfig(currentAgent, 'javascript'), null, 2)}`
                  }
                />
              </Box>

              {/* Implementation Example */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, fontSize: '0.875rem' }}>
                  4. Implement AI agent with automatic tracing
                </Typography>
                <CodeBlock
                  language={codeTabValue === 0 ? "python" : "javascript"}
                  code={getImplementationExample(codeTabValue, currentAgent, apiToken)}
                />
              </Box>
            </Box>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
} 