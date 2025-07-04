#!/bin/bash

# Cleanup script for old AWS deployment resources
# This will remove old Amplify and CloudFormation stacks

set -e

REGION=${AWS_REGION:-ap-southeast-2}
PROFILE=${AWS_PROFILE:-singampk}

echo "🧹 Cleaning up old AWS deployment resources"
echo "==========================================="
echo "Region: $REGION"
echo "Profile: $PROFILE"
echo ""

# List existing stacks
echo "📋 Checking existing CloudFormation stacks..."
aws cloudformation list-stacks \
    --stack-status-filter CREATE_COMPLETE UPDATE_COMPLETE \
    --query 'StackSummaries[?contains(StackName, `rustic-roots`)].{Name:StackName,Status:StackStatus,Created:CreationTime}' \
    --output table \
    --profile $PROFILE \
    --region $REGION

# List Amplify apps
echo ""
echo "📱 Checking existing Amplify applications..."
aws amplify list-apps \
    --query 'apps[?contains(name, `rustic-roots`) || contains(name, `Rustic`)].{Name:name,Id:appId,Domain:defaultDomain}' \
    --output table \
    --profile $PROFILE \
    --region $REGION 2>/dev/null || echo "No Amplify apps found"

echo ""
echo "⚠️  WARNING: This will delete the following old resources:"
echo "- CloudFormation stacks with 'rustic-roots' in the name"
echo "- Amplify applications with 'rustic-roots' or 'Rustic' in the name"
echo "- Associated resources (databases, load balancers, etc.)"
echo ""

read -p "Continue with cleanup? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Cleanup cancelled"
    exit 0
fi

# Delete old CloudFormation stacks
echo ""
echo "🗑️  Deleting old CloudFormation stacks..."

# Get stack names
OLD_STACKS=$(aws cloudformation list-stacks \
    --stack-status-filter CREATE_COMPLETE UPDATE_COMPLETE ROLLBACK_COMPLETE \
    --query 'StackSummaries[?contains(StackName, `rustic-roots-amplify`) || contains(StackName, `rustic-roots-rds`)].StackName' \
    --output text \
    --profile $PROFILE \
    --region $REGION)

if [ -n "$OLD_STACKS" ]; then
    for stack in $OLD_STACKS; do
        echo "🗑️  Deleting stack: $stack"
        aws cloudformation delete-stack \
            --stack-name $stack \
            --profile $PROFILE \
            --region $REGION
        
        echo "⏳ Waiting for stack deletion: $stack"
        aws cloudformation wait stack-delete-complete \
            --stack-name $stack \
            --profile $PROFILE \
            --region $REGION || echo "⚠️  Stack deletion may have failed or timed out"
    done
else
    echo "ℹ️  No old CloudFormation stacks found"
fi

# Delete old Amplify apps
echo ""
echo "🗑️  Deleting old Amplify applications..."

OLD_APPS=$(aws amplify list-apps \
    --query 'apps[?contains(name, `rustic-roots`) || contains(name, `Rustic`)].appId' \
    --output text \
    --profile $PROFILE \
    --region $REGION 2>/dev/null)

if [ -n "$OLD_APPS" ]; then
    for app_id in $OLD_APPS; do
        echo "🗑️  Deleting Amplify app: $app_id"
        aws amplify delete-app \
            --app-id $app_id \
            --profile $PROFILE \
            --region $REGION || echo "⚠️  Failed to delete Amplify app: $app_id"
    done
else
    echo "ℹ️  No old Amplify apps found"
fi

# Clean up local files
echo ""
echo "🧹 Cleaning up local deployment files..."
cd ../

# Remove old infrastructure files if they exist
if [ -d "infrastructure" ]; then
    echo "🗑️  Moving old infrastructure directory to backup..."
    mv infrastructure infrastructure-backup-$(date +%Y%m%d-%H%M%S)
fi

# Remove deployment artifacts
rm -f deployment.zip deployment-response.json
rm -rf .amplify-deploy static-deploy
rm -f amplify-*.yml

echo ""
echo "✅ Cleanup completed!"
echo ""
echo "📋 Summary:"
echo "- Old CloudFormation stacks deleted"
echo "- Old Amplify applications removed"
echo "- Local deployment artifacts cleaned"
echo "- Old infrastructure files backed up"
echo ""
echo "💡 You can now proceed with new deployment methods:"
echo "   ECS Fargate: cd aws-deployment/ecs && ./deploy-ecs.sh"
echo "   EC2:         cd aws-deployment/ec2 && ./deploy-ec2.sh"
echo "   HTTPS Local: ./deploy-https.sh"