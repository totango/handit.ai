provider "aws" {
  region = var.aws_region

  # Always assume role for production workspace
  assume_role {
    role_arn = "arn:aws:iam::904233102192:role/Devops"
  }

  default_tags {
    tags = {
      ManagedBy   = "terraform"
      Project     = "handit"
      Environment = "prod"
      Workspace   = terraform.workspace
    }
  }
}

# Get current AWS account info after provider is configured
data "aws_caller_identity" "current" {}