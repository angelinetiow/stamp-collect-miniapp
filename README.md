# Stamp Collect Mini App

A React-based stamp collection PWA with static demo data.

## Features

- Collect stamps by visiting merchants
- Animated stamp collection flow
- QR code generation for membership
- Prize redemption with vouchers and tokens
- Responsive mobile-first design

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

Run the app in development mode on port 3000:

```bash
npm run dev
```

Or use the start script:

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Build

Build for production:

```bash
npm run build
```

## Project Structure

```
stamp-collect-miniapp/
├── public/
│   ├── index.html
│   ├── images/           # Background images
│   └── svg/              # SVG assets for stamps and UI
├── src/
│   ├── data/
│   │   └── staticData.ts # Static demo data
│   ├── styles/
│   │   ├── typography.css
│   │   └── typography/fonts/  # Poppins fonts
│   ├── types/
│   │   └── global.d.ts   # TypeScript declarations
│   ├── index.tsx         # App entry point
│   ├── LandingPage.tsx   # Main component
│   └── LandingPage.css   # Styles
├── package.json
├── tsconfig.json
└── webpack.config.js
```

## Demo Mode

This version uses static data for demonstration purposes. Click on stamps to simulate collection:

1. Click on any uncollected stamp
2. Click "Simulate Collection" in the QR modal
3. Repeat until all 5 stamps are collected
4. Click "Redeem" to claim your prize

## Technologies

- React 19
- TypeScript
- Webpack 5
- Mantine UI
- QRCode library
