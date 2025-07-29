# Handit.ai EKS Integration Guide

This guide explains how to integrate Handit.ai with your existing leviosa-backend EKS infrastructure.

## Recommended Approach: Add to leviosa-backend repository

Since the leviosa-backend repository already has:
- EKS cluster access configured
- GitHub Actions workflows with AWS credentials
- Helm deployment patterns established
- External Secrets Operator configured

The recommended approach is to move the Handit.ai Helm charts to the leviosa-backend repository.

### Steps:

1. **Copy Helm charts to leviosa-backend**:
```bash
# From the handit.ai directory
cp -r helm/handit-ai /Users/jacob_1/totango/leviosa-backend/helm/
```

2. **Update the values files** with correct configurations:
   - Use the same AWS account IDs as leviosa
   - Use the same namespace (`leviosa`) or create a new one
   - Update ECR registry URLs to match your environment

3. **Create a GitHub Actions workflow** in leviosa-backend:

Create `.github/workflows/handit-helm-deploy.yml`:

```yaml
name: Deploy Handit.ai to EKS
on:
  push:
    branches:
      - main
    paths:
      - 'helm/handit-ai/**'
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy to'
        required: true
        default: 'dev'
        type: choice
        options:
          - dev
          - prod

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS credentials for Dev
        if: github.event.inputs.environment == 'dev' || github.ref == 'refs/heads/main'
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::537124952465:role/github-actions-oidc-role
          aws-region: eu-west-1

      - name: Configure AWS credentials for Prod
        if: github.event.inputs.environment == 'prod'
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::904233102192:role/github-actions-oidc-role
          aws-region: eu-west-1

      - name: Deploy Handit.ai Helm chart
        uses: bitovi/github-actions-deploy-eks-helm@v1.2.10
        with:
          aws-region: eu-west-1
          cluster-name: ${{ github.event.inputs.environment == 'prod' && 'leviosa-prod-eks' || 'leviosa-dev-eks' }}
          namespace: leviosa
          name: handit-ai
          chart-path: helm/handit-ai
          values: |
            global:
              imageRegistry: ${{ github.event.inputs.environment == 'prod' && '904233102192' || '537124952465' }}.dkr.ecr.eu-west-1.amazonaws.com
          config-files: helm/handit-ai/values-${{ github.event.inputs.environment || 'dev' }}.yaml
```

## Alternative: Deploy from handit.ai repository

If you prefer to keep the repositories separate, you'll need to:

1. **Set up AWS OIDC** for the handit.ai repository
2. **Create GitHub Secrets** with AWS credentials
3. **Configure kubectl access** in the workflow

### GitHub Actions Workflow for Separate Repository:

Create `.github/workflows/deploy-to-eks.yml` in handit.ai:

```yaml
name: Deploy to EKS
on:
  push:
    branches:
      - main
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy to'
        required: true
        default: 'dev'
        type: choice
        options:
          - dev
          - prod

env:
  AWS_REGION: eu-west-1
  ECR_REPOSITORY_API: handit-api
  ECR_REPOSITORY_DASHBOARD: handit-dashboard

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build and push API image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY_API:$IMAGE_TAG ./apps/api
          docker push $ECR_REGISTRY/$ECR_REPOSITORY_API:$IMAGE_TAG

      - name: Build and push Dashboard image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY_DASHBOARD:$IMAGE_TAG ./apps/dashboard
          docker push $ECR_REGISTRY/$ECR_REPOSITORY_DASHBOARD:$IMAGE_TAG

      - name: Update kubeconfig
        run: |
          aws eks update-kubeconfig --region ${{ env.AWS_REGION }} --name leviosa-${{ github.event.inputs.environment || 'dev' }}-eks

      - name: Deploy to EKS
        run: |
          helm upgrade --install handit-ai ./helm/handit-ai \
            -f ./helm/handit-ai/values-${{ github.event.inputs.environment || 'dev' }}.yaml \
            --namespace leviosa \
            --set handit-api.image.tag=${{ github.sha }} \
            --set handit-dashboard.image.tag=${{ github.sha }} \
            --set global.imageRegistry=${{ steps.login-ecr.outputs.registry }}
```

### Required GitHub Secrets:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

## Local Development Deployment

To deploy from your local machine:

1. **Configure AWS profiles** (if not already done):
```bash
aws configure --profile leviosa-dev
aws configure --profile leviosa-prod
```

2. **Update kubeconfig**:
```bash
# For development
aws eks update-kubeconfig --region eu-west-1 --name leviosa-dev-eks --profile leviosa-dev

# For production
aws eks update-kubeconfig --region eu-west-1 --name leviosa-prod-eks --profile leviosa-prod
```

3. **Deploy using Helm**:
```bash
# Development
helm upgrade --install handit-ai ./helm/handit-ai \
  -f ./helm/handit-ai/values-dev.yaml \
  --namespace leviosa \
  --create-namespace

# Production
helm upgrade --install handit-ai ./helm/handit-ai \
  -f ./helm/handit-ai/values-prod.yaml \
  --namespace leviosa
```

## Integration Checklist

- [ ] Update ECR registry URLs in values files
- [ ] Create ECR repositories for handit-api and handit-dashboard
- [ ] Update AWS account IDs in values files
- [ ] Configure External Secrets in AWS Secrets Manager
- [ ] Update ingress hosts to use your domain
- [ ] Set up GitHub Actions workflow
- [ ] Test deployment in development environment
- [ ] Verify service connectivity with leviosa services