import { ClothingItem } from '@/types';
import { formatPrice, getImagePlaceholder } from '@/lib/utils';

interface ClothingCardProps {
  item: ClothingItem;
  onSelect?: (item: ClothingItem) => void;
  selected?: boolean;
}

export default function ClothingCard({ item, onSelect, selected }: ClothingCardProps) {
  return (
    <button
      onClick={() => onSelect?.(item)}
      className={`w-full p-4 border-2 rounded-xl transition-all text-left ${
        selected
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
      <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-1">
        {item.name}
      </h3>
      <p className="text-xs text-gray-600 mb-2">{item.brand}</p>
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-purple-600">
          {formatPrice(item.price)}
        </p>
        <span className="text-xs text-gray-500 capitalize">
          {item.category}
        </span>
      </div>
    </button>
  );
}
