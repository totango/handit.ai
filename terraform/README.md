# Handit.ai Terraform Module

This module can be referenced from the leviosa-backend Terraform configuration.

## Usage from leviosa-backend

In your leviosa-backend `terraform/main.tf`:

```hcl
module "handit_deployment" {
  source = "git::https://github.com/your-org/handit.ai.git//terraform?ref=main"
  
  environment         = var.environment
  eks_cluster_name   = module.eks.cluster_name
  ecr_registry       = module.ecr.registry_url
  namespace          = "handit"
  
  # Database configuration
  postgres_host      = module.rds.endpoint
  redis_host         = module.elasticache.endpoint
  
  # Image tags
  api_image_tag      = var.handit_api_tag
  dashboard_image_tag = var.handit_dashboard_tag
}
```

## GitHub Actions in handit.ai repo

The handit.ai repository would handle its own CI/CD:
1. Build and push images to ECR
2. Trigger leviosa-backend Terraform to update deployments