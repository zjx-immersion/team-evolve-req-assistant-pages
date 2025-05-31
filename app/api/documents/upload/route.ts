import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { Document } from '@/app/types/document';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { status: 'error', message: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.match(/^application\/(msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document)$/)) {
      return NextResponse.json(
        { status: 'error', message: 'Only Word documents are allowed' },
        { status: 400 }
      );
    }

    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'prd');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${timestamp}_${file.name}`;
    const filePath = join(uploadDir, fileName);

    // Convert File to Buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Create document record
    const newDocument: Document = {
      id: `doc${Date.now()}`,
      title: file.name,
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'uploaded',
      progress: 0,
      issues: 0,
      fixed: 0,
    };

    return NextResponse.json({
      status: 'success',
      data: {
        document: newDocument,
        message: 'Document uploaded successfully'
      }
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to upload file' },
      { status: 500 }
    );
  }
} 