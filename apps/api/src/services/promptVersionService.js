import db from '../../models/index.js';

const { Model } = db;

/**
 * Create a new prompt version for a given model
 * @param {string|number} modelId - ID of the model
 * @param {string} prompt - The new prompt to store
 * @returns {Promise<Object>} - The newly created PromptVersion instance
 */
export async function createPrompt(modelId, prompt) {
    // Create a new record in the PromptVersion table
    const model = await db.Model.findByPk(Number(modelId));
    if (!model) throw new Error(`Model with id=${modelId} not found`);
    const newPrompt = await model.createVersionPromt({
        modelId,
        prompt: prompt,
        active: false,         // new versions start inactive by default
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    return newPrompt;
}


/**
 * Retrieve a specific prompt version for a model
 * @param {string|number} modelId
 * @param {string} version
 * @returns {Promise<Object|null>} - Matching ModelVersion or null if none found
 * @throws {Error} - When database query fails
 */
export async function getPrompt(modelId, version) {
    try {
        // delegate down to your Model entity helper
        const promptVersion = await Model.getVersionPromt({
            modelId: Number(modelId),
            version: String(version),
        });
        return promptVersion;
    } catch (err) {
        console.error('Error in promptVersionService.getPrompt:', err);
        throw new Error(`Failed to retrieve prompt version ${version} for model ${modelId}: ${err.message}`);
    }
}



/**
  * Update the prompt text on a specific prompt version
  * @param {string|number} modelId
  * @param {string} version
  * @param {string} newPrompt
  * @returns {Promise<Object>} - The updated ModelVersion instance
  * @throws {Error} - If version not found or on DB failure
  */
export async function updatePrompt(modelId, version, newPrompt) {
    try {
        // Delegate to the Model-level helper
        const model = await db.Model.findByPk(Number(modelId));
        if (!model) throw new Error(`Model with id=${modelId} not found`);
        const updated = await model.updateVersionPrompt(modelId, version, newPrompt);
        if (!updated) {
            throw new Error(`Prompt version "${version}" not found for model ${modelId}`);
        }
        return updated;
    } catch (err) {
        console.error('Error in promptVersionService.updatePrompt:', err);
        throw err;
    }
}


/**
 * Delete all prompt versions for a given model
 */
export async function deletePromptVersion(modelId, version) {
    const deleted = await Model.deleteVersionPrompt({ modelId, version });
    if (!deleted) throw new Error('Prompt version not found');
    return deleted;
}

/**
 * Get all active prompt versions
 */
export async function getActivePrompts() {
    const actives = await Model.getActiveVersionPrompt();
    return actives;
}

/**
 * Service wrapper to expose release functionality
 * @param {number|string} modelId - ID of the model
 * @param {string} version - Version identifier to set active
 * @returns {Promise<Object|null>} - Activated ModelVersion or null
 */
export async function releasePrompt(modelId, version, originalModelId) {
    const model = await db.Model.findByPk(Number(modelId));
    if (!model) throw new Error(`Model with id=${modelId} not found`);
    return await model.releasePromptVersion({ modelId, version, originalModelId });
}

/**
 * Get all prompt versions grouped by modelId
 * @returns {Promise<Record<string, Object[]>>}
 */
export async function getPromptsGrouped() {
    // Delegate to our Model helper (no args)
    const grouped = await Model.getVersionPromptsGrouped();
    return grouped;
}

/**
 * Get the active prompt version for a specific model
 * @param {string|number} modelId - ID of the model
 * @returns {Promise<Object|null>} - The active ModelVersion instance or null if none found
 * @throws {Error} - When database query fails
 */
export async function getActivePrompt(modelId) {
    try {
        const activeVersion = await Model.getActiveVersionPrompt(modelId);
        return activeVersion;
    } catch (error) {
        console.error('Error in promptVersionService.getActivePrompt:', error);
        throw new Error(`Failed to retrieve active prompt version for model ${modelId}: ${error.message}`);
    }
}

/**
 * Get all prompt versions for a specific model and its principal AB test model
 * @param {string|number} modelId - ID of the model
 * @returns {Promise<Object[]>} - Array of prompt versions (base + principal AB test), sorted and renumbered
 * @throws {Error} - When database query fails
 */
export async function getAllPromptVersions(modelId) {
    try {
        const ModelVersion = db.ModelVersions;
        // Get base model versions
        const baseVersions = await ModelVersion.findAll({
            where: { modelId: Number(modelId) },
            order: [['createdAt', 'ASC']], // Oldest first for renumbering
            paranoid: true
        });

        // Get the principal AB test model (if any)
        const baseModel = await db.Model.findByPk(Number(modelId));
        let abTestVersions = [];
        if (baseModel && typeof baseModel.getPrincipalABTestModel === 'function') {
            const principalABTestModel = await baseModel.getPrincipalABTestModel();
            if (principalABTestModel) {
                abTestVersions = await ModelVersion.findAll({
                    where: { modelId: principalABTestModel.id },
                    order: [['createdAt', 'ASC']],
                    paranoid: true
                });
            }
        }

        // Combine all versions
        let allVersions = [...baseVersions, ...abTestVersions];
        // Sort by createdAt ascending (oldest first)
        allVersions.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        // Reassign version numbers as strings: "1", "2", ...
        allVersions = allVersions.map((v, idx) => {
            const data = {
                ...v.dataValues,
                originalVersion: v.version,
                version: (idx + 1).toString()
            };
            return data;
        });

        return allVersions;
    } catch (error) {
        console.error('Error in promptVersionService.getAllPromptVersions:', error);
        throw new Error(`Failed to retrieve prompt versions for model ${modelId}: ${error.message}`);
    }
}

/**
 * Get the last metrics for a specific model version
 * @param {string|number} modelId - ID of the model
 * @param {string} version - Version string (as stored in ModelMetricLog.version)
 * @returns {Promise<Object[]>} - Array of last metric logs for the version
 */
export async function getLastMetricsOfVersion(modelId, version) {
    const dbModel = await db.Model.findByPk(Number(modelId));
    if (!dbModel) throw new Error(`Model with id=${modelId} not found`);
    // Get all metrics for this model
    const metrics = await db.ModelMetric.findAll({ where: { modelId: Number(modelId) } });
    const metricIds = metrics.map(m => m.id);
    // The version field in ModelMetricLog is expected to be `${modelId}-${version}`
    const versionKey = `${modelId}-${version}`;
    // For each metric, get the latest log for this version
    let logs = await db.ModelMetricLog.findAll({
        where: {
            version: versionKey
        },
        order: [['createdAt', 'DESC']],
        limit: 30
    });
    if (logs.length === 0) {
        logs = await db.ModelMetricLog.findAll({
            where: {
                modelMetricId: metricIds,
            },
            order: [['createdAt', 'DESC']],
            limit: 30
        });
    }
    return logs;
}

/**
 * Get insights for a specific model version, fallback to modelId if none for version
 * @param {string|number} modelId - ID of the model
 * @param {string} version - Version string (as stored in Insights.version)
 * @returns {Promise<Object[]>} - Array of insights
 */
export async function getInsightsOfVersion(modelId, version) {
    const versionKey = `${modelId}-${version}`;
    let insights = await db.Insights.findAll({
        where: { version: versionKey },
        order: [['createdAt', 'DESC']],
        limit: 30
    });
    if (insights.length === 0) {
        insights = await db.Insights.findAll({
            where: { modelId: Number(modelId) },
            order: [['createdAt', 'DESC']],
            limit: 30
        });
    }
    return insights;
}