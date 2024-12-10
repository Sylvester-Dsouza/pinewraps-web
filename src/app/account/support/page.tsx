'use client'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"

const supportTickets = [
  {
    id: "TKT123",
    subject: "Order Delivery Delay",
    status: "Open",
    lastUpdate: "2024-01-15",
    priority: "High",
  },
  {
    id: "TKT122",
    subject: "Product Quality Issue",
    status: "Closed",
    lastUpdate: "2024-01-10",
    priority: "Medium",
  },
]

const faqs = [
  {
    question: "How do I track my order?",
    answer: "You can track your order by going to the Orders section in your account. Each order has a unique tracking number that you can use to monitor its status."
  },
  {
    question: "What is your return policy?",
    answer: "We accept returns within 30 days of purchase. Items must be unused and in their original packaging. Please contact our support team to initiate a return."
  },
  {
    question: "How long does shipping take?",
    answer: "Standard shipping typically takes 3-5 business days. Express shipping options are available at checkout for faster delivery."
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes, we ship to select international destinations. Shipping costs and delivery times vary by location."
  }
]

export default function SupportPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // TODO: Implement ticket submission
    setTimeout(() => setIsSubmitting(false), 1000)
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Customer Support</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>New Support Ticket</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Support Ticket</DialogTitle>
              <DialogDescription>
                Fill out the form below to create a new support ticket. We'll respond as soon as possible.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitTicket} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                <Input id="subject" required placeholder="Brief description of your issue" />
              </div>
              <div className="space-y-2">
                <label htmlFor="priority" className="text-sm font-medium">Priority</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Description</label>
                <Textarea
                  id="description"
                  required
                  placeholder="Please provide detailed information about your issue"
                  className="min-h-[100px]"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Ticket"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Support Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h3 className="font-semibold mb-2">Live Chat</h3>
          <p className="text-sm text-gray-600 mb-4">Chat with our support team</p>
          <Button className="w-full">Start Chat</Button>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="font-semibold mb-2">Email Support</h3>
          <p className="text-sm text-gray-600 mb-4">Send us an email</p>
          <Button className="w-full">Email Us</Button>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <h3 className="font-semibold mb-2">Phone Support</h3>
          <p className="text-sm text-gray-600 mb-4">Call us directly</p>
          <Button className="w-full">Call Now</Button>
        </div>
      </div>

      {/* Support Tickets */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Support Tickets</h3>
          <div className="space-y-4">
            {supportTickets.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No support tickets found</p>
            ) : (
              supportTickets.map((ticket) => (
                <div key={ticket.id} className="border rounded-lg p-4 transition-all hover:border-black">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-600">Ticket #{ticket.id}</p>
                      <h4 className="font-medium">{ticket.subject}</h4>
                      <p className="text-sm text-gray-600">Last updated: {ticket.lastUpdate}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm
                        ${ticket.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {ticket.status}
                      </span>
                      <p className="text-sm text-gray-600 mt-1">Priority: {ticket.priority}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" className="w-full">View Details</Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Frequently Asked Questions</h3>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border rounded-lg overflow-hidden">
              <button
                className="w-full text-left px-4 py-3 flex justify-between items-center hover:bg-gray-50"
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
              >
                <span className="font-medium">{faq.question}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 transform transition-transform ${
                    expandedFaq === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedFaq === index && (
                <div className="px-4 py-3 bg-gray-50">
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
