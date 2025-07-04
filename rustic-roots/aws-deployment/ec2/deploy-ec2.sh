#!/bin/bash

# EC2 Deployment Script for Rustic Roots
# Usage: ./deploy-ec2.sh [domain]

set -e

DOMAIN=${1:-therusticroots.com.au}
REGION=${AWS_REGION:-ap-southeast-2}
PROFILE=${AWS_PROFILE:-default}
STACK_NAME="rustic-roots-ec2"
INSTANCE_TYPE="t3.small"
KEY_NAME="rustic-roots-key"

echo "🚀 Deploying Rustic Roots to EC2"
echo "==============================="
echo "Domain: $DOMAIN"
echo "Region: $REGION"
echo "Instance Type: $INSTANCE_TYPE"
echo ""

# Check if key pair exists
echo "🔑 Checking SSH key pair..."
aws ec2 describe-key-pairs --key-names $KEY_NAME --profile $PROFILE --region $REGION >/dev/null 2>&1 || {
    echo "📋 Creating SSH key pair..."
    aws ec2 create-key-pair \
        --key-name $KEY_NAME \
        --query 'KeyMaterial' \
        --output text \
        --profile $PROFILE \
        --region $REGION > ${KEY_NAME}.pem
    
    chmod 400 ${KEY_NAME}.pem
    echo "✅ SSH key saved as ${KEY_NAME}.pem"
}

# Get latest Amazon Linux 2 AMI
echo "🖥️  Getting latest Amazon Linux 2 AMI..."
AMI_ID=$(aws ec2 describe-images \
    --owners amazon \
    --filters \
        "Name=name,Values=amzn2-ami-hvm-*-x86_64-gp2" \
        "Name=state,Values=available" \
    --query 'Images | sort_by(@, &CreationDate) | [-1].ImageId' \
    --output text \
    --profile $PROFILE \
    --region $REGION)

echo "📦 Using AMI: $AMI_ID"

# Deploy CloudFormation stack
echo "☁️  Deploying EC2 infrastructure..."
aws cloudformation deploy \
    --template-file ec2-infrastructure.yml \
    --stack-name $STACK_NAME \
    --parameter-overrides \
        DomainName=$DOMAIN \
        KeyName=$KEY_NAME \
        AmiId=$AMI_ID \
        InstanceType=$INSTANCE_TYPE \
    --capabilities CAPABILITY_IAM \
    --region $REGION \
    --profile $PROFILE

# Get instance details
echo "📊 Getting instance information..."
INSTANCE_ID=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --query 'Stacks[0].Outputs[?OutputKey==`InstanceId`].OutputValue' \
    --output text \
    --profile $PROFILE \
    --region $REGION)

PUBLIC_IP=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --query 'Stacks[0].Outputs[?OutputKey==`PublicIP`].OutputValue' \
    --output text \
    --profile $PROFILE \
    --region $REGION)

echo "✅ Instance created: $INSTANCE_ID"
echo "🌐 Public IP: $PUBLIC_IP"

# Wait for instance to be ready
echo "⏳ Waiting for instance to be ready..."
aws ec2 wait instance-running \
    --instance-ids $INSTANCE_ID \
    --profile $PROFILE \
    --region $REGION

# Wait for SSH to be available
echo "🔗 Waiting for SSH connectivity..."
sleep 60

# Deploy application
echo "📦 Deploying application to EC2..."
./deploy-to-instance.sh $PUBLIC_IP $KEY_NAME $DOMAIN

echo ""
echo "🎉 EC2 deployment completed!"
echo "============================"
echo "Instance ID: $INSTANCE_ID"
echo "Public IP: $PUBLIC_IP"
echo "SSH Key: ${KEY_NAME}.pem"
echo ""
echo "🌐 Your application will be available at:"
echo "   https://$DOMAIN"
echo "   http://$PUBLIC_IP (temporary)"
echo ""
echo "🔗 SSH access:"
echo "   ssh -i ${KEY_NAME}.pem ec2-user@$PUBLIC_IP"
echo ""
echo "📋 Next steps:"
echo "1. Update DNS A record: $DOMAIN -> $PUBLIC_IP"
echo "2. Wait for SSL certificate validation"
echo "3. Monitor application logs"