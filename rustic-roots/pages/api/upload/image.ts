import { NextApiRequest, NextApiResponse } from 'next'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { verifyRole } from '../../../lib/authMiddleware'
import formidable, { File } from 'formidable'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'files.therusticroots.com.au'

// Disable Next.js body parsing for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Verify admin role
    await verifyRole(req, 'ADMIN')

    // Create S3 client with environment variables
    const s3Client = new S3Client({
      region: process.env.AWS_REGION || 'ap-southeast-2',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
      forcePathStyle: false, // Use virtual hosted-style for custom domains
    })

    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
      allowEmptyFiles: false,
    })

    const [, files] = await form.parse(req)
    
    if (!files.image || !Array.isArray(files.image) || files.image.length === 0) {
      return res.status(400).json({ error: 'No image file provided' })
    }

    const file = files.image[0] as File
    
    // Validate file type
    if (!file.mimetype?.startsWith('image/')) {
      return res.status(400).json({ error: 'File must be an image' })
    }

    // Generate unique filename in the images folder
    const fileExtension = file.originalFilename?.split('.').pop() || 'jpg'
    const fileName = `images/products/${uuidv4()}.${fileExtension}`

    // Read file content
    const fileContent = fs.readFileSync(file.filepath)

    // Upload to S3
    const uploadCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: fileContent,
      ContentType: file.mimetype,
      // Note: ACL removed - bucket permissions should handle public access
    })

    await s3Client.send(uploadCommand)

    // Generate public URL using your custom domain
    const imageUrl = `https://${BUCKET_NAME}/${fileName}`

    // Clean up temporary file
    fs.unlinkSync(file.filepath)

    return res.status(200).json({
      success: true,
      imageUrl,
      message: 'Image uploaded successfully'
    })

  } catch (error: unknown) {
    console.error('Image upload error:', error)
    
    if (error instanceof Error) {
      if (error.message === 'Unauthorized') {
        return res.status(401).json({ error: 'Unauthorized' })
      }
      if (error.message === 'Forbidden') {
        return res.status(403).json({ error: 'Forbidden' })
      }
    }

    return res.status(500).json({ error: 'Failed to upload image' })
  }
}