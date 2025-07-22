variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "eu-west-1"
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "handit"
}

variable "github_org" {
  description = "GitHub organization name"
  type        = string
  default     = "totango"
}

# Resource configuration variables
variable "create_ecr_repos" {
  description = "Whether to create ECR repositories"
  type        = bool
  default     = true
}

variable "create_github_oidc" {
  description = "Whether to create GitHub OIDC provider and roles"
  type        = bool
  default     = true
}

variable "create_service_accounts" {
  description = "Whether to create service account IAM roles"
  type        = bool
  default     = true
}