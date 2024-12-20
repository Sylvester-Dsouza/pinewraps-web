import PageTitle from "@/components/ui/page-title"

export default function ShippingPolicyPage() {
  return (
    <div>
      <PageTitle 
        title="Shipping Policy" 
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Shipping Policy", href: "/shipping-policy" },
        ]} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto prose prose-lg">
          <p className="text-gray-600 mb-8">
            Last updated: January 2024
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. Delivery Areas & Zones</h2>
            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Zone A - Same Day Delivery</h3>
                <ul className="list-disc pl-6">
                  <li>Central Mumbai</li>
                  <li>South Mumbai</li>
                  <li>Western Suburbs (up to Borivali)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Zone B - Next Day Delivery</h3>
                <ul className="list-disc pl-6">
                  <li>Extended Western Suburbs</li>
                  <li>Navi Mumbai</li>
                  <li>Thane</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. Delivery Time Slots</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Standard Delivery Windows:</h3>
                <ul className="list-disc pl-6">
                  <li>Morning: 9 AM - 12 PM</li>
                  <li>Afternoon: 12 PM - 3 PM</li>
                  <li>Evening: 3 PM - 6 PM</li>
                  <li>Night: 6 PM - 9 PM</li>
                </ul>
              </div>
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Express Delivery:</h3>
                <ul className="list-disc pl-6">
                  <li>4-hour delivery window</li>
                  <li>Available in Zone A only</li>
                  <li>Subject to slot availability</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. Shipping Charges</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 border-b text-left">Reward Tier</th>
                    <th className="px-6 py-3 border-b text-left">Standard Delivery</th>
                    <th className="px-6 py-3 border-b text-left">Express Delivery</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-6 py-4 border-b">GREEN</td>
                    <td className="px-6 py-4 border-b">₹49</td>
                    <td className="px-6 py-4 border-b">₹99</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 border-b">SILVER</td>
                    <td className="px-6 py-4 border-b">₹29</td>
                    <td className="px-6 py-4 border-b">₹79</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 border-b">GOLD</td>
                    <td className="px-6 py-4 border-b">Free</td>
                    <td className="px-6 py-4 border-b">₹49</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              * Free delivery on all orders above ₹1000 regardless of tier
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. Special Handling</h2>
            <div className="space-y-4">
              <p>We take extra care for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Temperature-sensitive items (cakes, desserts)</li>
                <li>Fragile items (glass arrangements)</li>
                <li>Custom decorations</li>
                <li>Special occasion deliveries</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. Delivery Rescheduling</h2>
            <div className="space-y-4">
              <p>Rescheduling guidelines:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>24-hour notice required for free rescheduling</li>
                <li>Same-day rescheduling subject to ₹99 fee</li>
                <li>Maximum 2 reschedules per order</li>
                <li>Subject to slot availability</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. Order Tracking</h2>
            <p>
              Once your order is confirmed, you can track its status:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Through your account dashboard</li>
              <li>Via tracking link sent in email/SMS</li>
              <li>By contacting customer support</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">7. Delivery Guidelines</h2>
            <div className="space-y-4">
              <p>To ensure smooth delivery:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate delivery address and contact number</li>
                <li>Ensure someone is available to receive the order</li>
                <li>Keep your phone accessible for delivery updates</li>
                <li>Inform us about any specific delivery instructions in advance</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">8. Failed Delivery</h2>
            <p>In case of failed delivery:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>We will attempt to contact you on the provided number</li>
              <li>A second delivery attempt will be made if possible</li>
              <li>Additional delivery charges may apply for rescheduling</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">9. Special Occasions</h2>
            <p>
              During peak seasons (festivals, Valentine's Day, etc.):
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Place orders at least 2 days in advance</li>
              <li>Delivery times may vary</li>
              <li>Additional delivery charges may apply</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">10. Contact Us</h2>
            <p>
              For shipping-related queries, contact us at:
            </p>
            <ul className="list-none mt-4">
              <li>Email: shipping@pinewraps.com</li>
              <li>Phone: +91 98765 43210</li>
              <li>Customer Support Hours: 9:00 AM - 8:00 PM (Mon-Sat)</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
