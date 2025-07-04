#!/bin/bash

# Build and push Docker image to ECR
# Usage: ./build-and-push.sh [profile] [region]

set -e

PROFILE=${1:-default}
REGION=${2:-ap-southeast-2}
STACK_NAME="rustic-roots-ecs"

echo "🐳 Building and pushing Docker image to ECR"
echo "Profile: $PROFILE"
echo "Region: $REGION"
echo ""

# Get ECR repository URI from CloudFormation
ECR_URI=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --query 'Stacks[0].Outputs[?OutputKey==`ECRRepositoryURI`].OutputValue' \
    --output text \
    --profile $PROFILE \
    --region $REGION)

if [ -z "$ECR_URI" ]; then
    echo "❌ Could not find ECR repository URI. Make sure infrastructure is deployed."
    exit 1
fi

echo "📦 ECR Repository: $ECR_URI"

# Get ECR login token
echo "🔐 Logging into ECR..."
aws ecr get-login-password --region $REGION --profile $PROFILE | \
    docker login --username AWS --password-stdin $ECR_URI

# Build Docker image
echo "🔨 Building Docker image..."
cd ../..
docker build -f Dockerfile.prod -t rustic-roots:latest .

# Tag for ECR
echo "🏷️  Tagging image for ECR..."
docker tag rustic-roots:latest $ECR_URI:latest
docker tag rustic-roots:latest $ECR_URI:$(date +%Y%m%d-%H%M%S)

# Push to ECR
echo "📤 Pushing image to ECR..."
docker push $ECR_URI:latest
docker push $ECR_URI:$(date +%Y%m%d-%H%M%S)

echo "✅ Docker image pushed successfully!"
echo "📦 Image URI: $ECR_URI:latest"