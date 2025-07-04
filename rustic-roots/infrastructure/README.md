# AWS Infrastructure for Rustic Roots

This directory contains CloudFormation templates and deployment scripts for deploying the Rustic Roots e-commerce platform on AWS using Amplify + RDS.

## Architecture

```
Route 53 → CloudFront (Amplify) → Amplify Hosting → RDS PostgreSQL
                               ↓
                         S3 (files.therusticroots.com.au)
```

## Components

1. **RDS PostgreSQL**: Managed database in private subnets
2. **AWS Amplify**: Hosting with built-in CI/CD and CDN
3. **VPC**: Custom VPC with public/private subnets
4. **Security Groups**: Secure network access
5. **Secrets Manager**: Secure credential storage

## Prerequisites

1. **AWS CLI** configured with `singampk` profile
2. **Domain**: `therusticroots.com.au` already configured
3. **S3 Bucket**: `files.therusticroots.com.au` already exists

## Deployment

### Infrastructure Deployment

```bash
cd infrastructure
./deploy.sh production YOUR_DB_PASSWORD
```

### Manual Application Deployment

After infrastructure is deployed, deploy your application manually:

```bash
cd infrastructure
./manual-deploy.sh production
```

### Manual Deployment

1. **Deploy RDS Stack:**
```bash
aws cloudformation deploy \
    --template-file rds-stack.yml \
    --stack-name rustic-roots-rds-production \
    --parameter-overrides \
        Environment=production \
        DBPassword=YourSecurePassword123 \
    --capabilities CAPABILITY_NAMED_IAM \
    --region ap-southeast-2 \
    --profile singampk
```

2. **Deploy Amplify Stack:**
```bash
aws cloudformation deploy \
    --template-file amplify-stack.yml \
    --stack-name rustic-roots-amplify-production \
    --parameter-overrides \
        Environment=production \
        DatabaseStackName=rustic-roots-rds-production \
    --capabilities CAPABILITY_NAMED_IAM \
    --region ap-southeast-2 \
    --profile singampk
```

## Configuration

### Environment Variables

The following environment variables are automatically configured in Amplify:

- `DATABASE_URL`: PostgreSQL connection string (using IAM authentication)
- `NEXTAUTH_SECRET`: NextAuth.js secret key
- `NEXTAUTH_URL`: Application URL
- `AWS_REGION`: AWS region
- `AWS_ACCESS_KEY_ID`: S3 access key
- `AWS_SECRET_ACCESS_KEY`: S3 secret key
- `AWS_S3_BUCKET_NAME`: S3 bucket name

### Database Authentication

Uses **IAM Database Authentication** for secure access:
- No hardcoded passwords in application
- Authentication tokens generated automatically
- Database access controlled via IAM policies

### Secrets Manager

Secrets are stored in AWS Secrets Manager:

- `/production/rustic-roots/nextauth`: NextAuth secret
- `/production/rustic-roots/aws`: AWS credentials for S3

## Post-Deployment Steps

1. **Verify Domain**: Check that `therusticroots.com.au` points to Amplify
2. **SSL Certificate**: Verify SSL certificate is issued
3. **First Build**: Monitor the first Amplify build
4. **Database**: Verify database migrations and seeding
5. **Testing**: Test all application functionality

## Monitoring

- **Amplify Console**: Build logs and metrics
- **CloudWatch**: Application and RDS metrics
- **RDS Performance Insights**: Database performance

## Costs (Estimated Monthly)

- **Amplify**: $15-25
- **RDS PostgreSQL (db.t3.micro)**: $15-25
- **Data Transfer**: $5-10
- **Total**: ~$35-60/month

## Security Features

- Database in private subnets
- Security groups with minimal access
- Encrypted storage
- Secrets Manager for credentials
- IAM roles with least privilege

## Scaling

- **Amplify**: Auto-scales based on traffic
- **RDS**: Can be upgraded to larger instances
- **CDN**: Global CloudFront distribution

## Troubleshooting

### Common Issues

1. **Build Failures**: Check Amplify build logs
2. **Database Connection**: Verify security groups and credentials
3. **Domain Issues**: Check Route 53 and SSL certificate
4. **Environment Variables**: Verify Secrets Manager values

### Useful Commands

```bash
# Check stack status
aws cloudformation describe-stacks --stack-name rustic-roots-rds-production --profile singampk

# View Amplify builds
aws amplify list-jobs --app-id YOUR_APP_ID --branch-name main --profile singampk

# Test database connection
psql postgresql://username:password@endpoint:5432/rustic_roots
```

## Cleanup

To delete all resources:

```bash
# Delete Amplify stack
aws cloudformation delete-stack --stack-name rustic-roots-amplify-production --profile singampk

# Delete RDS stack (will create final snapshot)
aws cloudformation delete-stack --stack-name rustic-roots-rds-production --profile singampk
```

## Support

For issues or questions:
1. Check AWS CloudFormation events
2. Review Amplify build logs
3. Check CloudWatch logs
4. Verify Secrets Manager values