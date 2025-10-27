import { ClothingItem, Outfit, Recommendation } from '@/types';

export const mockClothingItems: ClothingItem[] = [
  {
    id: '1',
    name: 'Classic White T-Shirt',
    brand: 'StyleCo',
    category: 'top',
    imageUrl: '/images/white-tshirt.jpg',
    price: 29.99,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['White', 'Black', 'Gray'],
    fabric: 'Cotton',
    description: 'Essential wardrobe staple with a perfect fit',
  },
  {
    id: '2',
    name: 'Slim Fit Jeans',
    brand: 'DenimPro',
    category: 'bottom',
    imageUrl: '/images/jeans.jpg',
    price: 79.99,
    sizes: ['28', '30', '32', '34', '36'],
    colors: ['Blue', 'Black', 'Gray'],
    fabric: 'Denim',
    description: 'Comfortable stretch denim with modern fit',
  },
  {
    id: '3',
    name: 'Summer Floral Dress',
    brand: 'Elegance',
    category: 'dress',
    imageUrl: '/images/floral-dress.jpg',
    price: 89.99,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Floral Blue', 'Floral Pink', 'Floral Yellow'],
    fabric: 'Cotton Blend',
    description: 'Light and breezy dress perfect for summer',
  },
  {
    id: '4',
    name: 'Leather Jacket',
    brand: 'UrbanStyle',
    category: 'outerwear',
    imageUrl: '/images/leather-jacket.jpg',
    price: 199.99,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Brown'],
    fabric: 'Genuine Leather',
    description: 'Classic leather jacket with modern edge',
  },
  {
    id: '5',
    name: 'Casual Sneakers',
    brand: 'FootComfort',
    category: 'shoes',
    imageUrl: '/images/sneakers.jpg',
    price: 69.99,
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: ['White', 'Black', 'Navy'],
    fabric: 'Canvas & Rubber',
    description: 'All-day comfort with style',
  },
  {
    id: '6',
    name: 'Blazer',
    brand: 'Professional',
    category: 'outerwear',
    imageUrl: '/images/blazer.jpg',
    price: 149.99,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Navy', 'Black', 'Gray'],
    fabric: 'Wool Blend',
    description: 'Perfect for office or formal occasions',
  },
];

export const mockOutfits: Outfit[] = [
  {
    id: 'outfit-1',
    name: 'Casual Weekend',
    items: [mockClothingItems[0], mockClothingItems[1], mockClothingItems[4]],
    occasion: 'casual',
    season: 'spring',
  },
  {
    id: 'outfit-2',
    name: 'Office Professional',
    items: [mockClothingItems[5], mockClothingItems[1]],
    occasion: 'office',
    season: 'all',
  },
  {
    id: 'outfit-3',
    name: 'Summer Outing',
    items: [mockClothingItems[2], mockClothingItems[4]],
    occasion: 'party',
    season: 'summer',
  },
];

export const mockRecommendations: Recommendation[] = [
  {
    id: 'rec-1',
    outfit: mockOutfits[0],
    score: 95,
    reason: 'Perfect for your casual style preference',
  },
  {
    id: 'rec-2',
    outfit: mockOutfits[1],
    score: 88,
    reason: 'Great for professional settings',
  },
  {
    id: 'rec-3',
    outfit: mockOutfits[2],
    score: 92,
    reason: 'Matches your summer wardrobe',
  },
];

export const occasions = [
  'casual',
  'office',
  'party',
  'formal',
  'sports',
  'beach',
  'date',
  'wedding',
];

export const bodyTypes = ['slim', 'athletic', 'curvy', 'plus-size'];
export const colorTones = ['warm', 'cool', 'neutral'];
export const styles = [
  'casual',
  'formal',
  'sporty',
  'bohemian',
  'minimalist',
  'vintage',
  'streetwear',
  'elegant',
];
