import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
// import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from '../../../lib/prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        console.log('NextAuth authorize called with email:', credentials?.email)
        
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials')
          return null
        }

        try {
          console.log('Connecting to database...')
          await prisma.$connect()
          
          console.log('Looking up user:', credentials.email)
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          })

          if (!user) {
            console.log('User not found:', credentials.email)
            return null
          }

          console.log('User found, checking password...')
          console.log('Stored hash:', user.password)
          console.log('Provided password length:', credentials.password.length)
          
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
          console.log('Password valid:', isPasswordValid)

          if (!isPasswordValid) {
            console.log('Invalid password for user:', credentials.email)
            return null
          }

          console.log('Authentication successful for user:', user.email)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          }
        } catch (error) {
          console.error('NextAuth authorize error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
  logger: {
    error(code, metadata) {
      console.error('NextAuth Error:', code, metadata)
    },
    warn(code) {
      console.warn('NextAuth Warning:', code)
    },
    debug(code, metadata) {
      console.log('NextAuth Debug:', code, metadata)
    }
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin'
  }
}

export default NextAuth(authOptions)