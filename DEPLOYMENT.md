# Handit.ai Deployment Guide

This guide explains how to deploy Handit.ai to the existing Leviosa EKS clusters.

## Prerequisites

- AWS CLI configured with appropriate profiles
- Terraform installed (v1.0+)
- kubectl installed
- Helm 3.8+ installed
- Access to Leviosa EKS clusters
- GitHub repository access

## Initial Setup (One-time)

### 1. Create ECR Repositories

Create the ECR repositories in both AWS accounts:

```bash
# Development account (537124952465)
aws ecr create-repository --repository-name handit-api --region eu-west-1 --profile leviosa-dev
aws ecr create-repository --repository-name handit-dashboard --region eu-west-1 --profile leviosa-dev

# Production account (904233102192)
aws ecr create-repository --repository-name handit-api --region eu-west-1 --profile leviosa-prod
aws ecr create-repository --repository-name handit-dashboard --region eu-west-1 --profile leviosa-prod
```

### 2. Configure GitHub Secrets

Add these secrets to your GitHub repository (get values from Leviosa team):

1. Go to Settings → Secrets and variables → Actions
2. Add the following secrets:
   - `AWS_ACCOUNT_ID`: 537124952465
   - `AWS_ACCESS_KEY_ID`: (dev access key)
   - `AWS_SECRET_ACCESS_KEY`: (dev secret key)
   - `PROD_AWS_ACCOUNT_ID`: 904233102192
   - `PROD_AWS_ACCESS_KEY_ID`: (prod access key)
   - `PROD_AWS_SECRET_ACCESS_KEY`: (prod secret key)

### 3. Add Environment Variables to Leviosa's External Secrets

Handit.ai uses Leviosa's existing external secrets. Add your environment variables to the shared secret:

```bash
# Get current secret
aws secretsmanager get-secret-value \
  --secret-id external-secrets \
  --region eu-west-1 \
  --profile leviosa-dev \
  --query SecretString \
  --output text | jq . > current-secrets.json

# Edit current-secrets.json and add Handit variables (prefixed with HANDIT_)
# Then update:
aws secretsmanager update-secret \
  --secret-id external-secrets \
  --secret-string file://current-secrets.json \
  --region eu-west-1 \
  --profile leviosa-dev
```

See `SHARED_SECRETS_GUIDE.md` for detailed instructions.

### 4. Update Helm Values

Update the Helm values files with actual endpoints:

1. Edit `helm/handit-ai/values-dev.yaml`:
   - Update PostgreSQL host
   - Update Redis host
   - Update certificate ARN

2. Edit `helm/handit-ai/values-prod.yaml`:
   - Update PostgreSQL host
   - Update Redis host
   - Update certificate ARN

## Deployment

### Automatic Deployment (GitHub Actions)

1. **Deploy to Development** (automatic on push to main):
   ```
   git push origin main
   ```

2. **Deploy to Production** (manual):
   - Go to Actions tab in GitHub
   - Select "Deploy to Leviosa EKS"
   - Click "Run workflow"
   - Select "prod" environment
   - Click "Run workflow"

### Manual Deployment (Local)

1. **Configure kubectl**:
   ```bash
   # Development
   aws eks update-kubeconfig \
     --region eu-west-1 \
     --name leviosa-dev-eks \
     --profile leviosa-dev

   # Production
   aws eks update-kubeconfig \
     --region eu-west-1 \
     --name leviosa-prod-eks \
     --profile leviosa-prod
   ```

2. **Build and Push Docker Images**:
   ```bash
   # Login to ECR
   aws ecr get-login-password --region eu-west-1 --profile leviosa-dev | \
     docker login --username AWS --password-stdin 537124952465.dkr.ecr.eu-west-1.amazonaws.com

   # Build and push API
   docker build -t handit-api:latest ./apps/api
   docker tag handit-api:latest 537124952465.dkr.ecr.eu-west-1.amazonaws.com/handit-api:latest
   docker push 537124952465.dkr.ecr.eu-west-1.amazonaws.com/handit-api:latest

   # Build and push Dashboard
   docker build -t handit-dashboard:latest ./apps/dashboard
   docker tag handit-dashboard:latest 537124952465.dkr.ecr.eu-west-1.amazonaws.com/handit-dashboard:latest
   docker push 537124952465.dkr.ecr.eu-west-1.amazonaws.com/handit-dashboard:latest
   ```

3. **Deploy with Helm**:
   ```bash
   # Development
   helm upgrade --install handit-ai ./helm/handit-ai \
     -f ./helm/handit-ai/values-dev.yaml \
     --namespace handit \
     --create-namespace

   # Production
   helm upgrade --install handit-ai ./helm/handit-ai \
     -f ./helm/handit-ai/values-prod.yaml \
     --namespace handit \
     --create-namespace
   ```

## Verification

1. **Check Pod Status**:
   ```bash
   kubectl get pods -n handit
   kubectl get ingress -n handit
   ```

2. **View Logs**:
   ```bash
   kubectl logs -n handit -l app.kubernetes.io/name=handit-api
   kubectl logs -n handit -l app.kubernetes.io/name=handit-dashboard
   ```

3. **Access the Application**:
   - Development: https://handit.dev-unison.totango.com
   - Production: https://handit.unison.totango.com

## Troubleshooting

### Common Issues

1. **Pods not starting**:
   - Check secrets: `kubectl get secrets -n handit`
   - Check logs: `kubectl describe pod -n handit <pod-name>`

2. **ECR Access Denied**:
   - Verify IAM roles are correctly configured
   - Check ECR repository policies

3. **Ingress not working**:
   - Verify ALB ingress controller is installed
   - Check ingress annotations and certificate ARN

4. **Database connection issues**:
   - Verify security groups allow connections
   - Check database credentials in secrets

## Rollback

To rollback a deployment:

```bash
# List releases
helm list -n handit

# Rollback to previous version
helm rollback handit-ai -n handit

# Rollback to specific version
helm rollback handit-ai 2 -n handit
```

## Monitoring

1. **Application Metrics**:
   - Check CloudWatch for ALB metrics
   - Monitor pod resource usage: `kubectl top pods -n handit`

2. **Logs**:
   - Application logs are sent to CloudWatch Logs
   - Use CloudWatch Insights for log analysis

## CI/CD Pipeline

The GitHub Actions workflow:
1. Builds Docker images for API and Dashboard
2. Pushes images to ECR
3. Deploys to EKS using Helm
4. Tags images with git SHA and environment

### Environment Promotion

1. Changes are automatically deployed to dev on merge to main
2. Production deployments require manual approval
3. Use git tags for production releases:
   ```bash
   git tag -a v1.0.0 -m "Release v1.0.0"
   git push origin v1.0.0
   ```