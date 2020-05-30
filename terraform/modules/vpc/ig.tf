resource "aws_internet_gateway" "medecc" {
  vpc_id = "${aws_vpc.main.id}"

  tags = {
    Name = "medecc"
  }
}