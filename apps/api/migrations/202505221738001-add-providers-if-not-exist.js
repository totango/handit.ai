// Migration to add OpenAI and TogetherAI providers if they do not exist

export const up = async (queryInterface, Sequelize) => {
  const now = new Date();
  // OpenAI
  const [openai] = await queryInterface.sequelize.query(
    `SELECT id FROM "Providers" WHERE name = 'OpenAI'`
  );
  if (openai.length === 0) {
    await queryInterface.bulkInsert('Providers', [
      {
        name: 'OpenAI',
        type: 'AI',
        config: JSON.stringify({ models: ['gpt-4o'] }),
        created_at: now,
        updated_at: now,
      },
    ]);
  }
  // TogetherAI
  const [togetherai] = await queryInterface.sequelize.query(
    `SELECT id FROM "Providers" WHERE name = 'TogetherAI'`
  );
  if (togetherai.length === 0) {
    await queryInterface.bulkInsert('Providers', [
      {
        name: 'TogetherAI',
        type: 'AI',
        config: JSON.stringify({ models: ['meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8'] }),
        created_at: now,
        updated_at: now,
      },
    ]);
  }
};

export const down = async (queryInterface) => {
  await queryInterface.bulkDelete('Providers', { name: ['OpenAI', 'TogetherAI'] });
}; 