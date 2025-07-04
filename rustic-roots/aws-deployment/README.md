# 🚀 AWS Deployment Options for Rustic Roots

This directory contains multiple AWS deployment strategies for the Rustic Roots application.

## 📋 Available Deployment Options

| Option | Best For | Cost | Complexity | Scalability |
|--------|----------|------|------------|-------------|
| **ECS Fargate** | Production | Medium | Medium | High |
| **EC2 + Docker** | Full Control | Low-Medium | Low | Medium |
| **Lambda + RDS** | Serverless | Low | High | High |
| **Amplify + RDS** | Simple Deploy | Low | Low | Medium |

## 🎯 Recommended: ECS Fargate (Production)

For production deployment with your domain `therusticroots.com.au`, we recommend **ECS Fargate**:

✅ **Benefits:**
- Fully managed containers
- Auto-scaling
- Load balancing
- SSL/TLS termination
- Cost-effective for production
- Easy CI/CD integration

## 🚀 Quick Start

### 1. ECS Fargate Deployment (Recommended)
```bash
cd ecs/
./deploy-ecs.sh therusticroots.com.au
```

### 2. EC2 with Docker (Simple)
```bash
cd ec2/
./deploy-ec2.sh
```

### 3. Serverless Lambda (Advanced)
```bash
cd lambda/
./deploy-lambda.sh
```

## 🔧 Prerequisites

### AWS Setup
```bash
# Install AWS CLI
aws configure
aws configure set region ap-southeast-2

# Verify credentials
aws sts get-caller-identity
```

### Domain Setup
- Route 53 hosted zone for `therusticroots.com.au`
- ACM certificate for SSL

## 📊 Cost Estimation

### ECS Fargate (Production)
- **Compute**: ~$30-50/month (2 vCPU, 4GB RAM)
- **RDS**: ~$20-30/month (db.t3.micro)
- **Load Balancer**: ~$18/month
- **Data Transfer**: ~$5-15/month
- **Total**: ~$75-115/month

### EC2 (Development)
- **EC2 Instance**: ~$10-25/month (t3.small)
- **RDS**: ~$15-25/month (db.t3.micro)
- **Elastic IP**: ~$3/month
- **Total**: ~$30-55/month

## 🛠️ Architecture Options

### Option 1: ECS Fargate + RDS
```
Internet → ALB → ECS Fargate → RDS
    ↓         ↓        ↓         ↓
Route 53  ACM SSL  Docker   PostgreSQL
```

### Option 2: EC2 + Docker Compose
```
Internet → EC2 Instance → Docker Compose
    ↓           ↓              ↓
Route 53   Nginx + SSL   App + Database
```

### Option 3: Lambda + RDS
```
Internet → API Gateway → Lambda → RDS
    ↓           ↓          ↓        ↓
Route 53   Custom Domain  SSR    PostgreSQL
```

## 📚 Documentation

Each deployment option includes:
- Step-by-step setup guides
- Infrastructure as Code (CDK/CloudFormation)
- CI/CD pipeline configurations
- Monitoring and logging setup
- Cost optimization tips

## 🔐 Security Features

All deployment options include:
- ✅ SSL/TLS encryption
- ✅ VPC with private subnets
- ✅ Security groups
- ✅ IAM roles and policies
- ✅ Secrets management
- ✅ Database encryption

## 🚨 Migration Guide

If you're migrating from the old Amplify setup:
1. Export data from existing deployment
2. Choose new deployment option
3. Deploy infrastructure
4. Import data
5. Update DNS records

---

Choose your deployment option and follow the specific guide in each directory! 🎯