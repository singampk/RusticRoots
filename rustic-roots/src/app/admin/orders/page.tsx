'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '../../../components/Header'

type OrderStatus = 'RECEIVED_ORDER' | 'REVIEWING_ORDER' | 'WORK_IN_PROGRESS' | 'IN_SHIPPING' | 'DELIVERED'

interface Order {
  id: string
  total: number
  subtotal: number
  discountAmount: number
  status: OrderStatus
  notes: string | null
  promotionCode: string | null
  promotionSnapshot: object | null
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    email: string
  }
  items: {
    id: string
    quantity: number
    price: number
    product: {
      id: string
      name: string
      price: number
    }
  }[]
  promotion: {
    id: string
    name: string
    code: string
    type: string
    value: number
  } | null
}

const ORDER_STATUSES: { value: OrderStatus; label: string; color: string }[] = [
  { value: 'RECEIVED_ORDER', label: 'Received Order', color: 'bg-blue-100 text-blue-800' },
  { value: 'REVIEWING_ORDER', label: 'Reviewing Order', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'WORK_IN_PROGRESS', label: 'Work In Progress', color: 'bg-purple-100 text-purple-800' },
  { value: 'IN_SHIPPING', label: 'In Shipping', color: 'bg-orange-100 text-orange-800' },
  { value: 'DELIVERED', label: 'Delivered', color: 'bg-green-100 text-green-800' }
]

export default function AdminOrders() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [filter, setFilter] = useState<OrderStatus | 'ALL'>('ALL')
  const [editingNotes, setEditingNotes] = useState<string | null>(null)
  const [notesValue, setNotesValue] = useState('')

  useEffect(() => {
    console.log('Session status:', status)
    console.log('Session data:', session)
    
    if (status === 'loading') return
    if (!session || session.user?.role !== 'ADMIN') {
      console.log('Redirecting: no session or not admin')
      router.push('/')
      return
    }
    
    console.log('Admin authenticated, fetching orders...')
    fetchOrders()
  }, [session, status, router])

  async function fetchOrders() {
    try {
      const response = await fetch('/api/orders', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      console.log('Orders API response status:', response.status)
      
      if (response.ok) {
        const ordersData = await response.json()
        console.log('Orders data received:', ordersData.length, 'orders')
        setOrders(ordersData)
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('Failed to fetch orders:', response.status, errorData)
        if (response.status === 401) {
          setError('Failed to fetch orders: Not authenticated. Please log in as admin.')
        } else if (response.status === 403) {
          setError('Failed to fetch orders: Access denied. Admin role required.')
        } else {
          setError(`Failed to fetch orders: ${response.status} ${errorData.error || ''}`)
        }
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
      setError('Failed to fetch orders: Network error')
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    setUpdating(orderId)
    setError('')

    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        const { data: updatedOrder } = await response.json()
        setOrders(prev => prev.map(order => 
          order.id === orderId ? updatedOrder : order
        ))
        setSuccess(`Order status updated to ${ORDER_STATUSES.find(s => s.value === newStatus)?.label}`)
        setTimeout(() => setSuccess(''), 3000)
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to update order status')
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      setError('Network error occurred')
    } finally {
      setUpdating(null)
    }
  }

  const startEditingNotes = (orderId: string, currentNotes: string | null) => {
    setEditingNotes(orderId)
    setNotesValue(currentNotes || '')
  }

  const cancelEditingNotes = () => {
    setEditingNotes(null)
    setNotesValue('')
  }

  const updateOrderNotes = async (orderId: string) => {
    setError('')

    try {
      const response = await fetch(`/api/orders/${orderId}/notes`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ notes: notesValue.trim() || null })
      })

      if (response.ok) {
        const { data: updatedOrder } = await response.json()
        setOrders(prev => prev.map(order => 
          order.id === orderId ? updatedOrder : order
        ))
        setSuccess('Order notes updated successfully')
        setTimeout(() => setSuccess(''), 3000)
        setEditingNotes(null)
        setNotesValue('')
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to update order notes')
      }
    } catch (error) {
      console.error('Error updating order notes:', error)
      setError('Network error occurred')
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusInfo = (status: OrderStatus) => {
    return ORDER_STATUSES.find(s => s.value === status) || ORDER_STATUSES[0]
  }

  const filteredOrders = filter === 'ALL' 
    ? orders 
    : orders.filter(order => order.status === filter)

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-xl">Loading...</div>
        </div>
      </div>
    )
  }

  if (!session || session.user?.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
              <p className="text-gray-600">Manage order statuses and track fulfillment</p>
            </div>
            <Link
              href="/admin"
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{success}</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
              <button
                onClick={() => setError('')}
                className="ml-auto text-red-400 hover:text-red-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'ALL'
                  ? 'bg-amber-800 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              All Orders ({orders.length})
            </button>
            {ORDER_STATUSES.map(status => (
              <button
                key={status.value}
                onClick={() => setFilter(status.value)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === status.value
                    ? 'bg-amber-800 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                {status.label} ({orders.filter(o => o.status === status.value).length})
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Promotion
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => {
                  const statusInfo = getStatusInfo(order.status)
                  return (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            #{order.id.slice(-8)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDate(order.createdAt)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.user.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {order.items.map((item, index) => (
                            <div key={item.id} className={index > 0 ? 'mt-1' : ''}>
                              {item.quantity}x {item.product.name}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="font-medium">
                            {formatPrice(order.total)}
                          </div>
                          {order.discountAmount > 0 && (
                            <div className="text-xs text-gray-500">
                              Subtotal: {formatPrice(order.subtotal)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {order.promotion ? (
                          <div className="text-sm">
                            <div className="text-xs font-medium text-green-800 bg-green-100 px-2 py-1 rounded-full inline-block">
                              {order.promotion.code}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              {order.promotion.name}
                            </div>
                            <div className="text-xs text-red-600 font-medium">
                              -{formatPrice(order.discountAmount)}
                            </div>
                          </div>
                        ) : order.promotionCode ? (
                          <div className="text-sm">
                            <div className="text-xs font-medium text-green-800 bg-green-100 px-2 py-1 rounded-full inline-block">
                              {order.promotionCode}
                            </div>
                            <div className="text-xs text-red-600 font-medium">
                              -{formatPrice(order.discountAmount)}
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">No promotion</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                        {order.updatedAt !== order.createdAt && (
                          <div className="text-xs text-gray-500 mt-1">
                            Updated: {formatDate(order.updatedAt)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {editingNotes === order.id ? (
                          <div className="space-y-2">
                            <textarea
                              value={notesValue}
                              onChange={(e) => setNotesValue(e.target.value)}
                              placeholder="Add notes for this order..."
                              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-gray-900"
                              rows={3}
                            />
                            <div className="flex space-x-2">
                              <button
                                onClick={() => updateOrderNotes(order.id)}
                                className="px-3 py-1 bg-amber-800 text-white text-xs rounded hover:bg-amber-900"
                              >
                                Save
                              </button>
                              <button
                                onClick={cancelEditingNotes}
                                className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="max-w-xs">
                            {order.notes ? (
                              <div>
                                <p className="text-sm text-gray-900 mb-1 break-words">{order.notes}</p>
                                <button
                                  onClick={() => startEditingNotes(order.id, order.notes)}
                                  className="text-xs text-amber-600 hover:text-amber-800"
                                >
                                  Edit notes
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => startEditingNotes(order.id, null)}
                                className="text-xs text-gray-500 hover:text-amber-600"
                              >
                                Add notes
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex flex-col space-y-1">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                            disabled={updating === order.id}
                            className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50 bg-white text-gray-900"
                          >
                            {ORDER_STATUSES.map(status => (
                              <option key={status.value} value={status.value}>
                                {status.label}
                              </option>
                            ))}
                          </select>
                          {updating === order.id && (
                            <div className="text-xs text-amber-600">Updating...</div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filter === 'ALL' ? 'No orders have been placed yet.' : `No orders with status "${ORDER_STATUSES.find(s => s.value === filter)?.label}".`}
              </p>
            </div>
          )}
        </div>

        {/* Order Status Legend */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Order Status Guide</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {ORDER_STATUSES.map((status, index) => (
              <div key={status.value} className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center mb-2">
                  <span className="text-lg font-bold text-gray-900 mr-2">{index + 1}.</span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${status.color}`}>
                    {status.label}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {status.value === 'RECEIVED_ORDER' && 'Order has been received and is awaiting review.'}
                  {status.value === 'REVIEWING_ORDER' && 'Order details are being reviewed and confirmed.'}
                  {status.value === 'WORK_IN_PROGRESS' && 'Furniture is being crafted in the workshop.'}
                  {status.value === 'IN_SHIPPING' && 'Order has been shipped and is in transit.'}
                  {status.value === 'DELIVERED' && 'Order has been successfully delivered to customer.'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}