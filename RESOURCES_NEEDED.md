# Resources Needed for Handit.ai Deployment

## ✅ Resources You Can Reuse from Leviosa

### 1. **EKS Clusters** (No new resources needed)
- Development: `leviosa-dev-eks`
- Production: `leviosa-prod-eks`

### 2. **AWS Load Balancer** (No new resources needed)
- ALB shared via ingress group: `leviosa-dev` / `leviosa-prod`
- Certificate already exists on the ALB

### 3. **External Secrets Operator** (No new resources needed)
- Already installed in the clusters
- SecretStore: `aws-secretsmanager-leviosa-dev` / `aws-secretsmanager-leviosa-prod`

### 4. **Monitoring Infrastructure** (No new resources needed)
- CloudWatch Logs
- Prometheus (if installed)
- ALB metrics

### 5. **GitHub Actions Runners** (No new resources needed)
- CodeBuild runners: `codebuild-handit-*`
- Same pattern as Leviosa

## 🆕 Resources That Need to Be Created

### 1. **ECR Repositories** (2 new repositories)
```bash
# In each AWS account (dev/prod):
- handit-api
- handit-dashboard
```

### 2. **Database** (Options)
- **Option A**: Share existing Leviosa PostgreSQL RDS (add new database)
- **Option B**: Create new RDS instance (more isolated but more cost)

### 3. **Redis/Cache** (Options)
- **Option A**: Share existing Leviosa ElastiCache (different key prefix)
- **Option B**: Create new ElastiCache instance (more isolated but more cost)

### 4. **AWS Secrets Manager** (No new secrets needed!)
- Uses Leviosa's existing `external-secrets` entry
- Just add Handit-specific variables with `HANDIT_` prefix
- No additional IAM or infrastructure needed

### 5. **S3 Buckets** (Optional - only if needed)
- For file uploads/storage
- Can potentially share with Leviosa using different prefixes

### 6. **GitHub Secrets** (Need to be added)
```
AWS_ACCOUNT_ID           # 537124952465 (dev)
PROD_AWS_ACCOUNT_ID      # 904233102192 (prod)
AWS_ACCESS_KEY_ID        # For dev deployments
AWS_SECRET_ACCESS_KEY    # For dev deployments
PROD_AWS_ACCESS_KEY_ID   # For prod deployments
PROD_AWS_SECRET_ACCESS_KEY # For prod deployments
```

## 💰 Cost Implications

### Minimal Cost Approach (Recommended)
- Share RDS and ElastiCache with Leviosa
- Only new costs: ECR storage (minimal)
- No additional compute costs (using same EKS nodes)

### Isolated Approach (Higher Cost)
- New RDS instance: ~$50-200/month
- New ElastiCache instance: ~$20-100/month
- Still sharing EKS compute resources

## 🔧 Quick Setup Commands

### 1. Create ECR Repositories (Manual or via Terraform)
```bash
# For dev account
aws ecr create-repository --repository-name handit-api --region eu-west-1
aws ecr create-repository --repository-name handit-dashboard --region eu-west-1
```

### 2. Create Database and User (if sharing RDS)
```sql
-- Connect to Leviosa RDS
CREATE DATABASE handit;
CREATE USER handit_user WITH ENCRYPTED PASSWORD 'secure-password';
GRANT ALL PRIVILEGES ON DATABASE handit TO handit_user;
```

### 3. Create Secrets
```bash
aws secretsmanager create-secret \
  --name /handit/api \
  --secret-string '{"JWT_SECRET":"...", "SESSION_SECRET":"..."}' \
  --region eu-west-1
```

## 📝 Summary

**Total New AWS Resources Needed:**
- 2 ECR repositories
- 3 Secrets Manager entries
- 0-2 databases (depending on sharing strategy)
- 0-1 S3 buckets (optional)

**Everything else is reused from Leviosa infrastructure!**