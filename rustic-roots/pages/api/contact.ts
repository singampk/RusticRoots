import { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer'

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore: { [key: string]: { count: number; resetTime: number } } = {}
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour in milliseconds
const RATE_LIMIT_MAX_REQUESTS = 5 // Maximum requests per IP per hour

// Input validation and sanitization
function validateAndSanitizeInput(data: Record<string, unknown>) {
  const { name, email, subject, message, phone, projectType, timeline, budget, dimensions, woodPreference, description, inspiration, type } = data

  // Basic validation
  const messageContent = message || description
  if (!name || !email || !messageContent) {
    throw new Error('Name, email, and message/description are required')
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (typeof email !== 'string' || !emailRegex.test(email)) {
    throw new Error('Invalid email format')
  }

  // Sanitize inputs (remove potentially malicious content)
  const sanitize = (str: unknown): string => {
    if (typeof str !== 'string') return ''
    return str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').trim()
  }

  return {
    name: sanitize(name),
    email: sanitize(email),
    subject: sanitize(subject),
    message: sanitize(message),
    phone: sanitize(phone),
    projectType: sanitize(projectType),
    timeline: sanitize(timeline),
    budget: sanitize(budget),
    dimensions: sanitize(dimensions),
    woodPreference: sanitize(woodPreference),
    description: sanitize(description),
    inspiration: sanitize(inspiration),
    type: (type as string) || 'contact'
  }
}

// Rate limiting check
function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const userLimit = rateLimitStore[ip]

  if (!userLimit) {
    rateLimitStore[ip] = { count: 1, resetTime: now + RATE_LIMIT_WINDOW }
    return true
  }

  if (now > userLimit.resetTime) {
    rateLimitStore[ip] = { count: 1, resetTime: now + RATE_LIMIT_WINDOW }
    return true
  }

  if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false
  }

  userLimit.count++
  return true
}

// Get client IP address
function getClientIp(req: NextApiRequest): string {
  const forwarded = req.headers['x-forwarded-for']
  const ip = forwarded ? (Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0]) : req.socket.remoteAddress
  return ip || 'unknown'
}

// Create email transporter
function createTransporter() {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_SECURE,
    SMTP_USER,
    SMTP_PASSWORD
  } = process.env

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD) {
    throw new Error('SMTP configuration is missing')
  }

  return nodemailer.createTransport({
    host: SMTP_HOST || 'smtp.zoho.com',
    port: parseInt(SMTP_PORT || '587'),
    secure: false, // Use STARTTLS for port 587
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
  })
}

// Generate email content based on form type
function generateEmailContent(data: Record<string, string>) {
  const { type, name, email, phone, message, subject, projectType, timeline, budget, dimensions, woodPreference, description, inspiration } = data
  
  if (type === 'custom-build') {
    return {
      subject: `Custom Build Request from ${name}`,
      html: `
        <h2>New Custom Build Request</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
        
        <h3>Project Details</h3>
        <p><strong>Project Type:</strong> ${projectType}</p>
        <p><strong>Timeline:</strong> ${timeline}</p>
        <p><strong>Budget:</strong> ${budget}</p>
        <p><strong>Dimensions:</strong> ${dimensions}</p>
        <p><strong>Wood Preference:</strong> ${woodPreference}</p>
        
        <h3>Description</h3>
        <p>${description.replace(/\n/g, '<br>')}</p>
        
        ${inspiration ? `<h3>Inspiration/References</h3><p>${inspiration.replace(/\n/g, '<br>')}</p>` : ''}
        
        <hr>
        <p><em>Submitted from: Custom Build Request Form</em></p>
        <p><em>Time: ${new Date().toLocaleString()}</em></p>
      `,
      text: `
        New Custom Build Request
        
        From: ${name} (${email})
        ${phone ? `Phone: ${phone}` : ''}
        
        Project Details:
        - Type: ${projectType}
        - Timeline: ${timeline}
        - Budget: ${budget}
        - Dimensions: ${dimensions}
        - Wood Preference: ${woodPreference}
        
        Description:
        ${description}
        
        ${inspiration ? `Inspiration/References:\n${inspiration}` : ''}
        
        ---
        Submitted: ${new Date().toLocaleString()}
      `
    }
  } else {
    return {
      subject: subject ? `Contact Form: ${subject}` : `Contact Form Message from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
        ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
        
        <h3>Message</h3>
        <p>${message.replace(/\n/g, '<br>')}</p>
        
        <hr>
        <p><em>Submitted from: Contact Form</em></p>
        <p><em>Time: ${new Date().toLocaleString()}</em></p>
      `,
      text: `
        New Contact Form Submission
        
        From: ${name} (${email})
        ${phone ? `Phone: ${phone}` : ''}
        ${subject ? `Subject: ${subject}` : ''}
        
        Message:
        ${message}
        
        ---
        Submitted: ${new Date().toLocaleString()}
      `
    }
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Check rate limiting
    const clientIp = getClientIp(req)
    if (!checkRateLimit(clientIp)) {
      return res.status(429).json({ 
        error: 'Too many requests. Please try again later.',
        retryAfter: RATE_LIMIT_WINDOW / 1000 / 60 // minutes
      })
    }

    // Validate and sanitize input
    const sanitizedData = validateAndSanitizeInput(req.body)
    
    // Simple honeypot check (frontend should leave this empty)
    if (req.body.website) {
      return res.status(400).json({ error: 'Spam detected' })
    }

    // Create email transporter
    const transporter = createTransporter()

    // Generate email content
    const emailContent = generateEmailContent(sanitizedData)

    // Send email
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: 'admin@therusticroots.com.au',
      ...emailContent,
      replyTo: sanitizedData.email,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent successfully:', info.messageId)

    res.status(200).json({ 
      success: true, 
      message: 'Message sent successfully',
      messageId: info.messageId 
    })

  } catch (error) {
    console.error('Email sending error:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('SMTP configuration')) {
        return res.status(500).json({ error: 'Email service configuration error' })
      }
      if (error.message.includes('required') || error.message.includes('Invalid')) {
        return res.status(400).json({ error: error.message })
      }
    }

    res.status(500).json({ error: 'Failed to send message. Please try again later.' })
  }
}