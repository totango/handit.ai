# Shared Helm Charts Repository Setup

Create a separate repository for all your Helm charts that can deploy multiple applications.

## Structure
```
totango-helm-charts/
├── charts/
│   ├── leviosa-express/
│   ├── handit-ai/
│   └── temporal/
└── .github/
    └── workflows/
        └── deploy-all.yml
```

## Benefits
1. Single place for all Helm configurations
2. Can reference multiple application repositories
3. Centralized deployment workflows
4. Easier to manage shared resources (ingress, secrets)

## Deployment Workflow

```yaml
name: Deploy Applications
on:
  workflow_dispatch:
    inputs:
      application:
        description: 'Application to deploy'
        required: true
        type: choice
        options:
          - leviosa
          - handit
          - all
      environment:
        description: 'Environment'
        required: true
        type: choice
        options:
          - dev
          - prod

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Get application versions
        run: |
          # Fetch latest tags from application repos
          HANDIT_TAG=$(curl -s https://api.github.com/repos/your-org/handit.ai/releases/latest | jq -r .tag_name)
          LEVIOSA_TAG=$(curl -s https://api.github.com/repos/your-org/leviosa-backend/releases/latest | jq -r .tag_name)
          
          echo "HANDIT_TAG=$HANDIT_TAG" >> $GITHUB_ENV
          echo "LEVIOSA_TAG=$LEVIOSA_TAG" >> $GITHUB_ENV
      
      - name: Deploy to EKS
        # Deploy with specific versions
```