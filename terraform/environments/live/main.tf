provider "aws" {
  version = "~> 2.0"
  region  = "us-west-2"
}

terraform {
  backend "s3" {
    bucket = "medecc-terraform"
    key    = "states"
    region = "us-west-2"
    dynamodb_table = "medecc-terraform-lock"
  }
}

module "dns" {
  source = "../../modules/dns"
}

module "vpc" {
    source = "../../modules/vpc"
}

module "eks" {
   private_subnets = ["${module.vpc.private_a_id}", "${module.vpc.private_b_id}"]
   public_subnets = ["${module.vpc.public_a_id}"]
   source = "../../modules/eks"
}