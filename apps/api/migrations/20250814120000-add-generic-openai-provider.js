'use strict';

export const up = async (queryInterface, Sequelize) => {
  // Add GenericOpenAI provider
  await queryInterface.bulkInsert('Providers', [
    {
      id: 99, // Use high ID to avoid conflicts
      name: 'CustomProvider',
      type: 'AI',
      config: JSON.stringify({
        description: 'OpenAI-compatible API endpoints (Ollama, vLLM, LocalAI, etc.)',
        requiresCustomConfig: true,
        supportedFeatures: ['chat', 'completions', 'structured_output'],
        configFields: [
          {
            name: 'baseURL',
            type: 'url',
            required: true,
            label: 'Base URL',
            placeholder: 'http://localhost:11434/v1',
            description: 'The base URL of your OpenAI-compatible API endpoint'
          },
          {
            name: 'model',
            type: 'text',
            required: true,
            label: 'Model Name',
            placeholder: 'llama2:7b',
            description: 'The model name to use for requests'
          },
          {
            name: 'apiKey',
            type: 'password',
            required: false,
            label: 'API Key',
            placeholder: 'Optional authentication token',
            description: 'API key if required by your endpoint'
          },
          {
            name: 'timeout',
            type: 'number',
            required: false,
            label: 'Timeout (ms)',
            placeholder: '30000',
            description: 'Request timeout in milliseconds'
          }
        ]
      }),
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);
};

export const down = async (queryInterface, Sequelize) => {
  // Remove GenericOpenAI provider
  await queryInterface.bulkDelete('Providers', {
    name: 'CustomProvider'
  });
};