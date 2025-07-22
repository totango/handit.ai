#!/bin/bash
# Script to set up AWS resources for Handit.ai deployment

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
TERRAFORM_DIR="$PROJECT_ROOT/terraform/setup"

echo "🚀 Setting up AWS resources for Handit.ai..."

# Check prerequisites
command -v terraform >/dev/null 2>&1 || { echo "❌ Terraform is required but not installed. Aborting." >&2; exit 1; }
command -v aws >/dev/null 2>&1 || { echo "❌ AWS CLI is required but not installed. Aborting." >&2; exit 1; }

# Get environment
read -p "Enter environment (dev/prod): " ENVIRONMENT
if [[ ! "$ENVIRONMENT" =~ ^(dev|prod)$ ]]; then
    echo "❌ Invalid environment. Must be 'dev' or 'prod'"
    exit 1
fi

# Get GitHub organization
read -p "Enter your GitHub organization name: " GITHUB_ORG

# Set AWS profile based on environment
if [ "$ENVIRONMENT" == "dev" ]; then
    AWS_PROFILE="leviosa-dev"
    AWS_ACCOUNT_ID="537124952465"
else
    AWS_PROFILE="leviosa-prod"
    AWS_ACCOUNT_ID="904233102192"
fi

echo "📋 Using AWS profile: $AWS_PROFILE"

# Export AWS profile
export AWS_PROFILE=$AWS_PROFILE

# Initialize Terraform
cd "$TERRAFORM_DIR"
echo "🔧 Initializing Terraform..."
terraform init

# Create terraform.tfvars
cat > terraform.tfvars <<EOF
environment = "$ENVIRONMENT"
aws_region  = "eu-west-1"
github_org  = "$GITHUB_ORG"
EOF

# Plan Terraform
echo "📝 Planning Terraform changes..."
terraform plan -out=tfplan

# Apply Terraform
read -p "Do you want to apply these changes? (yes/no): " CONFIRM
if [ "$CONFIRM" == "yes" ]; then
    echo "🏗️ Applying Terraform..."
    terraform apply tfplan
    
    # Get outputs
    echo ""
    echo "✅ AWS resources created successfully!"
    echo ""
    echo "📌 Important outputs:"
    echo "GitHub Actions Role ARN: $(terraform output -raw github_actions_role_arn)"
    echo "ECR Registry: $(terraform output -raw ecr_registry)"
    echo ""
    echo "🔐 Next steps:"
    echo "1. Add the GitHub Actions Role ARN to your repository secrets:"
    echo "   - Name: AWS_${ENVIRONMENT^^}_ROLE_ARN"
    echo "   - Value: $(terraform output -raw github_actions_role_arn)"
    echo ""
    echo "2. Create secrets in AWS Secrets Manager:"
    echo "   aws secretsmanager create-secret --name /handit/api --secret-string '{...}'"
    echo "   aws secretsmanager create-secret --name /handit/database/postgres --secret-string '{...}'"
    echo "   aws secretsmanager create-secret --name /handit/database/redis --secret-string '{...}'"
else
    echo "❌ Terraform apply cancelled"
    rm -f tfplan
fi