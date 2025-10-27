'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getImagePlaceholder } from '@/lib/utils';

function TryOnContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const resultId = searchParams.get('resultId');
  
  const [sliderPosition, setSliderPosition] = useState(50);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (resultId) {
      setTimeout(() => {
        setResult({
          id: resultId,
          originalImage: getImagePlaceholder('default'),
          resultImage: getImagePlaceholder('dress'),
          clothingName: 'Summer Floral Dress',
          brand: 'Elegance',
        });
        setLoading(false);
      }, 1500);
    }
  }, [resultId]);

  const handleSaveToWardrobe = async () => {
    alert('Saved to your wardrobe!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-semibold text-gray-900">
            AI is processing your try-on...
          </p>
          <p className="text-sm text-gray-600">
            This may take a few seconds
          </p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-lg font-semibold text-gray-900">
            No result found
          </p>
          <Link
            href="/upload"
            className="inline-block px-6 py-3 text-white bg-purple-600 rounded-lg hover:bg-purple-700"
          >
            Try Again
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your Virtual Try-On Result
          </h1>
          <p className="text-lg text-gray-600">
            {result.clothingName} by {result.brand}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Before & After Comparison
            </h2>
            
            <div className="relative aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden">
              <div
                className="absolute inset-0"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
              >
                <img
                  src={result.originalImage}
                  alt="Original"
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div
                className="absolute inset-0"
                style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
              >
                <img
                  src={result.resultImage}
                  alt="Try-on result"
                  className="w-full h-full object-cover"
                />
              </div>

              <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize"
                style={{ left: `${sliderPosition}%` }}
                onMouseDown={(e) => {
                  const handleMouseMove = (moveEvent: MouseEvent) => {
                    const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                    if (rect) {
                      const x = moveEvent.clientX - rect.left;
                      const percentage = (x / rect.width) * 100;
                      setSliderPosition(Math.max(0, Math.min(100, percentage)));
                    }
                  };

                  const handleMouseUp = () => {
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                  };

                  document.addEventListener('mousemove', handleMouseMove);
                  document.addEventListener('mouseup', handleMouseUp);
                }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </div>
              </div>

              <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 text-white text-sm rounded-full">
                Before
              </div>
              <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 text-white text-sm rounded-full">
                After
              </div>
            </div>

            <div className="mt-4 text-center text-sm text-gray-600">
              Drag the slider to compare
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Actions
              </h2>
              
              <div className="space-y-4">
                <button
                  onClick={handleSaveToWardrobe}
                  className="w-full px-6 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Save to Wardrobe
                </button>

                <button className="w-full px-6 py-4 text-lg font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:border-purple-600 hover:text-purple-600 transition-all">
                  Share Result
                </button>

                <Link
                  href="/upload"
                  className="block w-full px-6 py-4 text-center text-lg font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all"
                >
                  Try Another Item
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Product Details
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {result.clothingName}
                  </h3>
                  <p className="text-gray-600">{result.brand}</p>
                </div>

                <div className="flex items-center justify-between py-3 border-t border-gray-200">
                  <span className="text-gray-600">Price</span>
                  <span className="text-2xl font-bold text-purple-600">$89.99</span>
                </div>

                <button className="w-full px-6 py-3 text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors">
                  Buy Now
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-bold mb-2">
                Love this look?
              </h3>
              <p className="text-purple-100 text-sm mb-4">
                Get personalized outfit recommendations based on your style
              </p>
              <Link
                href="/recommendations"
                className="inline-block px-6 py-2 bg-white text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition-colors"
              >
                View Recommendations
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function TryOnPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <TryOnContent />
    </Suspense>
  );
}
