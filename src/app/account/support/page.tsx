'use client'

import { useState } from "react"
import { MessageSquare, Mail, ChevronDown, ChevronUp } from "lucide-react"

const faqs = [
  {
    question: "How do I track my order?",
    answer: "You can track your order by going to the Orders section in your account. Each order has a unique tracking number that you can use to monitor its status."
  },
  {
    question: "What is your return policy?",
    answer: "Due to the perishable nature of our products, we have specific guidelines for returns. Please refer to our Refund Policy for detailed information."
  },
  {
    question: "How long does delivery take?",
    answer: "We offer same-day delivery for orders placed before 2 PM. For orders placed after 2 PM, delivery will be scheduled for the next day. You can select your preferred delivery time slot during checkout."
  },
  {
    question: "What are your delivery areas?",
    answer: "We currently deliver to select areas in Dubai and surrounding emirates. You can check if we deliver to your area by entering your location during checkout."
  },
  {
    question: "How can I modify or cancel my order?",
    answer: "To modify or cancel your order, please contact our support team immediately through WhatsApp or email. Note that modifications or cancellations may not be possible if your order is already being prepared."
  }
]

export default function SupportPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold mb-8">Customer Support</h2>

      {/* Contact Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* WhatsApp Support */}
        <a 
          href="https://wa.me/971501234567" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="h-12 w-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
            <MessageSquare className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-1">WhatsApp Support</h3>
            <p className="text-gray-600">Quick responses on WhatsApp</p>
            <p className="text-sm text-gray-500 mt-1">Available 9 AM - 9 PM</p>
          </div>
        </a>

        {/* Email Support */}
        <a 
          href="mailto:support@pinewraps.com" 
          className="flex items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
            <Mail className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-1">Email Support</h3>
            <p className="text-gray-600">support@pinewraps.com</p>
            <p className="text-sm text-gray-500 mt-1">Response within 24 hours</p>
          </div>
        </a>
      </div>

      {/* FAQs */}
      <div>
        <h3 className="text-xl font-semibold mb-6">Frequently Asked Questions</h3>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
              >
                <span className="font-medium">{faq.question}</span>
                {expandedFaq === index ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
              {expandedFaq === index && (
                <div className="px-6 py-4 bg-gray-50 border-t">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
