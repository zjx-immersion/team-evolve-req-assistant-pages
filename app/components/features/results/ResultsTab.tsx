import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ChevronLeft, ChevronRight, Copy, MessageSquare } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface ResultsTabProps {
  onNextStep: () => void;
  onBackToReview: () => void;
}

export const ResultsTab: React.FC<ResultsTabProps> = ({ onNextStep, onBackToReview }) => {
  const uploadedDocuments = [
    { title: "智能驾驶系统PRD", status: "reviewing" },
    // Add more documents as needed
  ];

  const reviewIssues = [
    {
      id: "rt1",
      type: "error",
      title: "缺少具体的性能指标",
      description: "当前PRD中对智能驾驶系统的性能指标描述不够具体，建议添加量化指标如响应时间、准确率等。",
      section: "section-3-2",
      sectionTitle: "3.2 系统性能要求",
      suggestion: "系统响应时间应不超过100ms，目标识别准确率应达到98%以上，系统稳定性应确保99.9%的可用性。",
      accepted: true,
    },
    {
      id: "rt2",
      type: "warning",
      title: "用户场景描述不完整",
      description: "用户场景描述过于简略，缺少极端情况和边缘案例的考虑。",
      section: "section-2-2",
      sectionTitle: "2.2 用户调研",
      suggestion: "建议补充恶劣天气、复杂路况等边缘场景的处理方案。",
      accepted: false,
    },
    {
      id: "rt3",
      type: "suggestion",
      title: "缺少合规性要求",
      description: "未明确提及智能驾驶相关的法规标准要求。",
      section: "section-4-1",
      sectionTitle: "4.1 法规要求",
      suggestion: "建议添加ISO 26262功能安全标准、国标等相关法规要求。",
      accepted: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          评审结果 -{" "}
          {uploadedDocuments.find((d) => d.status === "reviewing" || d.status === "completed")?.title ||
            "智能驾驶系统PRD"}
        </h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Copy className="w-4 h-4 mr-2" />
            复制结果
          </Button>
          <Button variant="outline" size="sm">
            导出报告
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>评审规则执行结果</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/4">评审规则</TableHead>
                <TableHead>结果</TableHead>
                <TableHead>问题数</TableHead>
                <TableHead>已处理</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>得分</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">需求完整性检查</TableCell>
                <TableCell>
                  <Badge variant="destructive">不通过</Badge>
                </TableCell>
                <TableCell>4</TableCell>
                <TableCell>3</TableCell>
                <TableCell>
                  <Progress value={75} className="h-2 w-24" />
                </TableCell>
                <TableCell>75</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">需求一致性检查</TableCell>
                <TableCell>
                  <Badge variant="destructive">不通过</Badge>
                </TableCell>
                <TableCell>2</TableCell>
                <TableCell>1</TableCell>
                <TableCell>
                  <Progress value={50} className="h-2 w-24" />
                </TableCell>
                <TableCell>50</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">需求可测试性检查</TableCell>
                <TableCell>
                  <Badge variant="outline">通过</Badge>
                </TableCell>
                <TableCell>1</TableCell>
                <TableCell>1</TableCell>
                <TableCell>
                  <Progress value={100} className="h-2 w-24" />
                </TableCell>
                <TableCell>100</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">需求可追溯性检查</TableCell>
                <TableCell>
                  <Badge variant="destructive">不通过</Badge>
                </TableCell>
                <TableCell>1</TableCell>
                <TableCell>0</TableCell>
                <TableCell>
                  <Progress value={0} className="h-2 w-24" />
                </TableCell>
                <TableCell>0</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">需求明确性检查</TableCell>
                <TableCell>
                  <Badge variant="outline">通过</Badge>
                </TableCell>
                <TableCell>3</TableCell>
                <TableCell>3</TableCell>
                <TableCell>
                  <Progress value={100} className="h-2 w-24" />
                </TableCell>
                <TableCell>100</TableCell>
              </TableRow>
              <TableRow className="bg-gray-50">
                <TableCell className="font-medium">总体评分</TableCell>
                <TableCell colSpan={4}>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">65分</span>
                    <span className="text-sm text-green-600">(及格)</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">65</Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>评审问题列表</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reviewIssues &&
              reviewIssues.length > 0 &&
              reviewIssues.map((issue) => {
                if (!issue || !issue.type) return null
                return (
                  <div key={issue.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {issue.type === "error" && <AlertTriangle className="w-5 h-5 text-red-500" />}
                          {issue.type === "warning" && <AlertTriangle className="w-5 h-5 text-yellow-500" />}
                          {issue.type === "suggestion" && <MessageSquare className="w-5 h-5 text-blue-500" />}
                          <h4 className="font-medium text-gray-900">{issue.title || ""}</h4>
                          <Badge variant="outline" className="text-xs">
                            {issue.sectionTitle || issue.section || ""}
                          </Badge>
                          {issue.accepted === true && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              已采纳
                            </Badge>
                          )}
                          {issue.accepted === false && (
                            <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                              已拒绝
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{issue.description || ""}</p>
                        <p className="text-sm text-blue-600 mb-3">建议：{issue.suggestion || ""}</p>
                      </div>
                      <div className="ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            // Handle re-evaluation logic here
                          }}
                        >
                          再次评估
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>修改前后对比</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-4">修改前</h3>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h4 className="font-medium text-gray-800 mb-2">3.2 系统性能要求</h4>
                <p className="text-sm text-gray-600">系统需要满足以下性能指标要求。</p>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-4">修改后</h3>
              <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                <h4 className="font-medium text-gray-800 mb-2">3.2 系统性能要求</h4>
                <p className="text-sm text-gray-600">系统需要满足以下性能指标要求：</p>
                <p className="text-sm text-gray-600">1. 系统响应时间应不超过100ms</p>
                <p className="text-sm text-gray-600">2. 目标识别准确率应达到98%以上</p>
                <p className="text-sm text-gray-600">3. 系统稳定性应确保99.9%的可用性</p>
                <p className="text-sm text-gray-600">4. 峰值处理能力应支持每秒1000次请求</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={onBackToReview}
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>上一步</span>
        </Button>
        <Button
          onClick={onNextStep}
          className="bg-orange-500 hover:bg-orange-600"
        >
          下一步
        </Button>
      </div>
    </div>
  )
} 