// MCP Server Configuration
const config = {
  server: {
    port: 3000,
    host: 'localhost'
  },
  logging: {
    level: 'info',
    format: 'json'
  },
  security: {
    cors: {
      enabled: true,
      origin: '*'
    },
    rateLimit: {
      enabled: true,
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // limit each IP to 100 requests per windowMs
    }
  },
  monitoring: {
    enabled: true,
    metrics: {
      enabled: true,
      path: '/metrics'
    }
  }
};

module.exports = config; 