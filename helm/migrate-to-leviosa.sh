#!/bin/bash
# Script to migrate Handit.ai Helm charts to leviosa-backend repository

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
HANDIT_HELM_DIR="${SCRIPT_DIR}/handit-ai"
LEVIOSA_HELM_DIR="/Users/jacob_1/totango/leviosa-backend/helm"

echo "🚀 Migrating Handit.ai Helm charts to leviosa-backend..."

# Check if leviosa-backend directory exists
if [ ! -d "$LEVIOSA_HELM_DIR" ]; then
    echo "❌ Error: leviosa-backend helm directory not found at $LEVIOSA_HELM_DIR"
    exit 1
fi

# Check if handit-ai helm chart exists
if [ ! -d "$HANDIT_HELM_DIR" ]; then
    echo "❌ Error: handit-ai helm chart not found at $HANDIT_HELM_DIR"
    exit 1
fi

# Backup existing handit-ai directory if it exists in leviosa
if [ -d "$LEVIOSA_HELM_DIR/handit-ai" ]; then
    echo "📦 Backing up existing handit-ai directory..."
    mv "$LEVIOSA_HELM_DIR/handit-ai" "$LEVIOSA_HELM_DIR/handit-ai.backup.$(date +%Y%m%d%H%M%S)"
fi

# Copy handit-ai helm chart to leviosa-backend
echo "📋 Copying handit-ai helm chart to leviosa-backend..."
cp -r "$HANDIT_HELM_DIR" "$LEVIOSA_HELM_DIR/"

echo "✅ Migration complete!"
echo ""
echo "Next steps:"
echo "1. cd /Users/jacob_1/totango/leviosa-backend"
echo "2. Review and update the values files in helm/handit-ai/"
echo "3. Create GitHub Actions workflow for Handit.ai deployment"
echo "4. Update ECR repository names and RDS/Redis endpoints"
echo "5. Commit and push the changes"
echo ""
echo "To deploy locally:"
echo "  aws eks update-kubeconfig --region eu-west-1 --name leviosa-dev-eks --profile leviosa-dev"
echo "  helm upgrade --install handit-ai ./helm/handit-ai -f ./helm/handit-ai/values-dev.yaml --namespace leviosa"