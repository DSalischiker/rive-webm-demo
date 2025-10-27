# rive-webm-demo

A Vite React application that renders a Rive animation over a webm video to minimize file weight.

## Features

- Rive animation overlay on top of webm video
- 700x700px video player with autoplay and loop
- Loading state management
- Responsive and centered layout

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd rive-webm-demo
```

2. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to the URL shown in the terminal (typically `http://localhost:5173`)

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality

## Technology Stack

- React 19
- Vite
- @rive-app/react-canvas
- HTML5 video

## How It Works

The application:
1. Imports the webm video and Rive animation files from `src/assets/`
2. Displays a "Loading..." message until the video's `loadeddata` event fires
3. The video element is rendered immediately but hidden with `visibility: hidden` until loaded
4. Once the video is loaded (`isLoaded` becomes true):
   - The video becomes visible with `visibility: visible`
   - The Rive animation renders on top using absolute positioning
5. The video plays automatically (muted and with `playsInline` for browser compatibility)
6. Both video and Rive animation loop continuously
7. The Rive animation has `pointerEvents: "none"` to allow interaction with the video if needed

## Configuration

The Vite configuration includes custom `assetsInclude` settings to handle `.riv` and `.webm` file types:

```javascript
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.riv', '**/*.webm'],
})
```

This allows Vite to properly import and bundle these asset types.
