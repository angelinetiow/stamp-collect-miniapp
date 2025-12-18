# Stamp Collect PWA

A Progressive Web App for collecting stamps from merchants and redeeming rewards. Optimized for GitHub Pages hosting.

## ✨ Features

- **Progressive Web App** - Installable on mobile devices
- **Offline Support** - Works without internet via Service Worker
- **Responsive Design** - Mobile-first, works on all screen sizes
- **Animated UI** - Smooth stamp collection animations
- **QR Code Generation** - Generate membership QR codes
- **Prize Redemption** - Win vouchers or tokens

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Opens at [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
```

## 📦 GitHub Pages Deployment

### Step 1: Build the project
```bash
npm run build
```

### Step 2: Commit and push
```bash
git add .
git commit -m "Build for production"
git push origin main
```

### Step 3: Enable GitHub Pages
1. Go to **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **main** / **(root)**
4. Click **Save**

Your PWA will be live at: `https://YOUR_USERNAME.github.io/stamp-collect-miniapp/`

## 📁 Project Structure

```
stamp-collect-miniapp/
│
├── 📂 public/              # Source static assets
│   ├── index.html          # HTML template with PWA meta tags
│   ├── manifest.json       # PWA manifest
│   ├── sw.js               # Service Worker
│   ├── icons/              # App icons
│   ├── images/             # Images
│   └── svg/                # SVG assets
│
├── 📂 src/                 # Source code
│   ├── index.tsx           # App entry point
│   ├── LandingPage.tsx     # Main component
│   ├── LandingPage.css     # Styles
│   ├── data/
│   │   └── staticData.ts   # Static demo data
│   └── styles/
│       ├── typography.css
│       └── typography/fonts/
│
├── 📄 index.html           # [BUILD] Production HTML
├── 📄 bundle.js            # [BUILD] Bundled JavaScript
├── 📄 manifest.json        # [BUILD] PWA manifest
├── 📄 sw.js                # [BUILD] Service Worker
├── 📂 svg/                 # [BUILD] SVG assets
├── 📂 images/              # [BUILD] Images
├── 📂 icons/               # [BUILD] App icons
│
├── package.json
├── tsconfig.json
└── webpack.config.js
```

## 🔧 PWA Features Implemented

### Web App Manifest
- App name and icons
- Standalone display mode
- Theme colors
- Start URL configuration

### Service Worker
- Caches static assets for offline use
- Network-first strategy with cache fallback
- Automatic cache versioning

### Meta Tags
- Theme color
- Apple mobile web app support
- Viewport configuration
- Description

## 📱 Demo Mode

This version uses static data for demonstration:

1. Click on any **uncollected stamp**
2. Click **"Simulate Collection"** in the QR modal
3. Repeat until all 5 stamps are collected
4. Click **"Redeem"** to claim your prize!

## 🛠️ Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm start` | Alias for `npm run dev` |
| `npm run build` | Build for production (outputs to root) |
| `npm run clean` | Remove build artifacts from root |

## 🎨 Technologies

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Webpack 5** - Bundler with optimizations
- **Mantine UI** - Component library
- **QRCode** - QR code generation
- **Service Worker** - Offline support

## 📄 License

MIT License
