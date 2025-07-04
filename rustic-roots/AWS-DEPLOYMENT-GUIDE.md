# 🚀 AWS Deployment Guide for therusticroots.com.au

## 🎯 Overview

This guide provides multiple AWS deployment options for Rustic Roots, from simple EC2 to production-ready ECS Fargate.

## 🧹 Clean Up Old Resources First

If you have old AWS resources from previous deployments, clean them up first:

```bash
cd aws-deployment
./cleanup-old-resources.sh
```

This will remove:
- Old CloudFormation stacks
- Old Amplify applications
- Local deployment artifacts

## 🚀 Deployment Options

### Option 1: ECS Fargate (Recommended for Production)

**Best for**: Production workloads, high availability, auto-scaling

**Features**:
- ✅ Fully managed containers
- ✅ Auto-scaling based on demand
- ✅ Application Load Balancer with SSL
- ✅ RDS PostgreSQL with backups
- ✅ Private networking with VPC
- ✅ CloudWatch monitoring

**Cost**: ~$75-115/month

```bash
cd aws-deployment/ecs
./deploy-ecs.sh therusticroots.com.au
```

### Option 2: EC2 with Docker (Simple & Cost-Effective)

**Best for**: Development, testing, small production workloads

**Features**:
- ✅ Single EC2 instance with Docker
- ✅ Nginx reverse proxy with SSL
- ✅ Let's Encrypt certificates
- ✅ Docker Compose setup
- ✅ Simple management

**Cost**: ~$30-55/month

```bash
cd aws-deployment/ec2
./deploy-ec2.sh therusticroots.com.au
```

## 📋 Prerequisites

### 1. AWS CLI Setup
```bash
# Install AWS CLI v2
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
sudo installer -pkg AWSCLIV2.pkg -target /

# Configure credentials
aws configure
# AWS Access Key ID: [Your access key]
# AWS Secret Access Key: [Your secret key]
# Default region name: ap-southeast-2
# Default output format: json
```

### 2. Domain Prerequisites
- Domain `therusticroots.com.au` registered
- Access to domain registrar for DNS updates
- Or Route 53 hosted zone (will be created automatically)

### 3. Firewall Rules (for local HTTPS)
```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
```

## 🏗️ Architecture Comparison

### ECS Fargate Architecture
```
Internet → Route 53 → ALB → ECS Fargate → RDS
    ↓         ↓        ↓        ↓         ↓
   Users   SSL Cert  Load     Docker   PostgreSQL
                    Balance  Container
```

**Components**:
- Application Load Balancer (ALB)
- ECS Fargate cluster
- RDS PostgreSQL (Multi-AZ)
- VPC with public/private subnets
- ECR for Docker images
- Secrets Manager for credentials

### EC2 Architecture
```
Internet → Route 53 → EC2 Instance → Docker Compose
    ↓         ↓           ↓              ↓
   Users   DNS Record  Nginx +      App + Database
                      SSL Proxy    Containers
```

**Components**:
- Single EC2 instance
- Docker Compose
- Nginx reverse proxy
- Let's Encrypt SSL
- Local PostgreSQL container

## 💰 Cost Breakdown

### ECS Fargate (Production)
| Service | Specification | Monthly Cost |
|---------|---------------|--------------|
| ECS Fargate | 2 vCPU, 4GB RAM | $35-50 |
| Application Load Balancer | Standard | $18 |
| RDS PostgreSQL | db.t3.micro | $20-30 |
| Data Transfer | 100GB | $10 |
| Route 53 | Hosted zone + queries | $2 |
| **Total** | | **$85-110** |

### EC2 (Cost-Effective)
| Service | Specification | Monthly Cost |
|---------|---------------|--------------|
| EC2 Instance | t3.small | $15-20 |
| Elastic IP | Static IP | $3 |
| EBS Storage | 20GB | $2 |
| Route 53 | Hosted zone + queries | $2 |
| **Total** | | **$22-27** |

## 🔧 Detailed Deployment Steps

### ECS Fargate Deployment

1. **Prepare Environment**
   ```bash
   cd aws-deployment/ecs
   # Review and update configuration
   nano deploy-ecs.sh
   ```

2. **Deploy Infrastructure**
   ```bash
   ./deploy-ecs.sh therusticroots.com.au
   ```

3. **Monitor Deployment**
   - Check CloudFormation console
   - Verify SSL certificate validation
   - Monitor ECS service deployment

4. **Update DNS (if needed)**
   ```bash
   # If you're not using Route 53, update your domain registrar
   # Point A records to the Load Balancer DNS name
   ```

### EC2 Deployment

1. **Deploy Instance**
   ```bash
   cd aws-deployment/ec2
   ./deploy-ec2.sh therusticroots.com.au
   ```

2. **Connect to Instance**
   ```bash
   ssh -i rustic-roots-key.pem ec2-user@YOUR_INSTANCE_IP
   ```

3. **Monitor Application**
   ```bash
   # On the EC2 instance
   docker-compose -f docker-compose.ssl.yml logs -f
   ```

## 🔍 Monitoring & Management

### ECS Fargate Monitoring
```bash
# View ECS service status
aws ecs describe-services \
  --cluster rustic-roots-cluster \
  --services rustic-roots-service

# View task logs
aws logs get-log-events \
  --log-group-name /ecs/rustic-roots \
  --log-stream-name [stream-name]
```

### EC2 Monitoring
```bash
# SSH into instance
ssh -i rustic-roots-key.pem ec2-user@YOUR_IP

# Check application status
docker ps
docker-compose ps

# View logs
docker logs rusticroots-app
```

## 🛠️ Troubleshooting

### Common Issues

#### 1. SSL Certificate Validation
```bash
# Check certificate status
aws acm describe-certificate --certificate-arn YOUR_CERT_ARN

# If stuck, add DNS validation records manually
# Check ACM console for required CNAME records
```

#### 2. ECS Task Startup Issues
```bash
# Check task definition
aws ecs describe-task-definition --task-definition rustic-roots-task

# View task events
aws ecs describe-tasks \
  --cluster rustic-roots-cluster \
  --tasks TASK_ARN
```

#### 3. Database Connection Issues
```bash
# Check security groups
aws ec2 describe-security-groups --group-ids sg-xxxxx

# Verify database connectivity
aws rds describe-db-instances --db-instance-identifier rustic-roots-db
```

### Debug Commands
```bash
# Test connectivity
curl -I https://therusticroots.com.au

# Check DNS resolution
nslookup therusticroots.com.au

# Verify SSL certificate
openssl s_client -connect therusticroots.com.au:443
```

## 🔄 Updates & Maintenance

### Update Application (ECS)
```bash
cd aws-deployment/ecs
./build-and-push.sh
aws ecs update-service \
  --cluster rustic-roots-cluster \
  --service rustic-roots-service \
  --force-new-deployment
```

### Update Application (EC2)
```bash
# SSH into instance
ssh -i rustic-roots-key.pem ec2-user@YOUR_IP

# Pull latest image
docker pull singampk/rusticroots:latest

# Restart containers
docker-compose -f docker-compose.ssl.yml up -d
```

## 🔒 Security Best Practices

### ECS Security
- ✅ Private subnets for containers
- ✅ Security groups with minimal access
- ✅ Secrets Manager for credentials
- ✅ IAM roles with least privilege
- ✅ VPC endpoints for AWS services

### EC2 Security
- ✅ Security groups (ports 22, 80, 443 only)
- ✅ Regular OS updates
- ✅ SSH key authentication
- ✅ Fail2ban for intrusion prevention
- ✅ Regular backups

## 📊 Performance Optimization

### ECS Optimizations
- Auto-scaling policies
- CloudFront CDN
- Application Load Balancer caching
- RDS read replicas

### EC2 Optimizations
- Nginx caching
- Gzip compression
- Static file optimization
- Database tuning

## 📈 Scaling Strategies

### ECS Auto-Scaling
```bash
# Set up auto-scaling
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --scalable-dimension ecs:service:DesiredCount \
  --resource-id service/rustic-roots-cluster/rustic-roots-service \
  --min-capacity 2 \
  --max-capacity 10
```

### EC2 Scaling
- Vertical scaling (larger instance type)
- Horizontal scaling (multiple instances with load balancer)
- Database scaling (RDS with read replicas)

---

## 🎉 Success!

After deployment, your site will be available at:
- 🔒 **https://therusticroots.com.au**
- 🔒 **https://www.therusticroots.com.au**

With production-grade AWS infrastructure! 🚀