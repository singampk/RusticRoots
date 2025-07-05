'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import Header from '../../components/Header'
import { useCart } from '../../context/CartContext'

export default function Cart() {
  const { state, dispatch, applyPromotion, removePromotion } = useCart()
  const [promoCode, setPromoCode] = useState('')
  const [promoLoading, setPromoLoading] = useState(false)
  const [promoError, setPromoError] = useState('')

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { id, quantity }
    })
  }

  const removeItem = (id: string) => {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: id
    })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const handleApplyPromotion = async () => {
    if (!promoCode.trim()) return

    setPromoLoading(true)
    setPromoError('')

    const result = await applyPromotion(promoCode.trim())

    if (result.success) {
      setPromoCode('')
      setPromoError('')
    } else {
      setPromoError(result.error || 'Failed to apply promotion')
    }

    setPromoLoading(false)
  }

  const handleRemovePromotion = () => {
    removePromotion()
    setPromoCode('')
    setPromoError('')
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center bg-white rounded-lg shadow-sm p-12">
            <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.8 9M7 13l-1.8 9m4.8-9h6m-6 0v4m6-4v4" />
            </svg>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-lg text-gray-600 mb-8">Get started by adding some items to your cart.</p>
            <div className="space-y-4">
              <Link
                href="/products"
                className="inline-block bg-amber-800 text-white px-8 py-3 rounded-md font-medium hover:bg-amber-900 transition-colors text-lg"
              >
                Continue Shopping
              </Link>
              <p className="text-sm text-gray-500">
                Browse our collection of handcrafted wooden furniture
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">Review your items and proceed to checkout when ready.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">
                    Cart Items ({state.itemCount})
                  </h2>
                  <button
                    onClick={clearCart}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {state.items.map((item) => (
                  <div key={item.id} className="p-6 flex">
                    <div className="flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={96}
                        height={96}
                        className="w-24 h-24 rounded-md object-center object-cover"
                      />
                    </div>
                    
                    <div className="ml-6 flex-1 flex flex-col">
                      <div className="flex">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-lg font-medium text-gray-900">
                            {item.name}
                          </h3>
                          <p className="text-lg font-bold text-amber-800">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                        
                        <div className="ml-4 flex-shrink-0">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex items-center">
                        <label htmlFor={`quantity-${item.id}`} className="text-sm text-gray-700 mr-2">
                          Quantity:
                        </label>
                        <div className="flex items-center">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 rounded-l-md border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-gray-700 font-semibold"
                          >
                            -
                          </button>
                          <input
                            id={`quantity-${item.id}`}
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                            className="w-16 text-center border-t border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900 font-semibold"
                          />
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-r-md border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-gray-700 font-semibold"
                          >
                            +
                          </button>
                        </div>
                        
                        <div className="ml-auto">
                          <p className="text-lg font-bold text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
              
              {/* Promotion Code Section */}
              <div className="mb-6">
                <label htmlFor="promoCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Promotion Code
                </label>
                {state.appliedPromotion ? (
                  <div className="bg-green-50 border border-green-200 rounded-md p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-800">
                          {state.appliedPromotion.name}
                        </p>
                        <p className="text-xs text-green-600">
                          Code: {state.appliedPromotion.code}
                        </p>
                      </div>
                      <button
                        onClick={handleRemovePromotion}
                        className="text-green-600 hover:text-green-800 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex">
                    <input
                      id="promoCode"
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter promotion code"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 bg-white"
                    />
                    <button
                      onClick={handleApplyPromotion}
                      disabled={promoLoading || !promoCode.trim()}
                      className="px-4 py-2 bg-amber-800 text-white rounded-r-md hover:bg-amber-900 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-medium"
                    >
                      {promoLoading ? 'Applying...' : 'Apply'}
                    </button>
                  </div>
                )}
                {promoError && (
                  <p className="mt-2 text-sm text-red-600">{promoError}</p>
                )}
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between py-2">
                  <span className="text-gray-700 font-medium">Subtotal</span>
                  <span className="font-bold text-gray-900">{formatPrice(state.subtotal)}</span>
                </div>
                
                {state.appliedPromotion && state.discountAmount > 0 && (
                  <div className="flex justify-between py-2">
                    <span className="text-green-700 font-medium">
                      Discount ({state.appliedPromotion.code})
                    </span>
                    <span className="font-bold text-green-600">
                      -{formatPrice(state.discountAmount)}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between py-2">
                  <span className="text-gray-700 font-medium">Shipping</span>
                  <span className="font-bold text-green-600">Free</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-700 font-medium">Tax (8%)</span>
                  <span className="font-bold text-gray-900">{formatPrice(state.total * 0.08)}</span>
                </div>
                <div className="border-t border-gray-300 pt-4">
                  <div className="flex justify-between">
                    <span className="text-xl font-bold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-amber-800">
                      {formatPrice(state.total * 1.08)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <Link
                  href="/checkout"
                  className="w-full bg-amber-800 text-white px-6 py-3 rounded-md font-medium hover:bg-amber-900 transition-colors flex items-center justify-center"
                >
                  Proceed to Checkout
                </Link>
                <Link
                  href="/products"
                  className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}