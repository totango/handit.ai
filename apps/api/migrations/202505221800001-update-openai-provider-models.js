// Migration to update OpenAI provider with comprehensive list of available models

export const up = async (queryInterface) => {
  const now = new Date();
  
  // Comprehensive list of current OpenAI models as of 2024
  const openaiModels = [
    // GPT-4o series (multimodal)
    'gpt-4o',
    'gpt-4o-mini',
    
    // GPT-4 Turbo
    'gpt-4-turbo',
  
    // GPT-3.5 Turbo series
    'gpt-3.5-turbo',
  ];

  // Update OpenAI provider with comprehensive model list
  await queryInterface.sequelize.query(`
    UPDATE "Providers" 
    SET 
      config = '${JSON.stringify({ models: openaiModels })}',
      updated_at = '${now.toISOString()}'
    WHERE name = 'OpenAI'
  `);
};

export const down = async (queryInterface) => {
  const now = new Date();
  
  // Revert to original simple model list
  await queryInterface.sequelize.query(`
    UPDATE "Providers" 
    SET 
      config = '${JSON.stringify({ models: ['gpt-4o'] })}',
      updated_at = '${now.toISOString()}'
    WHERE name = 'OpenAI'
  `);
}; 