import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import formidable from 'formidable'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'

// Disable body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
}

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
})

async function uploadToS3(file: formidable.File, bucketName: string): Promise<string> {
  const fileContent = fs.readFileSync(file.filepath)
  const fileName = `images/${uuidv4()}-${file.originalFilename}`
  
  const uploadParams = {
    Bucket: bucketName,
    Key: fileName,
    Body: fileContent,
    ContentType: file.mimetype || 'application/octet-stream',
    // ACL removed - bucket doesn't allow ACLs, using bucket policy instead
  }

  try {
    await s3Client.send(new PutObjectCommand(uploadParams))
    // Use the correct S3 URL format for ap-southeast-2 region
    return `https://s3.${process.env.AWS_REGION || 'ap-southeast-2'}.amazonaws.com/${bucketName}/${fileName}`
  } catch (error) {
    console.error('S3 upload error:', error)
    throw error
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Check authentication
    const session = await getServerSession(req, res, authOptions)
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    // Check if AWS credentials are configured
    const bucketName = process.env.AWS_S3_BUCKET_NAME
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

    if (!bucketName || !accessKeyId || !secretAccessKey) {
      console.log('AWS S3 not configured - using placeholder')
      return res.status(200).json({ 
        imageUrl: '/images/placeholder.svg',
        message: 'S3 upload not configured - using placeholder'
      })
    }

    // Parse the incoming form data
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB
      allowEmptyFiles: false,
    })

    const [, files] = await form.parse(req)
    const file = Array.isArray(files.image) ? files.image[0] : files.image

    if (!file) {
      return res.status(400).json({ error: 'No image file provided' })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.mimetype || '')) {
      return res.status(400).json({ error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' })
    }

    // Try to upload to S3, fall back to placeholder on error
    try {
      const imageUrl = await uploadToS3(file, bucketName)
      return res.status(200).json({ 
        imageUrl,
        message: 'Image uploaded successfully to S3'
      })
    } catch (s3Error) {
      console.error('S3 upload failed, using placeholder:', s3Error.message)
      return res.status(200).json({ 
        imageUrl: '/images/placeholder.svg',
        message: 'S3 upload failed, using placeholder. Check S3 permissions.'
      })
    }
    
  } catch (error) {
    console.error('Image upload error:', error)
    return res.status(500).json({ 
      error: 'Upload failed',
      imageUrl: '/images/placeholder.svg' // Fallback to placeholder
    })
  }
}