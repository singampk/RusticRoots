'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '../../components/Header'

export default function CustomFurniture() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    timeline: '',
    budget: '',
    dimensions: '',
    woodPreference: '',
    description: '',
    inspiration: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setSubmitted(true)
    setIsSubmitting(false)
    setFormData({
      name: '', email: '', phone: '', projectType: '', timeline: '', budget: '',
      dimensions: '', woodPreference: '', description: '', inspiration: ''
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Custom Furniture Builds
            </h1>
            <p className="text-2xl md:text-3xl text-amber-800 font-semibold mb-6 italic">
              &ldquo;From Your Vision to Our Tree — Crafted Just for You&rdquo;
            </p>
            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
              Tell us your dream, and we&rsquo;ll find the perfect tree to bring it to life. 
              Every custom piece begins with selecting the ideal wood for your unique vision.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#consultation"
                className="bg-amber-800 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-amber-900 transition-colors"
              >
                Start Your Custom Project
              </a>
              <a
                href="#gallery"
                className="border border-amber-800 text-amber-800 px-8 py-3 rounded-md text-lg font-medium hover:bg-amber-50 transition-colors"
              >
                View Custom Gallery
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Custom Furniture Process
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From initial consultation to final delivery, we guide you through every step 
              of creating your perfect piece of furniture.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-amber-800">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Consultation</h3>
              <p className="text-gray-600">
                Share your vision, requirements, and preferences with our design experts.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-amber-800">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Wood Selection</h3>
              <p className="text-gray-600">
                We source the perfect tree and wood type to match your project&rsquo;s character and durability needs.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-amber-800">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Design & Approval</h3>
              <p className="text-gray-600">
                Detailed sketches and 3D renderings ensure your vision is perfectly captured.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-amber-800">4</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Handcraft & Deliver</h3>
              <p className="text-gray-600">
                Master craftsmen bring your piece to life with traditional techniques and modern precision.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Expertise That Spans Generations
              </h2>
              <p className="text-gray-600 mb-6">
                With over three decades of combined experience, our master craftsmen specialize in 
                creating custom wooden furniture that tells your unique story. We don&rsquo;t just build 
                furniture — we craft heirlooms.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-amber-600 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-gray-900">Sustainable Wood Sourcing</h4>
                    <p className="text-gray-600">We partner with certified forestries to select the perfect tree for your project</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-amber-600 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-gray-900">Traditional Joinery Techniques</h4>
                    <p className="text-gray-600">Hand-cut dovetails, mortise and tenon joints built to last generations</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-amber-600 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-gray-900">Custom Design Collaboration</h4>
                    <p className="text-gray-600">Work directly with our designers to create something truly unique</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <Image
                src="/placeholder-furniture.svg"
                alt="Master craftsman working on custom furniture"
                width={600}
                height={384}
                className="rounded-lg shadow-lg w-full h-96 object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-lg shadow-lg">
                <div className="text-3xl font-bold text-amber-800">30+</div>
                <div className="text-gray-600">Years of Experience</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Gallery Section */}
      <section id="gallery" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Custom Creations Gallery
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Each piece tells a story. Browse some of our recent custom furniture builds 
              and see the craftsmanship that goes into every project.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Live Edge Dining Table", wood: "Black Walnut", timeline: "6 weeks" },
              { title: "Custom Kitchen Island", wood: "White Oak", timeline: "8 weeks" },
              { title: "Floating Shelves Set", wood: "Reclaimed Barn Wood", timeline: "3 weeks" },
              { title: "Executive Desk", wood: "Cherry", timeline: "5 weeks" },
              { title: "Built-in Bookcase", wood: "Maple", timeline: "4 weeks" },
              { title: "Bedroom Set", wood: "Mahogany", timeline: "10 weeks" }
            ].map((project, index) => (
              <div key={index} className="bg-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-48 bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                  <svg className="w-16 h-16 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{project.title}</h3>
                  <p className="text-sm text-gray-600">Wood: {project.wood}</p>
                  <p className="text-sm text-gray-600">Timeline: {project.timeline}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Consultation Form */}
      <section id="consultation" className="py-16 bg-amber-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Start Your Custom Project
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Ready to create something extraordinary? Share your vision with us and we&rsquo;ll 
              begin the journey from concept to completion.
            </p>
          </div>

          {submitted ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <svg className="w-16 h-16 text-green-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Thank You!</h3>
              <p className="text-gray-600 mb-6">
                We&rsquo;ve received your custom furniture request. Our design team will review your 
                project and contact you within 24 hours to discuss the next steps.
              </p>
              <Link
                href="/contact"
                className="text-amber-800 hover:text-amber-900 font-medium"
              >
                Need immediate assistance? Contact us →
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900 bg-white"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900 bg-white"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900 bg-white"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Type *
                  </label>
                  <select
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900 bg-white"
                  >
                    <option value="">Select project type</option>
                    <option value="table">Dining Table</option>
                    <option value="chairs">Chairs/Seating</option>
                    <option value="storage">Storage Solutions</option>
                    <option value="bedroom">Bedroom Furniture</option>
                    <option value="office">Office Furniture</option>
                    <option value="kitchen">Kitchen Features</option>
                    <option value="outdoor">Outdoor Furniture</option>
                    <option value="other">Other/Multiple Items</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timeline
                  </label>
                  <select
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900 bg-white"
                  >
                    <option value="">Select timeline</option>
                    <option value="flexible">Flexible</option>
                    <option value="2-4 weeks">2-4 weeks</option>
                    <option value="1-2 months">1-2 months</option>
                    <option value="2-3 months">2-3 months</option>
                    <option value="3+ months">3+ months</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget Range
                  </label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900 bg-white"
                  >
                    <option value="">Select budget range</option>
                    <option value="under-1000">Under $1,000</option>
                    <option value="1000-2500">$1,000 - $2,500</option>
                    <option value="2500-5000">$2,500 - $5,000</option>
                    <option value="5000-10000">$5,000 - $10,000</option>
                    <option value="10000+">$10,000+</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dimensions (if known)
                  </label>
                  <input
                    type="text"
                    name="dimensions"
                    value={formData.dimensions}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900 bg-white"
                    placeholder="e.g., 8ft x 4ft x 30in"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Wood Preference
                  </label>
                  <select
                    name="woodPreference"
                    value={formData.woodPreference}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900 bg-white"
                  >
                    <option value="">Select wood type</option>
                    <option value="oak">Oak</option>
                    <option value="walnut">Walnut</option>
                    <option value="cherry">Cherry</option>
                    <option value="maple">Maple</option>
                    <option value="mahogany">Mahogany</option>
                    <option value="pine">Pine</option>
                    <option value="cedar">Cedar</option>
                    <option value="reclaimed">Reclaimed Wood</option>
                    <option value="other">Other/Unsure</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900 bg-white"
                  placeholder="Describe your vision, intended use, style preferences, and any special requirements..."
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Inspiration/Reference Images
                </label>
                <textarea
                  name="inspiration"
                  value={formData.inspiration}
                  onChange={handleChange}
                  rows={2}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900 bg-white"
                  placeholder="Share links to inspiration images or describe styles you admire..."
                />
              </div>

              <div className="bg-gray-50 rounded-md p-4 mb-6">
                <p className="text-sm text-gray-600">
                  <strong>What happens next?</strong> After submitting this form, our design team will 
                  review your project and contact you within 24 hours to schedule a consultation. 
                  We&rsquo;ll discuss your vision in detail and provide a preliminary timeline and cost estimate.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-amber-800 text-white px-6 py-3 rounded-md font-medium hover:bg-amber-900 transition-colors disabled:bg-gray-400"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Custom Project Request'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Create Your Heirloom?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Every masterpiece starts with a conversation. Let&rsquo;s discuss your vision 
            and find the perfect tree to bring it to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-amber-800 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-amber-900 transition-colors"
            >
              Schedule Consultation
            </Link>
            <Link
              href="/products"
              className="border border-white text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-white hover:text-gray-900 transition-colors"
            >
              Browse Ready-Made Pieces
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}