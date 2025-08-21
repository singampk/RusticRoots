'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Header from '../../../components/Header'
import { useCart } from '../../../context/CartContext'

interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
  stock: number
  owner: {
    name: string
  }
  createdAt: string
}

export default function ProductDetail() {
  const params = useParams()
  const { dispatch } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (params?.id) {
      fetchProduct(params.id as string)
    }
  }, [params?.id])

  async function fetchProduct(id: string) {
    try {
      const response = await fetch(`/api/products/${id}`)
      if (response.ok) {
        const data = await response.json()
        setProduct(data.data)
      } else {
        setError('Product not found')
      }
    } catch {
      setError('Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const getFallbackImage = (category: string, name: string) => {
    const categoryLower = category.toLowerCase()
    const nameLower = name.toLowerCase()
    
    if (nameLower.includes('table') || categoryLower.includes('table')) {
      if (nameLower.includes('dining') || nameLower.includes('dinner')) {
        return '/images/dining-table.svg'
      } else if (nameLower.includes('coffee') || nameLower.includes('side')) {
        return '/images/coffee-table.svg'
      }
      return '/images/dining-table.svg'
    }
    
    if (nameLower.includes('chair') || categoryLower.includes('chair') || categoryLower.includes('seating')) {
      return '/images/rocking-chair.svg'
    }
    
    if (nameLower.includes('shelf') || nameLower.includes('bookcase') || categoryLower.includes('storage')) {
      return '/images/bookshelf.svg'
    }
    
    // Default fallback
    const images = ['/images/dining-table.svg', '/images/coffee-table.svg', '/images/rocking-chair.svg', '/images/bookshelf.svg']
    const hash = name.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0)
      return a & a
    }, 0)
    return images[Math.abs(hash) % images.length]
  }

  const handleAddToCart = async () => {
    if (!product) return

    setIsAdding(true)
    
    // Add multiple quantities to cart
    for (let i = 0; i < quantity; i++) {
      dispatch({
        type: 'ADD_ITEM',
        payload: {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0] || getFallbackImage(product.category, product.name)
        }
      })
    }

    // Show success animation
    setTimeout(() => {
      setIsAdding(false)
      setShowSuccess(true)
      
      setTimeout(() => {
        setShowSuccess(false)
      }, 2000)
    }, 500)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-xl">Loading product...</div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-white rounded-lg shadow-sm p-12">
              <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 4a7.962 7.962 0 01-6 7.291M12 20h.01" />
              </svg>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
              <p className="text-gray-600 mb-6">{error}</p>
              <Link
                href="/products"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-800 hover:bg-amber-900"
              >
                ← Back to Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                Home
              </Link>
            </li>
            <li>
              <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
            <li>
              <Link href="/products" className="text-gray-500 hover:text-gray-700">
                Products
              </Link>
            </li>
            <li>
              <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
            <li className="text-gray-900 font-medium">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
          {/* Image gallery */}
          <div className="flex flex-col-reverse">
            {/* Image selector */}
            <div className="hidden mt-6 w-full max-w-2xl mx-auto sm:block lg:max-w-none">
              <div className="grid grid-cols-4 gap-6">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-24 bg-white rounded-md flex items-center justify-center text-sm font-medium uppercase text-gray-900 cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring focus:ring-offset-4 focus:ring-amber-500 ${
                      index === selectedImage ? 'ring-2 ring-amber-500' : ''
                    }`}
                  >
                    <span className="sr-only">Image {index + 1}</span>
                    <span className="absolute inset-0 rounded-md overflow-hidden">
                      {image && !image.includes('placeholder-furniture.svg') ? (
                        <Image
                          src={image}
                          alt={`${product.name} view ${index + 1}`}
                          fill
                          className="w-full h-full object-center object-cover"
                        />
                      ) : (
                        <Image
                          src={getFallbackImage(product.category, product.name)}
                          alt={`${product.name} view ${index + 1}`}
                          fill
                          className="w-full h-full object-center object-cover"
                        />
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Main image */}
            <div className="w-full aspect-w-1 aspect-h-1">
              <div className="w-full h-96 sm:h-[500px] bg-white rounded-lg overflow-hidden relative">
                {product.images[selectedImage] && !product.images[selectedImage].includes('placeholder-furniture.svg') ? (
                  <Image
                    src={product.images[selectedImage]}
                    alt={product.name}
                    fill
                    className="w-full h-full object-center object-cover"
                  />
                ) : (
                  <Image
                    src={getFallbackImage(product.category, product.name)}
                    alt={product.name}
                    fill
                    className="w-full h-full object-center object-cover"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Product info */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{product.name}</h1>

            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl tracking-tight text-amber-800 font-bold">{formatPrice(product.price)}</p>
            </div>

            {/* Category and Stock */}
            <div className="mt-6">
              <div className="flex items-center space-x-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                  {product.category}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div className="text-base text-gray-700 space-y-6">
                <p>{product.description}</p>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="mt-8">
              <div className="flex items-center space-x-4 mb-6">
                <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                  Quantity:
                </label>
                <div className="flex items-center">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-8 h-8 rounded-l-md border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-700 font-semibold"
                  >
                    -
                  </button>
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                    className="w-16 text-center border-t border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900 font-semibold"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="w-8 h-8 rounded-r-md border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-700 font-semibold"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isAdding}
                className={`w-full flex justify-center items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white transition-all duration-300 ${
                  showSuccess 
                    ? 'bg-green-600' 
                    : product.stock === 0 
                      ? 'bg-gray-400 cursor-not-allowed'
                      : isAdding
                        ? 'bg-amber-700 scale-95'
                        : 'bg-amber-800 hover:bg-amber-900 hover:scale-105'
                }`}
              >
                {showSuccess ? (
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Added to Cart!
                  </span>
                ) : isAdding ? (
                  <span className="flex items-center">
                    <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding to Cart...
                  </span>
                ) : product.stock === 0 ? (
                  'Out of Stock'
                ) : (
                  `Add ${quantity} to Cart`
                )}
              </button>
            </div>

            {/* Product Details */}
            <div className="mt-8 border-t border-gray-200 pt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Product Details</h3>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Crafted by</dt>
                  <dd className="text-sm text-gray-900">{product.owner.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Category</dt>
                  <dd className="text-sm text-gray-900">{product.category}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Added</dt>
                  <dd className="text-sm text-gray-900">
                    {new Date(product.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Features */}
            <div className="mt-8 border-t border-gray-200 pt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Features</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Handcrafted with premium materials
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Lifetime warranty included
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Free shipping within continental US
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  White glove delivery service
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">You might also like</h2>
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500">Related products will be shown here</p>
            <Link
              href="/products"
              className="inline-flex items-center mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-amber-800 bg-amber-100 hover:bg-amber-200"
            >
              Browse All Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}