resource "aws_security_group" "eks_cluster" {
    name   = "eks-cluster-sg"
    vpc_id = module.vpc.vpc_id
  
    ingress {
      from_port   = 443
      to_port     = 443
      protocol    = "tcp"
      cidr_blocks = ["0.0.0.0/0"]  # Allow API access
    }
  }
  
  resource "aws_security_group" "frontend" {
    name   = "frontend-sg"
    vpc_id = module.vpc.vpc_id
  }
  
  resource "aws_security_group" "backend" {
    name   = "backend-sg"
    vpc_id = module.vpc.vpc_id
  }
  
  resource "aws_security_group" "database" {
    name   = "database-sg"
    vpc_id = module.vpc.vpc_id
  }
  
  resource "aws_security_group_rule" "allow_frontend_ingress" {
    security_group_id = aws_security_group.frontend.id
    type              = "ingress"
    from_port        = 80
    to_port          = 443
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]  # Allow internet access
  }
  
  resource "aws_security_group_rule" "allow_backend_from_frontend" {
    security_group_id = aws_security_group.backend.id
    type              = "ingress"
    from_port        = 8080
    to_port          = 8080
    protocol         = "tcp"
    source_security_group_id = aws_security_group.frontend.id  # Allow traffic from frontend only
    #depends_on = [aws_security_group.frontend]
  }
  
  resource "aws_security_group_rule" "allow_database_from_backend" {
    security_group_id = aws_security_group.database.id
    type              = "ingress"
    from_port        = 3306
    to_port          = 3306
    protocol         = "tcp"
    source_security_group_id = aws_security_group.backend.id  # Allow traffic from backend only
    #depends_on = [aws_security_group.backend]
  }

  resource "aws_security_group" "ALB-SG" {
  name        = "ALB-SG"
  description = "Allow port 80 inbound traffic and all outbound traffic"
  vpc_id      = module.vpc.vpc_id

  tags = {
    Name = "ALB-SG"
  }
}
resource "aws_security_group_rule" "allow_port_80_to_ALB" {
  type              = "ingress"
  from_port         = 80
  to_port           = 80
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.ALB-SG.id
}
resource "aws_security_group_rule" "outbound_allow_all" {
  type              = "egress"
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.ALB-SG.id
  from_port         = 0
}
  