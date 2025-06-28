import Header from '../../components/Header'

export default function Shipping() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Shipping Information</h1>
          <p className="text-xl text-gray-600">
            Learn about our shipping policies, delivery times, and what to expect when your furniture arrives.
          </p>
        </div>

        {/* Free Shipping Banner */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h2 className="text-2xl font-bold text-green-800">Free Shipping on All Orders!</h2>
          </div>
          <p className="text-green-700">
            We provide complimentary shipping within the continental United States for all furniture orders.
          </p>
        </div>

        {/* Shipping Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Standard Items</h3>
            <p className="text-gray-600">2-3 weeks delivery for in-stock furniture</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-amber-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Custom Orders</h3>
            <p className="text-gray-600">6-12 weeks for made-to-order pieces</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Professional Delivery</h3>
            <p className="text-gray-600">White glove service with setup included</p>
          </div>
        </div>

        {/* Shipping Zones */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Zones & Costs</h2>
          
          <div className="space-y-6">
            <div className="border border-green-200 rounded-lg p-4 bg-green-50">
              <div className="flex items-center mb-3">
                <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <h3 className="text-lg font-semibold text-green-800">Continental United States</h3>
              </div>
              <p className="text-green-700 mb-2"><strong>Cost:</strong> FREE shipping on all orders</p>
              <p className="text-green-700"><strong>Delivery:</strong> Standard 2-3 weeks, Custom 6-12 weeks</p>
            </div>

            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
              <div className="flex items-center mb-3">
                <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-blue-800">Alaska & Hawaii</h3>
              </div>
              <p className="text-blue-700 mb-2"><strong>Cost:</strong> Calculated based on size and weight</p>
              <p className="text-blue-700"><strong>Delivery:</strong> Additional 1-2 weeks</p>
            </div>

            <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
              <div className="flex items-center mb-3">
                <svg className="w-6 h-6 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-purple-800">International</h3>
              </div>
              <p className="text-purple-700 mb-2"><strong>Cost:</strong> Quote provided upon request</p>
              <p className="text-purple-700"><strong>Delivery:</strong> 4-8 weeks depending on destination</p>
            </div>
          </div>
        </div>

        {/* Delivery Process */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What to Expect</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-amber-800 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
              <h4 className="font-semibold text-gray-900 mb-2">Order Confirmation</h4>
              <p className="text-sm text-gray-600">Receive detailed timeline and tracking information</p>
            </div>
            <div className="text-center">
              <div className="bg-amber-800 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
              <h4 className="font-semibold text-gray-900 mb-2">Production Updates</h4>
              <p className="text-sm text-gray-600">Regular updates on your order&apos;s progress</p>
            </div>
            <div className="text-center">
              <div className="bg-amber-800 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
              <h4 className="font-semibold text-gray-900 mb-2">Delivery Scheduling</h4>
              <p className="text-sm text-gray-600">We&apos;ll contact you to schedule a convenient delivery time</p>
            </div>
            <div className="text-center">
              <div className="bg-amber-800 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
              <h4 className="font-semibold text-gray-900 mb-2">White Glove Delivery</h4>
              <p className="text-sm text-gray-600">Professional setup and packaging removal</p>
            </div>
          </div>
        </div>

        {/* White Glove Service */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">White Glove Delivery Service</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What&apos;s Included:</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Scheduled delivery appointment
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Careful transport by professionals
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Placement in desired room
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Assembly if required
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Packaging removal and disposal
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Basic setup and positioning
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Preparation:</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-amber-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Clear pathway to delivery room
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-amber-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Measure doorways and staircases
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-amber-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Remove existing furniture if needed
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-amber-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Be available during delivery window
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-amber-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Protect flooring if desired
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Packaging & Protection */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Packaging & Protection</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">How We Protect Your Furniture</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <div>
                    <strong>Corner protection:</strong> Foam and cardboard guards on all edges
                  </div>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <div>
                    <strong>Surface protection:</strong> Soft blankets and plastic wrap
                  </div>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <div>
                    <strong>Cushioning:</strong> Bubble wrap and foam for delicate areas
                  </div>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <div>
                    <strong>Custom crating:</strong> Wooden crates for valuable pieces
                  </div>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Inspection Upon Delivery</h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-yellow-800 mb-2">Important:</p>
                    <p className="text-yellow-700 text-sm">
                      Please inspect your furniture immediately upon delivery. 
                      Report any damage within 48 hours for fastest resolution.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Special Circumstances */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Special Delivery Circumstances</h2>
          
          <div className="space-y-6">
            <div className="border-l-4 border-orange-500 pl-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Apartment/Condo Deliveries</h3>
              <p className="text-gray-600 mb-3">
                Please ensure building access and elevator availability. Additional fees may apply for stairs above the 2nd floor.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Provide building access codes</li>
                <li>• Reserve freight elevator if needed</li>
                <li>• Check weight limits for elevators</li>
                <li>• Coordinate with building management</li>
              </ul>
            </div>

            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Remote/Rural Deliveries</h3>
              <p className="text-gray-600 mb-3">
                Deliveries to rural areas may require additional time and coordination. We&apos;ll contact you to arrange details.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Clear directions to your location</li>
                <li>• Accessible roads for delivery truck</li>
                <li>• May require customer pickup at depot</li>
                <li>• Additional fees may apply</li>
              </ul>
            </div>

            <div className="border-l-4 border-green-500 pl-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Installation Services</h3>
              <p className="text-gray-600 mb-3">
                Professional installation available for built-in units and complex assemblies.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Wall mounting and securing</li>
                <li>• Built-in furniture installation</li>
                <li>• Custom fitting and adjustments</li>
                <li>• Quote provided upon request</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact for Shipping */}
        <div className="bg-amber-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions About Shipping?</h2>
          <p className="text-gray-600 mb-6">
            Our logistics team is here to help with any shipping questions or special requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-amber-800 text-white px-6 py-3 rounded-md font-medium hover:bg-amber-900 transition-colors"
            >
              Contact Shipping Team
            </a>
            <a
              href="mailto:shipping@therusticroots.com.au"
              className="border border-amber-800 text-amber-800 px-6 py-3 rounded-md font-medium hover:bg-amber-50 transition-colors"
            >
              Email: shipping@therusticroots.com.au
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
            href="/returns"
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-gray-900 mb-2">Returns Policy</h3>
            <p className="text-sm text-gray-600">Information about returns and exchanges</p>
          </a>
          <a
            href="/warranty"
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-gray-900 mb-2">Warranty</h3>
            <p className="text-sm text-gray-600">Learn about our lifetime warranty</p>
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