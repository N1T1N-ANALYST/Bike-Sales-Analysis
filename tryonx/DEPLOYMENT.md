# TryOnX - Deployment Guide

This guide covers deploying TryOnX to various platforms.

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications.

#### Steps:

1. **Install Vercel CLI** (if not already installed)
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
cd /vercel/sandbox/tryonx
vercel
```

4. **Follow the prompts:**
   - Set up and deploy? Yes
   - Which scope? Select your account
   - Link to existing project? No
   - Project name? tryonx (or your preferred name)
   - Directory? ./
   - Override settings? No

5. **Production Deployment**
```bash
vercel --prod
```

#### Vercel Dashboard Configuration:
- No additional environment variables needed for MVP
- Automatic HTTPS
- Global CDN
- Automatic deployments on git push

### Option 2: Netlify

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Build the project**
```bash
npm run build
```

3. **Deploy**
```bash
netlify deploy
```

4. **Production deployment**
```bash
netlify deploy --prod
```

### Option 3: Docker

1. **Create Dockerfile**
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

2. **Build Docker image**
```bash
docker build -t tryonx .
```

3. **Run container**
```bash
docker run -p 3000:3000 tryonx
```

### Option 4: AWS Amplify

1. **Install Amplify CLI**
```bash
npm install -g @aws-amplify/cli
```

2. **Initialize Amplify**
```bash
amplify init
```

3. **Add hosting**
```bash
amplify add hosting
```

4. **Publish**
```bash
amplify publish
```

### Option 5: Self-Hosted (VPS/Dedicated Server)

1. **Build the application**
```bash
npm run build
```

2. **Install PM2 (Process Manager)**
```bash
npm install -g pm2
```

3. **Start the application**
```bash
pm2 start npm --name "tryonx" -- start
```

4. **Set up Nginx as reverse proxy**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

5. **Enable SSL with Let's Encrypt**
```bash
sudo certbot --nginx -d yourdomain.com
```

## 🔧 Environment Variables

For production deployment, you may need to set these environment variables:

```env
# API Configuration (when integrating real AI)
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
AI_MODEL_API_KEY=your_api_key_here

# Database (when integrated)
DATABASE_URL=your_database_url
DATABASE_API_KEY=your_database_key

# Storage (when integrated)
AWS_S3_BUCKET=your_bucket_name
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1

# Authentication (when integrated)
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your_secret_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Analytics (optional)
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

## 📋 Pre-Deployment Checklist

- [ ] Run `npm run build` successfully
- [ ] Test all pages locally
- [ ] Check responsive design on multiple devices
- [ ] Verify all API routes work
- [ ] Update metadata (title, description) in layout.tsx
- [ ] Add favicon and app icons
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure analytics
- [ ] Set up monitoring
- [ ] Prepare custom domain (if applicable)
- [ ] Review security headers
- [ ] Test performance (Lighthouse)

## 🔒 Security Considerations

### Before Production:

1. **Add rate limiting** to API routes
2. **Implement CSRF protection**
3. **Add input validation** on all forms
4. **Set up CORS** properly
5. **Enable security headers**:
```typescript
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};
```

## 📊 Performance Optimization

### Before Deployment:

1. **Enable Image Optimization**
   - Already configured in next.config.ts
   - Use Next.js Image component

2. **Add Caching Headers**
```typescript
// For static assets
export const revalidate = 3600; // 1 hour
```

3. **Enable Compression**
   - Vercel/Netlify handle this automatically
   - For self-hosted, enable gzip in Nginx

4. **Optimize Bundle Size**
```bash
npm run build
# Check bundle size in output
```

## 🔍 Monitoring & Analytics

### Recommended Tools:

1. **Vercel Analytics** (if using Vercel)
2. **Google Analytics** for user tracking
3. **Sentry** for error tracking
4. **LogRocket** for session replay
5. **Uptime monitoring** (UptimeRobot, Pingdom)

## 🚦 Post-Deployment

### Immediate Actions:

1. **Test all functionality** on production URL
2. **Check mobile responsiveness**
3. **Verify SSL certificate**
4. **Test API endpoints**
5. **Monitor error logs**
6. **Check performance metrics**

### Ongoing Maintenance:

1. **Monitor uptime**
2. **Review error logs weekly**
3. **Update dependencies monthly**
4. **Backup data regularly** (when database is integrated)
5. **Review analytics**

## 🎯 Custom Domain Setup

### Vercel:

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for DNS propagation (up to 48 hours)

### Netlify:

1. Go to Domain Settings
2. Add custom domain
3. Configure DNS
4. Enable HTTPS

## 📱 Progressive Web App (PWA)

To make TryOnX a PWA:

1. **Add manifest.json**
```json
{
  "name": "TryOnX",
  "short_name": "TryOnX",
  "description": "AI Virtual Clothing Try-On",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#9333ea",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

2. **Add service worker** (using next-pwa)
```bash
npm install next-pwa
```

## 🆘 Troubleshooting

### Build Fails:
- Check Node.js version (18+)
- Clear `.next` folder: `rm -rf .next`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

### Images Not Loading:
- Check next.config.ts image configuration
- Verify image paths are correct
- Check CORS settings for external images

### API Routes Not Working:
- Verify route files are in correct location
- Check for TypeScript errors
- Review server logs

## 📞 Support

For deployment issues:
- Check Next.js deployment docs: https://nextjs.org/docs/deployment
- Vercel support: https://vercel.com/support
- Community forums: https://github.com/vercel/next.js/discussions

---

**Ready to Deploy!** 🚀

Choose your preferred platform and follow the steps above. Vercel is recommended for the easiest deployment experience with Next.js.
