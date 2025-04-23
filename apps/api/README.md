Here’s a `README.md` file for your project:

# Handit API

Handit API is a backend API built with Node.js and Express.js, using Sequelize as an ORM for PostgreSQL. This project provides endpoints for managing companies, datasets, models, metrics, and other business-related entities.

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Running the Application](#running-the-application)
  - [Development Mode](#development-mode)
  - [Production Mode](#production-mode)
- [Database Migrations and Seeding](#database-migrations-and-seeding)
- [Environment Variables](#environment-variables)
- [Docker Support](#docker-support)
- [API Routes](#api-routes)
- [License](#license)

## Requirements

- [Node.js](https://nodejs.org/en/download/) (version 12.x or higher)
- [PostgreSQL](https://www.postgresql.org/download/)
- [Docker](https://www.docker.com/) (optional, for Docker setup)

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/handit-api.git
   cd handit-api
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file at the root of your project to configure environment variables. (See [Environment Variables](#environment-variables))

## Running the Application

### Development Mode

To run the application in development mode with live-reloading, use:
```bash
npm run dev
```

This will start the server using `nodemon` which watches for file changes.

### Production Mode

To run the application in production mode, use:
```bash
npm start
```

## Database Migrations and Seeding

### Running Migrations

To run migrations using Sequelize CLI:
```bash
npm run migrate
```

### Seeding the Database

To seed the database with initial data:
```bash
npm run seed
```

## Environment Variables

Create a `.env` file at the root of the project with the following variables:

```
DATABASE_URL=your_postgresql_database_url
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
```

## Docker Support

You can run the application with Docker using the following commands.

### Building the Docker Image

To build the Docker image:
```bash
npm run docker-build
```

### Running with Docker Compose

To run the application with Docker Compose:
```bash
npm run docker-start
```

This will start both the application and the PostgreSQL database using the `docker-compose.yml` configuration.

## API Routes

The API has the following routes for managing various entities:

- **Authentication:**
  - `POST /api/auth/login` - Log in to the system with email and password.
  - `POST /api/auth/signup` - Sign up a new user.

- **Companies:**
  - `POST /api/companies` - Create a new company.
  - `GET /api/companies` - Get all companies.
  - `GET /api/companies/:id` - Get a company by ID.
  - `PUT /api/companies/:id` - Update a company.
  - `DELETE /api/companies/:id` - Delete a company.

- **Company Metrics:**
  - `POST /api/company-metrics` - Create a new company metric.
  - `GET /api/company-metrics` - Get all company metrics.
  - `GET /api/company-metrics/:id` - Get a company metric by ID.
  - `PUT /api/company-metrics/:id` - Update a company metric.
  - `DELETE /api/company-metrics/:id` - Delete a company metric.

- **Datasets:**
  - `POST /api/datasets` - Create a new dataset.
  - `GET /api/datasets` - Get all datasets.
  - `GET /api/datasets/:id` - Get a dataset by ID.
  - `PUT /api/datasets/:id` - Update a dataset.
  - `DELETE /api/datasets/:id` - Delete a dataset.

- **Models:**
  - `POST /api/models` - Create a new model.
  - `GET /api/models` - Get all models.
  - `GET /api/models/:id` - Get a model by ID.
  - `PUT /api/models/:id` - Update a model.
  - `DELETE /api/models/:id` - Delete a model.

- **Other Routes:** Similar CRUD operations exist for `ModelLogs`, `ModelMetrics`, `ModelGroups`, `ModelDatasets`, `CompanyMetricLogs`, and `Users`.

## License

This project is licensed under the MIT License.


## Deployment

- gcloud config set project handitai
- docker build --platform linux/amd64 -t gcr.io/handitai/handit_api:v1 .
- gcloud auth configure-docker
- docker push gcr.io/handitai/handit_api:v1  
- gcloud compute instances create-with-container api --container-image gcr.io/handitai/handit_api:v1