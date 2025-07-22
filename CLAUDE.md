# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Handit.ai is an open-source AI observability and optimization platform that provides monitoring, evaluation, and automatic improvement for AI agents and LLMs. The project uses a monorepo structure with:

- **Backend API**: Node.js/Express with Sequelize ORM
- **Frontend Dashboard**: Next.js 14 with React, Redux Toolkit, and Material-UI
- **NPM Package**: @handit.ai/onboarding for interactive UI components

## Commands

### API Development (apps/api/)

```bash
# Install dependencies
npm install

# Run development server with hot reload
npm run dev

# Run production server
npm start

# Run database migrations
npm run migrate

# Run linting
npm run lint
npm run lint-fix

# Run metric worker
npm run metric-worker

# Docker operations
npm run docker-build
npm run docker-start
```

### Dashboard Development (apps/dashboard/)

```bash
# Install dependencies
npm install

# Run development server (uses local API)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting and type checking
npm run lint
npm run lint:fix
npm run typecheck

# Format code
npm run format:write
npm run format:check

# Run tests
npm run test
```

### Onboarding Package (packages/@handit/onboarding/)

```bash
# Install dependencies
npm install

# Build the package
npm run build

# Development mode with watch
npm run dev

# Run tests
npm run test
```

### Docker Development

```bash
# Start all services (frontend, API, PostgreSQL, Redis)
docker-compose up

# Start with rebuild
docker-compose up --build

# Development mode with hot reload
docker-compose -f docker-compose.dev.yml up
```

## Architecture

### Backend (apps/api/)

The API follows a layered architecture:

1. **Routes** (`src/routes/`): HTTP endpoint definitions organized by feature
2. **Controllers** (`src/controllers/`): Request handling and response formatting
3. **Services** (`src/services/`): Business logic and external integrations
4. **Models** (`src/models/`): Sequelize models for database entities
5. **Middleware** (`src/middleware/`): Authentication (JWT) and API token validation
6. **Jobs** (`src/jobs/`): Background job processing using Bull/Redis queues
7. **Migrations** (`migrations/`): Database schema versioning

Key patterns:
- JWT-based authentication with API token support
- Redis for caching and job queues
- Sequelize for PostgreSQL ORM
- Service layer pattern for business logic separation

### Frontend (apps/dashboard/)

Next.js application with:

1. **App Router** (`src/app/`): Page components and layouts
2. **Components** (`src/components/`): Reusable UI components organized by feature
3. **Services** (`src/services/`): API client services using RTK Query
4. **Store** (`src/store/`): Redux Toolkit state management
5. **Hooks** (`src/hooks/`): Custom React hooks
6. **Context** (`src/contexts/`): React context providers

Key patterns:
- Material-UI (MUI) component library
- Redux Toolkit for state management
- RTK Query for API data fetching
- Authentication guard components
- Theme provider with dark/light mode support

### Key Features and Entry Points

1. **Agent Monitoring**: Track AI agent performance and execution traces
   - API: `src/controllers/agentController.js`
   - UI: `src/app/(dashboard)/ag-monitoring/page.js`

2. **Evaluation Hub**: Create and manage model evaluators
   - API: `src/controllers/evaluatorController.js`
   - UI: `src/app/(dashboard)/evaluation-hub/page.js`

3. **Prompt Management**: Version control and A/B testing for prompts
   - API: `src/controllers/promptVersionController.js`
   - UI: `src/app/(dashboard)/prompt-versions/page.js`

4. **Model Optimization**: Automatic improvement suggestions
   - API: `src/controllers/automaticOptimizationController.js`
   - UI: `src/app/(dashboard)/model-refinement/page.js`

5. **Tracing**: Detailed execution traces for debugging
   - API: `src/services/agentTracingService.js`
   - UI: `src/app/(dashboard)/ag-tracing/page.js`

### Database Schema

The application uses PostgreSQL with Sequelize ORM. Key models include:
- `Company`: Organization accounts
- `User`: User accounts with membership associations
- `Agent`: AI agent configurations
- `AgentNode`: Individual nodes in agent workflows
- `AgentLog`/`AgentNodeLog`: Execution traces
- `Model`: LLM model configurations
- `ModelLog`: Model inference logs
- `EvaluationPrompt`: Evaluator configurations
- `ABTestModel`: A/B test configurations

### Environment Variables

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `JWT_SECRET`: JWT token signing secret
- `SESSION_SECRET`: Express session secret
- `SENDGRID_API_KEY`: Email service API key
- `OPENAI_API_KEY`: OpenAI API key (for AI features)
- `NEXT_PUBLIC_API_URL`: API URL for frontend

### Testing Strategy

- API: Jest for unit tests (test files alongside source)
- Dashboard: Jest with React Testing Library
- Run specific test: `npm test -- path/to/test.js`

### Deployment

The application deploys to Leviosa EKS clusters using Helm charts and GitHub Actions.

#### Quick Deployment Commands

```bash
# Initial setup (one-time)
./scripts/setup-aws-resources.sh

# Deploy to dev (automatic on push to main)
git push origin main

# Deploy to prod (manual via GitHub Actions)
# Go to Actions tab → "Deploy to Leviosa EKS" → Run workflow → Select "prod"

# Local deployment
aws eks update-kubeconfig --region eu-west-1 --name leviosa-dev-eks --profile leviosa-dev
helm upgrade --install handit-ai ./helm/handit-ai -f ./helm/handit-ai/values-dev.yaml --namespace handit
```

#### Key Files
- `.github/workflows/deploy-to-eks.yml` - CI/CD pipeline
- `helm/handit-ai/` - Kubernetes deployment charts
- `terraform/setup/` - AWS infrastructure setup
- `DEPLOYMENT.md` - Detailed deployment guide

#### Environments
- Dev: https://handit.dev-unison.totango.com (AWS: 537124952465)
- Prod: https://handit.unison.totango.com (AWS: 904233102192)