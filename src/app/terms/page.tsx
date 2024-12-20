import PageTitle from "@/components/ui/page-title"

export default function TermsPage() {
  return (
    <div>
      <PageTitle 
        title="Terms & Conditions" 
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Terms & Conditions", href: "/terms" },
        ]} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto prose prose-lg">
          <p className="text-gray-600 mb-8">
            Last updated: January 2024
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
            <p>
              Welcome to Pinewraps. By accessing and using our website, you accept and agree to be bound by the terms and conditions outlined below. Please read these terms carefully before using our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. Definitions</h2>
            <p>In these Terms & Conditions:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>"Website" refers to Pinewraps website and mobile applications</li>
              <li>"Services" means all services provided by Pinewraps</li>
              <li>"Products" means all items available for purchase</li>
              <li>"User", "You", "Your" refers to the person accessing our website</li>
              <li>"We", "Us", "Our" refers to Pinewraps</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. Account & Registration</h2>
            <p>When creating an account:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>You must provide accurate and complete information</li>
              <li>You are responsible for maintaining account security</li>
              <li>You must notify us of any unauthorized access</li>
              <li>We reserve the right to suspend or terminate accounts</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. Rewards Program</h2>
            <p>
              Our rewards program is subject to the following terms:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Points are earned on qualifying purchases</li>
              <li>Points have no monetary value and cannot be transferred</li>
              <li>We reserve the right to modify or terminate the program</li>
              <li>Points expire after 12 months of account inactivity</li>
              <li>Tier benefits are subject to change with notice</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. Intellectual Property</h2>
            <p>
              All content on this website is protected by intellectual property rights:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Trademarks, logos, and brand features are our property</li>
              <li>Content may not be copied without permission</li>
              <li>User-generated content remains your property</li>
              <li>You grant us license to use your content</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>We are not liable for indirect or consequential damages</li>
              <li>Our liability is limited to the amount paid for products</li>
              <li>We do not warrant uninterrupted service access</li>
              <li>Force majeure events are excluded from liability</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">7. Dispute Resolution</h2>
            <p>
              Any disputes shall be resolved through:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Initial informal negotiation</li>
              <li>Mediation if negotiation fails</li>
              <li>Arbitration as a final resort</li>
              <li>Jurisdiction under Mumbai, Maharashtra laws</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">8. Use of Website</h2>
            <p>
              The content of this website is for your general information and use only. It is subject to change without notice. By using our website, you agree to:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Not use the website in any way that causes, or may cause, damage to the website or impairment of its availability</li>
              <li>Not use the website in any way that is unlawful, illegal, fraudulent, or harmful</li>
              <li>Not use the website for any purpose related to marketing without our express written consent</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">9. Product Information</h2>
            <p>
              While we strive to provide accurate product information, including prices and availability, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">10. Ordering & Payment</h2>
            <p>
              By placing an order, you are offering to purchase a product. All orders are subject to availability and confirmation of the order price. Payment must be made in full at the time of ordering.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">11. Delivery</h2>
            <p>
              We will make every effort to deliver the products within the estimated timeframes. However, delays are occasionally inevitable due to unforeseen circumstances. We shall not be liable for any delay or failure to deliver products.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">12. Cancellation & Refunds</h2>
            <p>
              Orders can be cancelled before they are dispatched. Once dispatched, our refund policy applies. Please refer to our separate Refund Policy for detailed information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">13. Account Security</h2>
            <p>
              If you create an account, you are responsible for maintaining the confidentiality of your account details and password. You agree to accept responsibility for all activities that occur under your account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">14. Privacy</h2>
            <p>
              Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your personal information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">15. Contact Us</h2>
            <p>
              If you have any questions about these Terms & Conditions, please contact us at:
            </p>
            <ul className="list-none mt-4">
              <li>Email: support@pinewraps.com</li>
              <li>Phone: +91 98765 43210</li>
              <li>Address: 123 Main Street, Mumbai, Maharashtra 400001</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
