#!/bin/bash

# Manual deployment script for Rustic Roots from local Mac
# Usage: ./manual-deploy.sh [environment]

set -e

# Default values
ENVIRONMENT=${1:-production}
REGION=${AWS_REGION:-ap-southeast-2}

echo "🚀 Manual deployment to Amplify..."
echo "Environment: $ENVIRONMENT"
echo "Region: $REGION"

# Get Amplify App ID from CloudFormation
AMPLIFY_APP_ID=$(aws cloudformation describe-stacks \
    --stack-name rustic-roots-amplify-$ENVIRONMENT \
    --query 'Stacks[0].Outputs[?OutputKey==`AmplifyAppId`].OutputValue' \
    --output text \
    --region $REGION \
    --profile singampk)

if [ -z "$AMPLIFY_APP_ID" ]; then
    echo "❌ Error: Could not find Amplify App ID. Make sure the stack is deployed."
    exit 1
fi

echo "📱 Found Amplify App ID: $AMPLIFY_APP_ID"

# Build the application locally
echo "🔨 Building application locally..."
cd ..
npm ci
npm run build

# Create deployment package
echo "📦 Creating deployment package..."
if [ -d ".amplify-deploy" ]; then
    rm -rf .amplify-deploy
fi

mkdir .amplify-deploy
cp -r .next .amplify-deploy/
cp -r public .amplify-deploy/
cp package.json .amplify-deploy/
cp next.config.ts .amplify-deploy/ 2>/dev/null || cp next.config.js .amplify-deploy/ 2>/dev/null || echo "No next.config file found"

# Create a simple deployment manifest
cat > .amplify-deploy/amplify.yml << EOF
version: 1
applications:
  - appRoot: .
    frontend:
      phases:
        preBuild:
          commands:
            - npm ci
        build:
          commands:
            - echo "Using pre-built artifacts"
      artifacts:
        baseDirectory: .next
        files:
          - '**/*'
EOF

# Zip the deployment package
echo "📦 Creating deployment zip..."
cd .amplify-deploy
zip -r ../deployment.zip . -x "*.DS_Store*"
cd ..

# Upload to Amplify
echo "⬆️  Uploading to Amplify..."
aws amplify create-deployment \
    --app-id $AMPLIFY_APP_ID \
    --branch-name main \
    --region $REGION \
    --profile singampk > deployment-response.json

# Extract upload URL
UPLOAD_URL=$(cat deployment-response.json | python3 -c "import json,sys; data=json.load(sys.stdin); print(data['uploadUrl'])")
JOB_ID=$(cat deployment-response.json | python3 -c "import json,sys; data=json.load(sys.stdin); print(data['jobId'])")

echo "📤 Uploading deployment package..."
curl -X PUT "$UPLOAD_URL" \
    -H "Content-Type: application/zip" \
    --data-binary @deployment.zip

# Start deployment
echo "🚀 Starting deployment..."
aws amplify start-deployment \
    --app-id $AMPLIFY_APP_ID \
    --branch-name main \
    --job-id $JOB_ID \
    --region $REGION \
    --profile singampk

echo "✅ Deployment initiated!"
echo ""
echo "📊 Deployment Information:"
echo "========================="
echo "Environment: $ENVIRONMENT"
echo "App ID: $AMPLIFY_APP_ID"
echo "Job ID: $JOB_ID"
echo ""
echo "🔗 Monitor deployment:"
echo "https://console.aws.amazon.com/amplify/home?region=$REGION#/$AMPLIFY_APP_ID"

# Cleanup
rm -rf .amplify-deploy
rm deployment.zip
rm deployment-response.json

echo ""
echo "🎉 Manual deployment completed!"