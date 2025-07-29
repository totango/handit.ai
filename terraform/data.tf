# Data source for EKS cluster
data "aws_eks_cluster" "cluster" {
  name = "leviosa-prod-eks"
}