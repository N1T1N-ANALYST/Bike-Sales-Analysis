'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUploader from '@/components/ImageUploader';
import { mockClothingItems } from '@/lib/mockData';
import { ClothingItem } from '@/types';
import { getImagePlaceholder } from '@/lib/utils';

export default function UploadPage() {
  const router = useRouter();
  const [uploadedImage, setUploadedImage] = useState<{ file: File; preview: string } | null>(null);
  const [selectedClothing, setSelectedClothing] = useState<ClothingItem | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageSelect = (file: File, preview: string) => {
    if (file && preview) {
      setUploadedImage({ file, preview });
    } else {
      setUploadedImage(null);
    }
  };

  const handleTryOn = async () => {
    if (!uploadedImage || !selectedClothing) return;

    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('image', uploadedImage.file);
      formData.append('clothingId', selectedClothing.id);

      const response = await fetch('/api/tryon', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/tryon?resultId=${data.resultId}`);
      }
    } catch (error) {
      console.error('Try-on failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Virtual Try-On
          </h1>
          <p className="text-lg text-gray-600">
            Upload your photo and select clothing to see how it looks on you
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Step 1: Upload Your Photo
            </h2>
            <ImageUploader onImageSelect={handleImageSelect} />
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Step 2: Select Clothing
            </h2>
            
            {!uploadedImage ? (
              <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-xl">
                <p className="text-gray-500">Upload a photo first to select clothing</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {['all', 'top', 'bottom', 'dress', 'outerwear'].map((category) => (
                    <button
                      key={category}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  {mockClothingItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedClothing(item)}
                      className={`p-4 border-2 rounded-xl transition-all text-left ${
                        selectedClothing?.id === item.id
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                        <img
                          src={getImagePlaceholder(item.category)}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="font-semibold text-sm text-gray-900 mb-1">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-600">{item.brand}</p>
                      <p className="text-sm font-bold text-purple-600 mt-1">
                        ${item.price}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {uploadedImage && selectedClothing && (
          <div className="mt-8 bg-white rounded-2xl shadow-sm p-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Ready to Try On
                </h3>
                <p className="text-gray-600">
                  Selected: <span className="font-semibold">{selectedClothing.name}</span> by {selectedClothing.brand}
                </p>
              </div>
              <button
                onClick={handleTryOn}
                disabled={isProcessing}
                className="px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Generate Try-On'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
