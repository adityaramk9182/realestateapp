resource "aws_lb" "webapp-ALB" {
  name               = "webapp-ALB"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.ALB-SG.id]
  subnets            = module.vpc.public_subnets

  tags = {
    application = "webapp"
  }
}

# Create the target group
resource "aws_lb_target_group" "webapp-TG" {
  name        = "webapp-tg"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = module.vpc.vpc_id
  target_type = "instance"
}

# Create the listener
resource "aws_lb_listener" "webapp_listener" {
  load_balancer_arn = aws_lb.webapp-ALB.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.webapp-TG.arn
  }
}

# Create the Auto Scaling group
resource "aws_autoscaling_group" "webapp_asg" {
  name                = "webapp-asg"
  desired_capacity    = 2
  max_size            = 2
  min_size            = 1
  target_group_arns   = [aws_lb_target_group.webapp-TG.arn]
  vpc_zone_identifier = module.vpc.public_subnets

  launch_template {
    id      = aws_launch_template.ecommerce-launch-template.id
    version = "$Latest"
  }
}