import db from '../../models/index.js';

const { Model, AgentNode, Agent } = db;

export const getActivePrompt = async (req, res) => {
  try {
    const agent = await Agent.findOne({ where: { slug: req.params.agentSlug, companyId: req.userObject.companyId }});
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    const llmNodes = await AgentNode.findAll({ where: { agentId: agent.id, type: 'model' }});
    const models = await Model.findAll({ where: { id: llmNodes.map(node => node.modelId) }});
    const activePrompts = {};
    for (const model of models) {
      const agentNode = llmNodes.find(node => node.modelId === model.id);
      const prompt = await model.getModelVersion();
      activePrompts[agentNode.dataValues.slug] = prompt?.parameters?.prompt;
    }
    res.status(200).json(activePrompts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const getOptimizedPrompt = async (req, res) => {
  try {
    // the route has the id in the url model/:id/optimized-prompt
    const model = await Model.findOne({ where: { slug: req.params.id }});
    const optimizedPrompt = await model.prompt();

    res.status(200).json({ optimizedPrompt });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};