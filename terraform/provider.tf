provider "aws" {
  region = var.aws_region

  # Dynamic role assumption based on workspace
  dynamic "assume_role" {
    for_each = local.is_root_account ? [] : [1]
    content {
      role_arn = local.role_arn
    }
  }

  default_tags {
    tags = {
      ManagedBy   = "terraform"
      Project     = "handit"
      Environment = local.environment
      Workspace   = terraform.workspace
    }
  }
}

# Local values for role assumption
locals {
  # Check if we're in the root account (where terraform state is stored)
  is_root_account = data.aws_caller_identity.current.account_id == "185586169836"
  
  # Only production environment supported
  environment = "prod"
  
  # Map workspace to account ID and role (only prod supported)
  account_id = {
    "handit-prod" = "904233102192"
  }[terraform.workspace]
  
  role_arn = local.is_root_account ? null : "arn:aws:iam::${local.account_id}:role/Devops"
}

# Get current AWS account info
data "aws_caller_identity" "current" {}