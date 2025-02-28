module "vpc" {
  source = "terraform-aws-modules/vpc/aws"

  name = var.vpc_name
  cidr = var.vpc_cidr

  azs             = var.azs
  private_subnets = var.private_subnets
  public_subnets  = var.public_subnets

  enable_nat_gateway = true
  enable_vpn_gateway = true
  enable_dns_hostnames  = true
  enable_dns_support    = true

  tags = {
    Terraform = "true"
    Environment = var.environment
  }
}

module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version         = "~> 19.0"
  cluster_name = var.cluster_name
  cluster_version = var.cluster_version
  subnet_ids = module.vpc.private_subnets
  vpc_id = module.vpc.vpc_id
  
  eks_managed_node_groups = {
    
    frontend = {
    name = var.eks_frontend_nodegrp_name
    desired_capacity = var.frontend_desired
    max_capacity = var.frontend_max
    min_capacity = var.frontend_min
    frontend_instance_type = var.frontend_instance_type
    launch_template = {
      name    = var.launch_template
      version = "$Latest"
    }
    }

    backend = {
    name = var.eks_backend_nodegrp_name
    desired_capacity = var.backend_desired
    max_capacity = var.backend_max
    min_capacity = var.backend_min
    frontend_instance_type = var.backend_instance_type
    launch_template = {
      name    = var.launch_template
      version = "$Latest"
    }
    }

    database = {
    name = var.eks_database_nodegrp_name
    desired_capacity = var.database_desired
    max_capacity = var.database_max
    min_capacity = var.database_min
    frontend_instance_type = var.database_instance_type
    launch_template = {
      name    = var.launch_template
      version = "$Latest"
    }
    }
  }

  tags = {
    Environment = "dev"
    name = "my-cluster"
  }
}

# module "iam_roles" {
#   source = "./modules/iam_roles"
# }

# module "security_groups" {
#   source = "./modules/security_groups"
# }