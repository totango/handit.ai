terraform {
  required_version = ">= 1.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  backend "s3" {
    bucket = "leviosa-terraform-state"
    key    = "handit/setup/terraform.tfstate"
    region = "eu-west-1"
  }
}

provider "aws" {
  region = var.aws_region
}

# ECR Repositories
resource "aws_ecr_repository" "handit_api" {
  name                 = "handit-api"
  image_tag_mutability = "MUTABLE"
  
  image_scanning_configuration {
    scan_on_push = true
  }
  
  lifecycle_policy {
    policy = jsonencode({
      rules = [{
        rulePriority = 1
        description  = "Keep last 10 images"
        selection = {
          tagStatus     = "tagged"
          tagPrefixList = ["v"]
          countType     = "imageCountMoreThan"
          countNumber   = 10
        }
        action = {
          type = "expire"
        }
      }]
    })
  }
  
  tags = {
    Name        = "handit-api"
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}

resource "aws_ecr_repository" "handit_dashboard" {
  name                 = "handit-dashboard"
  image_tag_mutability = "MUTABLE"
  
  image_scanning_configuration {
    scan_on_push = true
  }
  
  lifecycle_policy {
    policy = jsonencode({
      rules = [{
        rulePriority = 1
        description  = "Keep last 10 images"
        selection = {
          tagStatus     = "tagged"
          tagPrefixList = ["v"]
          countType     = "imageCountMoreThan"
          countNumber   = 10
        }
        action = {
          type = "expire"
        }
      }]
    })
  }
  
  tags = {
    Name        = "handit-dashboard"
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}

# IAM Role for GitHub Actions
resource "aws_iam_role" "github_actions" {
  name = "github-actions-handit-${var.environment}"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:oidc-provider/token.actions.githubusercontent.com"
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringLike = {
            "token.actions.githubusercontent.com:sub" = "repo:${var.github_org}/handit.ai:*"
          }
          StringEquals = {
            "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
          }
        }
      }
    ]
  })
  
  tags = {
    Name        = "github-actions-handit-${var.environment}"
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}

# IAM Policy for GitHub Actions
resource "aws_iam_role_policy" "github_actions" {
  name = "github-actions-handit-policy"
  role = aws_iam_role.github_actions.id
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:PutImage",
          "ecr:InitiateLayerUpload",
          "ecr:UploadLayerPart",
          "ecr:CompleteLayerUpload",
          "ecr:ListImages",
          "ecr:DescribeImages"
        ]
        Resource = [
          aws_ecr_repository.handit_api.arn,
          aws_ecr_repository.handit_dashboard.arn
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "ecr:GetAuthorizationToken"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "eks:DescribeCluster",
          "eks:ListClusters"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "sts:GetCallerIdentity"
        ]
        Resource = "*"
      }
    ]
  })
}

# Kubernetes RBAC for deployment
resource "aws_iam_role" "handit_deployer" {
  name = "handit-deployer-${var.environment}"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          AWS = aws_iam_role.github_actions.arn
        }
        Action = "sts:AssumeRole"
      }
    ]
  })
  
  tags = {
    Name        = "handit-deployer-${var.environment}"
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}

# Store role ARNs in SSM for easy retrieval
resource "aws_ssm_parameter" "github_actions_role_arn" {
  name  = "/handit/${var.environment}/github-actions-role-arn"
  type  = "String"
  value = aws_iam_role.github_actions.arn
  
  tags = {
    Name        = "handit-github-actions-role-arn"
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}

data "aws_caller_identity" "current" {}

output "github_actions_role_arn" {
  value = aws_iam_role.github_actions.arn
  description = "ARN of the GitHub Actions role - add this to GitHub secrets"
}

output "ecr_registry" {
  value = "${data.aws_caller_identity.current.account_id}.dkr.ecr.${var.aws_region}.amazonaws.com"
  description = "ECR registry URL"
}

output "ecr_repository_urls" {
  value = {
    api       = aws_ecr_repository.handit_api.repository_url
    dashboard = aws_ecr_repository.handit_dashboard.repository_url
  }
  description = "ECR repository URLs"
}