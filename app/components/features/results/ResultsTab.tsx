"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ChevronLeft, ChevronRight, Copy, MessageSquare } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ResultsService, ReviewRule, ReviewIssue, DocumentComparison } from "@/lib/api/results"

interface ResultsTabProps {
  onNextStep: () => void;
  onBackToReview: () => void;
}

export const ResultsTab: React.FC<ResultsTabProps> = ({ onNextStep, onBackToReview }) => {
  const [uploadedDocuments, setUploadedDocuments] = useState([
    { title: "智能驾驶系统PRD", status: "reviewing" }
  ]);
  const [reviewRules, setReviewRules] = useState<ReviewRule[]>([]);
  const [reviewIssues, setReviewIssues] = useState<ReviewIssue[]>([]);
  const [documentComparison, setDocumentComparison] = useState<DocumentComparison[]>([]);

  useEffect(() => {
    const resultsService = ResultsService.getInstance();

    // Get review rules
    resultsService.getReviewRules().then(response => {
      if (response.status === 'success' && response.data) {
        setReviewRules(response.data);
      }
    });

    // Get review issues
    resultsService.getReviewIssues().then(response => {
      if (response.status === 'success' && response.data) {
        setReviewIssues(response.data);
      }
    });

    // Get document comparison
    resultsService.getDocumentComparison().then(response => {
      if (response.status === 'success' && response.data) {
        setDocumentComparison(response.data);
      }
    });
  }, []);

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
              {reviewRules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell className="font-medium">{rule.name}</TableCell>
                  <TableCell>
                    <Badge variant={rule.status === 'pass' ? 'outline' : 'destructive'}>
                      {rule.status === 'pass' ? '通过' : '不通过'}
                    </Badge>
                  </TableCell>
                  <TableCell>{rule.issueCount}</TableCell>
                  <TableCell>{rule.fixedCount}</TableCell>
                  <TableCell>
                    <Progress value={rule.progress} className="h-2 w-24" />
                  </TableCell>
                  <TableCell>{rule.score}</TableCell>
                </TableRow>
              ))}
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
            {reviewIssues.map((issue) => (
              <div key={issue.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {issue.type === "error" && <AlertTriangle className="w-5 h-5 text-red-500" />}
                      {issue.type === "warning" && <AlertTriangle className="w-5 h-5 text-yellow-500" />}
                      {issue.type === "suggestion" && <MessageSquare className="w-5 h-5 text-blue-500" />}
                      <h4 className="font-medium text-gray-900">{issue.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {issue.sectionTitle}
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
                    <p className="text-sm text-gray-600 mb-2">{issue.description}</p>
                    <p className="text-sm text-blue-600 mb-3">建议：{issue.suggestion}</p>
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
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>修改前后对比</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            {documentComparison.map((comparison) => (
              <React.Fragment key={comparison.sectionId}>
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">修改前</h3>
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h4 className="font-medium text-gray-800 mb-2">{comparison.sectionTitle}</h4>
                    <p className="text-sm text-gray-600">{comparison.originalContent}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">修改后</h3>
                  <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                    <h4 className="font-medium text-gray-800 mb-2">{comparison.sectionTitle}</h4>
                    <p className="text-sm text-gray-600">{comparison.modifiedContent}</p>
                  </div>
                </div>
              </React.Fragment>
            ))}
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