# Using Leviosa's Shared External Secrets

Handit.ai is configured to use Leviosa's existing External Secrets infrastructure. This means you don't need to create any new secrets infrastructure - just add your environment variables to the existing secret.

## How It Works

1. **Shared Secret**: Both Leviosa and Handit.ai use the same AWS Secrets Manager entry: `external-secrets`
2. **Shared Service Account**: Uses `leviosa-express-sa` which already has permissions
3. **Shared ClusterSecretStore**: Uses Leviosa's existing secret store
4. **Kubernetes Secret**: Both services load from `leviosa-express-secrets`

## Adding Handit.ai Environment Variables

To add Handit.ai specific environment variables to the shared secret:

### 1. Get Current Secret Values

```bash
# Development
aws secretsmanager get-secret-value \
  --secret-id external-secrets \
  --region eu-west-1 \
  --profile leviosa-dev \
  --query SecretString \
  --output text | jq . > current-secrets.json
```

### 2. Add Handit.ai Variables

Edit `current-secrets.json` and add Handit.ai specific variables:

```json
{
  "...existing leviosa variables...": "...",
  
  "HANDIT_DATABASE_URL": "postgres://handit_user:password@<rds-host>:5432/handit",
  "HANDIT_REDIS_URL": "redis://:password@<redis-host>:6379",
  "HANDIT_JWT_SECRET": "your-jwt-secret",
  "HANDIT_SESSION_SECRET": "your-session-secret",
  "HANDIT_SENDGRID_API_KEY": "your-sendgrid-key",
  "HANDIT_OPENAI_API_KEY": "your-openai-key",
  "HANDIT_API_BASE_URL": "https://handit-api.dev-unison.totango.com",
  "HANDIT_CORS_ORIGIN": "https://handit.dev-unison.totango.com"
}
```

### 3. Update the Secret

```bash
# Development
aws secretsmanager update-secret \
  --secret-id external-secrets \
  --secret-string file://current-secrets.json \
  --region eu-west-1 \
  --profile leviosa-dev

# Production (same process with prod profile)
```

### 4. Wait for Refresh

External Secrets Operator refreshes every 15 minutes. To force immediate update:

```bash
# Delete the secret to force recreation
kubectl delete secret leviosa-express-secrets -n leviosa

# Check status
kubectl describe externalsecret leviosa-express-externalsecret -n leviosa
```

## Environment Variable Naming Convention

To avoid conflicts with Leviosa, prefix Handit.ai specific variables with `HANDIT_`:

- ✅ `HANDIT_DATABASE_URL`
- ✅ `HANDIT_JWT_SECRET`
- ❌ `DATABASE_URL` (might conflict with Leviosa)

## Shared Variables

Some variables can be shared between services:
- `NODE_ENV`
- `AWS_REGION`
- `LOG_LEVEL`
- Common AWS service endpoints

## Application Code Updates

Update your application to use the prefixed environment variables:

```javascript
// apps/api/src/app.js
const dbUrl = process.env.HANDIT_DATABASE_URL || process.env.DATABASE_URL;
const redisUrl = process.env.HANDIT_REDIS_URL || process.env.REDIS_URL;
```

## Benefits

1. **No additional infrastructure** - Reuse existing setup
2. **Simplified IAM** - Service account already has permissions
3. **Unified secret management** - One place for all secrets
4. **Cost effective** - No additional AWS resources

## Verification

Check that Handit.ai can access the secrets:

```bash
# Check if secret exists in namespace
kubectl get secret leviosa-express-secrets -n handit

# If using same namespace (leviosa)
kubectl exec -it deployment/handit-ai-handit-api -n leviosa -- env | grep HANDIT_

# View all available environment variables
kubectl exec -it deployment/handit-ai-handit-api -n leviosa -- env | sort
```

## Troubleshooting

### Secret not found
If the secret isn't available in the Handit namespace, you may need to:
1. Deploy Handit.ai in the same namespace as Leviosa (`leviosa`)
2. Or create a secret copy/reference in the Handit namespace

### Permission denied
The service account `leviosa-express-sa` should already have permissions. If not, check:
```bash
kubectl describe sa leviosa-express-sa -n leviosa
```

### Variables not loading
Ensure the pod has restarted after secret updates:
```bash
kubectl rollout restart deployment/handit-ai-handit-api -n leviosa
```