resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  
  tags = {
    Name = "tvcv19-vpc"
  }
}
resource "aws_subnet" "public_a" {
  vpc_id     = "${aws_vpc.main.id}"
  cidr_block = "10.0.0.0/24"
  availability_zone = "us-west-2a"
  tags = {
    Name = "public-a"
    "kubernetes.io/cluster/MedECC" = "shared"
  }
}
resource "aws_subnet" "private_a" {
  vpc_id     = "${aws_vpc.main.id}"
  cidr_block = "10.0.1.0/24"
  availability_zone = "us-west-2a"

  tags = {
    Name = "private-a"
    "kubernetes.io/cluster/MedECC" = "shared"
  }
}
resource "aws_subnet" "private_b" {
  vpc_id     = "${aws_vpc.main.id}"
  cidr_block = "10.0.2.0/24"
  availability_zone = "us-west-2b"

  tags = {
    Name = "private-b"
    "kubernetes.io/cluster/MedECC" = "shared"
  }
}
