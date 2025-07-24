#!/bin/bash
# Terraform authentication script - MFA only, no role assumptions
# Usage: . ./terraform-auth.sh <MFA_TOKEN>

MFA_TOKEN=$1

if [ -z "$MFA_TOKEN" ]; then
    echo "Usage: . ./terraform-auth.sh <MFA_TOKEN>"
    echo "Get your MFA token from your authenticator app"
    return 1
fi

echo "Setting up Terraform authentication..."

# IMPORTANT: Clear ALL existing credentials and profiles
unset AWS_ACCESS_KEY_ID
unset AWS_SECRET_ACCESS_KEY
unset AWS_SESSION_TOKEN
unset AWS_PROFILE
unset AWS_DEFAULT_PROFILE
unset AWS_REGION

# Check if we're already in an assumed role
CURRENT_IDENTITY=$(aws sts get-caller-identity 2>/dev/null || echo "{}")
if echo "$CURRENT_IDENTITY" | grep -q "assumed-role"; then
    echo "⚠️  WARNING: You are currently authenticated as an assumed role:"
    echo "$CURRENT_IDENTITY" | jq -r '.Arn'
    echo ""
    echo "This will prevent Terraform from assuming the necessary roles."
    echo "Please start a new terminal session and run this script again."
    return 1
fi

# Check if default profile has credentials configured
if ! aws configure list --profile default | grep -q access_key; then
    echo "❌ No base AWS credentials found in [default] profile"
    echo ""
    echo "You need to configure your base IAM user credentials:"
    echo "  aws configure --profile default"
    echo ""
    echo "Or manually add to ~/.aws/credentials:"
    echo "  [default]"
    echo "  aws_access_key_id = YOUR_ACCESS_KEY"
    echo "  aws_secret_access_key = YOUR_SECRET_KEY"
    echo ""
    return 1
fi

# Get MFA session token using base credentials
echo "Authenticating with MFA..."
MFA_CREDS=$(aws sts get-session-token \
    --serial-number arn:aws:iam::464800036708:mfa/jacob \
    --token-code $MFA_TOKEN \
    --duration-seconds 43200 \
    --profile default 2>/dev/null)

if [ $? -ne 0 ]; then
    echo "Failed to get MFA session token"
    echo "Possible issues:"
    echo "  - Invalid MFA token"
    echo "  - Base credentials expired or invalid"
    echo "  - MFA serial number incorrect"
    return 1
fi

# Export MFA credentials directly - Terraform will handle role assumptions
export AWS_ACCESS_KEY_ID=$(echo $MFA_CREDS | jq -r '.Credentials.AccessKeyId')
export AWS_SECRET_ACCESS_KEY=$(echo $MFA_CREDS | jq -r '.Credentials.SecretAccessKey')
export AWS_SESSION_TOKEN=$(echo $MFA_CREDS | jq -r '.Credentials.SessionToken')
export AWS_REGION=us-east-1

# Verify we're using MFA session (not assumed role)
VERIFY_IDENTITY=$(aws sts get-caller-identity)
echo "✓ Authenticated as: $(echo $VERIFY_IDENTITY | jq -r '.Arn')"

echo "✓ MFA authentication successful!"
echo "✓ Session expires at: $(echo $MFA_CREDS | jq -r '.Credentials.Expiration')"
echo ""
echo "Terraform will handle role assumptions:"
echo "  - Backend: arn:aws:iam::185586169836:role/Devops (for state)"
echo "  - Workspace: arn:aws:iam::904233102192:role/Devops (for resources)"
echo ""
echo "Next steps:"
echo "  1. terraform init -reconfigure"
echo "  2. terraform workspace select leviosa-prod"
echo "  3. terraform plan"