# Handit.ai Local Development Makefile

# Default target
.DEFAULT_GOAL := help

# Variables
API_DIR := apps/api
DASHBOARD_DIR := apps/dashboard
WORKER_DIR := apps/api
DOCKER_COMPOSE := docker-compose -f docker-compose.dev.yml

# Colors for output
CYAN := \033[0;36m
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m # No Color

.PHONY: help
help: ## Show this help message
	@echo '${CYAN}Handit.ai Development Commands${NC}'
	@echo ''
	@echo 'Usage:'
	@echo '  ${YELLOW}make${NC} ${GREEN}<target>${NC}'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  ${YELLOW}%-20s${NC} %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Installation targets
.PHONY: install
install: install-api install-dashboard ## Install all dependencies

.PHONY: install-api
install-api: ## Install API dependencies
	@echo "${CYAN}Installing API dependencies...${NC}"
	cd $(API_DIR) && npm install --legacy-peer-deps

.PHONY: install-dashboard
install-dashboard: ## Install Dashboard dependencies
	@echo "${CYAN}Installing Dashboard dependencies...${NC}"
	cd $(DASHBOARD_DIR) && npm install --legacy-peer-deps

# Database targets
.PHONY: db-migrate
db-migrate: ## Run database migrations
	@echo "${CYAN}Running database migrations...${NC}"
	cd $(API_DIR) && npm run migrate

.PHONY: db-rollback
db-rollback: ## Rollback database migrations
	@echo "${CYAN}Rolling back database migrations...${NC}"
	cd $(API_DIR) && npm run rollback

# Individual service targets
.PHONY: start-api
start-api: ## Start API server only
	@echo "${CYAN}Starting API server...${NC}"
	cd $(API_DIR) && npm run dev

.PHONY: start-dashboard
start-dashboard: ## Start Dashboard only
	@echo "${CYAN}Starting Dashboard...${NC}"
	cd $(DASHBOARD_DIR) && npm run dev

.PHONY: start-worker
start-worker: ## Start Worker only
	@echo "${CYAN}Starting Worker...${NC}"
	cd $(WORKER_DIR) && npm run metric-worker

# Docker targets
.PHONY: docker-up
docker-up: ## Start all services with Docker Compose
	@echo "${CYAN}Starting services with Docker Compose...${NC}"
	$(DOCKER_COMPOSE) up -d

.PHONY: docker-down
docker-down: ## Stop all Docker services
	@echo "${CYAN}Stopping Docker services...${NC}"
	$(DOCKER_COMPOSE) down

.PHONY: docker-logs
docker-logs: ## View Docker logs
	$(DOCKER_COMPOSE) logs -f

.PHONY: docker-build
docker-build: ## Build Docker images
	@echo "${CYAN}Building Docker images...${NC}"
	$(DOCKER_COMPOSE) build

# Combined targets
.PHONY: dev
dev: ## Start all services in development mode (requires multiple terminals)
	@echo "${CYAN}Starting all services...${NC}"
	@echo "${YELLOW}Note: This requires multiple terminal windows${NC}"
	@echo ""
	@echo "Run these commands in separate terminals:"
	@echo "  1. ${GREEN}make start-api${NC}      - API server on port 8081"
	@echo "  2. ${GREEN}make start-dashboard${NC} - Dashboard on port 3002"
	@echo "  3. ${GREEN}make start-worker${NC}    - Background worker"
	@echo ""
	@echo "Or use ${GREEN}make docker-up${NC} to run everything with Docker"

.PHONY: dev-parallel
dev-parallel: ## Start all services in parallel (experimental)
	@echo "${CYAN}Starting all services in parallel...${NC}"
	@echo "${YELLOW}Press Ctrl+C to stop all services${NC}"
	@make -j3 start-api start-dashboard start-worker

# Testing targets
.PHONY: test
test: test-api test-dashboard ## Run all tests

.PHONY: test-api
test-api: ## Run API tests
	@echo "${CYAN}Running API tests...${NC}"
	cd $(API_DIR) && npm test

.PHONY: test-dashboard
test-dashboard: ## Run Dashboard tests
	@echo "${CYAN}Running Dashboard tests...${NC}"
	cd $(DASHBOARD_DIR) && npm test

# Linting targets
.PHONY: lint
lint: lint-api lint-dashboard ## Run linting for all services

.PHONY: lint-api
lint-api: ## Run API linting
	@echo "${CYAN}Linting API...${NC}"
	cd $(API_DIR) && npm run lint

.PHONY: lint-dashboard
lint-dashboard: ## Run Dashboard linting
	@echo "${CYAN}Linting Dashboard...${NC}"
	cd $(DASHBOARD_DIR) && npm run lint

.PHONY: lint-fix
lint-fix: ## Fix linting issues
	@echo "${CYAN}Fixing lint issues...${NC}"
	cd $(API_DIR) && npm run lint-fix
	cd $(DASHBOARD_DIR) && npm run lint:fix

# Build targets
.PHONY: build
build: build-api build-dashboard ## Build all services

.PHONY: build-api
build-api: ## Build API
	@echo "${CYAN}Building API...${NC}"
	cd $(API_DIR) && npm run build || echo "No build script for API"

.PHONY: build-dashboard
build-dashboard: ## Build Dashboard
	@echo "${CYAN}Building Dashboard...${NC}"
	cd $(DASHBOARD_DIR) && npm run build

# Clean targets
.PHONY: clean
clean: ## Clean build artifacts and dependencies
	@echo "${CYAN}Cleaning build artifacts...${NC}"
	rm -rf $(API_DIR)/node_modules
	rm -rf $(DASHBOARD_DIR)/node_modules
	rm -rf $(DASHBOARD_DIR)/.next
	rm -rf $(DASHBOARD_DIR)/out

# Environment setup
.PHONY: setup-env
setup-env: ## Copy example environment files
	@echo "${CYAN}Setting up environment files...${NC}"
	@if [ ! -f $(API_DIR)/.env ]; then \
		cp $(API_DIR)/.env.example $(API_DIR)/.env 2>/dev/null || echo "${YELLOW}No .env.example found for API${NC}"; \
	fi
	@if [ ! -f $(DASHBOARD_DIR)/.env.local ]; then \
		cp $(DASHBOARD_DIR)/.env.example $(DASHBOARD_DIR)/.env.local 2>/dev/null || echo "${YELLOW}No .env.example found for Dashboard${NC}"; \
	fi
	@echo "${GREEN}Environment files ready. Please update them with your values.${NC}"

# Quick start
.PHONY: quickstart
quickstart: install setup-env db-migrate ## Quick start: install deps, setup env, run migrations
	@echo ""
	@echo "${GREEN}Setup complete!${NC}"
	@echo ""
	@echo "Next steps:"
	@echo "  1. Update environment files with your configuration"
	@echo "  2. Run ${YELLOW}make dev${NC} to start all services"

# Status check
.PHONY: status
status: ## Check status of all services
	@echo "${CYAN}Checking service status...${NC}"
	@echo ""
	@echo "API (port 8081):"
	@curl -s http://localhost:8081/health > /dev/null && echo "  ${GREEN}✓ Running${NC}" || echo "  ${RED}✗ Not running${NC}"
	@echo ""
	@echo "Dashboard (port 3002):"
	@curl -s http://localhost:3002 > /dev/null && echo "  ${GREEN}✓ Running${NC}" || echo "  ${RED}✗ Not running${NC}"
	@echo ""
	@echo "PostgreSQL (port 5432):"
	@nc -z localhost 5432 > /dev/null 2>&1 && echo "  ${GREEN}✓ Running${NC}" || echo "  ${RED}✗ Not running${NC}"
	@echo ""
	@echo "Redis (port 6379):"
	@nc -z localhost 6379 > /dev/null 2>&1 && echo "  ${GREEN}✓ Running${NC}" || echo "  ${RED}✗ Not running${NC}"

# Logs viewing
.PHONY: logs-api
logs-api: ## View API logs
	@echo "${CYAN}Viewing API logs...${NC}"
	tail -f $(API_DIR)/logs/*.log 2>/dev/null || echo "${YELLOW}No log files found${NC}"

# Port forwarding for production debugging
.PHONY: port-forward
port-forward: ## Port forward to production Kubernetes services
	@echo "${CYAN}Setting up port forwarding to production...${NC}"
	@echo "${YELLOW}This will forward:${NC}"
	@echo "  - localhost:8080 → Production API"
	@echo "  - localhost:3000 → Production Dashboard"
	@echo ""
	kubectl port-forward -n handit svc/handit-ai-handit-api 8080:8080 & \
	kubectl port-forward -n handit svc/handit-ai-handit-dashboard 3000:3000

# Database connection
.PHONY: db-connect
db-connect: ## Connect to local PostgreSQL
	@echo "${CYAN}Connecting to PostgreSQL...${NC}"
	psql -h localhost -p 5432 -U handit -d handit_development