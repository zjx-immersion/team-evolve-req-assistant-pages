import { ApiClient } from './client';
import { Document, UploadResponse, UploadProgress } from '@/app/types/document';
import { ApiResponse } from '@/app/types/api';

export class DocumentService {
  private static instance: DocumentService;
  private apiClient: ApiClient;

  private constructor() {
    this.apiClient = ApiClient.getInstance();
  }

  static getInstance(): DocumentService {
    if (!DocumentService.instance) {
      DocumentService.instance = new DocumentService();
    }
    return DocumentService.instance;
  }

  async uploadDocument(file: File): Promise<ApiResponse<UploadResponse>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.apiClient.post<UploadResponse>('/documents/upload', formData);
  }

  async getUploadProgress(documentId: string): Promise<ApiResponse<UploadProgress>> {
    return this.apiClient.get<UploadProgress>(`/documents/${documentId}/progress`);
  }

  async getDocument(documentId: string): Promise<ApiResponse<Document>> {
    return this.apiClient.get<Document>(`/documents/${documentId}`);
  }

  // 临时模拟数据，后续会移除
  private mockDocuments: Document[] = [
    {
      id: "doc1",
      title: "智能驾驶系统PRD_v1.2.0",
      uploadDate: "2025-05-25",
      status: "completed",
      progress: 100,
      issues: 12,
      fixed: 8,
    },
    {
      id: "doc2",
      title: "自动泊车功能需求说明_v0.9",
      uploadDate: "2025-05-27",
      status: "reviewing",
      progress: 60,
      issues: 15,
      fixed: 5,
    },
    {
      id: "doc3",
      title: "智能座舱交互需求_v1.0",
      uploadDate: "2025-05-28",
      status: "analyzing",
      progress: 30,
      issues: 7,
      fixed: 0,
    },
    {
      id: "doc4",
      title: "ADAS功能规格说明_v2.1",
      uploadDate: "2025-05-29",
      status: "uploaded",
      progress: 0,
      issues: 0,
      fixed: 0,
    },
  ];

  async getDocuments(): Promise<ApiResponse<Document[]>> {
    // 临时返回模拟数据，后续会替换为实际的 API 调用
    return Promise.resolve({
      data: this.mockDocuments,
      status: 'success',
      message: 'Documents retrieved successfully'
    });
  }
}

// 添加模拟数据
const mockData = {
  '/documents': [
    {
      id: "doc1",
      title: "智能驾驶系统PRD_v1.2.0",
      uploadDate: "2025-05-25",
      status: "completed",
      progress: 100,
      issues: 12,
      fixed: 8,
    },
    {
      id: "doc2",
      title: "自动泊车功能需求说明_v0.9",
      uploadDate: "2025-05-27",
      status: "reviewing",
      progress: 60,
      issues: 15,
      fixed: 5,
    }
  ]
}; 