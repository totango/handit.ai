#!/bin/bash
# Script to migrate terraform state to the correct backend configuration

echo "🔄 Migrating Terraform State"
echo "==========================="

# Check if errored.tfstate exists
if [ -f "errored.tfstate" ]; then
    echo "✅ Found errored.tfstate file"
    
    # Backup the errored state
    echo "📦 Creating backup..."
    cp errored.tfstate errored.tfstate.backup
    
    echo ""
    echo "⚠️  IMPORTANT: The ECR repositories were created successfully!"
    echo "   - handit-api"
    echo "   - handit-dashboard"
    echo ""
    echo "We need to reconfigure the backend to use the correct state path."
    echo ""
else
    echo "ℹ️  No errored.tfstate found. Proceeding with backend reconfiguration."
fi

echo "Steps to fix the state:"
echo ""
echo "1. First, let's reinitialize with the new backend configuration:"
echo "   terraform init -reconfigure -migrate-state"
echo ""
echo "2. If prompted about existing state, choose 'yes' to copy"
echo ""
echo "3. Select the 'leviosa-prod' workspace:"
echo "   terraform workspace select leviosa-prod"
echo ""
echo "4. If you have errored.tfstate, import it:"
echo "   terraform state push errored.tfstate"
echo ""
echo "5. Verify the state:"
echo "   terraform state list"
echo ""
echo "Press Enter to continue with terraform init -reconfigure..."
read

# Reinitialize terraform with new backend
terraform init -reconfigure