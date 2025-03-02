import { Router, Express } from "express";
import { z } from "zod";
import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import { isbot } from "isbot";

const router = Router();

const urlPreviewSchema = z.object({
  url: z.string().url()
});

const extractMetadata = (html: string, url: string) => {
  const dom = new JSDOM(html);
  const doc = dom.window.document;

  // Helper function to get meta content
  const getMeta = (selectors: string[]): string | null => {
    for (const selector of selectors) {
      const element = doc.querySelector(selector);
      const content = element?.getAttribute("content") || element?.textContent;
      if (content) return content;
    }
    return null;
  };

  // Extract metadata with fallbacks
  const title = getMeta([
    'meta[property="og:title"]',
    'meta[name="twitter:title"]',
    'meta[name="title"]',
    'title'
  ]);

  const description = getMeta([
    'meta[property="og:description"]',
    'meta[name="twitter:description"]',
    'meta[name="description"]'
  ]);

  let image = getMeta([
    'meta[property="og:image"]',
    'meta[name="twitter:image"]',
    'meta[name="image"]'
  ]);

  // Handle relative image URLs
  if (image && !image.startsWith('http')) {
    try {
      const baseUrl = new URL(url);
      image = new URL(image, baseUrl).toString();
    } catch (error) {
      console.error('Failed to resolve relative image URL:', error);
      image = null;
    }
  }

  return {
    title,
    description,
    image
  };
};

router.get("/api/preview", async (req, res) => {
  try {
    const { url } = urlPreviewSchema.parse({ url: req.query.url });

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PreviewBot/1.0; +http://example.com)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      },
      timeout: 5000
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) {
      return res.json({
        title: url,
        description: 'This URL does not contain HTML content.',
        image: null
      });
    }

    const html = await response.text();
    
    // Check for bot protection
    if (isbot(response.headers.get('user-agent') || '')) {
      return res.status(403).json({
        error: 'Access denied by bot protection'
      });
    }

    const metadata = extractMetadata(html, url);

    return res.json(metadata);
  } catch (error) {
    console.error('Preview error:', error);
    return res.status(400).json({
      error: error instanceof Error ? error.message : 'Failed to generate preview'
    });
  }
});

export const registerRoutes = (app: Express) => {
  app.use(router);
  return app;
};
