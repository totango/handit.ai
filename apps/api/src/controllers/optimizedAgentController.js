// controllers/optimizedAgentController.js
import db from '../../models/index.js';
import { redisService } from '../services/redisService.js';
import { cacheWarmingQueue } from '../services/queue.js';
import { scheduleAgentCacheWarming } from '../jobs/cacheWarmingJob.js';

// Helper function to get environment from request
const getEnvironment = (req) => req.query.environment || 'production';

// Maximum entries to process synchronously before switching to background jobs
const MAX_SYNC_ENTRIES = 1000;

export const getAgentEntriesOptimized = async (req, res) => {
  try {
    let { id } = req.params;
    const { userObject } = req;
    let { companyId } = userObject;
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 100, 100); // Cap at 100
    const query = req.query.query || '';
    const environment = getEnvironment(req);
    const status = req.query.status || 'all';
    const filteredNode = req.query.filteredNode || null;
    const filteredNodeType = req.query.filteredNodeType || null;
    let date = req.query.date || null;
    
    if (date === '' || date === 'null') {
      date = null;
    }

    // Get agent and verify access
    let company = await db.Company.findOne({
      where: { id: companyId },
    });

    // If company is in test mode, generate mock entries
    if (company.testMode) {
      companyId = 63;
      company = await db.Company.findOne({
        where: { id: companyId },
      });
      id = 39;
    }

    let response = null;

    // Try cache first (only for non-search queries)
    if (!query || query === '') {
      const metadataKey = `agent-entries-metadata:${id}:${environment}:${status}`;
      const metadata = await redisService.get(metadataKey);

      const pageKey = `agent-entries:${id}:page:${page}:limit:${limit}:${environment}:${status}`;
      const cachedPage = await redisService.get(pageKey);

      if (metadata && cachedPage) {
        console.log(`Cache hit for agent ${id}, page ${page}`);
        response = {
          entries: cachedPage,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: metadata.total,
            totalFailedEntries: metadata.totalFailedEntries,
            totalFailedModelEntries: metadata.totalFailedModelEntries,
            totalPages: metadata.totalPages,
          },
        };
      }
    }

    if (!response) {
      console.log(`Cache miss for agent ${id}, checking dataset size...`);
      
      // First, check the approximate size of the dataset
      const sizeEstimate = await db.sequelize.query(
        `SELECT COUNT(*) as count FROM "AgentLogs" 
         WHERE "agent_id" = :agentId AND "environment" = :environment 
         AND "deleted_at" IS NULL`,
        {
          replacements: { agentId: id, environment },
          type: db.sequelize.QueryTypes.SELECT,
        }
      );

      const totalEntries = parseInt(sizeEstimate[0].count);

      if (totalEntries > MAX_SYNC_ENTRIES && page === 1) {
        // For large datasets, schedule background job and return placeholder
        console.log(`Large dataset detected (${totalEntries} entries), scheduling background job...`);
        
        // Check if a job is already processing
        const jobStatusKey = `cache-warming:${id}:${environment}:${status}:${page}`;
        const jobStatus = await redisService.get(jobStatusKey);
        
        if (!jobStatus || jobStatus === 'failed') {
          // Schedule cache warming for first few pages
          await scheduleAgentCacheWarming(cacheWarmingQueue, id, {
            pages: [1, 2, 3], // Warm first 3 pages
            environment,
            status,
            limit,
            priority: 'high'
          });
        }

        // Return loading state
        return res.status(202).json({
          loading: true,
          message: `Processing ${totalEntries} entries. This may take a few moments...`,
          jobStatus: jobStatus || 'queued',
          estimatedTime: Math.ceil(totalEntries / 1000) * 10, // Rough estimate in seconds
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: totalEntries,
            totalPages: Math.ceil(totalEntries / limit),
          }
        });
      }

      // For smaller datasets or subsequent pages, process synchronously with timeout
      console.log(`Processing synchronously for agent ${id}, ${totalEntries} total entries`);
      
      // Import here to avoid circular dependency
      const { updateAgentEntriesCache } = await import('../services/agentService.js');
      
      // Set a shorter timeout for synchronous processing
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 30000); // 30 seconds
      });

      const cacheUpdatePromise = updateAgentEntriesCache(
        id, page, limit, environment, status, query, filteredNode, filteredNodeType, date
      );

      try {
        response = await Promise.race([cacheUpdatePromise, timeoutPromise]);
      } catch (error) {
        if (error.message === 'Request timeout') {
          // Schedule background job for this specific page
          await scheduleAgentCacheWarming(cacheWarmingQueue, id, {
            pages: [page],
            environment,
            status,
            limit,
            query,
            filteredNode,
            filteredNodeType,
            date
          });

          return res.status(202).json({
            loading: true,
            message: 'Request is taking longer than expected. Processing in background...',
            jobStatus: 'processing',
            pagination: {
              page: parseInt(page),
              limit: parseInt(limit),
              total: totalEntries,
              totalPages: Math.ceil(totalEntries / limit),
            }
          });
        }
        throw error;
      }
    }

    // Add performance metadata
    response.performance = {
      cached: !!response,
      timestamp: new Date().toISOString(),
    };

    res.status(200).json(response);

  } catch (error) {
    console.error('Error in getAgentEntriesOptimized:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to retrieve agent entries'
    });
  }
};

// Endpoint to check job status
export const getAgentEntriesJobStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, environment = 'production', status = 'all' } = req.query;
    
    const jobStatusKey = `cache-warming:${id}:${environment}:${status}:${page}`;
    const jobStatus = await redisService.get(jobStatusKey);
    
    res.json({
      status: jobStatus || 'not_found',
      agent_id: id,
      page: parseInt(page),
      environment,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error checking job status:', error);
    res.status(500).json({ error: 'Failed to check job status' });
  }
};

export default {
  getAgentEntriesOptimized,
  getAgentEntriesJobStatus
};