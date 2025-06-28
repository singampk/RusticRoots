import Link from 'next/link'
import Header from '../../components/Header'

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">About Rustic Roots</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Crafting beautiful, sustainable wooden furniture for your home since 2020. 
            Every piece tells a story of traditional craftsmanship and environmental responsibility.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Rustic Roots was born from a passion for traditional woodworking and a commitment to sustainable practices. 
                Founded in 2020 by master craftsman David Thompson, our workshop began in a converted barn in rural Vermont.
              </p>
              <p>
                What started as a hobby quickly grew into a mission: to create heirloom-quality furniture that honors both 
                the natural beauty of wood and the time-tested techniques of our ancestors. Every piece we create is 
                handcrafted with care, using only sustainably sourced materials.
              </p>
              <p>
                Today, our team of skilled artisans continues this tradition, creating furniture that will be cherished 
                for generations to come. We believe that great furniture should tell a story – yours.
              </p>
            </div>
          </div>
          <div className="bg-gray-200 rounded-lg flex items-center justify-center h-96">
            <div className="text-center text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <p>Workshop Photo</p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Handcrafted Excellence</h3>
              <p className="text-gray-600">
                Every piece is meticulously handcrafted by skilled artisans using traditional techniques 
                passed down through generations. No mass production, only quality.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Sustainable Sourcing</h3>
              <p className="text-gray-600">
                We source our wood exclusively from responsibly managed forests and use eco-friendly 
                finishes. Protecting our environment is as important as creating beautiful furniture.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Lifetime Quality</h3>
              <p className="text-gray-600">
                We build furniture to last generations. Our comprehensive lifetime warranty reflects 
                our confidence in our craftsmanship and commitment to customer satisfaction.
              </p>
            </div>
          </div>
        </div>

        {/* Process Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-amber-800 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
              <h4 className="font-semibold text-gray-900 mb-2">Design & Planning</h4>
              <p className="text-sm text-gray-600">We work with you to create a custom design that fits your space and style perfectly.</p>
            </div>
            <div className="text-center">
              <div className="bg-amber-800 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
              <h4 className="font-semibold text-gray-900 mb-2">Material Selection</h4>
              <p className="text-sm text-gray-600">We carefully select premium, sustainably sourced wood that matches your project requirements.</p>
            </div>
            <div className="text-center">
              <div className="bg-amber-800 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
              <h4 className="font-semibold text-gray-900 mb-2">Handcrafting</h4>
              <p className="text-sm text-gray-600">Our skilled artisans bring your piece to life using traditional woodworking techniques.</p>
            </div>
            <div className="text-center">
              <div className="bg-amber-800 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
              <h4 className="font-semibold text-gray-900 mb-2">Finishing & Delivery</h4>
              <p className="text-sm text-gray-600">We apply protective finishes and deliver your heirloom piece with care and pride.</p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Meet Our Team</h2>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
            Our team of passionate craftspeople brings decades of combined experience in traditional woodworking, 
            sustainable practices, and customer service.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gray-200 rounded-full w-32 h-32 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900">David Thompson</h4>
              <p className="text-amber-600 mb-2">Founder & Master Craftsman</p>
              <p className="text-sm text-gray-600">30+ years of woodworking expertise</p>
            </div>
            <div className="text-center">
              <div className="bg-gray-200 rounded-full w-32 h-32 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900">Sarah Mitchell</h4>
              <p className="text-amber-600 mb-2">Lead Designer</p>
              <p className="text-sm text-gray-600">Specialized in custom furniture design</p>
            </div>
            <div className="text-center">
              <div className="bg-gray-200 rounded-full w-32 h-32 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900">Michael Chen</h4>
              <p className="text-amber-600 mb-2">Sustainability Coordinator</p>
              <p className="text-sm text-gray-600">Expert in eco-friendly practices</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-amber-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Create Something Beautiful?</h2>
          <p className="text-gray-600 mb-6">
            Let us help you bring your vision to life with our handcrafted furniture.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="bg-amber-800 text-white px-6 py-3 rounded-md font-medium hover:bg-amber-900 transition-colors"
            >
              Shop Our Collection
            </Link>
            <Link
              href="/contact"
              className="border border-amber-800 text-amber-800 px-6 py-3 rounded-md font-medium hover:bg-amber-50 transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}