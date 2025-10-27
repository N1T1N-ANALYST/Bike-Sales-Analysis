import Link from 'next/link';
import { Outfit } from '@/types';
import { getImagePlaceholder, formatPrice } from '@/lib/utils';

interface OutfitCardProps {
  outfit: Outfit;
  score?: number;
  reason?: string;
}

export default function OutfitCard({ outfit, score, reason }: OutfitCardProps) {
  const totalPrice = outfit.items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {outfit.name}
            </h3>
            {reason && <p className="text-gray-600">{reason}</p>}
          </div>
          {score && (
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-semibold">{score}% Match</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          {outfit.items.map((item) => (
            <div key={item.id} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={getImagePlaceholder(item.category)}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-600">Total Price</span>
          <span className="text-2xl font-bold text-purple-600">
            {formatPrice(totalPrice)}
          </span>
        </div>

        <div className="flex gap-3">
          <Link
            href="/upload"
            className="flex-1 px-4 py-3 text-center font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            Try This Outfit
          </Link>
          <button className="px-4 py-3 font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:border-purple-600 hover:text-purple-600 transition-all">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
