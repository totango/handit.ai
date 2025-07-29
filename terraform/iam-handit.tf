# IAM role for handit namespace service account
data "aws_iam_openid_connect_provider" "eks" {
  url = data.aws_eks_cluster.cluster.identity[0].oidc[0].issuer
}

resource "aws_iam_role" "handit_sa_role" {
  name = "leviosa-prod-eks-handit-sa-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = data.aws_iam_openid_connect_provider.eks.arn
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "${replace(data.aws_eks_cluster.cluster.identity[0].oidc[0].issuer, "https://", "")}:sub" = "system:serviceaccount:handit:handit-sa"
            "${replace(data.aws_eks_cluster.cluster.identity[0].oidc[0].issuer, "https://", "")}:aud" = "sts.amazonaws.com"
          }
        }
      }
    ]
  })

  tags = {
    Name        = "handit-sa-role"
    Environment = "prod"
    ManagedBy   = "terraform"
  }
}

# Attach policy to access Secrets Manager
resource "aws_iam_role_policy" "handit_secrets_policy" {
  name = "handit-secrets-policy"
  role = aws_iam_role.handit_sa_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue",
          "secretsmanager:DescribeSecret"
        ]
        Resource = [
          "arn:aws:secretsmanager:eu-west-1:904233102192:secret:leviosa-express*",
          "arn:aws:secretsmanager:eu-west-1:904233102192:secret:external-secrets*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "kms:Decrypt",
          "kms:DescribeKey"
        ]
        Resource = "*"
      }
    ]
  })
}

# Add ECR permissions for pulling images
resource "aws_iam_role_policy" "handit_ecr_policy" {
  name = "handit-ecr-policy"  
  role = aws_iam_role.handit_sa_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage"
        ]
        Resource = "*"
      }
    ]
  })
}

# Output the role ARN
output "handit_sa_role_arn" {
  value = aws_iam_role.handit_sa_role.arn
}