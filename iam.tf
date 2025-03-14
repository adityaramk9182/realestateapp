# IAM Role for EKS Cluster
resource "aws_iam_role" "eks_cluster_role" { 
    name = "eks-cluster-role"

    assume_role_policy = jsonencode({  
      Statement = [{
        Effect = "Allow"
        Principal = { Service = "eks.amazonaws.com" }
        Action = "sts:AssumeRole"
      }]
    })
}

resource "aws_iam_role_policy_attachment" "eks_cluster_policy" {
    role       = aws_iam_role.eks_cluster_role.name
    policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy" 
}

# IAM Role for EKS Nodes
resource "aws_iam_role" "eks_node_role" {
  name = "eks-node-role"

  assume_role_policy = jsonencode({
    Statement = [{
      Effect = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
      Action = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "eks_node_policy" {
  role       = aws_iam_role.eks_node_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
}

resource "aws_iam_role_policy_attachment" "eks_ecr_policy" {
  role       = aws_iam_role.eks_node_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}

# IAM Role for Load Balancer Controller
resource "aws_iam_role" "eks_ingress_role" {
  name = "eks-ingress-role"

  assume_role_policy = jsonencode({
    Statement = [{
      Effect = "Allow"
      Principal = { Service = "eks.amazonaws.com" }
      Action = "sts:AssumeRole"
    }]
  })
}

# Load Balancer Controller Policy Fix
resource "aws_iam_policy_attachment" "eks_ingress_policy" {
  name       = "eks-ingress-policy-attachment"
  roles      = [aws_iam_role.eks_ingress_role.name]
  policy_arn = "arn:aws:iam::908027415035:policy/AWSLoadBalancerControllerIAMPolicy"
}