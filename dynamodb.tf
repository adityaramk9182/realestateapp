# resource "aws_dynamodb_table" "webapp" {
#   name           = "app-state"
#   read_capacity  = 10
#   write_capacity = 10
#   hash_key       = "firstName"
#   attribute {
#     name = "firstName"
#     type = "S"
#   }
#   tags = {
#     Name = "webapp"
#   }

# }