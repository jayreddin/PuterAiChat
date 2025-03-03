export interface FSEntry {
  id: string;
  name: string;
  path: string;
  size: number;
  type: 'file' | 'directory';
  created: string;
  modified: string;
}

export interface FSOperation {
  write(path: string, content: string | Blob | File): Promise<FSEntry>;
  read(path: string): Promise<string | ArrayBuffer>;
  mkdir(path: string): Promise<FSEntry>;
  rm(path: string): Promise<void>;
  ls(path: string): Promise<FSEntry[]>;
  exists(path: string): Promise<boolean>;
  rename(oldPath: string, newPath: string): Promise<FSEntry>;
  copy(sourcePath: string, destPath: string): Promise<FSEntry>;
  move(sourcePath: string, destPath: string): Promise<FSEntry>;
  getPublicURL(path: string): Promise<string>;
}

export interface PuterAPI {
  fs: FSOperation;
  ui?: {
    alert(message: string): Promise<void>;
    confirm(message: string): Promise<boolean>;
    prompt(message: string, defaultValue?: string): Promise<string | null>;
  };
}

declare global {
  interface Window {
    puter: PuterAPI;
  }
}