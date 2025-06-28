import Header from '../../components/Header'

export default function Returns() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Returns & Exchanges</h1>
          <p className="text-xl text-gray-600">
            We want you to love your furniture. If you&apos;re not completely satisfied, here&apos;s what you need to know.
          </p>
        </div>

        {/* Return Policy Overview */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Return Policy</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">30-Day Window</h3>
              <p className="text-sm text-gray-600">Return standard items within 30 days of delivery</p>
            </div>
            
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Original Condition</h3>
              <p className="text-sm text-gray-600">Items must be unused and in original packaging</p>
            </div>
            
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Full Refund</h3>
              <p className="text-sm text-gray-600">Receive full refund minus return shipping</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="font-semibold text-blue-800 mb-1">Important Note</h4>
                <p className="text-blue-700 text-sm">
                  Custom and made-to-order pieces are non-returnable unless there is a manufacturing defect or the item was damaged during shipping.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* What Can Be Returned */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-bold text-green-800 mb-4">✅ Returnable Items</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <strong>Standard catalog items</strong>
                  <p className="text-sm text-gray-600">Items from our regular product line</p>
                </div>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <strong>Unused accessories</strong>
                  <p className="text-sm text-gray-600">Hardware, cushions, and add-ons</p>
                </div>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <strong>Defective items</strong>
                  <p className="text-sm text-gray-600">Items with manufacturing defects</p>
                </div>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <strong>Shipping damaged items</strong>
                  <p className="text-sm text-gray-600">Items damaged during transit</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-bold text-red-800 mb-4">❌ Non-Returnable Items</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-red-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <div>
                  <strong>Custom furniture</strong>
                  <p className="text-sm text-gray-600">Made-to-order pieces with custom specifications</p>
                </div>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-red-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <div>
                  <strong>Used or damaged items</strong>
                  <p className="text-sm text-gray-600">Items showing wear or customer damage</p>
                </div>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-red-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <div>
                  <strong>Items past 30 days</strong>
                  <p className="text-sm text-gray-600">Returns after the 30-day window</p>
                </div>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-red-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <div>
                  <strong>Final sale items</strong>
                  <p className="text-sm text-gray-600">Clearance and discontinued products</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* How to Return */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Return an Item</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-amber-800 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
              <h4 className="font-semibold text-gray-900 mb-2">Contact Us</h4>
              <p className="text-sm text-gray-600">Email or call to initiate your return request within 30 days</p>
            </div>
            <div className="text-center">
              <div className="bg-amber-800 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
              <h4 className="font-semibold text-gray-900 mb-2">Get Authorization</h4>
              <p className="text-sm text-gray-600">Receive your Return Authorization (RA) number and instructions</p>
            </div>
            <div className="text-center">
              <div className="bg-amber-800 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
              <h4 className="font-semibold text-gray-900 mb-2">Package & Ship</h4>
              <p className="text-sm text-gray-600">Carefully package the item and ship it back using our provided label</p>
            </div>
            <div className="text-center">
              <div className="bg-amber-800 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
              <h4 className="font-semibold text-gray-900 mb-2">Get Refund</h4>
              <p className="text-sm text-gray-600">Receive your refund within 5-7 business days after we receive the item</p>
            </div>
          </div>
        </div>

        {/* Exchanges */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Exchanges</h2>
          <p className="text-gray-600 mb-4">
            We&apos;re happy to help you exchange your item for a different size, color, or style. Exchanges follow the same process as returns, but we&apos;ll send your new item as soon as we receive the original.
          </p>
          <div className="bg-gray-50 rounded-md p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Exchange Benefits:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• No restocking fees for exchanges</li>
              <li>• Priority processing for replacement items</li>
              <li>• We&apos;ll cover return shipping for exchanges due to our error</li>
              <li>• Credit any price differences if exchanging for a less expensive item</li>
            </ul>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-amber-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Need to Start a Return?</h2>
          <p className="text-gray-600 mb-6">
            Contact our customer service team to get started. We&apos;re here to make the process as easy as possible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-amber-800 text-white px-6 py-3 rounded-md font-medium hover:bg-amber-900 transition-colors"
            >
              Contact Customer Service
            </a>
            <a
              href="mailto:returns@therusticroots.com.au"
              className="border border-amber-800 text-amber-800 px-6 py-3 rounded-md font-medium hover:bg-amber-50 transition-colors"
            >
              Email: returns@therusticroots.com.au
            </a>
            <a
              href="tel:(802) 555-0123"
              className="border border-amber-800 text-amber-800 px-6 py-3 rounded-md font-medium hover:bg-amber-50 transition-colors"
            >
              Call: (802) 555-0123
            </a>
          </div>
        </div>

        {/* Related Links */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <a
            href="/warranty"
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-gray-900 mb-2">Warranty Information</h3>
            <p className="text-sm text-gray-600">Learn about our lifetime warranty coverage</p>
          </a>
          <a
            href="/shipping"
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-gray-900 mb-2">Shipping Info</h3>
            <p className="text-sm text-gray-600">Delivery times and shipping policies</p>
          </a>
          <a
            href="/faq"
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-gray-900 mb-2">FAQ</h3>
            <p className="text-sm text-gray-600">Common questions and answers</p>
          </a>
        </div>
      </div>
    </div>
  )
}