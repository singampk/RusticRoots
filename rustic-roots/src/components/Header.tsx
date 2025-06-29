'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useCart } from '../context/CartContext'

export default function Header() {
  const { data: session } = useSession()
  const { state } = useCart()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [cartAnimation, setCartAnimation] = useState(false)
  const [prevItemCount, setPrevItemCount] = useState(0)

  // Animate cart when item count changes
  useEffect(() => {
    if (state.itemCount > prevItemCount) {
      setCartAnimation(true)
      setTimeout(() => setCartAnimation(false), 600)
    }
    setPrevItemCount(state.itemCount)
  }, [state.itemCount, prevItemCount])

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-amber-800">
              Rustic Roots
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-amber-800">
              Home
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-amber-800">
              Products
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-amber-800">
              About
            </Link>
            <Link href="/custom" className="text-gray-700 hover:text-amber-800">
              Custom Builds
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-amber-800">
              Contact
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            <Link href="/cart" className={`relative text-gray-700 hover:text-amber-800 transition-transform duration-300 ${cartAnimation ? 'animate-bounce' : ''}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.8 9M7 13l-1.8 9m4.8-9h6m-6 0v4m6-4v4" />
              </svg>
              {state.itemCount > 0 && (
                <span className={`absolute -top-2 -right-2 bg-amber-800 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center transition-all duration-300 ${cartAnimation ? 'scale-125 bg-green-600' : ''}`}>
                  {state.itemCount}
                </span>
              )}
            </Link>

            {/* Desktop User Menu */}
            <div className="hidden md:block">
              {session ? (
                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-amber-800"
                  >
                    <span>{session.user?.name}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile
                      </Link>
                      <Link
                        href="/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        My Orders
                      </Link>
                      {session.user?.role === 'ADMIN' && (
                        <Link
                          href="/admin"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => signOut()}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex space-x-4">
                  <Link
                    href="/auth/signin"
                    className="text-gray-700 hover:text-amber-800"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="bg-amber-800 text-white px-4 py-2 rounded-md hover:bg-amber-900"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 hover:text-amber-800 focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              <Link
                href="/"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-amber-800 hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/products"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-amber-800 hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-amber-800 hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/custom"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-amber-800 hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Custom Builds
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-amber-800 hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
              
              {/* Mobile User Section */}
              <div className="pt-4 pb-3 border-t border-gray-200">
                {session ? (
                  <div className="space-y-1">
                    <div className="px-3 py-2 text-base font-medium text-gray-900">
                      {session.user?.name}
                    </div>
                    <Link
                      href="/profile"
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-amber-800 hover:bg-gray-50"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-amber-800 hover:bg-gray-50"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                    {session.user?.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-amber-800 hover:bg-gray-50"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        signOut()
                        setIsMobileMenuOpen(false)
                      }}
                      className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-amber-800 hover:bg-gray-50"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Link
                      href="/auth/signin"
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-amber-800 hover:bg-gray-50"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="block px-3 py-2 text-base font-medium bg-amber-800 text-white hover:bg-amber-900 mx-3 rounded-md"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}