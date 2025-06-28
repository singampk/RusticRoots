'use client'

import { useState } from 'react'
import Header from '../../components/Header'

interface FAQItem {
  id: number
  question: string
  answer: string
  category: string
}

const faqData: FAQItem[] = [
  {
    id: 1,
    category: "Ordering",
    question: "How do I place a custom furniture order?",
    answer: "You can place a custom order by contacting us through our contact form or calling us directly. We'll schedule a consultation to discuss your requirements, provide a detailed quote, and create a timeline for your project."
  },
  {
    id: 2,
    category: "Ordering",
    question: "What information do you need for a custom piece?",
    answer: "We'll need dimensions, wood type preferences, finish options, any special features, and your timeline. Photos or sketches of your vision are also very helpful."
  },
  {
    id: 3,
    category: "Ordering",
    question: "Can I modify or cancel my order?",
    answer: "Orders can be modified or cancelled within 48 hours of placement. Once production begins, modifications may not be possible, and cancellations may incur a restocking fee."
  },
  {
    id: 4,
    category: "Materials",
    question: "What types of wood do you work with?",
    answer: "We work with a variety of sustainably sourced hardwoods including oak, walnut, cherry, maple, mahogany, and teak. We can also source specific wood types upon request."
  },
  {
    id: 5,
    category: "Materials",
    question: "Are your materials sustainably sourced?",
    answer: "Yes, all our wood comes from FSC-certified sustainable forests. We're committed to environmental responsibility and only work with suppliers who share our values."
  },
  {
    id: 6,
    category: "Materials",
    question: "What finishes do you use?",
    answer: "We use eco-friendly, low-VOC finishes including natural oils, waxes, and water-based polyurethanes. All finishes are food-safe and suitable for indoor use."
  },
  {
    id: 7,
    category: "Shipping",
    question: "How much does shipping cost?",
    answer: "We offer free shipping on all orders within the continental United States. For Alaska, Hawaii, and international orders, shipping costs will be calculated based on size and destination."
  },
  {
    id: 8,
    category: "Shipping",
    question: "How long does delivery take?",
    answer: "Standard pieces typically ship within 2-3 weeks. Custom pieces take 6-12 weeks depending on complexity. We'll provide a detailed timeline with your order confirmation."
  },
  {
    id: 9,
    category: "Shipping",
    question: "How is furniture packaged for shipping?",
    answer: "All pieces are carefully wrapped in protective materials and packed in custom-built crates when necessary. We include detailed unpacking and assembly instructions."
  },
  {
    id: 10,
    category: "Care",
    question: "How do I care for my wooden furniture?",
    answer: "Regular dusting and occasional conditioning with appropriate wood care products will keep your furniture beautiful. Avoid direct sunlight and extreme temperature changes. See our detailed care guide for specific instructions."
  },
  {
    id: 11,
    category: "Care",
    question: "What if my furniture gets damaged?",
    answer: "Minor scratches and dents can often be repaired with simple techniques. For significant damage, contact us for repair recommendations. Our warranty covers manufacturing defects."
  },
  {
    id: 12,
    category: "Care",
    question: "Can scratches and dents be repaired?",
    answer: "Yes, most scratches and small dents can be repaired. Surface scratches often buff out with proper wood conditioner, while deeper damage may require professional refinishing."
  },
  {
    id: 13,
    category: "Warranty",
    question: "What does your lifetime warranty cover?",
    answer: "Our lifetime warranty covers structural defects and craftsmanship issues. It does not cover normal wear, damage from misuse, or changes due to natural wood movement."
  },
  {
    id: 14,
    category: "Warranty",
    question: "How do I make a warranty claim?",
    answer: "Contact our customer service team with photos of the issue and your order information. We'll assess the claim and provide repair, replacement, or refund as appropriate."
  },
  {
    id: 15,
    category: "Returns",
    question: "What is your return policy?",
    answer: "We offer a 30-day return window for standard pieces in original condition. Custom pieces are non-returnable unless there's a manufacturing defect. Return shipping costs apply unless the item is defective."
  }
]

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [openItem, setOpenItem] = useState<number | null>(null)

  const categories = ['All', ...Array.from(new Set(faqData.map(item => item.category)))]
  
  const filteredFAQs = activeCategory === 'All' 
    ? faqData 
    : faqData.filter(item => item.category === activeCategory)

  const toggleItem = (id: number) => {
    setOpenItem(openItem === id ? null : id)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600">
            Find answers to common questions about our furniture, ordering process, and policies.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category
                    ? 'bg-amber-800 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm">
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div>
                  <span className="inline-block bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full mr-3">
                    {item.category}
                  </span>
                  <span className="text-lg font-medium text-gray-900">{item.question}</span>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-500 transform transition-transform ${
                    openItem === item.id ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {openItem === item.id && (
                <div className="px-6 pb-4">
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 bg-amber-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Still Have Questions?</h2>
          <p className="text-gray-600 mb-6">
            Can&apos;t find what you&apos;re looking for? Our customer service team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-amber-800 text-white px-6 py-3 rounded-md font-medium hover:bg-amber-900 transition-colors"
            >
              Contact Us
            </a>
            <a
              href="tel:(802) 555-0123"
              className="border border-amber-800 text-amber-800 px-6 py-3 rounded-md font-medium hover:bg-amber-50 transition-colors"
            >
              Call (802) 555-0123
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <a
            href="/returns"
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-gray-900 mb-2">Returns Policy</h3>
            <p className="text-sm text-gray-600">Learn about our 30-day return window</p>
          </a>
          <a
            href="/warranty"
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-gray-900 mb-2">Warranty Info</h3>
            <p className="text-sm text-gray-600">Details about our lifetime warranty</p>
          </a>
          <a
            href="/care"
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-gray-900 mb-2">Care Guide</h3>
            <p className="text-sm text-gray-600">How to maintain your furniture</p>
          </a>
        </div>
      </div>
    </div>
  )
}