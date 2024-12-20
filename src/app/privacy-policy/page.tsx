import PageTitle from "@/components/ui/page-title"

export default function PrivacyPolicyPage() {
  return (
    <div>
      <PageTitle 
        title="Privacy Policy" 
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Privacy Policy", href: "/privacy-policy" },
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
              At Pinewraps, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
            <h3 className="text-xl font-semibold mb-2">Personal Information</h3>
            <p>We may collect personal information that you provide, including:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Name and contact information</li>
              <li>Billing and shipping addresses</li>
              <li>Payment information</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Purchase history and preferences</li>
              <li>Reward points and tier status</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-2">Automatically Collected Information</h3>
            <p>When you visit our website, we automatically collect certain information, including:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Device information and identifiers</li>
              <li>Usage data and analytics</li>
              <li>Cookies and similar tracking technologies</li>
              <li>Location data (if permitted)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. Legal Basis for Processing</h2>
            <p>We process your personal information based on the following legal grounds:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Performance of a contract when processing your order</li>
              <li>Legal obligation for tax and business records</li>
              <li>Legitimate interests in improving our services</li>
              <li>Your consent for marketing communications</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law. When data is no longer needed, it will be securely deleted or anonymized.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. International Data Transfers</h2>
            <p>
              Your information may be transferred and processed in countries outside your residence. We ensure appropriate safeguards are in place to protect your data in accordance with applicable laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. How We Use Your Information</h2>
            <p>We use the collected information for various purposes, including:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Processing and fulfilling your orders</li>
              <li>Communicating with you about your orders</li>
              <li>Sending promotional emails (with your consent)</li>
              <li>Improving our website and services</li>
              <li>Analyzing usage patterns</li>
              <li>Preventing fraud</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">7. Information Sharing</h2>
            <p>
              We do not sell, trade, or rent your personal information to third parties. We may share your information with:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Service providers (e.g., payment processors, delivery partners)</li>
              <li>Legal authorities when required by law</li>
              <li>Business partners with your consent</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">8. Your Privacy Rights</h2>
            <p>Under applicable data protection laws, you have the following rights:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Right to access your personal data</li>
              <li>Right to rectification of inaccurate data</li>
              <li>Right to erasure ("right to be forgotten")</li>
              <li>Right to restrict processing</li>
              <li>Right to data portability</li>
              <li>Right to object to processing</li>
              <li>Right to withdraw consent</li>
              <li>Right to lodge a complaint with a supervisory authority</li>
            </ul>
            <p className="mt-4">
              To exercise these rights, please contact our Data Protection Officer at privacy@pinewraps.com
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">9. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">10. Cookies</h2>
            <p>
              We use cookies to enhance your browsing experience. You can control cookie settings through your browser preferences.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">11. Children's Privacy</h2>
            <p>
              Our website is not intended for children under 13 years of age. We do not knowingly collect personal information from children.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">12. Changes to Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">13. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at:
            </p>
            <ul className="list-none mt-4">
              <li>Email: privacy@pinewraps.com</li>
              <li>Phone: +91 98765 43210</li>
              <li>Address: 123 Main Street, Mumbai, Maharashtra 400001</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
