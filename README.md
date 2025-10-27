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

## Required Assets

Before running the application, you need to add the following files to the `public/` directory:

1. `drgenius_framework_header_27_10.riv` - The Rive animation file
2. `Scroll_Animation.webm` - The webm video file

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

3. Add the required asset files to the `public/` directory (see Required Assets section above)

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
1. Loads a webm video and a Rive animation file from the public folder
2. Displays a "Loading..." message until the video is fully loaded
3. Renders a 700x700px video player with autoplay and loop enabled
4. Overlays the Rive animation on top of the video using absolute positioning
5. The Rive animation plays automatically via the `autoplay` option in the `useRive` hook
