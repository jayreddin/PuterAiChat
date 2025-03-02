import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

interface UrlPreview {
  url: string;
  title: string | null;
  description: string | null;
  image: string | null;
  loading: boolean;
  error: string | null;
}

const previewCache = new Map<string, UrlPreview>();

export function useUrlPreview(url: string | null) {
  const [preview, setPreview] = useState<UrlPreview>({
    url: url || '',
    title: null,
    description: null,
    image: null,
    loading: false,
    error: null
  });

  useEffect(() => {
    if (!url) {
      setPreview(prev => ({ ...prev, loading: false, error: null }));
      return;
    }

    const cachedPreview = previewCache.get(url);
    if (cachedPreview) {
      setPreview(cachedPreview);
      return;
    }

    const fetchPreview = async () => {
      setPreview(prev => ({ ...prev, loading: true, error: null }));

      try {
        const response = await fetch(`/api/preview?url=${encodeURIComponent(url)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch preview');
        }

        const data = await response.json();
        const newPreview = {
          url,
          title: data.title || null,
          description: data.description || null,
          image: data.image || null,
          loading: false,
          error: null
        };

        previewCache.set(url, newPreview);
        setPreview(newPreview);
      } catch (error) {
        console.error('Preview error:', error);
        const errorPreview = {
          url,
          title: null,
          description: null,
          image: null,
          loading: false,
          error: 'Failed to load preview'
        };
        previewCache.set(url, errorPreview);
        setPreview(errorPreview);
        
        toast({
          title: "Preview Error",
          description: "Could not load the URL preview. Please check the URL and try again.",
          variant: "destructive"
        });
      }
    };

    fetchPreview();

    return () => {
      // Clean up old previews if cache gets too large
      if (previewCache.size > 50) {
        const keys = Array.from(previewCache.keys());
        const oldestKeys = keys.slice(0, 10);
        oldestKeys.forEach(key => previewCache.delete(key));
      }
    };
  }, [url]);

  return preview;
}