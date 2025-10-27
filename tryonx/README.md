# TryOnX - AI Virtual Clothing Try-On App

An AI-powered web application that allows users to virtually try on clothes, receive personalized outfit suggestions, and explore collections from fashion brands.

## 🎯 Features

### Phase 1 MVP (Implemented)

- **AI Virtual Try-On**: Upload a photo and see realistic clothing overlays
- **Smart Outfit Recommender**: Get personalized outfit suggestions based on style preferences
- **User Wardrobe**: Save favorite outfits and view try-on history
- **Brand Portal**: Interface for fashion brands to partner and upload clothing items
- **Responsive Design**: Mobile-first design that works on all devices

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom React components
- **State Management**: React hooks and Context API (ready for implementation)

## 📁 Project Structure

```
tryonx/
├── app/
│   ├── api/              # API routes
│   │   ├── brands/       # Brand partnership endpoints
│   │   ├── recommendations/  # Outfit recommendations
│   │   ├── tryon/        # Virtual try-on processing
│   │   ├── upload/       # Image upload handling
│   │   └── wardrobe/     # User wardrobe management
│   ├── brands/           # Brand portal page
│   ├── recommendations/  # Recommendations page
│   ├── tryon/           # Try-on results page
│   ├── upload/          # Upload and try-on page
│   ├── wardrobe/        # User wardrobe page
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Landing page
│   └── globals.css      # Global styles
├── components/          # Reusable UI components
│   ├── Navigation.tsx
│   ├── ImageUploader.tsx
│   ├── ClothingCard.tsx
│   ├── OutfitCard.tsx
│   └── LoadingSpinner.tsx
├── lib/                 # Utility functions
│   ├── utils.ts
│   └── mockData.ts
└── types/              # TypeScript type definitions
    └── index.ts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Navigate to the project directory:
```bash
cd tryonx
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## 📱 Pages Overview

### Landing Page (`/`)
- Hero section with call-to-action
- Feature highlights
- How it works section
- Footer with navigation

### Upload Page (`/upload`)
- Drag-and-drop image uploader
- Clothing item selection
- Category filtering
- Try-on initiation

### Try-On Results (`/tryon`)
- Before/after comparison slider
- Save to wardrobe functionality
- Product details and purchase links
- Share functionality

### Wardrobe (`/wardrobe`)
- Saved items tab
- Try-on history tab
- Item management (view, delete)

### Recommendations (`/recommendations`)
- AI-curated outfit suggestions
- Filter by occasion and style
- Match score display
- Try-on and save options

### Brand Portal (`/brands`)
- Partnership benefits showcase
- Brand registration form
- Product image upload
- Contact information

## 🔌 API Routes

### POST `/api/upload`
Upload user photos for virtual try-on
- Accepts: multipart/form-data
- Returns: imageId, upload status

### POST `/api/tryon`
Process virtual try-on request
- Accepts: image file, clothingId
- Returns: resultId, processing status

### GET `/api/recommendations`
Fetch personalized outfit recommendations
- Query params: occasion, style
- Returns: array of recommendations

### GET/POST/DELETE `/api/wardrobe`
Manage user wardrobe items
- GET: Fetch wardrobe items
- POST: Add item to wardrobe
- DELETE: Remove item from wardrobe

### GET/POST `/api/brands`
Brand partnership management
- GET: Fetch brand items
- POST: Submit partnership request

## 🎨 Design Features

- Modern gradient color scheme (purple to pink)
- Clean typography with Inter font
- Smooth transitions and hover effects
- Accessible UI patterns
- Mobile-responsive layouts
- No icon dependencies (SVG-based)

## 🔮 Future Enhancements

### Phase 2
- Real AI model integration (VITON-HD)
- User authentication (NextAuth.js)
- Database integration (Firebase/Supabase)
- Size prediction algorithm
- Advanced body type detection

### Phase 3
- Payment integration
- Affiliate partnerships
- Social sharing features
- User reviews and ratings

### Phase 4
- AR live try-on (ARKit/ARCore)
- Mobile app (React Native)
- 3D clothing models
- Virtual wardrobe styling

## 📝 Notes

- Currently uses mock data for demonstration
- AI processing is simulated with delays
- Image placeholders are SVG-based
- Ready for backend integration
- Scalable architecture for future features

## 🤝 Contributing

This is an MVP implementation. To contribute:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Fashion AI research community for inspiration

---

Built with ❤️ using Next.js and TypeScript
