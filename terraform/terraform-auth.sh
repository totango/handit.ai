#!/bin/bash
# Terraform MFA Authentication Script for Handit.ai
# Based on repo-intelligence authentication pattern

set -e

# Configuration
DEFAULT_PROFILE="default"
MFA_DEVICE_ARN="arn:aws:iam::464800036708:mfa/$(aws sts get-caller-identity --profile $DEFAULT_PROFILE --query 'Arn' --output text | cut -d'/' -f2 | cut -d':' -f1)"
SESSION_DURATION=43200  # 12 hours

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔐 Terraform MFA Authentication for Handit.ai"
echo "==========================================="

# Check if MFA token was provided
if [ -z "$1" ]; then
    echo -e "${RED}Error: MFA token required${NC}"
    echo "Usage: . ./terraform-auth.sh YOUR_MFA_TOKEN"
    echo "Note: Source this script with '.' or 'source'"
    return 1 2>/dev/null || exit 1
fi

MFA_TOKEN=$1

# Check if script is being sourced
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    echo -e "${RED}Error: This script must be sourced${NC}"
    echo "Usage: . ./terraform-auth.sh YOUR_MFA_TOKEN"
    exit 1
fi

echo "Getting MFA device ARN..."
echo "MFA Device: $MFA_DEVICE_ARN"

# Get temporary credentials
echo "Requesting temporary credentials..."
TEMP_CREDS=$(aws sts get-session-token \
    --serial-number "$MFA_DEVICE_ARN" \
    --token-code "$MFA_TOKEN" \
    --duration-seconds $SESSION_DURATION \
    --profile $DEFAULT_PROFILE \
    --output json 2>&1) || {
    echo -e "${RED}Failed to get session token. Please check your MFA token.${NC}"
    return 1
}

# Extract credentials
export AWS_ACCESS_KEY_ID=$(echo "$TEMP_CREDS" | jq -r '.Credentials.AccessKeyId')
export AWS_SECRET_ACCESS_KEY=$(echo "$TEMP_CREDS" | jq -r '.Credentials.SecretAccessKey')
export AWS_SESSION_TOKEN=$(echo "$TEMP_CREDS" | jq -r '.Credentials.SessionToken')

# Validate credentials were set
if [ -z "$AWS_ACCESS_KEY_ID" ] || [ -z "$AWS_SECRET_ACCESS_KEY" ] || [ -z "$AWS_SESSION_TOKEN" ]; then
    echo -e "${RED}Failed to extract credentials from AWS response${NC}"
    return 1
fi

# Test authentication
echo "Testing authentication..."
CALLER_IDENTITY=$(aws sts get-caller-identity --output json 2>&1) || {
    echo -e "${RED}Authentication test failed${NC}"
    return 1
}

echo -e "${GREEN}✅ Authentication successful!${NC}"
echo "Authenticated as: $(echo "$CALLER_IDENTITY" | jq -r '.Arn')"
echo "Session expires: $(echo "$TEMP_CREDS" | jq -r '.Credentials.Expiration')"

echo ""
echo -e "${YELLOW}Terraform can now assume role in production account:${NC}"
echo "  - Prod: arn:aws:iam::904233102192:role/Devops"
echo ""
echo -e "${GREEN}You can now run terraform commands!${NC}"
echo "Example:"
echo "  terraform workspace select handit-prod"
echo "  terraform plan"
echo "  terraform apply"