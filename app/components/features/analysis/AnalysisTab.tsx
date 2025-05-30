"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, Pause, Play, RotateCcw, Plus, Settings, AlertTriangle, MessageSquare, Clock, CheckCircle } from "lucide-react"
import { AnalysisService, AssessmentRule, AnalysisStep, ReviewIssue } from "@/lib/api/analysis"

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

  const [assessmentRules, setAssessmentRules] = useState<AssessmentRule[]>([])
  const [analysisSteps, setAnalysisSteps] = useState<AnalysisStep[]>([])

  // 初始化数据
  useEffect(() => {
    const analysisService = AnalysisService.getInstance();
    
    // 获取评估规则
    analysisService.getAssessmentRules().then(response => {
      if (response.status === 'success' && response.data) {
        setAssessmentRules(response.data);
      }
    });

    // 获取分析步骤
    analysisService.getAnalysisSteps().then(response => {
      if (response.status === 'success' && response.data) {
        setAnalysisSteps(response.data);
      }
    });
  }, []);

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
    let currentStepIndex = 0
    const sections = ["section-1", "section-2-1", "section-2-2", "section-3-1", "section-3-2", "section-4-1"]
    const analysisService = AnalysisService.getInstance();

    const interval = setInterval(() => {
      if (isPaused) return

      progress += 2
      setUploadProgress(progress)

      // Update current section being reviewed
      if (progress % 15 === 0) {
        // Update current step progress
        setAnalysisSteps((steps) =>
          steps.map((step, idx) => {
            if (idx === currentStepIndex) {
              return { ...step, progress: Math.min(step.progress + 20, 100) }
            }
            return step
          }),
        )

        // Move to next step if current step is complete
        if (progress % 30 === 0 && currentStepIndex < analysisSteps.length - 1) {
          setAnalysisSteps((steps) =>
            steps.map((step, idx) => {
              if (idx === currentStepIndex) {
                return { ...step, status: "completed", progress: 100 }
              }
              if (idx === currentStepIndex + 1) {
                return { ...step, status: "in-progress", progress: 0 }
              }
              return step
            }),
          )
          currentStepIndex++
          setCurrentAnalysisStep(`step${currentStepIndex + 1}`)
        }

        // Update review section and progress
        const currentSection = sections[Math.min(Math.floor(progress / 15) % sections.length, sections.length - 1)]
        const currentProgress = Math.floor((progress / 100) * 100)
        setCurrentReviewSection(currentSection)
        setReviewProgress(currentProgress)

        // Call API to update progress
        analysisService.updateAnalysisProgress("doc1", progress, currentStepIndex).then(response => {
          if (response.status === 'success' && response.data) {
            console.log('Progress updated:', response.data);
          }
        });
      }

      // Add results progressively
      if (progress >= 30 && resultIndex < 3 && progress % 10 === 0) {
        analysisService.getReviewIssues().then(response => {
          if (response.status === 'success' && response.data) {
            setRealTimeResults(prev => [...prev, response.data[resultIndex]]);
            resultIndex++;
          }
        });
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