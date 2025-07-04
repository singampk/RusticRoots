#!/bin/bash

# Deployment script for Rustic Roots AWS Infrastructure
# Usage: ./deploy.sh [environment] [db-password]

set -e

# Default values
ENVIRONMENT=${1:-production}
DB_PASSWORD=${2}
REGION=${AWS_REGION:-ap-southeast-2}

# Validate inputs
if [ -z "$DB_PASSWORD" ]; then
    echo "Error: Database password is required"
    echo "Usage: ./deploy.sh [environment] [db-password]"
    exit 1
fi

echo "🚀 Deploying Rustic Roots infrastructure..."
echo "Environment: $ENVIRONMENT"
echo "Region: $REGION"

# Step 1: Deploy RDS Stack
echo "📦 Deploying RDS PostgreSQL stack..."
aws cloudformation deploy \
    --template-file rds-stack.yml \
    --stack-name rustic-roots-rds-$ENVIRONMENT \
    --parameter-overrides \
        Environment=$ENVIRONMENT \
        DBPassword=$DB_PASSWORD \
    --capabilities CAPABILITY_NAMED_IAM \
    --region $REGION \
    --profile singampk

echo "✅ RDS stack deployed successfully"

# Wait for RDS stack to complete
echo "⏳ Waiting for RDS stack to complete..."
aws cloudformation wait stack-create-complete \
    --stack-name rustic-roots-rds-$ENVIRONMENT \
    --region $REGION \
    --profile singampk || \
aws cloudformation wait stack-update-complete \
    --stack-name rustic-roots-rds-$ENVIRONMENT \
    --region $REGION \
    --profile singampk

# Step 2: Deploy Amplify Stack
echo "📱 Deploying Amplify stack..."
aws cloudformation deploy \
    --template-file amplify-stack.yml \
    --stack-name rustic-roots-amplify-$ENVIRONMENT \
    --parameter-overrides \
        Environment=$ENVIRONMENT \
        DatabaseStackName=rustic-roots-rds-$ENVIRONMENT \
    --capabilities CAPABILITY_NAMED_IAM \
    --region $REGION \
    --profile singampk

echo "✅ Amplify stack deployed successfully"

# Get stack outputs
echo "📋 Getting deployment information..."
RDS_ENDPOINT=$(aws cloudformation describe-stacks \
    --stack-name rustic-roots-rds-$ENVIRONMENT \
    --query 'Stacks[0].Outputs[?OutputKey==`DatabaseEndpoint`].OutputValue' \
    --output text \
    --region $REGION \
    --profile singampk)

AMPLIFY_URL=$(aws cloudformation describe-stacks \
    --stack-name rustic-roots-amplify-$ENVIRONMENT \
    --query 'Stacks[0].Outputs[?OutputKey==`AmplifyCustomDomainUrl`].OutputValue' \
    --output text \
    --region $REGION \
    --profile singampk)

AMPLIFY_APP_ID=$(aws cloudformation describe-stacks \
    --stack-name rustic-roots-amplify-$ENVIRONMENT \
    --query 'Stacks[0].Outputs[?OutputKey==`AmplifyAppId`].OutputValue' \
    --output text \
    --region $REGION \
    --profile singampk)

echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "📊 Deployment Information:"
echo "========================="
echo "Environment: $ENVIRONMENT"
echo "Region: $REGION"
echo "Database Endpoint: $RDS_ENDPOINT"
echo "Application URL: $AMPLIFY_URL"
echo "Amplify App ID: $AMPLIFY_APP_ID"
echo ""
echo "📝 Next Steps:"
echo "1. Update your DNS to point therusticroots.com.au to Amplify"
echo "2. Verify SSL certificate in Amplify console"
echo "3. Monitor the first deployment in Amplify console"
echo "4. Test the application functionality"
echo ""
echo "🔗 Useful Links:"
echo "Amplify Console: https://console.aws.amazon.com/amplify/home?region=$REGION#/$AMPLIFY_APP_ID"
echo "RDS Console: https://console.aws.amazon.com/rds/home?region=$REGION"
echo ""