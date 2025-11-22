export enum AppView {
  DASHBOARD = 'DASHBOARD',
  IMAGE_GEN = 'IMAGE_GEN',
  VIDEO_GEN = 'VIDEO_GEN',
  LIBRARY = 'LIBRARY',
  SETTINGS = 'SETTINGS',
}

export interface GeneratedMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
  prompt: string;
  createdAt: number;
  aspectRatio?: string;
}

export interface GenerationConfig {
  aspectRatio: string;
  resolution?: '720p' | '1080p' | '1K' | '2K';
}
