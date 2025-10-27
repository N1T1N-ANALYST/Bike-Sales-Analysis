'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockClothingItems } from '@/lib/mockData';
import { getImagePlaceholder } from '@/lib/utils';

export default function WardrobePage() {
  const [activeTab, setActiveTab] = useState<'saved' | 'tryons'>('saved');
  
  const savedItems = mockClothingItems.slice(0, 4);
  const tryOnHistory = [
    {
      id: '1',
      date: 'Today',
      clothing: mockClothingItems[2],
      resultImage: getImagePlaceholder('dress'),
    },
    {
      id: '2',
      date: 'Yesterday',
      clothing: mockClothingItems[0],
      resultImage: getImagePlaceholder('top'),
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            My Wardrobe
          </h1>
          <p className="text-lg text-gray-600">
            Your saved items and try-on history
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('saved')}
                className={`flex-1 px-6 py-4 text-center font-semibold transition-colors ${
                  activeTab === 'saved'
                    ? 'text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Saved Items ({savedItems.length})
              </button>
              <button
                onClick={() => setActiveTab('tryons')}
                className={`flex-1 px-6 py-4 text-center font-semibold transition-colors ${
                  activeTab === 'tryons'
                    ? 'text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Try-On History ({tryOnHistory.length})
              </button>
            </div>
          </div>

          <div className="p-8">
            {activeTab === 'saved' ? (
              <div>
                {savedItems.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No saved items yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Start trying on clothes and save your favorites
                    </p>
                    <Link
                      href="/upload"
                      className="inline-block px-6 py-3 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Try On Clothes
                    </Link>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {savedItems.map((item) => (
                      <div
                        key={item.id}
                        className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all"
                      >
                        <div className="aspect-square bg-gray-100 overflow-hidden">
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
                              ${item.price}
                            </span>
                            <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                          <Link
                            href="/upload"
                            className="mt-3 block w-full px-4 py-2 text-center text-sm font-medium text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
                          >
                            Try On Again
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                {tryOnHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No try-on history
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Your virtual try-on sessions will appear here
                    </p>
                    <Link
                      href="/upload"
                      className="inline-block px-6 py-3 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Start Trying On
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {tryOnHistory.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row gap-6 p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <div className="w-full sm:w-48 aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.resultImage}
                            alt="Try-on result"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 space-y-4">
                          <div>
                            <div className="text-sm text-gray-500 mb-2">{item.date}</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {item.clothing.name}
                            </h3>
                            <p className="text-gray-600">{item.clothing.brand}</p>
                          </div>
                          <div className="flex flex-wrap gap-3">
                            <button className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors">
                              View Result
                            </button>
                            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                              Save to Wardrobe
                            </button>
                            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                              Share
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold mb-3">
              Build Your Perfect Wardrobe
            </h2>
            <p className="text-purple-100 mb-6">
              Get AI-powered recommendations tailored to your style and body type
            </p>
            <Link
              href="/recommendations"
              className="inline-block px-6 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition-colors"
            >
              Get Recommendations
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
