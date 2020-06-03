output "endpoint" {
  value = "${aws_eks_cluster.medecc.endpoint}"
}

output "cluster_name" {
  value = "${aws_eks_cluster.medecc.id}"
}


# output "kubeconfig-certificate-authority-data" {
#   value = "${aws_eks_cluster.medec.certificate_authority.0.data}"
# }