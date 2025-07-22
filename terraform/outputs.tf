output "ecr_repository_url_api" {
  description = "URL of the ECR repository for API"
  value       = var.create_ecr_repos ? aws_ecr_repository.handit_api[0].repository_url : "Not created"
}

output "ecr_repository_url_dashboard" {
  description = "URL of the ECR repository for Dashboard"
  value       = var.create_ecr_repos ? aws_ecr_repository.handit_dashboard[0].repository_url : "Not created"
}

output "account_id" {
  description = "AWS Account ID"
  value       = data.aws_caller_identity.current.account_id
}

output "region" {
  description = "AWS Region"
  value       = var.aws_region
}