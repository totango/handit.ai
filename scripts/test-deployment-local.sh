#!/bin/bash

# Exit on error
set -e

echo "🧪 Testing Handit.ai Deployment Locally"
echo "======================================"
echo ""

# Configuration
AWS_REGION="eu-west-1"
AWS_ACCOUNT_ID="904233102192"
ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
CLUSTER_NAME="leviosa-prod-eks"
NAMESPACE="handit"
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

# Update kubeconfig
echo ""
echo "2. Updating kubeconfig for EKS cluster..."
aws eks update-kubeconfig --region ${AWS_REGION} --name ${CLUSTER_NAME} --profile ${PROFILE}
print_status "Kubeconfig updated"

# Check current context
echo ""
echo "3. Current Kubernetes context:"
kubectl config current-context

# Create namespace if it doesn't exist
echo ""
echo "4. Checking namespace..."
if kubectl get namespace ${NAMESPACE} >/dev/null 2>&1; then
    print_status "Namespace '${NAMESPACE}' exists"
else
    print_warning "Creating namespace '${NAMESPACE}'..."
    kubectl create namespace ${NAMESPACE}
    print_status "Namespace created"
fi

# Dry run helm install
echo ""
echo "5. Running Helm dry-run to test deployment..."
echo ""

cd helm/handit-ai

helm upgrade --install handit-ai . \
  -f values-prod.yaml \
  --namespace ${NAMESPACE} \
  --set global.imageRegistry=${ECR_REGISTRY} \
  --set handit-api.image.tag=latest \
  --set handit-dashboard.image.tag=latest \
  --set handit-worker.image.tag=latest \
  --dry-run \
  --debug

cd ../..

echo ""
print_status "Helm dry-run completed successfully!"
echo ""
print_warning "To actually deploy, run:"
echo ""
echo "cd helm/handit-ai"
echo "helm upgrade --install handit-ai . \\"
echo "  -f values-prod.yaml \\"
echo "  --namespace ${NAMESPACE} \\"
echo "  --set global.imageRegistry=${ECR_REGISTRY} \\"
echo "  --set handit-api.image.tag=latest \\"
echo "  --set handit-dashboard.image.tag=latest \\"
echo "  --set handit-worker.image.tag=latest"
echo ""
echo "Or remove the --dry-run flag from this script and run it again."