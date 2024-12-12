import PageTitle from "@/components/ui/page-title"

export default function RefundPolicyPage() {
  return (
    <div>
      <PageTitle 
        title="Refund Policy" 
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Refund Policy", href: "/refund-policy" },
        ]} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto prose prose-lg">
          <p className="text-gray-600 mb-8">
            Last updated: January 2024
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. Overview</h2>
            <p>
              At Pinewraps, we want you to be completely satisfied with your purchase. This Refund Policy outlines our guidelines for returns, refunds, and exchanges.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. Return Eligibility</h2>
            <p className="mb-4">
              Due to the perishable nature of our products (cakes and flowers), we have specific guidelines for returns:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Eligible for Refund/Replacement:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Products damaged during delivery</li>
                <li>Wrong items delivered</li>
                <li>Quality issues reported immediately upon delivery</li>
                <li>Delivery delayed beyond the scheduled time</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. Refund Process</h2>
            <p className="mb-4">To initiate a refund:</p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Contact our customer service within 2 hours of delivery</li>
              <li>Provide order number and reason for refund</li>
              <li>Share photos of the issue (if applicable)</li>
              <li>Our team will review your request within 24 hours</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. Refund Options</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-black pl-4">
                <h3 className="font-semibold mb-2">Full Refund</h3>
                <p>Provided for:</p>
                <ul className="list-disc pl-6">
                  <li>Undelivered orders</li>
                  <li>Severely damaged products</li>
                  <li>Wrong items delivered</li>
                </ul>
              </div>
              <div className="border-l-4 border-black pl-4">
                <h3 className="font-semibold mb-2">Partial Refund</h3>
                <p>Considered for:</p>
                <ul className="list-disc pl-6">
                  <li>Minor quality issues</li>
                  <li>Delayed deliveries</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. Refund Timeline</h2>
            <p>
              Once approved, refunds will be processed within 5-7 business days. The time for the refund to reflect in your account depends on your payment method:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Credit/Debit Cards: 5-7 business days</li>
              <li>UPI/Net Banking: 2-3 business days</li>
              <li>Digital Wallets: 24-48 hours</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. Non-Refundable Items</h2>
            <p>The following items are not eligible for refund:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Customized or personalized items</li>
              <li>Products reported after 2 hours of delivery</li>
              <li>Items damaged due to customer mishandling</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">7. Cancellation Policy</h2>
            <p>
              Orders can be cancelled free of charge if cancelled at least 24 hours before the scheduled delivery time. Late cancellations may be subject to a cancellation fee.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Contact Us</h2>
            <p>
              For any questions about our refund policy, please contact us:
            </p>
            <ul className="list-none mt-4">
              <li>Email: support@pinewraps.com</li>
              <li>Phone: +91 98765 43210</li>
              <li>Customer Support Hours: 9:00 AM - 8:00 PM (Mon-Sat)</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
