// jobs/cacheWarmingJob.js

import { updateAgentEntriesCache } from '../services/agentService.js';
import redisService from '../services/redisService.js';

export const processCacheWarmingJob = async (job) => {
  const { 
    agentId, 
    page = 1, 
    limit = 10, 
    environment = 'production',
    status = 'all',
    query = null,
    filteredNode = null,
    filteredNodeType = null,
    date = null
  } = job.data;

  try {
    console.log(`Starting cache warming for agent ${agentId}, page ${page}`);
    
    // Set a job status in Redis so frontend can show loading state
    const jobStatusKey = `cache-warming:${agentId}:${environment}:${status}:${page}`;
    await redisService.set(jobStatusKey, 'processing', 300); // 5 min TTL
    
    const result = await updateAgentEntriesCache(
      agentId,
      page,
      limit,
      environment,
      status,
      query,
      filteredNode,
      filteredNodeType,
      date
    );

    // Update job status to completed
    await redisService.set(jobStatusKey, 'completed', 60); // 1 min TTL
    
    console.log(`Completed cache warming for agent ${agentId}, page ${page}`);
    return result;
    
  } catch (error) {
    console.error(`Cache warming failed for agent ${agentId}:`, error);
    
    // Update job status to failed
    const jobStatusKey = `cache-warming:${agentId}:${environment}:${status}:${page}`;
    await redisService.set(jobStatusKey, 'failed', 60);
    
    throw error;
  }
};

export const scheduleAgentCacheWarming = async (queue, agentId, options = {}) => {
  const {
    pages = [1], // Array of pages to warm
    environment = 'production',
    status = 'all',
    limit = 10,
    priority = 'normal'
  } = options;

  const jobs = [];
  
  for (const page of pages) {
    const jobData = {
      agentId,
      page,
      limit,
      environment,
      status,
      ...options
    };

    const jobOptions = {
      priority: priority === 'high' ? 10 : priority === 'low' ? -10 : 0,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
      removeOnComplete: 5,
      removeOnFail: 10,
    };

    const job = await queue.add('cache-warming', jobData, jobOptions);
    jobs.push(job);
    
    console.log(`Scheduled cache warming job ${job.id} for agent ${agentId}, page ${page}`);
  }

  return jobs;
};

export default {
  processCacheWarmingJob,
  scheduleAgentCacheWarming
};