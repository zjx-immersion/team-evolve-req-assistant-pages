import { z } from 'zod';

export const DocumentSchema = z.object({
  id: z.string(),
  title: z.string(),
  uploadDate: z.string(),
  status: z.enum(['uploaded', 'analyzing', 'reviewing', 'completed']),
  progress: z.number().min(0).max(100),
  issues: z.number().min(0),
  fixed: z.number().min(0),
});

export type Document = z.infer<typeof DocumentSchema>;

export interface UploadResponse {
  document: Document;
  message: string;
}

export interface UploadError {
  message: string;
  code: string;
}

export interface UploadProgress {
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  message?: string;
} 