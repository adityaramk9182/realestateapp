#Creates an IAM role named eks-cluster-role
resource "aws_iam_role" "eks_cluster_role" { 
    name = "eks_cluster_role"

    #Grants AWS EKS service permission to assume this role
    assume_role_policy = jsonencode({  
    Statement = [{
      Effect = "Allow"
      Principal = { Service = "eks.amazonaws.com" }
      Action = "sts:AssumeRole"
    }]
  })
}

#Attaches AmazonEKSClusterPolicy, which allows EKS to manage resources
resource "aws_iam_policy_attachment" "ekas_cluster_policy" {
    name = "eks-cluster-policy-attachment"
    roles = [aws_iam_role.eks_cluster_role.name]
    policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy" 
}

#Creates an IAM role named eks-node-role
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

resource "aws_iam_policy_attachment" "eks_node_policy" {
  name       = "eks-node-policy-attachment"
  roles      = [aws_iam_role.eks_node_role.name]
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
}

#Attaches AmazonEC2ContainerRegistryReadOnly, which lets worker nodes pull container images from Amazon ECR
resource "aws_iam_policy_attachment" "eks_ecr_policy" {
  name       = "eks-ecr-policy-attachment"
  roles      = [aws_iam_role.eks_node_role.name]
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}

#Creates an IAM role named eks-ingress-role
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

#Attaches AWSLoadBalancerControllerIAMPolicy, which lets AWS manage the ALB for EKS
resource "aws_iam_policy_attachment" "eks_ingress_policy" {
  name       = "eks-ingress-policy-attachment"
  roles      = [aws_iam_role.eks_ingress_role.name]
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLoadBalancerControllerIAMPolicy"
}
