import nodemailer from 'nodemailer'

interface EmailUser {
  id: string
  name: string | null
  email: string
}

interface OrderItem {
  id: string
  quantity: number
  price: number
  product: {
    id: string
    name: string
    price: number
  }
}

interface Order {
  id: string
  orderNumber: string
  total: number
  status: string
  shippingAddress: unknown
  items: OrderItem[]
  user: EmailUser
  createdAt: Date
}

// Create email transporter
function createTransporter() {
  const {
    SMTP_HOST,
    SMTP_PORT,
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

// Welcome email template
function getWelcomeEmailTemplate(user: EmailUser) {
  return {
    subject: 'Welcome to Rustic Roots - Your Account is Ready!',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #7c2d12; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; }
            .footer { background: #374151; color: #d1d5db; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #7c2d12; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .highlight { background: #fbbf24; padding: 2px 6px; border-radius: 3px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌿 Welcome to Rustic Roots!</h1>
              <p>Your journey to beautiful handcrafted furniture begins here</p>
            </div>
            
            <div class="content">
              <h2>Hello ${user.name || 'User'}!</h2>
              
              <p>Thank you for joining the Rustic Roots family! We're thrilled to have you as part of our community of furniture enthusiasts.</p>
              
              <p><strong>What you can do now:</strong></p>
              <ul>
                <li>🛍️ Browse our collection of handcrafted wooden furniture</li>
                <li>✨ Request custom furniture pieces designed just for you</li>
                <li>📦 Track your orders and manage your account</li>
                <li>💝 Enjoy exclusive member benefits and early access to new collections</li>
              </ul>
              
              <div style="text-align: center;">
                <a href="https://therusticroots.com.au/products" class="button">Start Shopping</a>
              </div>
              
              <div style="background: #e7f3ff; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <h3>🎯 Special Welcome Offer</h3>
                <p>As a new member, enjoy <span class="highlight">10% off</span> your first order! Use code <strong>WELCOME10</strong> at checkout.</p>
                <p><small>Valid for 30 days from account creation</small></p>
              </div>
              
              <p>Need help getting started? Our team is here to assist you:</p>
              <ul>
                <li>📞 Visit our <a href="https://therusticroots.com.au/faq">FAQ page</a></li>
                <li>✉️ Contact us at <a href="mailto:admin@therusticroots.com.au">admin@therusticroots.com.au</a></li>
                <li>🛠️ Request a custom consultation</li>
              </ul>
            </div>
            
            <div class="footer">
              <p><strong>Rustic Roots Trading Co.</strong></p>
              <p>ABN: 96 672 808 963</p>
              <p>Crafting beautiful, sustainable wooden furniture since 2020</p>
              <p><a href="https://therusticroots.com.au" style="color: #fbbf24;">therusticroots.com.au</a></p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Welcome to Rustic Roots, ${user.name || 'User'}!
      
      Thank you for joining our family of furniture enthusiasts. We're excited to help you discover beautiful handcrafted wooden furniture.
      
      What you can do now:
      - Browse our collection at https://therusticroots.com.au/products
      - Request custom furniture pieces
      - Track orders and manage your account
      - Enjoy exclusive member benefits
      
      Special Welcome Offer: Get 10% off your first order with code WELCOME10 (valid for 30 days)
      
      Need help? Contact us at admin@therusticroots.com.au or visit our FAQ page.
      
      Happy shopping!
      The Rustic Roots Team
      
      Rustic Roots Trading Co. | ABN: 96 672 808 963
      https://therusticroots.com.au
    `
  }
}

// Password reset email template
function getPasswordResetEmailTemplate(user: EmailUser, resetToken: string) {
  const resetUrl = `https://therusticroots.com.au/auth/reset-password?token=${resetToken}`
  
  return {
    subject: 'Reset Your Rustic Roots Password',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #7c2d12; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; }
            .footer { background: #374151; color: #d1d5db; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .warning { background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Password Reset Request</h1>
            </div>
            
            <div class="content">
              <h2>Hello ${user.name || 'User'},</h2>
              
              <p>We received a request to reset the password for your Rustic Roots account.</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Your Password</a>
              </div>
              
              <p>This link will expire in <strong>1 hour</strong> for security reasons.</p>
              
              <div class="warning">
                <p><strong>⚠️ Security Notice:</strong></p>
                <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
                <p>For security, never share this reset link with anyone.</p>
              </div>
              
              <p>If the button doesn't work, copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background: #f3f4f6; padding: 10px; border-radius: 5px;">
                ${resetUrl}
              </p>
              
              <p>Need help? Contact our support team at <a href="mailto:admin@therusticroots.com.au">admin@therusticroots.com.au</a></p>
            </div>
            
            <div class="footer">
              <p><strong>Rustic Roots Trading Co.</strong></p>
              <p>This is an automated security email. Please do not reply.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Password Reset Request
      
      Hello ${user.name || 'User'},
      
      We received a request to reset your Rustic Roots account password.
      
      Reset your password: ${resetUrl}
      
      This link expires in 1 hour for security.
      
      If you didn't request this reset, please ignore this email.
      
      Need help? Contact admin@therusticroots.com.au
      
      Rustic Roots Trading Co.
    `
  }
}

// Order confirmation email template
function getOrderConfirmationEmailTemplate(order: Order) {
  const itemsHtml = order.items.map(item => `
    <tr style="border-bottom: 1px solid #e5e5e5;">
      <td style="padding: 15px 0;">${item.product.name}</td>
      <td style="text-align: center; padding: 15px 0;">${item.quantity}</td>
      <td style="text-align: right; padding: 15px 0;">$${item.price.toFixed(2)}</td>
      <td style="text-align: right; padding: 15px 0;">$${(item.quantity * item.price).toFixed(2)}</td>
    </tr>
  `).join('')

  return {
    subject: `Order Confirmation #${order.orderNumber} - Thank You!`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #7c2d12; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; }
            .footer { background: #374151; color: #d1d5db; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; }
            .order-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
            .total { font-size: 18px; font-weight: bold; color: #7c2d12; }
            table { width: 100%; border-collapse: collapse; }
            th { background: #f3f4f6; padding: 10px; text-align: left; }
            td { padding: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Order Confirmed!</h1>
              <p>Thank you for your purchase, ${order.user.name || 'User'}!</p>
            </div>
            
            <div class="content">
              <div class="order-details">
                <h2>Order #${order.orderNumber}</h2>
                <p><strong>Order Date:</strong> ${order.createdAt.toLocaleDateString()}</p>
                <p><strong>Status:</strong> ${order.status}</p>
                
                <h3>Order Items:</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th style="text-align: center;">Quantity</th>
                      <th style="text-align: right;">Price</th>
                      <th style="text-align: right;">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHtml}
                  </tbody>
                </table>
                
                <div style="text-align: right; margin-top: 20px; padding-top: 20px; border-top: 2px solid #7c2d12;">
                  <p class="total">Order Total: $${order.total.toFixed(2)}</p>
                </div>
              </div>
              
              <div style="background: #e7f3ff; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <h3>📦 What's Next?</h3>
                <ul>
                  <li><strong>Processing:</strong> We'll start crafting your order within 1-2 business days</li>
                  <li><strong>Updates:</strong> You'll receive email notifications as your order progresses</li>
                  <li><strong>Tracking:</strong> Track your order status at any time in your account</li>
                  <li><strong>Delivery:</strong> Estimated delivery: 2-4 weeks for handcrafted items</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://therusticroots.com.au/orders" style="display: inline-block; background: #7c2d12; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
                  Track Your Order
                </a>
              </div>
              
              <p><strong>Questions?</strong> Contact us at <a href="mailto:admin@therusticroots.com.au">admin@therusticroots.com.au</a> or visit our <a href="https://therusticroots.com.au/faq">FAQ page</a>.</p>
            </div>
            
            <div class="footer">
              <p><strong>Rustic Roots Trading Co.</strong></p>
              <p>ABN: 96 672 808 963</p>
              <p>Crafting your beautiful furniture with care</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Order Confirmation #${order.orderNumber}
      
      Thank you for your purchase, ${order.user.name || 'User'}!
      
      Order Details:
      - Order Date: ${order.createdAt.toLocaleDateString()}
      - Status: ${order.status}
      - Total: $${order.total.toFixed(2)}
      
      Items:
      ${order.items.map(item => `- ${item.product.name} x${item.quantity} - $${(item.quantity * item.price).toFixed(2)}`).join('\n')}
      
      What's Next:
      - Processing starts within 1-2 business days
      - You'll receive email updates as your order progresses  
      - Track your order: https://therusticroots.com.au/orders
      - Estimated delivery: 2-4 weeks
      
      Questions? Contact admin@therusticroots.com.au
      
      Rustic Roots Trading Co. | ABN: 96 672 808 963
    `
  }
}

// Order status update email template
function getOrderStatusEmailTemplate(order: Order, oldStatus: string, newStatus: string) {
  const statusMessages: Record<string, string> = {
    PROCESSING: '🔨 Your order is being processed and will begin crafting soon',
    CRAFTING: '🪚 Our artisans have started crafting your beautiful furniture',
    QUALITY_CHECK: '🔍 Your order is undergoing our rigorous quality inspection',
    SHIPPED: '🚚 Your order has been shipped and is on its way to you',
    DELIVERED: '📦 Your order has been delivered - enjoy your new furniture!'
  }

  return {
    subject: `Order #${order.orderNumber} Update: ${newStatus}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #7c2d12; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; }
            .footer { background: #374151; color: #d1d5db; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; }
            .status-update { background: #e7f3ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 20px 0; border-radius: 5px; }
            .button { display: inline-block; background: #7c2d12; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📋 Order Update</h1>
            </div>
            
            <div class="content">
              <h2>Hello ${order.user.name || 'User'},</h2>
              
              <div class="status-update">
                <h3>Order #${order.orderNumber} Status Update</h3>
                <p><strong>Previous Status:</strong> ${oldStatus}</p>
                <p><strong>New Status:</strong> ${newStatus}</p>
                <p>${statusMessages[newStatus] || 'Your order status has been updated'}</p>
              </div>
              
              <p><strong>Order Total:</strong> $${order.total.toFixed(2)}</p>
              <p><strong>Items:</strong> ${order.items.length} item(s)</p>
              
              <div style="text-align: center;">
                <a href="https://therusticroots.com.au/orders" class="button">View Order Details</a>
              </div>
              
              <p>Thank you for choosing Rustic Roots. We appreciate your patience as we craft your beautiful furniture with care.</p>
              
              <p>Questions? Contact us at <a href="mailto:admin@therusticroots.com.au">admin@therusticroots.com.au</a></p>
            </div>
            
            <div class="footer">
              <p><strong>Rustic Roots Trading Co.</strong></p>
              <p>ABN: 96 672 808 963</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Order #${order.orderNumber} Status Update
      
      Hello ${order.user.name || 'User'},
      
      Your order status has been updated:
      Previous: ${oldStatus}
      New: ${newStatus}
      
      ${statusMessages[newStatus] || 'Your order status has been updated'}
      
      Order Total: $${order.total.toFixed(2)}
      Items: ${order.items.length}
      
      Track your order: https://therusticroots.com.au/orders
      
      Questions? Contact admin@therusticroots.com.au
      
      Rustic Roots Trading Co.
    `
  }
}

// Send welcome email
export async function sendWelcomeEmail(user: EmailUser) {
  try {
    const transporter = createTransporter()
    const template = getWelcomeEmailTemplate(user)
    
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: user.email,
      subject: template.subject,
      html: template.html,
      text: template.text
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Welcome email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Failed to send welcome email:', error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

// Send password reset email
export async function sendPasswordResetEmail(user: EmailUser, resetToken: string) {
  try {
    const transporter = createTransporter()
    const template = getPasswordResetEmailTemplate(user, resetToken)
    
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: user.email,
      subject: template.subject,
      html: template.html,
      text: template.text
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Password reset email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Failed to send password reset email:', error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

// Send order confirmation email
export async function sendOrderConfirmationEmail(order: Order) {
  try {
    const transporter = createTransporter()
    const template = getOrderConfirmationEmailTemplate(order)
    
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: order.user.email,
      subject: template.subject,
      html: template.html,
      text: template.text
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Order confirmation email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Failed to send order confirmation email:', error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

// Send order status update email
export async function sendOrderStatusUpdateEmail(order: Order, oldStatus: string, newStatus: string) {
  try {
    const transporter = createTransporter()
    const template = getOrderStatusEmailTemplate(order, oldStatus, newStatus)
    
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: order.user.email,
      subject: template.subject,
      html: template.html,
      text: template.text
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Order status update email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Failed to send order status update email:', error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}