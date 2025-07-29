# Quick Start - Deploying Handit.ai to Leviosa EKS

## Prerequisites
- Access to Leviosa AWS accounts (dev: 537124952465, prod: 904233102192)
- AWS CLI configured with leviosa-dev and leviosa-prod profiles

## Step 1: Run Setup Script
```bash
./scripts/setup-aws-resources.sh
```
Select your environment (dev/prod) and enter your GitHub org name.

## Step 2: Add GitHub Secrets
Add the output Role ARN to your GitHub repository secrets:
- `AWS_DEV_ROLE_ARN` for development
- `AWS_PROD_ROLE_ARN` for production

## Step 3: Create AWS Secrets
```bash
# Example for dev environment
aws secretsmanager create-secret \
  --name /handit/api \
  --secret-string '{"JWT_SECRET":"your-secret","SESSION_SECRET":"your-secret","SENDGRID_API_KEY":"your-key","OPENAI_API_KEY":"your-key"}' \
  --region eu-west-1 \
  --profile leviosa-dev
```

## Step 4: Update Helm Values
Edit `helm/handit-ai/values-dev.yaml` and `values-prod.yaml`:
- Replace RDS endpoints
- Replace ElastiCache endpoints
- Replace certificate ARNs

## Step 5: Deploy
Push to main branch for automatic dev deployment:
```bash
git add .
git commit -m "feat: configure handit.ai deployment"
git push origin main
```

For production, use GitHub Actions workflow manually.

## Verify Deployment
```bash
# Configure kubectl
aws eks update-kubeconfig --region eu-west-1 --name leviosa-dev-eks --profile leviosa-dev

# Check pods
kubectl get pods -n handit

# Check ingress
kubectl get ingress -n handit
```

## URLs
- Dev: https://handit.dev-unison.totango.com
- Prod: https://handit.unison.totango.com