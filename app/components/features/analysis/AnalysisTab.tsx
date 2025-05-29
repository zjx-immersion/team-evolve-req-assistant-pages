"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, Pause, Play, RotateCcw, Plus, Settings, AlertTriangle, MessageSquare, Clock, CheckCircle } from "lucide-react"

interface AssessmentRule {
  id: string
  title: string
  description: string
  category: string
  severity: "high" | "medium" | "low"
  enabled: boolean
}

interface AnalysisStep {
  id: string
  title: string
  description: string
  status: "pending" | "in-progress" | "completed" | "skipped"
  progress: number
}

interface ReviewIssue {
  id: string
  type: "error" | "warning" | "suggestion"
  title: string
  description: string
  section: string
  sectionTitle: string
  suggestion: string
}

interface AnalysisTabProps {
  onResetWorkflow: () => void
  onCompleteAnalysis: () => void
}

export function AnalysisTab({ onResetWorkflow, onCompleteAnalysis }: AnalysisTabProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [reviewProgress, setReviewProgress] = useState(0)
  const [currentReviewSection, setCurrentReviewSection] = useState("")
  const [currentAnalysisStep, setCurrentAnalysisStep] = useState<string>("")
  const [realTimeResults, setRealTimeResults] = useState<ReviewIssue[]>([])

  const [assessmentRules, setAssessmentRules] = useState<AssessmentRule[]>([
    {
      id: "rule1",
      title: "需求完整性检查",
      description: "检查需求是否包含完整的功能描述、性能指标和验收标准",
      category: "完整性",
      severity: "high",
      enabled: true,
    },
    {
      id: "rule2",
      title: "需求一致性检查",
      description: "检查需求内部是否存在矛盾或冲突",
      category: "一致性",
      severity: "high",
      enabled: true,
    },
    {
      id: "rule3",
      title: "需求可测试性检查",
      description: "检查需求是否可以被测试验证",
      category: "可测试性",
      severity: "medium",
      enabled: true,
    },
    {
      id: "rule4",
      title: "需求可追溯性检查",
      description: "检查需求是否可以追溯到上层需求或业务目标",
      category: "可追溯性",
      severity: "medium",
      enabled: true,
    },
    {
      id: "rule5",
      title: "需求明确性检查",
      description: "检查需求描述是否清晰明确，避免模糊表述",
      category: "明确性",
      severity: "high",
      enabled: true,
    },
  ])

  const [analysisSteps, setAnalysisSteps] = useState<AnalysisStep[]>([
    { id: "step1", title: "文档解析", description: "解析文档结构和内容", status: "completed", progress: 100 },
    { id: "step2", title: "需求提取", description: "提取文档中的需求项", status: "completed", progress: 100 },
    { id: "step3", title: "规则加载", description: "加载评估规则库", status: "completed", progress: 100 },
    { id: "step4", title: "完整性评估", description: "评估需求的完整性", status: "in-progress", progress: 65 },
    { id: "step5", title: "一致性评估", description: "评估需求的一致性", status: "pending", progress: 0 },
    { id: "step6", title: "可测试性评估", description: "评估需求的可测试性", status: "pending", progress: 0 },
    { id: "step7", title: "可追溯性评估", description: "评估需求的可追溯性", status: "pending", progress: 0 },
    { id: "step8", title: "明确性评估", description: "评估需求的明确性", status: "pending", progress: 0 },
    { id: "step9", title: "生成评估报告", description: "生成最终评估报告", status: "pending", progress: 0 },
  ])

  // Predefined review issues
  const reviewIssuesData: ReviewIssue[] = [
    {
      id: "rt1",
      type: "error",
      title: "缺少具体的性能指标",
      description: "当前PRD中对智能驾驶系统的性能指标描述不够具体，建议添加量化指标如响应时间、准确率等。",
      section: "section-3-2",
      sectionTitle: "3.2 系统性能要求",
      suggestion: "系统响应时间应不超过100ms，目标识别准确率应达到98%以上，系统稳定性应确保99.9%的可用性。",
    },
    {
      id: "rt2",
      type: "warning",
      title: "用户场景描述不完整",
      description: "用户场景描述过于简略，缺少极端情况和边缘案例的考虑。",
      section: "section-2-2",
      sectionTitle: "2.2 用户调研",
      suggestion: "建议补充恶劣天气、复杂路况等边缘场景的处理方案。",
    },
    {
      id: "rt3",
      type: "suggestion",
      title: "缺少合规性要求",
      description: "未明确提及智能驾驶相关的法规标准要求。",
      section: "section-4-1",
      sectionTitle: "4.1 法规要求",
      suggestion: "建议添加ISO 26262功能安全标准、国标等相关法规要求。",
    },
  ]

  // Handle starting analysis
  const handleStartAnalysis = () => {
    setIsAnalyzing(true)
    setIsPaused(false)
    setRealTimeResults([])
    setReviewProgress(0)
    setCurrentReviewSection("")
    setCurrentAnalysisStep("step1")

    // Reset analysis steps
    setAnalysisSteps((steps) =>
      steps.map((step) => ({
        ...step,
        status: step.id === "step1" ? "in-progress" : "pending",
        progress: step.id === "step1" ? 0 : 0,
      })),
    )

    // Simulate analysis progress
    let progress = 0
    let resultIndex = 0
    let stepIndex = 0
    const sections = ["section-1", "section-2-1", "section-2-2", "section-3-1", "section-3-2", "section-4-1"]

    const interval = setInterval(() => {
      if (isPaused) return

      progress += 2
      setUploadProgress(progress)

      // Update current section being reviewed
      if (progress % 15 === 0 && stepIndex < analysisSteps.length) {
        // Update current step progress
        setAnalysisSteps((steps) =>
          steps.map((step, idx) => {
            if (idx === stepIndex) {
              return { ...step, progress: Math.min(step.progress + 20, 100) }
            }
            return step
          }),
        )

        // Move to next step if current step is complete
        if (progress % 30 === 0 && stepIndex < analysisSteps.length - 1) {
          setAnalysisSteps((steps) =>
            steps.map((step, idx) => {
              if (idx === stepIndex) {
                return { ...step, status: "completed", progress: 100 }
              }
              if (idx === stepIndex + 1) {
                return { ...step, status: "in-progress", progress: 0 }
              }
              return step
            }),
          )
          stepIndex++
          setCurrentAnalysisStep(`step${stepIndex + 1}`)
        }

        setCurrentReviewSection(sections[Math.min(Math.floor(progress / 15) % sections.length, sections.length - 1)])
        setReviewProgress(Math.floor((progress / 100) * 100))
      }

      // Add results progressively
      if (progress >= 30 && resultIndex < reviewIssuesData.length && progress % 10 === 0) {
        setRealTimeResults((prev) => [...prev, reviewIssuesData[resultIndex]])
        resultIndex++
      }

      if (progress >= 100) {
        clearInterval(interval)
        setIsAnalyzing(false)
        setReviewProgress(100)
        setAnalysisSteps((steps) =>
          steps.map((step) => ({
            ...step,
            status: "completed",
            progress: 100,
          })),
        )
        onCompleteAnalysis()
      }
    }, 300)

    return () => clearInterval(interval)
  }

  // Handle pausing analysis
  const handlePauseAnalysis = () => {
    setIsPaused(!isPaused)
  }

  // Handle restarting analysis
  const handleRestartAnalysis = () => {
    setRealTimeResults([])
    setReviewProgress(0)
    handleStartAnalysis()
  }

  // Toggle assessment rule
  const handleToggleRule = (ruleId: string) => {
    setAssessmentRules((rules) =>
      rules.map((rule) => (rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule)),
    )
  }

  // Start analysis when component mounts
  useEffect(() => {
    handleStartAnalysis()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5" />
            <span>智能驾驶系统PRD</span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">v1.2.0 汽车行业</Badge>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePauseAnalysis}
                disabled={!isAnalyzing}
                className="flex items-center space-x-1"
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                <span>{isPaused ? "继续" : "暂停"}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRestartAnalysis}
                className="flex items-center space-x-1"
              >
                <RotateCcw className="w-4 h-4" />
                <span>重新评估</span>
              </Button>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">评估规则</h3>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                <Plus className="w-4 h-4" />
                <span>添加规则</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center space-x-1">
                <Settings className="w-4 h-4" />
                <span>编辑</span>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {assessmentRules.map((rule) => (
              <div
                key={rule.id}
                className={`border rounded-md p-2 cursor-pointer transition-colors ${
                  rule.enabled ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200"
                }`}
                onClick={() => handleToggleRule(rule.id)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium">{rule.title}</span>
                  <Badge variant={rule.enabled ? "default" : "outline"} className="text-xs">
                    {rule.severity}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 truncate">{rule.category}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">分析进度</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">总体进度</span>
              <span className="text-sm text-gray-500">{reviewProgress}%</span>
            </div>
            <Progress value={reviewProgress} className="h-2" />
          </div>
          <div className="space-y-3">
            {analysisSteps.map((step) => (
              <div key={step.id} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    {step.status === "completed" && <CheckCircle className="w-4 h-4 text-green-500" />}
                    {step.status === "in-progress" && <RotateCcw className="w-4 h-4 text-blue-500 animate-spin" />}
                    {step.status === "pending" && <Clock className="w-4 h-4 text-gray-400" />}
                    <span
                      className={
                        step.status === "completed"
                          ? "text-green-600"
                          : step.status === "in-progress"
                            ? "text-blue-600"
                            : "text-gray-500"
                      }
                    >
                      {step.title}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {step.status === "completed"
                      ? "完成"
                      : step.status === "in-progress"
                        ? "进行中"
                        : "等待中"}
                  </span>
                </div>
                <p className="text-xs text-gray-500 ml-6">{step.description}</p>

                {/* Show results for completed steps */}
                {step.status === "completed" && step.id === "step4" && (
                  <div className="ml-6 mt-1 p-2 bg-green-50 rounded-md border border-green-100">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-3 h-3 text-yellow-500" />
                      <span className="text-xs text-gray-700">
                        发现 3 个完整性问题，主要集中在 "系统性能要求" 章节
                      </span>
                    </div>
                  </div>
                )}
                {step.status === "completed" && step.id === "step5" && (
                  <div className="ml-6 mt-1 p-2 bg-green-50 rounded-md border border-green-100">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-3 h-3 text-yellow-500" />
                      <span className="text-xs text-gray-700">
                        发现 1 个一致性问题，"性能指标与安全要求" 存在冲突
                      </span>
                    </div>
                  </div>
                )}
                {step.status === "completed" && step.id === "step8" && (
                  <div className="ml-6 mt-1 p-2 bg-green-50 rounded-md border border-green-100">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-3 h-3 text-red-500" />
                      <span className="text-xs text-gray-700">
                        发现 2 个明确性问题，"自动泊车激活条件" 和 "用户界面交互" 描述不明确
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {realTimeResults && realTimeResults.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">实时评估结果</h3>
            <div className="space-y-3">
              {realTimeResults.map((result, index) => {
                if (!result || !result.type) return null
                return (
                  <Card key={`${result.id}-${index}`} className="border-l-4 border-l-orange-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {result.type === "error" && <AlertTriangle className="w-4 h-4 text-red-500" />}
                            {result.type === "warning" && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                            {result.type === "suggestion" && <MessageSquare className="w-4 h-4 text-blue-500" />}
                            <h4 className="font-medium text-gray-900 text-sm">{result.title || ""}</h4>
                          </div>
                          <p className="text-xs text-gray-600">{result.description || ""}</p>
                        </div>
                        <Badge variant="outline" className="text-xs ml-2">
                          {result.sectionTitle || result.section || ""}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={onResetWorkflow}
          className="flex items-center space-x-2"
        >
          <span>上一步</span>
        </Button>
        <Button
          onClick={onCompleteAnalysis}
          className="bg-orange-500 hover:bg-orange-600"
        >
          下一步
        </Button>
      </div>
    </Card>
  )
} 