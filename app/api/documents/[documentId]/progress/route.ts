import { NextRequest, NextResponse } from 'next/server';
import { UploadProgress } from '@/app/types/document';

// 模拟进度数据，实际项目中应该从数据库或缓存中获取
const progressMap = new Map<string, UploadProgress>();

export async function GET(
  request: NextRequest,
  context: { params: { documentId: string } }
) {
  try {
    const documentId = context.params.documentId;
    
    // 获取或初始化进度
    let progress = progressMap.get(documentId);
    if (!progress) {
      progress = {
        progress: 0,
        status: 'uploading',
        message: 'Starting upload...'
      };
      progressMap.set(documentId, progress);
    }

    // 模拟进度更新
    if (progress.status === 'uploading') {
      progress.progress = Math.min(progress.progress + 10, 100);
      if (progress.progress === 100) {
        progress.status = 'completed';
        progress.message = 'Upload completed';
      }
    }

    return NextResponse.json({
      status: 'success',
      data: progress
    });
  } catch (error) {
    console.error('Error getting upload progress:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to get upload progress' },
      { status: 500 }
    );
  }
} 