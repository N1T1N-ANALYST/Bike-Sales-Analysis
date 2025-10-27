export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  bodyType?: 'slim' | 'athletic' | 'curvy' | 'plus-size';
  colorTone?: 'warm' | 'cool' | 'neutral';
  style?: string[];
  sizes?: {
    top?: string;
    bottom?: string;
    dress?: string;
    shoes?: string;
  };
}

export interface ClothingItem {
  id: string;
  name: string;
  brand: string;
  category: 'top' | 'bottom' | 'dress' | 'outerwear' | 'shoes' | 'accessories';
  imageUrl: string;
  price: number;
  sizes: string[];
  colors: string[];
  fabric?: string;
  description?: string;
  purchaseLink?: string;
}

export interface TryOnResult {
  id: string;
  userId: string;
  originalImageUrl: string;
  resultImageUrl: string;
  clothingItemId: string;
  createdAt: Date;
  saved: boolean;
}

export interface Outfit {
  id: string;
  name: string;
  items: ClothingItem[];
  occasion?: string;
  season?: string;
  imageUrl?: string;
}

export interface WardrobeItem {
  id: string;
  userId: string;
  clothingItem: ClothingItem;
  tryOnResult?: TryOnResult;
  addedAt: Date;
}

export interface Recommendation {
  id: string;
  outfit: Outfit;
  score: number;
  reason: string;
}

export interface UploadedImage {
  id: string;
  url: string;
  file: File;
  preview: string;
}
