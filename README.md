# OYLA — Handcrafted Rings & Fine Jewelry

> Landing page mewah untuk brand perhiasan artisanal **OYLA** (Berlin, est. 2019). Dibangun menggunakan arsitektur full-stack **Vite + Express + TypeScript**, ditenagai oleh animasi scroll interaktif dengan **GSAP ScrollTrigger**, serta teknik **cinematic video scrubbing** berperforma tinggi.

---

## ✨ Fitur Utama

- **Scroll-Driven Video Scrubbing (Hero Section)**:
  - Scrubbing video frame-by-frame yang sinkron dengan posisi scroll pengguna pada kontainer `500vh`.
  - Menggunakan teknik **Interpolasi Lerp (`0.08`)** dan **`!video.seeking` guard** untuk mencegah bottleneck decoder pada browser.
  - Per-character kinetic text animation yang memudar (fade, blur, translate) saat scroll mencapai progress 80%+.
- **Horizontal Product Carousel with Video Reveal (Awards Section)**:
  - Carousel produk horizontal (`33.333vw` per card) yang di-pin saat scroll berlangsung.
  - Setelah carousel selesai ter-scroll, transisi simetris `.video-scaling-wrapper` membesar (`width: 0%` ke `100%`) mengungkap video scrubbing kedua di bawahnya.
- **Two-Column Editorial & Stats Section**:
  - Kolom kiri *sticky viewport* (`100vh`) dengan narasi filosofi brand dan capsule action button.
  - Kolom kanan menampilkan 4 stat card dengan animasi teks bertingkat (*stomp stack*), character splitting, dan word-by-word reveal.
- **Fixed Footer Reveal Pattern**:
  - Footer fixed di bagian bawah (`z-index: 1`) yang terungkap secara elegan seiring konten utama di-scroll ke atas menggunakan `.footer-spacer` dinamis.
- **High-Performance Video Delivery**:
  - Video lokal teroptimasi dengan *frequent keyframes* (`g=4`, `faststart` atom), didukung HTTP 206 Partial Content (Byte-Range requests) oleh Express.
  - Fallback otomatis ke CloudFront CDN dan Higgsfield Video Resolver API.
- **Fully Responsive**:
  - Layout adaptif untuk Desktop, Tablet, dan Mobile dengan penyesuaian font fluid (`clamp()`) dan safe touch targets (min 44px).

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, Vanilla JavaScript / TypeScript, React 19
- **Animasi & Interaktivitas**: [GSAP 3.12.5](https://greensock.com/gsap/) & [ScrollTrigger](https://greensock.com/scrolltrigger/)
- **Styling**: Tailwind CSS v4 & custom CSS variables
- **Backend & Tooling**: [Express 4](https://expressjs.com/), [Vite 6](https://vitejs.dev/), [TypeScript 5.8](https://www.typescriptlang.org/), [tsx](https://github.com/privatenumber/tsx), [esbuild](https://esbuild.github.io/)
- **Tipografi**: Instrument Serif, Inter Tight, Cormorant Garamond via Google Fonts

---

## 🚀 Memulai (Quick Start)

### Prasyarat
Pastikan Anda telah menginstal:
- [Node.js](https://nodejs.org/) (versi 18+ disarankan)
- Package manager: `npm`, `yarn`, `pnpm`, atau `bun`

### 1. Klon Repositori
```bash
git clone https://github.com/username-kamu/oyla-jewelry.git
cd oyla-jewelry
```

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment (Opsional)
Salin file `.env.example` ke `.env`:
```bash
cp .env.example .env
```

### 4. Menjalankan Server Pengembangan (Dev)
```bash
npm run dev
```
Buka browser dan akses: `http://localhost:3000`

---

## 📦 Build & Produksi

Untuk mengompilasi aplikasi ke dalam mode produksi:

```bash
# Compile frontend dengan Vite & bundle backend server dengan esbuild
npm run build

# Menjalankan server produksi
npm start
```

Hasil build akan berada di direktori `dist/` dan backend server dibundel ke `dist/server.cjs`.

---

## 🔍 Detail Teknik Kunci: Video Scrubbing Performance

Salah satu tantangan terbesar dalam video scrubbing berbasis scroll adalah **frame stuttering** dan **decoder flooding**. OYLA mengimplementasikan arsitektur scrubbing dengan prinsip:

```javascript
// Render loop di dalam requestAnimationFrame
heroCurrentTime += (heroTargetTime - heroCurrentTime) * 0.08;

// SEEKING GUARD: Hanya perbarui frame jika browser sudah selesai merender frame sebelumnya
const isSeeking = video.seeking && (performance.now() - lastSeekTime < 250);

if (!isSeeking && Math.abs(video.currentTime - heroCurrentTime) > 0.01) {
  if (video.readyState >= 1) {
    video.currentTime = heroCurrentTime;
    lastSeekTime = performance.now();
  }
}
```

Manfaat pendekatan ini:
1. **Mencegah Decoder Overload**: Browser tidak dipaksa melakukan seek saat proses decoding frame sebelumnya masih berlangsung.
2. **Smooth Lerp (0.08)**: Transisi pergerakan video terasa sinematik dan luwes mengikuti inersia scrolling.
3. **Keyframe-Dense Videos**: Video di-encode dengan interval I-frame pendek agar proses seek berlangsung instan tanpa menunggu inter-frame decoding yang lama.

---

## 📁 Struktur Direktori

```text
├── public/                 # Asset statis publik (video teroptimasi, poster gambar)
│   ├── hero-poster.jpg     # Poster gambar awal hero section
│   ├── hero-video-fast.mp4 # Video hero dengan keyframe rapat untuk scrubbing
│   ├── reveal-poster.jpg   # Poster gambar awal awards reveal section
│   └── reveal-video-fast.mp4
├── src/                    # Komponen React & sumber TypeScript
│   ├── App.tsx             # Entry component React
│   ├── index.css           # Styling dasar Tailwind CSS v4
│   └── main.tsx            # React root mounter
├── index.html              # Entry point utama landing page & skrip GSAP
├── server.ts               # Express server (proxy API, static file serving, Vite middleware)
├── package.json            # Daftar dependensi & script runner
├── tsconfig.json           # Konfigurasi TypeScript
└── vite.config.ts          # Konfigurasi Vite
```

---

## 🔌 API Endpoint

### `GET /api/higgsfield-video`
Endpoint proxy untuk mengekstrak URL streaming direct MP4 dari halaman share Higgsfield AI.

- **Query Param**: `?url=<higgsfield_share_url>` (opsional, default ke video hero OYLA)
- **Response**:
  ```json
  {
    "success": true,
    "url": "https://d8j0ntlcm91z4.cloudfront.net/..."
  }
  ```

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan demonstrasi dan portofolio. Aset desain dan fotografi merupakan hak cipta dari pemilik merek terkait.
