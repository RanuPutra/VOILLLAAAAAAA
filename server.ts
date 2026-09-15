import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API proxy endpoint to extract direct MP4 URL from Higgsfield share pages
  app.get('/api/higgsfield-video', async (req, res) => {
    try {
      const shareUrl = (req.query.url as string) || 'https://higgsfield.ai/s/keldUFnImRA';

      // Set timeout for fetch
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(shareUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return res.status(response.status).json({
          success: false,
          error: `Failed to fetch share page: ${response.statusText}`,
        });
      }

      const html = await response.text();

      // Look for og:video, video src, or any direct .mp4 CloudFront / Higgsfield link
      const ogVideoMatch = html.match(/<meta\s+property=["']og:video(?::secure_url)?["']\s+content=["']([^"']+\.mp4[^"']*)["']/i);
      const generalMp4Match = html.match(/https:\/\/[^"'<>\s]+\.mp4(?:\?[^"'<>\s]*)?/i);

      const mp4Url = ogVideoMatch?.[1] || generalMp4Match?.[0];

      if (mp4Url) {
        return res.json({ success: true, url: mp4Url });
      }

      return res.status(404).json({
        success: false,
        error: 'No MP4 URL found in page source',
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: err?.message || 'Failed to extract video URL',
      });
    }
  });

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', brand: 'OYLA' });
  });

  // Serve static assets from public folder with Range request support for videos
  app.use(express.static(path.join(process.cwd(), 'public')));

  // Vite middleware in dev or static serving in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[OYLA] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
