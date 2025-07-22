terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    # Using the same backend as repo-intelligence
    bucket               = "catalyst-terraform-backend"
    key                  = "handit/terraform.tfstate"
    region               = "us-east-1"
    dynamodb_table       = "catalyst-terraform-backend"
    role_arn             = "arn:aws:iam::185586169836:role/Devops"
    workspace_key_prefix = "handit"
  }
}