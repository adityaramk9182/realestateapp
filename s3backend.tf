terraform {
  backend "s3" {
    bucket         = "adityas3-k"
    key            = "appterraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    #dynamodb_table = "app-state"
  }
}
