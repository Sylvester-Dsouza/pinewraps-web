"use client"

import PageTitle from "@/components/ui/page-title"
import { Card } from "@/components/ui/card"
import { 
  Phone,
  Mail,
  MapPin,
  MessageCircle
} from 'lucide-react'

const WhatsAppIcon = () => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    height="24" 
    width="24" 
    className="h-8 w-8"
  >
    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 012.41 5.83c0 4.54-3.7 8.23-8.24 8.23-1.48 0-2.93-.39-4.19-1.15l-.3-.17-3.12.82.83-3.04-.2-.32a8.188 8.188 0 01-1.26-4.38c.01-4.54 3.7-8.24 8.25-8.24M8.53 7.33c-.16 0-.43.06-.66.31-.22.25-.87.86-.87 2.07 0 1.22.89 2.39 1 2.56.14.17 1.76 2.67 4.25 3.73.59.27 1.05.42 1.41.53.59.19 1.13.16 1.56.1.48-.07 1.46-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.16-.48-.27-.25-.14-1.47-.74-1.69-.82-.23-.08-.37-.12-.56.12-.16.25-.64.81-.78.97-.15.17-.29.19-.53.07-.26-.13-1.06-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.12-.24-.01-.39.11-.5.11-.11.27-.29.37-.44.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.11-.56-1.35-.77-1.84-.2-.48-.4-.42-.56-.43-.14 0-.3-.01-.47-.01z" />
  </svg>
)

export default function ContactPage() {
  return (
    <div>
      <PageTitle 
        title="Contact Us" 
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Contact Us", href: "/contact" },
        ]} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Phone */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <Phone className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Call Us</h3>
              <p className="text-gray-600 mb-4">Available 9 AM - 9 PM</p>
              <a 
                href="tel:+971544044864" 
                className="text-primary hover:underline text-lg font-medium"
              >
                +971544044864
              </a>
            </div>
          </Card>

          {/* WhatsApp */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="bg-green-50 p-4 rounded-full mb-4">
                <WhatsAppIcon />
              </div>
              <h3 className="font-semibold text-xl mb-2">WhatsApp</h3>
              <p className="text-gray-600 mb-4">Quick Response Guaranteed</p>
              <a 
                href="https://wa.me/971544044864" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-500 hover:underline text-lg font-medium"
              >
                Message on WhatsApp
              </a>
            </div>
          </Card>

          {/* Email */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Email Us</h3>
              <p className="text-gray-600 mb-4">We'll respond within 24 hours</p>
              <a 
                href="mailto:support@pinewraps.com" 
                className="text-primary hover:underline text-lg font-medium"
              >
                support@pinewraps.com
              </a>
            </div>
          </Card>
        </div>

        {/* Map */}
        <Card className="p-0 overflow-hidden">
          {/* <div className="p-8 bg-gray-50">
            <div className="flex items-start space-x-4 mb-6">
              <div className="bg-primary/10 p-3 rounded-lg">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-xl mb-2">Our Location</h3>
                <p className="text-gray-600">Business Bay, Dubai, UAE</p>
                <a 
                  href="https://maps.google.com/?q=Pinewraps+Dubai+Business+Bay" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-block mt-2"
                >
                  Get Directions
                </a>
              </div>
            </div>
          </div> */}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14784539.742683245!2d37.32330322265626!3d25.21985072545473!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43422b09be9d%3A0x23eefc97ad256623!2sPine%20Wraps!5e0!3m2!1sen!2sin!4v1734805943746!5m2!1sen!2sin"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </Card>
      </div>
    </div>
  )
}
