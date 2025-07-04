#!/bin/bash

# ECS Fargate Deployment Script for Rustic Roots
# Usage: ./deploy-ecs.sh [domain]

set -e

# Configuration
DOMAIN=${1:-therusticroots.com.au}
REGION=${AWS_REGION:-ap-southeast-2}
PROFILE=${AWS_PROFILE:-default}
STACK_NAME="rustic-roots-ecs"
CLUSTER_NAME="rustic-roots-cluster"
SERVICE_NAME="rustic-roots-service"

echo "🚀 Deploying Rustic Roots to ECS Fargate"
echo "================================="
echo "Domain: $DOMAIN"
echo "Region: $REGION"
echo "Profile: $PROFILE"
echo ""

# Verify AWS credentials
echo "🔐 Verifying AWS credentials..."
aws sts get-caller-identity --profile $PROFILE > /dev/null
if [ $? -ne 0 ]; then
    echo "❌ AWS credentials not configured. Run 'aws configure'"
    exit 1
fi

# Check if domain exists in Route 53
echo "🌐 Checking domain configuration..."
HOSTED_ZONE_ID=$(aws route53 list-hosted-zones-by-name \
    --dns-name $DOMAIN \
    --query 'HostedZones[0].Id' \
    --output text \
    --profile $PROFILE 2>/dev/null | sed 's|/hostedzone/||')

if [ "$HOSTED_ZONE_ID" = "None" ] || [ -z "$HOSTED_ZONE_ID" ]; then
    echo "⚠️  Domain $DOMAIN not found in Route 53"
    echo "💡 Creating hosted zone..."
    
    aws route53 create-hosted-zone \
        --name $DOMAIN \
        --caller-reference $(date +%s) \
        --profile $PROFILE
    
    HOSTED_ZONE_ID=$(aws route53 list-hosted-zones-by-name \
        --dns-name $DOMAIN \
        --query 'HostedZones[0].Id' \
        --output text \
        --profile $PROFILE | sed 's|/hostedzone/||')
    
    echo "✅ Hosted zone created: $HOSTED_ZONE_ID"
    echo "📋 Update your domain registrar with these name servers:"
    aws route53 get-hosted-zone \
        --id $HOSTED_ZONE_ID \
        --query 'DelegationSet.NameServers[]' \
        --output table \
        --profile $PROFILE
else
    echo "✅ Domain found in Route 53: $HOSTED_ZONE_ID"
fi

# Request SSL certificate
echo "🔒 Setting up SSL certificate..."
CERT_ARN=$(aws acm list-certificates \
    --query "CertificateSummaryList[?DomainName=='$DOMAIN'].CertificateArn | [0]" \
    --output text \
    --profile $PROFILE)

if [ "$CERT_ARN" = "None" ] || [ -z "$CERT_ARN" ]; then
    echo "📜 Requesting new SSL certificate..."
    CERT_ARN=$(aws acm request-certificate \
        --domain-name $DOMAIN \
        --subject-alternative-names "www.$DOMAIN" \
        --validation-method DNS \
        --query 'CertificateArn' \
        --output text \
        --profile $PROFILE)
    
    echo "✅ Certificate requested: $CERT_ARN"
    echo "⏳ Waiting for DNS validation records..."
    
    # Wait for validation records to be available
    sleep 10
    
    # Get validation records
    aws acm describe-certificate \
        --certificate-arn $CERT_ARN \
        --query 'Certificate.DomainValidationOptions[*].ResourceRecord' \
        --output table \
        --profile $PROFILE
    
    echo "📋 Add these DNS records to validate the certificate"
    echo "💡 Certificate validation may take up to 30 minutes"
else
    echo "✅ SSL certificate found: $CERT_ARN"
fi

# Deploy CloudFormation stack
echo "☁️  Deploying infrastructure..."
aws cloudformation deploy \
    --template-file ecs-infrastructure.yml \
    --stack-name $STACK_NAME \
    --parameter-overrides \
        DomainName=$DOMAIN \
        CertificateArn=$CERT_ARN \
        HostedZoneId=$HOSTED_ZONE_ID \
    --capabilities CAPABILITY_IAM \
    --region $REGION \
    --profile $PROFILE

# Get outputs
echo "📊 Getting deployment information..."
VPC_ID=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --query 'Stacks[0].Outputs[?OutputKey==`VPCId`].OutputValue' \
    --output text \
    --profile $PROFILE)

CLUSTER_ARN=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --query 'Stacks[0].Outputs[?OutputKey==`ClusterArn`].OutputValue' \
    --output text \
    --profile $PROFILE)

LOAD_BALANCER_DNS=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --query 'Stacks[0].Outputs[?OutputKey==`LoadBalancerDNS`].OutputValue' \
    --output text \
    --profile $PROFILE)

# Build and push Docker image to ECR
echo "🐳 Building and pushing Docker image..."
./build-and-push.sh $PROFILE $REGION

# Deploy ECS service
echo "🚀 Deploying ECS service..."
aws ecs create-service \
    --cli-input-json file://ecs-service.json \
    --profile $PROFILE \
    --region $REGION 2>/dev/null || \
aws ecs update-service \
    --cluster $CLUSTER_NAME \
    --service $SERVICE_NAME \
    --force-new-deployment \
    --profile $PROFILE \
    --region $REGION

echo ""
echo "🎉 Deployment completed!"
echo "========================"
echo "VPC ID: $VPC_ID"
echo "Cluster: $CLUSTER_ARN"
echo "Load Balancer: $LOAD_BALANCER_DNS"
echo ""
echo "🌐 Your application will be available at:"
echo "   https://$DOMAIN"
echo "   https://www.$DOMAIN"
echo ""
echo "📋 Next steps:"
echo "1. Wait for certificate validation (up to 30 minutes)"
echo "2. Verify DNS records are correctly configured"
echo "3. Check ECS service status in AWS console"
echo ""
echo "🔗 AWS Console URLs:"
echo "ECS: https://console.aws.amazon.com/ecs/home?region=$REGION#/clusters/$CLUSTER_NAME"
echo "Route 53: https://console.aws.amazon.com/route53/home#hosted-zones:$HOSTED_ZONE_ID"