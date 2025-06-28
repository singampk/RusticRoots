import Header from '../../components/Header'

export default function Warranty() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Lifetime Warranty</h1>
          <p className="text-xl text-gray-600">
            We stand behind our craftsmanship with a comprehensive lifetime warranty on all our furniture.
          </p>
        </div>

        {/* Warranty Overview */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="text-center mb-8">
            <div className="bg-amber-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-amber-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Promise to You</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Every piece of Rustic Roots furniture comes with our lifetime warranty, reflecting our confidence 
              in our craftsmanship and commitment to your satisfaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Structural Integrity</h3>
              <p className="text-sm text-gray-600">Lifetime protection against structural defects and joint failures</p>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Craftsmanship</h3>
              <p className="text-sm text-gray-600">Coverage for any manufacturing defects or workmanship issues</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-purple-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Peace of Mind</h3>
              <p className="text-sm text-gray-600">Transferable warranty that protects your investment for life</p>
            </div>
          </div>
        </div>

        {/* What&apos;s Covered */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-bold text-green-800 mb-4">✅ What&apos;s Covered</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <strong>Structural defects</strong>
                  <p className="text-sm text-gray-600">Joint failures, frame damage, or structural weakening</p>
                </div>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <strong>Manufacturing defects</strong>
                  <p className="text-sm text-gray-600">Poor workmanship, faulty materials, or assembly errors</p>
                </div>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <strong>Hardware failures</strong>
                  <p className="text-sm text-gray-600">Hinges, drawer slides, and other mechanical components</p>
                </div>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <strong>Finish defects</strong>
                  <p className="text-sm text-gray-600">Premature finish failure due to manufacturing issues</p>
                </div>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <strong>Wood splitting</strong>
                  <p className="text-sm text-gray-600">Splits or cracks not caused by environmental factors</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-bold text-red-800 mb-4">❌ What&apos;s Not Covered</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-red-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <div>
                  <strong>Normal wear and tear</strong>
                  <p className="text-sm text-gray-600">Expected aging, patina development, or daily use marks</p>
                </div>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-red-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <div>
                  <strong>Accidental damage</strong>
                  <p className="text-sm text-gray-600">Scratches, dents, burns, or stains from accidents</p>
                </div>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-red-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <div>
                  <strong>Environmental damage</strong>
                  <p className="text-sm text-gray-600">Water damage, sun fading, or extreme temperature effects</p>
                </div>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-red-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <div>
                  <strong>Misuse or abuse</strong>
                  <p className="text-sm text-gray-600">Damage from improper use or excessive weight</p>
                </div>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-red-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <div>
                  <strong>Natural wood movement</strong>
                  <p className="text-sm text-gray-600">Seasonal expansion, contraction, or minor warping</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Warranty Claims Process */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How to File a Warranty Claim</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-amber-800 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
              <h4 className="font-semibold text-gray-900 mb-2">Document the Issue</h4>
              <p className="text-sm text-gray-600">Take clear photos showing the defect or problem area</p>
            </div>
            <div className="text-center">
              <div className="bg-amber-800 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
              <h4 className="font-semibold text-gray-900 mb-2">Contact Us</h4>
              <p className="text-sm text-gray-600">Submit your claim with photos and order information</p>
            </div>
            <div className="text-center">
              <div className="bg-amber-800 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
              <h4 className="font-semibold text-gray-900 mb-2">Assessment</h4>
              <p className="text-sm text-gray-600">Our team reviews your claim and determines coverage</p>
            </div>
            <div className="text-center">
              <div className="bg-amber-800 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
              <h4 className="font-semibold text-gray-900 mb-2">Resolution</h4>
              <p className="text-sm text-gray-600">We repair, replace, or refund based on the situation</p>
            </div>
          </div>

          <div className="mt-8 bg-amber-50 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-3">What to Include in Your Claim:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Order number or receipt</li>
                <li>• Clear photos of the issue</li>
                <li>• Description of the problem</li>
                <li>• Purchase date</li>
              </ul>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Model or product name</li>
                <li>• When the issue was first noticed</li>
                <li>• Any relevant circumstances</li>
                <li>• Preferred resolution (if any)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Resolution Options */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Resolution Options</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border-2 border-amber-200 rounded-lg">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Repair</h3>
              <p className="text-sm text-gray-600">
                We&apos;ll provide repair instructions, replacement parts, or arrange professional repair service.
              </p>
            </div>
            
            <div className="text-center p-4 border-2 border-amber-200 rounded-lg">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Replace</h3>
              <p className="text-sm text-gray-600">
                For significant defects, we&apos;ll create a replacement piece to match your original specifications.
              </p>
            </div>
            
            <div className="text-center p-4 border-2 border-amber-200 rounded-lg">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Refund</h3>
              <p className="text-sm text-gray-600">
                In cases where repair or replacement isn&apos;t feasible, we&apos;ll provide a full refund of your purchase price.
              </p>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-bold text-blue-800 mb-4">Important Warranty Information</h3>
          <div className="space-y-3 text-blue-700">
            <p><strong>Transferable:</strong> Our warranty transfers to new owners with proof of original purchase.</p>
            <p><strong>Registration:</strong> While not required, registering your purchase helps expedite warranty claims.</p>
            <p><strong>Response Time:</strong> We respond to warranty claims within 2-3 business days.</p>
            <p><strong>No Time Limit:</strong> Our lifetime warranty has no expiration date for covered defects.</p>
          </div>
        </div>

        {/* Contact for Claims */}
        <div className="bg-amber-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">File a Warranty Claim</h2>
          <p className="text-gray-600 mb-6">
            Ready to file a warranty claim? Contact our customer service team and we&apos;ll take care of you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-amber-800 text-white px-6 py-3 rounded-md font-medium hover:bg-amber-900 transition-colors"
            >
              Submit Warranty Claim
            </a>
            <a
              href="mailto:warranty@therusticroots.com.au"
              className="border border-amber-800 text-amber-800 px-6 py-3 rounded-md font-medium hover:bg-amber-50 transition-colors"
            >
              Email: warranty@therusticroots.com.au
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
            href="/care"
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-gray-900 mb-2">Care Instructions</h3>
            <p className="text-sm text-gray-600">Keep your furniture in perfect condition</p>
          </a>
          <a
            href="/returns"
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-gray-900 mb-2">Returns Policy</h3>
            <p className="text-sm text-gray-600">Information about returns and exchanges</p>
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