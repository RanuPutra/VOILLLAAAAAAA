# OYLA — Handcrafted Rings & Fine Jewelry

An interactive landing page for OYLA, an artisanal handcrafted jewelry studio based in Berlin (est. 2019). The project combines a full-stack Node.js architecture (Vite + Express + TypeScript) with advanced scroll-driven animations powered by GSAP ScrollTrigger and frame-accurate video scrubbing.

---

## Overview

OYLA showcases fine jewelry through a minimalist, editorial layout built with strict monochrome typography and a single crimson accent. The application architecture leverages a hybrid setup: Vite's Single Page Application middleware handles fast development on port 3000, while Express serves production assets and proxy endpoints for dynamic video resolution.

---

## Key Features

### Scroll-Driven Video Scrubbing
- Hero section spanning `500vh` to map user scroll distance directly to video playback progress.
- Custom animation loop utilizing linear interpolation (`lerp: 0.08`) coupled with a strict decoder seeking guard (`!video.seeking`) to eliminate stutter and frame dropping.
- Kinetic typographic exit animation at 80%+ scroll progress, splitting headings into individual characters that blur, elevate, and fade out.

### Horizontal Product Carousel & Video Reveal
- Pinned full-viewport (`100vh`) product track displaying six handcrafted rings across horizontal viewport units (`33.333vw` per card).
- Multi-phase GSAP timeline: once horizontal translation reaches maximum scroll offset, a centered scaling wrapper (`0%` to `100%` width) expands symmetrically to reveal a second synchronized video scrub.

### Sticky Editorial & Metric Breakdown
- Two-column layout with a pinned `100vh` sticky editorial column on the left detailing brand craftsmanship.
- Scrollable right column with four stat modules featuring duplicate-heading vertical shifts ("stomp stacks") and staggered word-by-word reveal triggers.

### Fixed Reveal Footer
- Fixed-position footer (`z-index: 1`) masked beneath the primary layout.
- A dynamically calculated `.footer-spacer` element in the document flow creates an optical slide-over reveal as the user reaches the bottom of the page.

### Optimized Asset Delivery
- Keyframe-dense video encoding (`libx264`, `g=4`, `+faststart` atom) allowing immediate seeking across any timestamp.
- Full support for HTTP 206 Partial Content (Byte-Range requests) served directly via Express static middleware.
- Automatic CDN fallback mechanisms and proxy routes for external video resolution.

---

## Tech Stack

- **Frontend Core**: HTML5, Vanilla JavaScript, TypeScript, React 19
- **Animation Framework**: GSAP 3.12.5 and ScrollTrigger Plugin
- **Styling**: Tailwind CSS v4 and Custom CSS Properties
- **Server Runtime**: Express 4, Node.js (ESM / CJS hybrid)
- **Build Tooling**: Vite 6, tsx (development runner), esbuild (production server bundler)
- **Typography**: Instrument Serif, Inter Tight, Cormorant Garamond

---

## Getting Started

### Prerequisites
- Node.js 18.0 or higher
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/oyla-jewelry.git
   cd oyla-jewelry
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables (optional):
   ```bash
   cp .env.example .env
   ```

4. Start the local development server:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:3000`.

---

## Production Build

To compile both frontend and backend bundles for production deployment:

```bash
# Build the client via Vite and bundle server.ts into dist/server.cjs via esbuild
npm run build

# Start the production server
npm start
```

---

## Technical Details: Video Scrubbing Engine

Standard HTML5 `<video>` scrubbing often fails during fast scroll gestures because browsers continuously fire seek requests before prior frames are rendered, leading to decoder starvation, blank canvases, and high CPU spikes.

OYLA solves this with three complementary strategies:

1. **Decoder Seeking Guard**:
   ```javascript
   heroCurrentTime += (heroTargetTime - heroCurrentTime) * 0.08;

   const isSeeking = video.seeking && (performance.now() - lastSeekTime < 250);

   if (!isSeeking && Math.abs(video.currentTime - heroCurrentTime) > 0.01) {
     if (video.readyState >= 1) {
       video.currentTime = heroCurrentTime;
       lastSeekTime = performance.now();
     }
   }
   ```
2. **Dense Keyframe Intervals**: Media files are pre-processed with closed GOP structures and frequent I-frames (`-g 4`), ensuring the browser decoder does not need to reconstruct frames from distant reference packets.
3. **Partial Content Range Requests**: Express serves media with `Accept-Ranges: bytes`, allowing browsers to fetch only required chunks for current timestamps.

---

## Project Structure

```text
├── public/                 # Static media assets and optimized video files
│   ├── hero-poster.jpg     # Pre-rendered first frame poster for hero section
│   ├── hero-video-fast.mp4 # Video encoded with dense keyframes for scrubbing
│   ├── reveal-poster.jpg   # Poster image for awards section reveal
│   └── reveal-video-fast.mp4
├── src/                    # React application source
│   ├── App.tsx             # Root component
│   ├── index.css           # Global Tailwind CSS imports
│   └── main.tsx            # Client mount point
├── index.html              # Main application entry point and animation script
├── server.ts               # Express server with Vite middleware and API endpoints
├── package.json            # Project manifest, dependencies, and scripts
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite build configuration
```

---

## API Reference

### `GET /api/higgsfield-video`
Extracts direct MP4 media streams from Higgsfield share URLs to bypass rate limits or broken preview wrappers.

- **Query Parameters**:
  - `url` (optional): The target Higgsfield share URL. Defaults to the primary hero media asset.
- **Response Format**:
  ```json
  {
    "success": true,
    "url": "https://d8j0ntlcm91z4.cloudfront.net/..."
  }
  ```

---

## License

This project is released under the MIT License for educational and portfolio demonstration purposes. All brand imagery, ring designs, and trademarks are property of their respective owners.
