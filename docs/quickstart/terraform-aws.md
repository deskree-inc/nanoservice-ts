
# Quick-Start: Provisioning an AWS EC2 Instance with Terraform

This guide walks you through provisioning an AWS EC2 instance using Terraform in the `nanoservice-ts` project.

## Prerequisites
- Node.js (LTS)
- Terraform CLI
- AWS CLI with EC2 permissions

## Step 1: Configure AWS Credentials

Configure your AWS credentials to allow Terraform to interact with your AWS account.

```bash
export AWS_ACCESS_KEY_ID='your-key'
export AWS_SECRET_ACCESS_KEY='your-secret'
export AWS_DEFAULT_REGION='us-east-1'
```

## Step 2: Create Terraform Configuration

Create a file named `main.tf` inside a directory (e.g., `terraform-aws-workflow/`).

```bash
provider "aws" {
  region = "us-east-1"
}

data "aws_ami" "amazon_linux_2023" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-2023.*-x86_64"]
  }

  filter {
    name   = "architecture"
    values = ["x86_64"]
  }
}

resource "aws_instance" "example" {
  ami           = data.aws_ami.amazon_linux_2023.id
  instance_type = "t2.micro"
}
```

## Step 3: Run Terraform

Initialize and apply the Terraform configuration.

```bash
cd terraform-aws-workflow
terraform init
terraform apply
```

## Step 4: Verify the Instance

- Open the AWS Management Console.
- Navigate to **EC2 > Instances**.
- Confirm that a new `t2.micro` instance is running.

## Cleanup

To avoid incurring costs, destroy the resources.

```bash
terraform destroy
```

## Note

The `nanoservice-ts` HTTP trigger workflow (`/terraform-aws-workflow/provision`) is not yet implemented.  
Use the manual Terraform commands above until the workflow becomes available.  
The configuration uses a public Amazon Linux 2023 AMI, dynamically fetched to ensure the latest version.

---

## Verify

```bash
cat docs/quickstart/terraform-aws.md
```
