resource "aws_eks_cluster" "medecc" {
  name     = "MedECC"
  role_arn = "${aws_iam_role.medecc.arn}"

  vpc_config {
    subnet_ids = concat(var.public_subnets, var.private_subnets)
  }

  # Ensure that IAM Role permissions are created before and deleted after EKS Cluster handling.
  # Otherwise, EKS will not be able to properly delete EKS managed EC2 infrastructure such as Security Groups.
  depends_on = [
    "aws_iam_role_policy_attachment.example-AmazonEKSClusterPolicy",
    "aws_iam_role_policy_attachment.example-AmazonEKSServicePolicy",
  ]
}

