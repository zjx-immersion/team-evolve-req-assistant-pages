"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Upload } from "lucide-react"

interface UploadedDocument {
  id: string
  title: string
  uploadDate: string
  status: "uploaded" | "analyzing" | "reviewing" | "completed"
  progress: number
  issues: number
  fixed: number
}

interface UploadTabProps {
  onStartAnalysis: (docId: string) => void
  onDocumentSelect: (docId: string) => void
}

export function UploadTab({ onStartAnalysis, onDocumentSelect }: UploadTabProps) {
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([
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
  ])

  const handleFileUploadComplete = () => {
    // Simulate file upload completion
    const newDocId = `doc${uploadedDocuments.length + 1}`
    const newDoc = {
      id: newDocId,
      title: `新上传文档_v1.0_${new Date().toLocaleDateString()}`,
      uploadDate: new Date().toISOString().split("T")[0],
      status: "uploaded" as const,
      progress: 0,
      issues: 0,
      fixed: 0,
    }

    setUploadedDocuments((prev) => [...prev, newDoc])

    // Show dialog to ask user what to do next
    if (confirm("文档上传成功！是否立即开始分析？")) {
      onStartAnalysis(newDocId)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="w-5 h-5" />
          <span>文档上传</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-900 mb-2">上传PRD文档</p>
          <p className="text-sm text-gray-500 mb-4">支持PDF、Word、Markdown格式</p>
          <div className="flex justify-center space-x-3">
            <Button className="bg-orange-500 hover:bg-orange-600">选择文件</Button>
            <Button variant="outline" onClick={handleFileUploadComplete}>
              拖拽文件到此处
            </Button>
          </div>
        </div>

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
                {uploadedDocuments.map((doc) => (
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