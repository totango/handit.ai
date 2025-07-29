#!/bin/bash

# Exit on error
set -e

echo "🚀 Handit.ai Production Deployment"
echo "=================================="
echo ""

# Configuration
AWS_REGION="eu-west-1"
AWS_ACCOUNT_ID="904233102192"
ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
PROFILE="leviosa-prod"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Check if AWS CLI is configured
echo "1. Checking AWS authentication..."
if aws sts get-caller-identity --profile ${PROFILE} >/dev/null 2>&1; then
    print_status "AWS CLI authenticated"
else
    print_error "AWS CLI not authenticated. Please run:"
    echo "cd terraform && . ./terraform-auth.sh YOUR_MFA_TOKEN"
    exit 1
fi

# Login to ECR
echo ""
echo "2. Logging in to ECR..."
aws ecr get-login-password --region ${AWS_REGION} --profile ${PROFILE} | docker login --username AWS --password-stdin ${ECR_REGISTRY}
print_status "ECR login successful"

# Build and push API image (used by both API and worker)
echo ""
echo "3. Building and pushing API Docker image..."
cd apps/api
docker build -t handit-api .
docker tag handit-api:latest ${ECR_REGISTRY}/handit-api:latest
docker push ${ECR_REGISTRY}/handit-api:latest
print_status "API image pushed to ECR"
cd ../..

# Build and push Dashboard image
echo ""
echo "4. Building and pushing Dashboard Docker image..."
cd apps/dashboard
docker build -t handit-dashboard .
docker tag handit-dashboard:latest ${ECR_REGISTRY}/handit-dashboard:latest
docker push ${ECR_REGISTRY}/handit-dashboard:latest
print_status "Dashboard image pushed to ECR"
cd ../..

# Commit and push the worker command update
echo ""
echo "5. Committing worker command update..."
git add helm/handit-ai/charts/handit-worker/values.yaml
git commit -m "Add worker command to run metric-worker" || true
git push origin unison-deployment || true

# Display deployment instructions
echo ""
echo "=================================="
print_status "Docker images built and pushed successfully!"
echo ""
print_warning "Next steps to deploy:"
echo ""
echo "1. Go to: https://github.com/jacobbeck-totango/handit.ai/actions"
echo "2. Click on 'Deploy to Leviosa EKS' workflow"
echo "3. Click 'Run workflow' button"
echo "4. Select:"
echo "   - Branch: unison-deployment"
echo "   - Environment: prod"
echo "5. Click the green 'Run workflow' button"
echo ""
echo "The deployment will:"
echo "   - Deploy handit-api (API service)"
echo "   - Deploy handit-dashboard (Frontend)"
echo "   - Deploy handit-worker (Background job processor)"
echo ""
echo "URLs after deployment:"
echo "   - API: https://handit-api.unison.totango.com"
echo "   - Dashboard: https://handit.unison.totango.com"
echo ""