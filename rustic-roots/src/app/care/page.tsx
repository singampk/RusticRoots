import Header from '../../components/Header'

export default function Care() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Furniture Care Guide</h1>
          <p className="text-xl text-gray-600">
            Keep your handcrafted wooden furniture looking beautiful for generations with proper care and maintenance.
          </p>
        </div>

        {/* Care Overview */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Care Principles</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Avoid Direct Sunlight</h3>
              <p className="text-sm text-gray-600">Protect from UV rays that can fade and dry out wood</p>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Control Humidity</h3>
              <p className="text-sm text-gray-600">Maintain 30-50% humidity to prevent cracking</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Stable Temperature</h3>
              <p className="text-sm text-gray-600">Avoid extreme temperature changes and heat sources</p>
            </div>
          </div>
        </div>

        {/* Daily Care */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Daily Care</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Dusting</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-amber-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Use a soft, dry microfiber cloth
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-amber-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Dust with the grain direction
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-amber-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Dust weekly or as needed
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-amber-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Avoid feather dusters (can scratch)
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Protection</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-amber-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Use coasters for drinks
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-amber-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Place mats under decorative items
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-amber-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Use tablecloths or runners
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-amber-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Wipe spills immediately
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Deep Cleaning */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Deep Cleaning & Conditioning</h2>
          
          <div className="space-y-6">
            <div className="border-l-4 border-amber-500 pl-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Monthly Conditioning</h3>
              <p className="text-gray-600 mb-3">
                Apply a high-quality wood conditioner or polish to nourish the wood and maintain its natural beauty.
              </p>
              <div className="bg-gray-50 rounded-md p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Recommended Products:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Howard Feed-N-Wax Wood Polish</li>
                  <li>• Beeswax-based furniture polish</li>
                  <li>• Lemon oil (for lighter woods)</li>
                  <li>• Tung oil (for natural finishes)</li>
                </ul>
              </div>
            </div>

            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Cleaning Process</h3>
              <ol className="space-y-2 text-gray-600">
                <li><strong>1.</strong> Remove all items from the surface</li>
                <li><strong>2.</strong> Dust thoroughly with a microfiber cloth</li>
                <li><strong>3.</strong> Apply conditioner with a clean, soft cloth</li>
                <li><strong>4.</strong> Work in the direction of the wood grain</li>
                <li><strong>5.</strong> Allow to penetrate for 15-20 minutes</li>
                <li><strong>6.</strong> Buff with a clean cloth to remove excess</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Dealing with Damage */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Addressing Common Issues</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Minor Scratches</h3>
              <div className="space-y-3 text-gray-600">
                <p><strong>Light Scratches:</strong> Rub with a walnut or apply furniture touch-up marker</p>
                <p><strong>Deeper Scratches:</strong> Use fine-grit sandpaper (220 grit) following the grain, then apply matching stain</p>
                <p><strong>Prevention:</strong> Use placemats, avoid dragging objects</p>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-6">Water Rings & Stains</h3>
              <div className="space-y-3 text-gray-600">
                <p><strong>White Rings:</strong> Gently rub with mayonnaise or toothpaste on a soft cloth</p>
                <p><strong>Dark Stains:</strong> May require professional refinishing</p>
                <p><strong>Prevention:</strong> Always use coasters and placemats</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Seasonal Changes</h3>
              <div className="space-y-3 text-gray-600">
                <p><strong>Winter:</strong> Use humidifiers to prevent cracking from dry air</p>
                <p><strong>Summer:</strong> Ensure good ventilation to prevent excessive humidity</p>
                <p><strong>Moving:</strong> Allow furniture to acclimate before use</p>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-6">Heat Damage</h3>
              <div className="space-y-3 text-gray-600">
                <p><strong>Hot Dishes:</strong> Always use trivets or hot pads</p>
                <p><strong>Heat Sources:</strong> Keep 3+ feet from radiators, fireplaces</p>
                <p><strong>Repair:</strong> Minor heat marks may fade with time and conditioning</p>
              </div>
            </div>
          </div>
        </div>

        {/* Wood-Specific Care */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Wood-Specific Care Tips</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 border border-amber-200 rounded-lg">
              <h3 className="font-semibold text-amber-800 mb-2">Oak</h3>
              <p className="text-sm text-gray-600">Very durable. Use oil-based conditioners. Avoid excessive moisture.</p>
            </div>
            
            <div className="p-4 border border-amber-200 rounded-lg">
              <h3 className="font-semibold text-amber-800 mb-2">Walnut</h3>
              <p className="text-sm text-gray-600">Rich wood that darkens with age. Use minimal conditioning.</p>
            </div>
            
            <div className="p-4 border border-amber-200 rounded-lg">
              <h3 className="font-semibold text-amber-800 mb-2">Cherry</h3>
              <p className="text-sm text-gray-600">Develops beautiful patina. Protect from direct sunlight initially.</p>
            </div>
            
            <div className="p-4 border border-amber-200 rounded-lg">
              <h3 className="font-semibold text-amber-800 mb-2">Maple</h3>
              <p className="text-sm text-gray-600">Light wood that shows scratches easily. Regular conditioning recommended.</p>
            </div>
            
            <div className="p-4 border border-amber-200 rounded-lg">
              <h3 className="font-semibold text-amber-800 mb-2">Teak</h3>
              <p className="text-sm text-gray-600">Naturally water-resistant. Can be left unfinished or oiled annually.</p>
            </div>
            
            <div className="p-4 border border-amber-200 rounded-lg">
              <h3 className="font-semibold text-amber-800 mb-2">Pine</h3>
              <p className="text-sm text-gray-600">Softer wood. Use gentle cleaners and avoid heavy impacts.</p>
            </div>
          </div>
        </div>

        {/* Professional Care */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-bold text-amber-800 mb-4">When to Call Professionals</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Professional Restoration Needed:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Deep gouges or cuts</li>
                <li>• Extensive water damage</li>
                <li>• Finish deterioration</li>
                <li>• Structural issues</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Annual Professional Services:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Deep cleaning and reconditioning</li>
                <li>• Hardware adjustment</li>
                <li>• Finish touch-ups</li>
                <li>• Preventive maintenance</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Recommended Products */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended Care Products</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cleaning Supplies</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Microfiber cloths (lint-free)</li>
                <li>• Soft-bristled brush for carvings</li>
                <li>• Vacuum with brush attachment</li>
                <li>• Cotton swabs for detail work</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Care Products</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• High-quality furniture wax</li>
                <li>• Wood conditioner/polish</li>
                <li>• Touch-up markers</li>
                <li>• Fine-grit sandpaper (220-320 grit)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact for Care Questions */}
        <div className="bg-amber-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Care Questions?</h2>
          <p className="text-gray-600 mb-6">
            Our team is here to help you maintain your furniture. Don&apos;t hesitate to reach out with any care questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-amber-800 text-white px-6 py-3 rounded-md font-medium hover:bg-amber-900 transition-colors"
            >
              Contact Our Care Experts
            </a>
            <a
              href="mailto:care@therusticroots.com.au"
              className="border border-amber-800 text-amber-800 px-6 py-3 rounded-md font-medium hover:bg-amber-50 transition-colors"
            >
              Email: care@therusticroots.com.au
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
            <p className="text-sm text-gray-600">Learn about our lifetime warranty</p>
          </a>
          <a
            href="/faq"
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-gray-900 mb-2">FAQ</h3>
            <p className="text-sm text-gray-600">Common questions and answers</p>
          </a>
          <a
            href="/contact"
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-gray-900 mb-2">Contact Support</h3>
            <p className="text-sm text-gray-600">Get personalized care advice</p>
          </a>
        </div>
      </div>
    </div>
  )
}