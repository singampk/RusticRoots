'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '../context/CartContext'

interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
  stock: number
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { dispatch } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

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
    setIsAdding(true)
    
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0] || getFallbackImage(product.category, product.name)
      }
    })

    // Show success animation
    setTimeout(() => {
      setIsAdding(false)
      setShowSuccess(true)
      
      // Hide success message after 2 seconds
      setTimeout(() => {
        setShowSuccess(false)
      }, 2000)
    }, 500)
  }

  return (
    <div className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-w-3 aspect-h-4 bg-gray-200 overflow-hidden h-64">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            width={300}
            height={400}
            className="w-full h-full object-center object-cover group-hover:opacity-75 transition-opacity"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 uppercase tracking-wide">{product.category}</p>
          <p className="text-sm text-gray-500">{product.stock} in stock</p>
        </div>
        
        <Link href={`/products/${product.id}`}>
          <h3 className="mt-1 text-lg font-medium text-gray-900 hover:text-amber-800 cursor-pointer">
            {product.name}
          </h3>
        </Link>
        
        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
          {product.description}
        </p>
        
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xl font-bold text-amber-800">
            {formatPrice(product.price)}
          </p>
          
          <button 
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isAdding}
            className={`relative px-4 py-2 rounded-md font-medium transition-all duration-300 disabled:cursor-not-allowed ${
              showSuccess 
                ? 'bg-green-600 text-white' 
                : product.stock === 0 
                  ? 'bg-gray-400 text-white'
                  : isAdding
                    ? 'bg-amber-700 text-white scale-95'
                    : 'bg-amber-800 text-white hover:bg-amber-900 hover:scale-105'
            }`}
          >
            {showSuccess ? (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Added!
              </span>
            ) : isAdding ? (
              <span className="flex items-center">
                <svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </span>
            ) : product.stock === 0 ? (
              'Out of Stock'
            ) : (
              'Add to Cart'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}