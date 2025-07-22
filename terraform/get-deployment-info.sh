#!/bin/bash
# Get deployment information from Terraform outputs
# Based on repo-intelligence pattern

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "📋 Getting Handit.ai Deployment Information"
echo "=========================================="

# Check if terraform is initialized
if [ ! -d ".terraform" ]; then
    echo "❌ Terraform not initialized. Run 'terraform init' first."
    exit 1
fi

# Check workspace
WORKSPACE=$(terraform workspace show)
if [ "$WORKSPACE" != "handit-prod" ]; then
    echo "⚠️  Not in production workspace. Run 'terraform workspace select handit-prod'"
    exit 1
fi

echo -e "${YELLOW}Getting outputs from Terraform...${NC}"

# Get ECR repository URLs
ECR_API=$(terraform output -raw ecr_repository_url_api 2>/dev/null || echo "Not created yet")
ECR_DASHBOARD=$(terraform output -raw ecr_repository_url_dashboard 2>/dev/null || echo "Not created yet")

echo ""
echo -e "${GREEN}ECR Repositories:${NC}"
echo "  API:       $ECR_API"
echo "  Dashboard: $ECR_DASHBOARD"

echo ""
echo -e "${GREEN}GitHub Secrets Configuration:${NC}"
echo "Add these to your GitHub repository secrets:"
echo ""
echo "PROD_AWS_ACCOUNT_ID=904233102192"
echo "PROD_AWS_ACCESS_KEY_ID=<get from AWS IAM>"
echo "PROD_AWS_SECRET_ACCESS_KEY=<get from AWS IAM>"

echo ""
echo -e "${GREEN}Helm Deployment Commands:${NC}"
echo "cd ../helm"
echo "make install"

echo ""
echo -e "${GREEN}Application URLs:${NC}"
echo "  API:       https://handit-api.unison.totango.com"
echo "  Dashboard: https://handit.unison.totango.com"