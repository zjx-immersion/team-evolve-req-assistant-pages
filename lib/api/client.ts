import axios, { AxiosInstance } from 'axios';
import { ApiResponse } from '@/app/types/api';

export class ApiClient {
  private static instance: ApiClient;
  private client: AxiosInstance;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.get<ApiResponse<T>>(endpoint);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          data: null as T,
          status: 'error',
          message: error.message
        };
      }
      throw error;
    }
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post<ApiResponse<T>>(endpoint, data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          data: null as T,
          status: 'error',
          message: error.message
        };
      }
      throw error;
    }
  }
}

// 临时模拟数据
const mockData: Record<string, any> = {}; 