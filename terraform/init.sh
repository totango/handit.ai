#!/bin/bash
# Initialize Terraform for Handit.ai

echo "🚀 Initializing Terraform for Handit.ai"
echo "======================================"

# Check if authenticated
if [ -z "$AWS_ACCESS_KEY_ID" ] || [ -z "$AWS_SESSION_TOKEN" ]; then
    echo "❌ Not authenticated. Please run: . ./terraform-auth.sh YOUR_MFA_TOKEN"
    exit 1
fi

echo "✅ AWS credentials found"
echo ""

# Initialize terraform with reconfigure to ensure clean state
echo "📦 Initializing Terraform backend..."
terraform init -reconfigure

# Check if workspace exists
if terraform workspace list | grep -q "handit-prod"; then
    echo "✅ Workspace 'handit-prod' exists"
else
    echo "📝 Creating workspace 'handit-prod'..."
    terraform workspace new handit-prod
fi

# Select workspace
echo "🎯 Selecting workspace 'handit-prod'..."
terraform workspace select handit-prod

echo ""
echo "✅ Terraform initialized successfully!"
echo ""
echo "Next steps:"
echo "  terraform plan    # Review changes"
echo "  terraform apply   # Apply changes"