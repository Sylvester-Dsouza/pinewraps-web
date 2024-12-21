import PageTitle from "@/components/ui/page-title"

export default function AboutPage() {
  return (
    <div>
      <PageTitle 
        title="About Us" 
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About Us", href: "/about" }
        ]} 
      />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-lg">
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <p className="mb-6">
              Welcome to PineWraps, where we transform ordinary moments into extraordinary memories. 
              Founded with a passion for creating beautiful experiences, we specialize in crafting 
              premium cakes, arranging stunning flowers, and curating perfect gift combinations.
            </p>

            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
            <p className="mb-6">
              Our mission is to bring joy and celebration to every occasion through our artisanal 
              creations. We blieve that every celebration deserves something special, and that's 
              what we strive to deliver with every order.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h4 className="font-bold mb-2">Quality</h4>
                <p className="text-gray-600">Only the finest ingredients and freshest flowers</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-bold mb-2">Timely Delivery</h4>
                <p className="text-gray-600">On-time delivery, every time</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                </div>
                <h4 className="font-bold mb-2">Customer Satisfaction</h4>
                <p className="text-gray-600">Your happiness is our priority</p>
              </div>
            </div>

            <h3 className="text-2xl font-bold mb-4">Our Commitment</h3>
            <p>
              We are committed to maintaining the highest standards of quality and service. 
              Every cake is baked with premium ingredients, every flower is hand-picked for 
              freshness, and every combo is thoughtfully curated to create the perfect gift.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
