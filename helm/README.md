# Handit.ai Helm Charts

This directory contains Helm charts for deploying Handit.ai on Kubernetes.

## Prerequisites

- Kubernetes 1.23+
- Helm 3.8+
- AWS ALB Ingress Controller (for ingress)
- External Secrets Operator (for secrets management)
- PostgreSQL database (RDS or self-hosted)
- Redis instance (ElastiCache or self-hosted)

## Structure

```
helm/
└── handit-ai/              # Main umbrella chart
    ├── Chart.yaml
    ├── values.yaml         # Default values
    ├── values-dev.yaml     # Development environment values
    ├── values-prod.yaml    # Production environment values
    └── charts/             # Sub-charts
        ├── handit-api/     # API service
        ├── handit-dashboard/ # Next.js frontend
        └── handit-worker/  # Background worker
```

## Installation

### 1. Configure Environment Values

Update the environment-specific values files:
- `values-dev.yaml` for development
- `values-prod.yaml` for production

Key configurations to update:
- Container registry URL
- Database endpoints
- Redis endpoints
- Certificate ARNs
- Domain names

### 2. Create Kubernetes Secrets

Using AWS Secrets Manager with External Secrets Operator:

```bash
# Create secrets in AWS Secrets Manager
aws secretsmanager create-secret --name /handit/api \
  --secret-string '{
    "JWT_SECRET": "your-jwt-secret",
    "SESSION_SECRET": "your-session-secret",
    "SENDGRID_API_KEY": "your-sendgrid-key",
    "OPENAI_API_KEY": "your-openai-key"
  }'

aws secretsmanager create-secret --name /handit/database/postgres \
  --secret-string '{
    "username": "handit_user",
    "password": "secure-password"
  }'

aws secretsmanager create-secret --name /handit/database/redis \
  --secret-string '{
    "password": "redis-password"
  }'
```

### 3. Deploy to Kubernetes

```bash
# Add the helm repository (if using a registry)
# helm repo add handit https://charts.handit.ai

# Install in development
helm install handit-dev ./handit-ai \
  -f ./handit-ai/values-dev.yaml \
  --namespace handit-dev \
  --create-namespace

# Install in production
helm install handit-prod ./handit-ai \
  -f ./handit-ai/values-prod.yaml \
  --namespace handit-prod \
  --create-namespace
```

### 4. Verify Deployment

```bash
# Check pod status
kubectl get pods -n handit-dev

# Check ingress
kubectl get ingress -n handit-dev

# View logs
kubectl logs -n handit-dev -l app.kubernetes.io/name=handit-api
```

## Configuration

### Global Values

| Parameter | Description | Default |
|-----------|-------------|---------|
| `global.environment` | Environment name (dev/prod) | `dev` |
| `global.imageRegistry` | Container registry URL | `""` |
| `global.postgresql.host` | PostgreSQL host | `""` |
| `global.redis.host` | Redis host | `""` |

### API Configuration

| Parameter | Description | Default |
|-----------|-------------|---------|
| `handit-api.replicaCount` | Number of API replicas | `2` |
| `handit-api.image.tag` | API image tag | `latest` |
| `handit-api.resources.requests.cpu` | CPU request | `200m` |
| `handit-api.resources.requests.memory` | Memory request | `512Mi` |

### Dashboard Configuration

| Parameter | Description | Default |
|-----------|-------------|---------|
| `handit-dashboard.replicaCount` | Number of dashboard replicas | `2` |
| `handit-dashboard.image.tag` | Dashboard image tag | `latest` |
| `handit-dashboard.env` | Environment variables | `[]` |

### Ingress Configuration

| Parameter | Description | Default |
|-----------|-------------|---------|
| `ingress.enabled` | Enable ingress | `true` |
| `ingress.className` | Ingress class | `alb` |
| `ingress.hosts` | Ingress hosts configuration | See values.yaml |

## Integration with Leviosa

The Helm charts are designed to deploy alongside your existing Leviosa services:

1. **Shared ALB**: Uses the same Application Load Balancer via `alb.ingress.kubernetes.io/group.name`
2. **Namespace**: Can deploy in the same namespace or separate namespaces
3. **Service Discovery**: Services can communicate using Kubernetes DNS
4. **Network Policies**: Add network policies if needed for service-to-service communication

### Example: Connecting Leviosa to Handit.ai

If Leviosa services need to call Handit.ai APIs:

```yaml
# In your Leviosa service configuration
env:
  - name: HANDIT_API_URL
    value: "http://handit-dev-handit-api:8080"  # Using Kubernetes service discovery
```

## Upgrading

```bash
# Upgrade with new values
helm upgrade handit-dev ./handit-ai \
  -f ./handit-ai/values-dev.yaml \
  --namespace handit-dev

# Rollback if needed
helm rollback handit-dev 1 --namespace handit-dev
```

## Uninstalling

```bash
helm uninstall handit-dev --namespace handit-dev
```

## Troubleshooting

### Common Issues

1. **Pods not starting**: Check secrets are properly configured
   ```bash
   kubectl describe pod -n handit-dev <pod-name>
   ```

2. **Ingress not working**: Verify ALB controller and certificate ARN
   ```bash
   kubectl describe ingress -n handit-dev
   ```

3. **Database connection issues**: Check security groups and database credentials
   ```bash
   kubectl logs -n handit-dev -l app.kubernetes.io/name=handit-api
   ```

## CI/CD Integration

### GitHub Actions Example

```yaml
- name: Deploy to Kubernetes
  run: |
    helm upgrade --install handit-${{ env.ENVIRONMENT }} ./helm/handit-ai \
      -f ./helm/handit-ai/values-${{ env.ENVIRONMENT }}.yaml \
      --namespace handit-${{ env.ENVIRONMENT }} \
      --create-namespace \
      --set handit-api.image.tag=${{ github.sha }} \
      --set handit-dashboard.image.tag=${{ github.sha }}
```