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
                <li>Items not meeting food safety standards</li>
                <li>Incorrect customization or personalization</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. Quality Guarantee</h2>
            <p className="mb-4">
              We guarantee the quality of our products at the time of delivery:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Fresh ingredients and materials used</li>
              <li>Proper temperature control during delivery</li>
              <li>Hygienic packaging standards</li>
              <li>Allergen information accuracy</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. Refund Process</h2>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Documentation Required:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Order number and date</li>
                <li>Photos of the issue (if applicable)</li>
                <li>Detailed description of the problem</li>
                <li>Proof of delivery (if relevant)</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. Refund Methods</h2>
            <div className="space-y-4">
              <p>Refunds will be processed through the original payment method:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Credit/Debit Cards: 5-7 business days</li>
                <li>UPI/Net Banking: 2-3 business days</li>
                <li>Digital Wallets: 24-48 hours</li>
                <li>Store Credit: Immediate</li>
              </ul>
              <p className="mt-4">
                In some cases, we may offer store credit or replacement instead of a monetary refund.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. Refund Timeline</h2>
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
            <h2 className="text-2xl font-bold mb-4">7. Non-Refundable Items</h2>
            <p>The following items are not eligible for refund:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Customized or personalized items</li>
              <li>Products reported after 2 hours of delivery</li>
              <li>Items damaged due to customer mishandling</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">8. Reward Points Adjustment</h2>
            <p>In case of refunds:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Points earned from the purchase will be deducted</li>
              <li>Tier status may be affected</li>
              <li>Points used for discounts will be reinstated</li>
              <li>Bonus points from promotions will be adjusted</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">9. Cancellation Policy</h2>
            <p>
              Orders can be cancelled free of charge if cancelled at least 24 hours before the scheduled delivery time. Late cancellations may be subject to a cancellation fee.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">10. Contact Us</h2>
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
