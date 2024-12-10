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

      <div className="container mx-auto px-4 py-12">
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
            <h2 className="text-2xl font-bold mb-4">2. Use of Website</h2>
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
            <h2 className="text-2xl font-bold mb-4">3. Product Information</h2>
            <p>
              While we strive to provide accurate product information, including prices and availability, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. Ordering & Payment</h2>
            <p>
              By placing an order, you are offering to purchase a product. All orders are subject to availability and confirmation of the order price. Payment must be made in full at the time of ordering.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. Delivery</h2>
            <p>
              We will make every effort to deliver the products within the estimated timeframes. However, delays are occasionally inevitable due to unforeseen circumstances. We shall not be liable for any delay or failure to deliver products.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. Cancellation & Refunds</h2>
            <p>
              Orders can be cancelled before they are dispatched. Once dispatched, our refund policy applies. Please refer to our separate Refund Policy for detailed information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">7. Account Security</h2>
            <p>
              If you create an account, you are responsible for maintaining the confidentiality of your account details and password. You agree to accept responsibility for all activities that occur under your account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">8. Privacy</h2>
            <p>
              Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your personal information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">9. Intellectual Property</h2>
            <p>
              All content on this website, including but not limited to text, graphics, logos, images, and software, is our property and is protected by copyright laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">10. Contact Us</h2>
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
