import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import session from 'express-session';
import { Sequelize } from 'sequelize';
import cors from 'cors';
import compression from 'compression';
import authRoutes from './routes/authRoutes.js';
import demoEmailRoutes from './routes/demoEmailRoutes.js';
import agentStructureRoutes from './routes/agentStructureRoutes.js';

// Importing all route files
import companyRoutes from './routes/companyRoutes.js';
import companyMetricRoutes from './routes/companyMetricRoutes.js';
import companyMetricLogRoutes from './routes/companyMetricLogRoutes.js';
import companyMetricModelRoutes from './routes/companyMetricModelRoutes.js';
import datasetRoutes from './routes/datasetRoutes.js';
import datasetGroupRoutes from './routes/datasetGroupRoutes.js';
import modelRoutes from './routes/modelRoutes.js';
import modelDatasetRoutes from './routes/modelDatasetRoutes.js';
import modelGroupRoutes from './routes/modelGroupRoutes.js';
import modelLogRoutes from './routes/modelLogRoutes.js';
import modelMetricRoutes from './routes/modelMetricRoutes.js';
import modelMetricLogRoutes from './routes/modelMetricLogRoutes.js';
import userRoutes from './routes/userRoutes.js';
import trackRoutes from './routes/trackRoutes.js';
import monitoringRoutes from './routes/monitoringRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import abTestRoutes from './routes/abTestRoutes.js';  
import insightsRoutes from './routes/insightsRoutes.js';
import performanceRoutes from './routes/performanceRoutes.js';
import authenticateJWT from './middleware/authMiddleware.js';
import automaticOptimizationRoutes from './routes/automaticOptimizationRoutes.js';
import evaluatorRoutes from './routes/evaluatorRoutes.js';
import agentRoutes from './routes/agentRoutes.js';
import weeklyEmailRoutes from './routes/weeklyEmailRoutes.js';
import { addMetricJob } from './jobs/metricJob.js';
import setupRouter from './routes/setupRouter.js';
import checkRoutes from './routes/checkRoutes.js';
import weeklyOptimizationRoutes from './routes/weeklyOptimizationRoutes.js';
import samplingRoutes from './routes/samplingRoutes.js';
import nodeMetricsRoutes from './routes/nodeMetricsRoutes.js';
import messageRouter from './routes/messageRouter.js';
import validateApiToken from './middleware/apiTokenMiddleware.js';
import emailAutonomRoutes from './routes/emailAutonomRoutes.js';
import promptVersionRoutes from './routes/promptVersionRoutes.js';
import integrationTokenRoutes from './routes/integrationTokenRoutes.js';
import evaluatorMetricRoutes from './routes/evaluatorMetricRoutes.js';
import providersRoutes from './routes/providersRoutes.js';
import reviewersTemplateRoutes from './routes/reviewersTemplateRoutes.js';

dotenv.config();

const app = express();


// Enable compression
app.use(compression());

// Enable CORS for all routes
app.use(cors({
  origin: ['http://127.0.0.1:3000', 'http://localhost:3000', 'http://localhost:3002', '*', 'https://handit-dashboard.vercel.app', 'https://dashboard.handit.ai', 'https://sandbox.handit.ai','https://try.handit.ai', 'https://handit.ai', 'https://www.handit.ai', 'https://demo.handit.ai', 'https://www.demo.handit.ai'],
}));

// Remove global chunked transfer encoding middleware
// Only specific endpoints will set this header as needed

// Configure body-parser with increased limits for all routes
app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));

// Special configuration for track routes to handle even larger payloads
const trackBodyParser = bodyParser.json({ limit: '500mb' });
const trackUrlEncoded = bodyParser.urlencoded({ limit: '500mb', extended: true });

app.use(session({
  secret: process.env.SESSION_SECRET || 'your_session_secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
});
app.use('/api/setup', setupRouter);


// Public routes
app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/demo-email', demoEmailRoutes);
app.use('/api/check', checkRoutes);
app.use('/api/weekly-email', weeklyEmailRoutes);
app.use('/api/weekly-optimization', weeklyOptimizationRoutes);
app.use('/api/email-autonom', emailAutonomRoutes);
app.use('/api/sampling', validateApiToken, samplingRoutes);
app.use('/api/node-metrics', validateApiToken, nodeMetricsRoutes);
app.use('/api/messages', validateApiToken, messageRouter);
app.use('/api/agent-structure', validateApiToken, agentStructureRoutes);




// Apply JWT authentication middleware to all routes except auth routes
app.use(authenticateJWT);

app.use('/api/evaluator', evaluatorRoutes);
app.use('/api/automatic-optimization', automaticOptimizationRoutes);
app.use('/api/ab-tests', abTestRoutes);
app.use('/api/model-metric-logs', modelMetricLogRoutes);
// Apply special body parser configuration for track routes
app.use('/api/track', trackBodyParser, trackUrlEncoded, trackRoutes);
// Protected routes
app.use('/api/companies', companyRoutes);
app.use('/api/company-metrics', companyMetricRoutes);
app.use('/api/company-metric-logs', companyMetricLogRoutes);
app.use('/api/company-metric-models', companyMetricModelRoutes);
app.use('/api/datasets', datasetRoutes);
app.use('/api/dataset-groups', datasetGroupRoutes);
app.use('/api/models', modelRoutes);
app.use('/api/model-datasets', modelDatasetRoutes);
app.use('/api/model-groups', modelGroupRoutes);
app.use('/api/model-logs', modelLogRoutes);
app.use('/api/model-metrics', modelMetricRoutes);
app.use('/api/users', userRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/monitoring', monitoringRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/insights', insightsRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/prompt-versions', promptVersionRoutes);
app.use('/api/integration-tokens', integrationTokenRoutes);
app.use('/api/evaluator-metrics', evaluatorMetricRoutes);
app.use('/api/providers', providersRoutes);
app.use('/api/reviewers-template', reviewersTemplateRoutes);
// Add sampling routes

// Add setup routes

// Configure express to handle large payloads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const scheduleMetricJobs = async () => {
  // Define your metric jobs here
  const metricJobs = [
    {
      cronTime: '* * * * *',
    }
  ];

  for (const job of metricJobs) {
    try {
      await addMetricJob(job);
      console.log(`Scheduled metric job: ${job.metricType} with cron time: ${job.cronTime}`);
    } catch (error) {
      console.error(`Failed to schedule metric job: ${job.metricType}`, error);
    }
  }
};
console.log("Hello World");
scheduleMetricJobs();
