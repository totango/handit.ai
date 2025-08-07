#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if required commands exist
check_requirements() {
    local missing=0
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        missing=1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        missing=1
    fi
    
    if ! command -v docker &> /dev/null; then
        print_warning "Docker is not installed (needed for PostgreSQL and Redis)"
    fi
    
    if [ $missing -eq 1 ]; then
        exit 1
    fi
}

# Function to cleanup on exit
cleanup() {
    print_status "Stopping all services..."
    
    # Kill all background processes
    jobs -p | xargs -r kill &> /dev/null
    
    # Stop docker services if running
    if [ "$USE_DOCKER" = true ]; then
        docker-compose -f docker-compose.dev.yml down &> /dev/null
    fi
    
    print_success "All services stopped"
}

# Trap exit signals
trap cleanup EXIT INT TERM

# Parse command line arguments
USE_DOCKER=false
SKIP_INSTALL=false
SKIP_MIGRATE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --docker)
            USE_DOCKER=true
            shift
            ;;
        --skip-install)
            SKIP_INSTALL=true
            shift
            ;;
        --skip-migrate)
            SKIP_MIGRATE=true
            shift
            ;;
        --help)
            echo "Usage: $0 [options]"
            echo ""
            echo "Options:"
            echo "  --docker        Use Docker for PostgreSQL and Redis"
            echo "  --skip-install  Skip npm install step"
            echo "  --skip-migrate  Skip database migration step"
            echo "  --help          Show this help message"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Check requirements
check_requirements

print_status "Starting Handit.ai local development environment..."

# Start Docker services if requested
if [ "$USE_DOCKER" = true ]; then
    print_status "Starting PostgreSQL and Redis with Docker..."
    docker-compose -f docker-compose.dev.yml up -d db redis
    
    # Wait for services to be ready
    print_status "Waiting for services to be ready..."
    sleep 5
fi

# Install dependencies if not skipped
if [ "$SKIP_INSTALL" = false ]; then
    print_status "Installing API dependencies..."
    (cd apps/api && npm install --legacy-peer-deps) || print_error "Failed to install API dependencies"
    
    print_status "Installing Dashboard dependencies..."
    (cd apps/dashboard && npm install --legacy-peer-deps) || print_error "Failed to install Dashboard dependencies"
fi

# Run migrations if not skipped
if [ "$SKIP_MIGRATE" = false ]; then
    print_status "Running database migrations..."
    (cd apps/api && npm run migrate) || print_warning "Migration failed - database might not be ready"
fi

# Create log directory
mkdir -p logs

# Start API
print_status "Starting API server on port 8081..."
(
    cd apps/api
    PORT=8081 npm run dev 2>&1 | tee ../../logs/api.log | sed 's/^/[API] /'
) &
API_PID=$!

# Wait for API to start
sleep 3

# Start Dashboard  
print_status "Starting Dashboard on port 3003..."
(
    cd apps/dashboard
    PORT=3003 npm run dev 2>&1 | tee ../../logs/dashboard.log | sed 's/^/[DASHBOARD] /'
) &
DASHBOARD_PID=$!

# Start Worker
print_status "Starting Worker..."
(
    cd apps/api
    npm run metric-worker 2>&1 | tee ../../logs/worker.log | sed 's/^/[WORKER] /'
) &
WORKER_PID=$!

# Print status
sleep 5
echo ""
print_success "All services started!"
echo ""
echo "Services running at:"
echo "  • Dashboard: http://localhost:3003"
echo "  • API:       http://localhost:8081"
echo "  • API Health: http://localhost:8081/health"
echo ""
echo "Logs are available in the ./logs directory"
echo ""
print_warning "Press Ctrl+C to stop all services"
echo ""

# Wait for any process to exit (use standard wait without -n for compatibility)
wait $API_PID $DASHBOARD_PID $WORKER_PID

# If we get here, something crashed
print_error "One of the services crashed. Check the logs for details."
exit 1