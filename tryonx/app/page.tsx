import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center space-y-8">
          <div className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
            AI-Powered Virtual Try-On
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
            Try Clothes Before
            <br />
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              You Buy
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl text-gray-600 leading-relaxed">
            Experience the future of fashion with AI-powered virtual try-on technology. 
            Upload your photo and see how clothes look on you instantly.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link
              href="/upload"
              className="px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
            >
              Start Trying On
            </Link>
            <Link
              href="/recommendations"
              className="px-8 py-4 text-lg font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:border-purple-600 hover:text-purple-600 transition-all"
            >
              Browse Collections
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <div className="w-6 h-6 bg-purple-600 rounded"></div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              AI Virtual Try-On
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Upload your photo and see realistic clothing overlays using advanced AI technology. 
              No more guessing how clothes will look on you.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
              <div className="w-6 h-6 bg-pink-600 rounded"></div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Smart Recommendations
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Get personalized outfit suggestions based on your body type, style preferences, 
              and the latest fashion trends.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
              <div className="w-6 h-6 bg-indigo-600 rounded"></div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Perfect Fit Prediction
            </h3>
            <p className="text-gray-600 leading-relaxed">
              AI analyzes your measurements to predict the best size, reducing returns 
              and ensuring you get the perfect fit every time.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-lg text-purple-100 mb-12 max-w-2xl mx-auto">
            Get started in three simple steps
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <div className="w-10 h-10 bg-white text-purple-600 rounded-full flex items-center justify-center font-bold text-lg mb-4">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">Upload Your Photo</h3>
              <p className="text-purple-100">
                Take or upload a full-body photo. Our AI will detect your body landmarks automatically.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <div className="w-10 h-10 bg-white text-purple-600 rounded-full flex items-center justify-center font-bold text-lg mb-4">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">Choose Clothing</h3>
              <p className="text-purple-100">
                Browse our collection or get AI recommendations based on your style and preferences.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <div className="w-10 h-10 bg-white text-purple-600 rounded-full flex items-center justify-center font-bold text-lg mb-4">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">See Results Instantly</h3>
              <p className="text-purple-100">
                View realistic try-on results, save to your wardrobe, and shop with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Ready to Transform Your Shopping Experience?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of users who are already trying clothes virtually
          </p>
          <Link
            href="/upload"
            className="inline-block px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      <footer className="border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg"></div>
                <span className="text-xl font-bold text-gray-900">TryOnX</span>
              </div>
              <p className="text-gray-600 text-sm">
                AI-powered virtual try-on for the modern shopper
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/upload" className="hover:text-purple-600">Try On</Link></li>
                <li><Link href="/recommendations" className="hover:text-purple-600">Recommendations</Link></li>
                <li><Link href="/wardrobe" className="hover:text-purple-600">Wardrobe</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-purple-600">About</a></li>
                <li><a href="#" className="hover:text-purple-600">Blog</a></li>
                <li><Link href="/brands" className="hover:text-purple-600">For Brands</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-purple-600">Privacy</a></li>
                <li><a href="#" className="hover:text-purple-600">Terms</a></li>
                <li><a href="#" className="hover:text-purple-600">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
            © 2025 TryOnX. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
