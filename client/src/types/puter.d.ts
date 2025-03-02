interface MessageBlock {
  type: string;
  text: string;
}

interface PuterAIMessage {
  role: string;
  content: string | MessageBlock[];
}

interface PuterAIResponse {
  index: number;
  message: PuterAIMessage;
  finish_reason: string;
}

interface ImageAnalysis {
  objects: string[];
  colors: string[];
  text: string[];
}

interface ImageDescription {
  description: string;
}

interface FileUploadOptions {
  path?: string;
  onProgress?: (progress: number) => void;
}

interface FileUploadResponse {
  id: string;
  url: string;
  path: string;
}

interface PuterFiles {
  upload(file: File, options?: FileUploadOptions): Promise<FileUploadResponse>;
}

interface PuterAI {
  chat(message: string, options: { model: string }): Promise<PuterAIResponse>;
  processImage(options: {
    image: File | string;
    prompt?: string;
    model?: string;
  }): Promise<{
    description: string;
    analysis: ImageAnalysis;
  }>;
  uploadImage(file: File, options?: {
    onProgress?: (progress: number) => void;
  }): Promise<{
    id: string;
    url: string;
  }>;
  describeImage(url: string): Promise<ImageDescription>;
}

interface PuterAPI {
  init(): Promise<void>;
  ai: PuterAI;
  files: PuterFiles;
}

declare global {
  interface Window {
    puter?: PuterAPI;
  }
}

export type {
  MessageBlock,
  PuterAIMessage,
  PuterAIResponse,
  ImageAnalysis,
  ImageDescription,
  FileUploadOptions,
  FileUploadResponse,
  PuterFiles,
  PuterAI,
  PuterAPI
};