# S3 Upload Configuration Guide

This guide explains how to enable real S3 uploads in your Rustic Roots application.

## Current Status

By default, the application uses placeholder images for uploads. To enable real S3 uploads, you need to configure AWS credentials.

## Prerequisites

1. **AWS Account** with S3 access
2. **S3 Bucket** created and configured for public reads
3. **AWS IAM User** with S3 permissions

## Step 1: Create S3 Bucket

1. Go to AWS S3 Console
2. Create a new bucket (e.g., `rustic-roots-uploads`)
3. Configure bucket for public reads:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicRead",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::your-bucket-name/*"
       }
     ]
   }
   ```

## Step 2: Create IAM User

1. Go to AWS IAM Console
2. Create new user for programmatic access
3. Attach policy:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "s3:PutObject",
           "s3:PutObjectAcl",
           "s3:GetObject",
           "s3:DeleteObject"
         ],
         "Resource": "arn:aws:s3:::your-bucket-name/*"
       }
     ]
   }
   ```
4. Save the Access Key ID and Secret Access Key

## Step 3: Configure Environment Variables

### For Local Development (.env.local)
```bash
# AWS S3 Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_S3_BUCKET_NAME=your-bucket-name
```

### For Docker Local HTTP
Edit `.env` file:
```bash
# Add to your .env file
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_S3_BUCKET_NAME=your-bucket-name
```

Then uncomment the AWS lines in `docker-compose.local-http.yml`:
```yaml
environment:
  # AWS S3 Configuration (uncomment and set values to enable S3 uploads)
  AWS_REGION: ${AWS_REGION:-us-east-1}
  AWS_ACCESS_KEY_ID: ${AWS_ACCESS_KEY_ID}
  AWS_SECRET_ACCESS_KEY: ${AWS_SECRET_ACCESS_KEY}
  AWS_S3_BUCKET_NAME: ${AWS_S3_BUCKET_NAME}
```

### For Docker HTTPS
Same as above, but edit `docker-compose.local-https.yml`

### For Production
Same as above, but edit `docker-compose.prod-https.yml`

## Step 4: Restart Application

After setting the environment variables:

```bash
# For local development
npm run dev

# For Docker HTTP
./docker-local-http.sh stop
./docker-local-http.sh start

# For Docker HTTPS  
./docker-local-https.sh stop
./docker-local-https.sh start

# For Production
./docker-prod-https.sh stop
./docker-prod-https.sh start
```

## How It Works

1. **Without AWS credentials**: The upload API returns placeholder images
2. **With AWS credentials**: The upload API uploads to S3 and returns the S3 URL

The upload API automatically detects if AWS credentials are configured:
- ✅ **Configured**: Real uploads to S3
- ❌ **Not configured**: Returns placeholder (no errors)

## Testing

1. Sign in to your application
2. Go to Admin → Products → Create Product
3. Try uploading an image
4. Check the browser network tab to see the API response

**With S3 configured:**
```json
{
  "imageUrl": "https://your-bucket.s3.amazonaws.com/images/uuid-filename.jpg",
  "message": "Image uploaded successfully"
}
```

**Without S3 configured:**
```json
{
  "imageUrl": "/images/placeholder.svg", 
  "message": "S3 upload not configured - using placeholder"
}
```

## Troubleshooting

### Common Issues

1. **"Access Denied" errors**: Check bucket permissions and IAM user policy
2. **"Credentials not found"**: Verify environment variables are set correctly
3. **"Bucket not found"**: Ensure bucket name is correct and exists
4. **CORS errors**: Configure CORS on your S3 bucket if accessing from browser

### Security Notes

- Never commit AWS credentials to git
- Use IAM roles in production when possible
- Rotate access keys regularly
- Use least-privilege permissions

## File Support

The upload API supports:
- **File types**: JPEG, PNG, WebP, GIF
- **Max size**: 10MB per file
- **Multiple uploads**: Supported
- **File naming**: UUID prefix to prevent conflicts