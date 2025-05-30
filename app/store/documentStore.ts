import { create } from 'zustand';
import { Document, UploadProgress } from '@/app/types/document';
import { DocumentService } from '@/lib/api/documents';

interface DocumentState {
  documents: Document[];
  currentDocument: Document | null;
  uploadProgress: UploadProgress | null;
  isLoading: boolean;
  error: string | null;
  fetchDocuments: () => Promise<void>;
  uploadDocument: (file: File) => Promise<void>;
  getUploadProgress: (documentId: string) => Promise<void>;
  setCurrentDocument: (document: Document | null) => void;
  clearError: () => void;
}

export const useDocumentStore = create<DocumentState>((set, get) => ({
  documents: [],
  currentDocument: null,
  uploadProgress: null,
  isLoading: false,
  error: null,

  fetchDocuments: async () => {
    set({ isLoading: true, error: null });
    try {
      const documentService = DocumentService.getInstance();
      const response = await documentService.getDocuments();
      if (response.status === 'success' && response.data) {
        set({ documents: response.data });
      } else {
        set({ error: response.message || 'Failed to fetch documents' });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred' });
    } finally {
      set({ isLoading: false });
    }
  },

  uploadDocument: async (file: File) => {
    set({ isLoading: true, error: null });
    try {
      const documentService = DocumentService.getInstance();
      const response = await documentService.uploadDocument(file);
      if (response.status === 'success' && response.data) {
        set({ currentDocument: response.data.document });
        // 开始轮询上传进度
        if (response.data.document.id) {
          get().getUploadProgress(response.data.document.id);
        }
      } else {
        set({ error: response.message || 'Failed to upload document' });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred' });
    } finally {
      set({ isLoading: false });
    }
  },

  getUploadProgress: async (documentId: string) => {
    try {
      const documentService = DocumentService.getInstance();
      const response = await documentService.getUploadProgress(documentId);
      if (response.status === 'success' && response.data) {
        set({ uploadProgress: response.data });
        // 如果上传还在进行中，继续轮询
        if (response.data.status === 'uploading' || response.data.status === 'processing') {
          setTimeout(() => get().getUploadProgress(documentId), 1000);
        }
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred' });
    }
  },

  setCurrentDocument: (document) => {
    set({ currentDocument: document });
  },

  clearError: () => {
    set({ error: null });
  },
})); 