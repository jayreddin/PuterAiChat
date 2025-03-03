interface FileSystemAPI {
  write: (path: string, content: any) => Promise<{ id: string; path: string }>;
  read: (path: string) => Promise<any>;
  getPublicURL: (path: string) => Promise<string>;
}

interface ImageDescription {
  description: string;
}

interface MessageBlock {
  type: string;
  text?: string;
  image_url?: { url: string };
}

interface PuterAPIResponse {
  message?: {
    content: string | MessageBlock[];
  };
}

interface PuterAPI {
  fs: FileSystemAPI;
  ai: {
    chat: (message: string, options?: {
      model?: string;
      onProgress?: (progress: string) => void;
    }) => Promise<PuterAPIResponse>;
    describeImage: (url: string) => Promise<ImageDescription>;
  };
}

declare global {
  interface Window {
    puter?: PuterAPI;
  }
}

export type { PuterAPI, FileSystemAPI, MessageBlock, ImageDescription };