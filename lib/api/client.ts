import { ApiResponse } from '@/app/types/api';

export class ApiClient {
  private static instance: ApiClient;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    // 确保 baseUrl 以 / 结尾
    if (!this.baseUrl.endsWith('/')) {
      this.baseUrl += '/';
    }
    console.log('ApiClient initialized with baseUrl:', this.baseUrl);
  }

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private cleanEndpoint(endpoint: string): string {
    // 移除开头的斜杠，避免双斜杠
    return endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  }

  private async request<T>(endpoint: string, options: RequestInit): Promise<ApiResponse<T>> {
    const cleanEndpoint = this.cleanEndpoint(endpoint);
    const url = `${this.baseUrl}${cleanEndpoint}`;
    
    console.log('Making request to:', url);
    console.log('Request options:', options);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
        },
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('API error response:', errorData);
        // 不抛出错误，而是返回错误响应
        return {
          status: 'error',
          message: errorData?.message || `请求失败: ${response.status}`,
          data: null as any
        };
      }

      const data = await response.json();
      console.log('Response data:', data);
      
      return {
        status: 'success',
        data: data.data || data
      };
    } catch (error) {
      console.error('API request error:', error);
      // 不抛出错误，而是返回错误响应
      return {
        status: 'error',
        message: error instanceof Error ? error.message : '请求失败',
        data: null as any
      };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    const isFormData = data instanceof FormData;
    const headers: Record<string, string> = {};
    
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    return this.request<T>(endpoint, {
      method: 'POST',
      headers,
      body: isFormData ? data : JSON.stringify(data),
    });
  }
}

// 临时模拟数据
const mockData: Record<string, any> = {}; 