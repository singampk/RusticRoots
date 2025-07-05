'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface Promotion {
  id: string
  name: string
  description: string
  code: string
  type: 'FIXED_AMOUNT' | 'PERCENTAGE'
  value: number
  maxDiscount?: number
  minOrderValue?: number
}

interface CartState {
  items: CartItem[]
  total: number
  subtotal: number
  discountAmount: number
  itemCount: number
  appliedPromotion: Promotion | null
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }
  | { type: 'APPLY_PROMOTION'; payload: { promotion: Promotion; discountAmount: number } }
  | { type: 'REMOVE_PROMOTION' }

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
  applyPromotion: (code: string) => Promise<{ success: boolean; error?: string }>
  removePromotion: () => void
} | null>(null)

function calculateTotals(items: CartItem[], _appliedPromotion?: Promotion | null, discountAmount: number = 0) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const total = subtotal - discountAmount
  
  return { subtotal, total, itemCount, discountAmount }
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id)
      
      let newItems: CartItem[]
      if (existingItem) {
        newItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        newItems = [...state.items, { ...action.payload, quantity: 1 }]
      }
      
      const totals = calculateTotals(newItems, state.appliedPromotion, state.discountAmount)
      
      return { 
        items: newItems, 
        appliedPromotion: state.appliedPromotion,
        ...totals
      }
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload)
      const totals = calculateTotals(newItems, state.appliedPromotion, state.discountAmount)
      
      return { 
        items: newItems, 
        appliedPromotion: state.appliedPromotion,
        ...totals
      }
    }
    
    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter(item => item.quantity > 0)
      
      const totals = calculateTotals(newItems, state.appliedPromotion, state.discountAmount)
      
      return { 
        items: newItems, 
        appliedPromotion: state.appliedPromotion,
        ...totals
      }
    }
    
    case 'CLEAR_CART':
      return { 
        items: [], 
        subtotal: 0,
        total: 0, 
        discountAmount: 0,
        itemCount: 0,
        appliedPromotion: null
      }
    
    case 'LOAD_CART': {
      const totals = calculateTotals(action.payload)
      
      return { 
        items: action.payload, 
        appliedPromotion: null,
        ...totals
      }
    }
    
    case 'APPLY_PROMOTION': {
      const totals = calculateTotals(state.items, action.payload.promotion, action.payload.discountAmount)
      
      return {
        ...state,
        appliedPromotion: action.payload.promotion,
        ...totals
      }
    }
    
    case 'REMOVE_PROMOTION': {
      const totals = calculateTotals(state.items)
      
      return {
        ...state,
        appliedPromotion: null,
        ...totals
      }
    }
    
    default:
      return state
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    subtotal: 0,
    total: 0,
    discountAmount: 0,
    itemCount: 0,
    appliedPromotion: null
  })

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('rustic-roots-cart')
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart)
        dispatch({ type: 'LOAD_CART', payload: items })
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('rustic-roots-cart', JSON.stringify(state.items))
  }, [state.items])

  const applyPromotion = async (code: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/promotions/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          orderTotal: state.subtotal,
        }),
      })

      const result = await response.json()

      if (result.isValid) {
        dispatch({
          type: 'APPLY_PROMOTION',
          payload: {
            promotion: result.promotion,
            discountAmount: result.discountAmount,
          },
        })
        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch (error) {
      console.error('Error applying promotion:', error)
      return { success: false, error: 'Failed to apply promotion' }
    }
  }

  const removePromotion = () => {
    dispatch({ type: 'REMOVE_PROMOTION' })
  }

  return (
    <CartContext.Provider value={{ 
      state, 
      dispatch, 
      applyPromotion, 
      removePromotion 
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}