"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Upload, FileText, AlertCircle, CheckCircle2, XCircle } from "lucide-react"
import { useDocumentStore } from "@/app/store/documentStore"

interface UploadTabProps {
  onStartAnalysis: (docId: string) => void
  onDocumentSelect: (docId: string) => void
  onCompleteUpload: () => void
}

export function UploadTab({ onStartAnalysis, onDocumentSelect, onCompleteUpload }: UploadTabProps) {
  const [isDragging, setIsDragging] = useState(false)
  const { 
    documents,
    currentDocument,
    uploadProgress,
    isLoading,
    error,
    uploadDocument,
    clearError,
    fetchDocuments
  } = useDocumentStore()

  // 组件加载时获取文档列表
  useEffect(() => {
    fetchDocuments()
  }, [fetchDocuments])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    clearError()

    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.type === "application/pdf" || file.type === "application/msword" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        await uploadDocument(file)
      } else {
        clearError()
        // 这里可以添加错误提示
      }
    }
  }, [uploadDocument, clearError])

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const file = files[0]
      if (file.type === "application/pdf" || file.type === "application/msword" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        await uploadDocument(file)
      } else {
        clearError()
        // 这里可以添加错误提示
      }
    }
  }, [uploadDocument, clearError])

  // 当上传完成时，自动进入下一步
  if (uploadProgress?.status === 'completed' && currentDocument) {
    onCompleteUpload()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Upload className="w-5 h-5" />
            <span>上传文档</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging ? "border-orange-500 bg-orange-50" : "border-gray-300"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="space-y-4">
            <div className="flex justify-center">
              <FileText className="w-12 h-12 text-gray-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-900">拖拽文件到此处</h3>
              <p className="text-sm text-gray-500">支持 PDF、Word 格式</p>
            </div>
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => document.getElementById("file-upload")?.click()}
                disabled={isLoading}
              >
                选择文件
              </Button>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={handleFileSelect}
              />
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">上传进度</span>
              <span className="text-sm text-gray-500">{uploadProgress?.progress || 0}%</span>
            </div>
            <Progress value={uploadProgress?.progress || 0} className="h-2" />
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          </div>
        )}

        {uploadProgress?.status === 'completed' && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span className="text-sm text-green-700">文档上传成功</span>
            </div>
          </div>
        )}

        {uploadProgress?.status === 'error' && (
          <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center space-x-2">
              <XCircle className="w-5 h-5 text-red-500" />
              <span className="text-sm text-red-700">上传失败，请重试</span>
            </div>
          </div>
        )}

        <div>
          <h3 className="font-medium text-gray-900 mb-4">已上传文档</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>文档名称</TableHead>
                  <TableHead>上传日期</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>进度</TableHead>
                  <TableHead>问题数</TableHead>
                  <TableHead>已修复</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.title}</TableCell>
                    <TableCell>{doc.uploadDate}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          doc.status === "completed"
                            ? "default"
                            : doc.status === "reviewing"
                              ? "secondary"
                              : doc.status === "analyzing"
                                ? "secondary"
                                : "outline"
                        }
                      >
                        {doc.status === "completed"
                          ? "已完成"
                          : doc.status === "reviewing"
                            ? "评审中"
                            : doc.status === "analyzing"
                              ? "分析中"
                              : "已上传"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="w-24">
                        <Progress value={doc.progress} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell>{doc.issues}</TableCell>
                    <TableCell>{doc.fixed}</TableCell>
                    <TableCell>
                      {doc.status === "uploaded" ? (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => onStartAnalysis(doc.id)}
                          className="bg-orange-500 hover:bg-orange-600"
                        >
                          开始分析
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDocumentSelect(doc.id)}
                          className="text-blue-600"
                        >
                          查看
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 