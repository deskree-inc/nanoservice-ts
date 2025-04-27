provider "aws" {
  region = "us-east-1"
}
resource "aws_instance" "example" {
  ami           = "ami-000c56be82cb62677"
  instance_type = "t2.micro"
}
