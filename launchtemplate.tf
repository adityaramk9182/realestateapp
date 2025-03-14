resource "aws_launch_template" "ecommerce-launch-template" {
  name_prefix   = "ecommerce-launch-template"
  image_id      = "ami-04b4f1a9cf54c11d0"
  instance_type = "t3.small"

  tag_specifications {
    resource_type = "instance"
    tags = {
      Name = "ecommerce"
    }
  }
}