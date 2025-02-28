variable "vpc_name"{
    type = string
    description = "Name of the VPC"
}

variable "vpc_cidr"{
    type = string
    description = "CIDR block for the VPC"
}

variable "azs"{
    type = list(string)
    description = "List of availability zones"
}

variable "public_subnets"{
    type = list(string)
    description = "List of public subnets"
}

variable "private_subnets"{
    type = list(string)
    description = "List of private subnets"
}

variable "environment" {
    type        = string
    description = "Deployment environment"
  }

  variable "cluster_name" {
    type = string
    description = "give name of cluster"
  }

  variable "cluster_version" {
    type = string
    description = "version"
  }

  variable "launch_template" {
    type = string
    description = "launch template"
  }

  variable "eks_frontend_nodegrp_name" {
    type = string
    description = "Name of fe node grp"
  }

  variable "frontend_desired" {
    type = string
    description = "desired capacity"
  }

  variable "frontend_max" {
    type = string
    description = "maximum capacity"
  }

  variable "frontend_min" {
    type = string
    description = "minimum capacity"
  }

  variable "frontend_instance_type" {
    type = string
    description = "Enter instance type"
  }

  variable "eks_backend_nodegrp_name" {
    type = string
    description = "Name of be node grp"
  }

  variable "backend_desired" {
    type = string
    description = "desired capacity"
  }

  variable "backend_max" {
    type = string
    description = "maximum capacity"
  }

  variable "backend_min" {
    type = string
    description = "minimum capacity"
  }

  variable "backend_instance_type" {
    type = string
    description = "Enter instance type"
  }

  variable "eks_database_nodegrp_name" {
    type = string
    description = "Name of db node grp"
  }

  variable "database_desired" {
    type = string
    description = "desired capacity"
  }

  variable "database_max" {
    type = string
    description = "maximum capacity"
  }

  variable "database_min" {
    type = string
    description = "minimum capacity"
  }

  variable "database_instance_type" {
    type = string
    description = "Enter instance type"
  }


