'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockRecommendations, occasions, styles } from '@/lib/mockData';
import { getImagePlaceholder, formatPrice } from '@/lib/utils';

export default function RecommendationsPage() {
  const [selectedOccasion, setSelectedOccasion] = useState<string>('all');
  const [selectedStyle, setSelectedStyle] = useState<string>('all');

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Personalized Recommendations
          </h1>
          <p className="text-lg text-gray-600">
            AI-curated outfits based on your preferences and style
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Occasion
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedOccasion('all')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    selectedOccasion === 'all'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                {occasions.map((occasion) => (
                  <button
                    key={occasion}
                    onClick={() => setSelectedOccasion(occasion)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors capitalize ${
                      selectedOccasion === occasion
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {occasion}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Style Preference
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedStyle('all')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    selectedStyle === 'all'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                {styles.slice(0, 6).map((style) => (
                  <button
                    key={style}
                    onClick={() => setSelectedStyle(style)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors capitalize ${
                      selectedStyle === style
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {mockRecommendations.map((recommendation) => (
            <div
              key={recommendation.id}
              className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {recommendation.outfit.name}
                    </h2>
                    <p className="text-gray-600">{recommendation.reason}</p>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-semibold">{recommendation.score}% Match</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendation.outfit.items.map((item) => (
                    <div
                      key={item.id}
                      className="group bg-gray-50 rounded-xl overflow-hidden hover:bg-gray-100 transition-colors"
                    >
                      <div className="aspect-square bg-gray-200 overflow-hidden">
                        <img
                          src={getImagePlaceholder(item.category)}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">{item.brand}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-purple-600">
                            {formatPrice(item.price)}
                          </span>
                          <span className="text-xs text-gray-500 capitalize">
                            {item.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/upload"
                    className="flex-1 px-6 py-3 text-center font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all"
                  >
                    Try This Outfit
                  </Link>
                  <button className="flex-1 px-6 py-3 font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:border-purple-600 hover:text-purple-600 transition-all">
                    Save to Wardrobe
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-3">
            Want More Personalized Recommendations?
          </h2>
          <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
            Complete your style profile to get even better outfit suggestions tailored to your body type, 
            color preferences, and fashion taste
          </p>
          <button className="px-8 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition-colors">
            Complete Style Profile
          </button>
        </div>
      </div>
    </main>
  );
}
