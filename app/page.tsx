"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MessageSquare,
  Settings,
  Database,
  Brain,
  ChevronRight,
  Copy,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Undo2,
  List,
  ChevronLeft,
  Pause,
  Play,
  RotateCcw,
  Plus,
  Clock,
  ImageIcon,
} from "lucide-react"

interface ReviewIssue {
  id: string
  type: "error" | "warning" | "suggestion"
  title: string
  description: string
  section: string
  sectionTitle: string
  suggestion: string
  accepted?: boolean
  originalContent?: string
  modifiedContent?: string
  rule?: string
  ruleId?: string
}

interface DocumentSection {
  id: string
  title: string
  content: string
  modifiedContent?: string
  isModified?: boolean
  children?: DocumentSection[]
  images?: DocumentImage[]
}

interface DocumentImage {
  id: string
  title: string
  url: string
  description: string
  type: "architecture" | "flow" | "interaction" | "other"
}

interface UploadedDocument {
  id: string
  title: string
  uploadDate: string
  status: "uploaded" | "analyzing" | "reviewing" | "completed"
  progress: number
  issues: number
  fixed: number
}

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

export default function TeamEvolveRequirementsAssistant() {
  const [activeTab, setActiveTab] = useState("upload")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [outlineExpanded, setOutlineExpanded] = useState(false)
  const [selectedSection, setSelectedSection] = useState<string>("")
  const [selectedIssue, setSelectedIssue] = useState<string>("")
  const [realTimeResults, setRealTimeResults] = useState<ReviewIssue[]>([])
  const [reviewProgress, setReviewProgress] = useState(0)
  const [currentReviewSection, setCurrentReviewSection] = useState("")
  const [documentSections, setDocumentSections] = useState<DocumentSection[]>([])
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([])
  const [assessmentRules, setAssessmentRules] = useState<AssessmentRule[]>([])
  const [analysisSteps, setAnalysisSteps] = useState<AnalysisStep[]>([])
  const [currentAnalysisStep, setCurrentAnalysisStep] = useState<string>("")
  const [reviewIssues, setReviewIssues] = useState<ReviewIssue[]>([])
  const [hasStartedAnalysis, setHasStartedAnalysis] = useState(false)
  const [hasCompletedAnalysis, setHasCompletedAnalysis] = useState(false)
  const [hasStartedReview, setHasStartedReview] = useState(false)
  const [hasCompletedReview, setHasCompletedReview] = useState(false)
  const [currentDocumentTitle, setCurrentDocumentTitle] = useState("")

  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  // Initialize document sections
  useEffect(() => {
    setDocumentSections([
      {
        id: "section-1",
        title: "一、文档说明",
        content: "本文档描述了智能驾驶系统的产品需求。",
        children: [
          {
            id: "section-1-1",
            title: "1.1 名词解释",
            content:
              "本文档中使用的术语和缩略词解释如下：\n- PRD: Product Requirement Document，产品需求文档\n- OCR: Optical Character Recognition，光学字符识别\n- AI: Artificial Intelligence，人工智能\n- APA: Automated Parking Assist，自动泊车辅助\n- AVM: Around View Monitor，全景影像系统\n- USS: Ultrasonic Sensor System，超声波传感器系统",
          },
        ],
      },
      {
        id: "section-2",
        title: "二、背景与目的",
        content: "本章节描述产品背景和开发目的。",
        children: [
          {
            id: "section-2-1",
            title: "2.1 产品/数据现状",
            content:
              "当前TTPO需求助手已具备通过AI技术生成规范化的PRD功能能力，并支持从需求来源到集成逐步成功的验证及改进建议。然而，在PRD文档的评审环节仍有较高人工工作量，缺乏标准化评估流程和实时反馈机制。",
          },
          {
            id: "section-2-2",
            title: "2.2 用户调研",
            content: "用户场景描述过于简略，缺少极端情况和边缘案例的考虑。",
            images: [
              {
                id: "img-user-research",
                title: "用户调研数据分析",
                url: "/images/user-research.png",
                description: "用户调研数据分析图表，展示用户对自动泊车功能的需求分布",
                type: "other",
              },
            ],
          },
        ],
      },
      {
        id: "section-3",
        title: "三、功能需求",
        content: "本章节描述系统的功能需求。",
        children: [
          {
            id: "section-3-1",
            title: "3.1 功能描述",
            content:
              "本功能模块主要实现对PRD文档的智能评审，包括但不限于以下几点：\n- PRD文档上传与解析功能\n- 基于行业知识库的内容评估\n- 问题识别与修改建议生成\n- 用户交互式评审流程",
            images: [
              {
                id: "img-system-architecture",
                title: "系统架构图",
                url: "/images/system-architecture.png",
                description: "自动泊车系统架构图，展示系统各模块间的关系",
                type: "architecture",
              },
            ],
          },
          {
            id: "section-3-2",
            title: "3.2 系统性能要求",
            content: "系统需要满足以下性能指标要求。",
          },
          {
            id: "section-3-3",
            title: "3.3 自动泊车流程",
            content:
              "自动泊车系统的工作流程包括：\n1. 驾驶员激活自动泊车功能\n2. 系统扫描周围环境寻找可用车位\n3. 系统规划泊车路径\n4. 系统控制车辆执行泊车操作\n5. 泊车完成后系统自动停止",
            images: [
              {
                id: "img-parking-flow",
                title: "自动泊车流程图",
                url: "/images/parking-flow.png",
                description: "自动泊车系统工作流程图，展示从激活到完成的全过程",
                type: "flow",
              },
            ],
          },
          {
            id: "section-3-4",
            title: "3.4 用户交互设计",
            content:
              "自动泊车系统的用户交互设计包括：\n1. 中控屏幕显示车位识别结果\n2. 提供泊车类型选择（平行、垂直、斜列）\n3. 实时显示泊车进度和周围障碍物\n4. 提供一键取消功能\n5. 语音提示引导用户操作",
            images: [
              {
                id: "img-ui-interaction",
                title: "用户界面交互图",
                url: "/images/ui-interaction.png",
                description: "自动泊车系统用户界面交互设计图，展示各功能区域和操作流程",
                type: "interaction",
              },
            ],
          },
        ],
      },
      {
        id: "section-4",
        title: "四、非功能需求",
        content: "本章节描述系统的非功能需求。",
        children: [
          {
            id: "section-4-1",
            title: "4.1 法规要求",
            content: "未明确提及智能驾驶相关的法规标准要求。",
          },
          {
            id: "section-4-2",
            title: "4.2 安全性要求",
            content:
              "自动泊车系统必须满足以下安全要求：\n1. 检测到移动障碍物时立即停止\n2. 提供紧急制动功能\n3. 系统故障时提供明确警告\n4. 防止误操作的安全机制",
          },
          {
            id: "section-4-3",
            title: "4.3 可靠性要求",
            content: "系统在各种环境条件下的可靠性要求未详细说明。",
          },
        ],
      },
    ])

    setUploadedDocuments([
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

    setAssessmentRules([
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

    setAnalysisSteps([
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
  }, [])

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
      originalContent: "系统需要满足以下性能指标要求。",
      modifiedContent:
        "系统需要满足以下性能指标要求：\n1. 系统响应时间应不超过100ms\n2. 目标识别准确率应达到98%以上\n3. 系统稳定性应确保99.9%的可用性\n4. 峰值处理能力应支持每秒1000次请求",
      rule: "需求明确性检查",
      ruleId: "rule5",
    },
    {
      id: "rt2",
      type: "warning",
      title: "用户场景描述不完整",
      description: "用户场景描述过于简略，缺少极端情况和边缘案例的考虑。",
      section: "section-2-2",
      sectionTitle: "2.2 用户调研",
      suggestion: "建议补充恶劣天气、复杂路况等边缘场景的处理方案。",
      originalContent: "用户场景描述过于简略，缺少极端情况和边缘案例的考虑。",
      modifiedContent:
        "用户调研显示以下场景需要特别关注：\n1. 常规场景：城市道路、高速公路、乡村道路等日常驾驶环境\n2. 极端场景：暴雨、大雾、暴雪等恶劣天气条件下的系统表现\n3. 边缘案例：复杂路口、施工区域、临时交通管制等特殊情况\n4. 用户反馈：90%的测试用户对系统响应速度表示满意，但对复杂场景下的准确性存在担忧",
      rule: "需求完整性检查",
      ruleId: "rule1",
    },
    {
      id: "rt3",
      type: "suggestion",
      title: "缺少合规性要求",
      description: "未明确提及智能驾驶相关的法规标准要求。",
      section: "section-4-1",
      sectionTitle: "4.1 法规要求",
      suggestion: "建议添加ISO 26262功能安全标准、国标等相关法规要求。",
      originalContent: "未明确提及智能驾驶相关的法规标准要求。",
      modifiedContent:
        "智能驾驶系统必须符合以下法规标准要求：\n1. ISO 26262功能安全标准\n2. GB/T 33577-2017 道路车辆 功能安全\n3. 《智能网联汽车道路测试管理规范（试行）》\n4. 《汽车驾驶自动化分级》国家标准\n5. 数据安全相关法规，包括《网络安全法》和《数据安全法》中关于车辆数据的规定",
      rule: "需求完整性检查",
      ruleId: "rule1",
    },
  ]

  // Function to find a section by ID
  const findSectionById = (sections: DocumentSection[], id: string): DocumentSection | undefined => {
    for (const section of sections) {
      if (section.id === id) {
        return section
      }
      if (section.children) {
        const found = findSectionById(section.children, id)
        if (found) {
          return found
        }
      }
    }
    return undefined
  }

  // Function to update a section's content
  const updateSectionContent = (
    sections: DocumentSection[],
    sectionId: string,
    newContent: string,
    isModified: boolean,
  ): DocumentSection[] => {
    return sections.map((section) => {
      if (section.id === sectionId) {
        return { ...section, modifiedContent: newContent, isModified }
      }
      if (section.children) {
        return {
          ...section,
          children: updateSectionContent(section.children, sectionId, newContent, isModified),
        }
      }
      return section
    })
  }

  // Handle accepting a modification
  const handleAcceptModification = (issueId: string) => {
    const issue = reviewIssuesData.find((i) => i && i.id === issueId)
    if (!issue || !issue.modifiedContent || !issue.section) return

    setDocumentSections((prevSections) =>
      updateSectionContent(prevSections, issue.section, issue.modifiedContent!, true),
    )

    setReviewIssues((prevIssues) => prevIssues.map((i) => (i && i.id === issueId ? { ...i, accepted: true } : i)))
  }

  // Handle undoing a modification
  const handleUndoModification = (issueId: string) => {
    const issue = reviewIssuesData.find((i) => i && i.id === issueId)
    if (!issue || !issue.originalContent || !issue.section) return

    setDocumentSections((prevSections) =>
      updateSectionContent(prevSections, issue.section, issue.originalContent!, false),
    )

    setReviewIssues((prevIssues) => prevIssues.map((i) => (i && i.id === issueId ? { ...i, accepted: undefined } : i)))
  }

  // Scroll to section
  const scrollToSection = (sectionId: string) => {
    if (sectionRefs.current[sectionId]) {
      sectionRefs.current[sectionId]?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  // Handle section selection
  const handleSectionSelect = (sectionId: string) => {
    setSelectedSection(sectionId)
    scrollToSection(sectionId)
  }

  // Handle issue selection
  const handleIssueSelect = (issueId: string) => {
    const issue = reviewIssuesData.find((i) => i && i.id === issueId)
    if (issue && issue.section) {
      setSelectedIssue(issueId)
      setSelectedSection(issue.section)
      scrollToSection(issue.section)
    }
  }

  // Handle starting analysis
  const handleStartAnalysis = () => {
    setIsAnalyzing(true)
    setIsPaused(false)
    setActiveTab("analysis")
    setRealTimeResults([])
    setReviewProgress(0)
    setCurrentReviewSection("")
    setCurrentAnalysisStep("step1")
    setHasStartedAnalysis(true)

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
        setActiveTab("review")
        setReviewIssues(reviewIssuesData)
        setReviewProgress(100)
        setAnalysisSteps((steps) =>
          steps.map((step) => ({
            ...step,
            status: "completed",
            progress: 100,
          })),
        )
        setHasCompletedAnalysis(true)
        setHasStartedReview(true)
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

  // Handle document selection
  const handleDocumentSelect = (docId: string) => {
    const doc = uploadedDocuments.find((d) => d.id === docId)
    if (!doc) return

    setCurrentDocumentTitle(doc.title)

    switch (doc.status) {
      case "uploaded":
        setActiveTab("upload")
        break
      case "analyzing":
        setActiveTab("analysis")
        setIsAnalyzing(true)
        setReviewProgress(doc.progress)
        setHasStartedAnalysis(true)
        break
      case "reviewing":
        setActiveTab("review")
        setReviewIssues(reviewIssuesData)
        setHasStartedAnalysis(true)
        setHasCompletedAnalysis(true)
        setHasStartedReview(true)
        break
      case "completed":
        setActiveTab("report")
        setReviewIssues(reviewIssuesData)
        setHasStartedAnalysis(true)
        setHasCompletedAnalysis(true)
        setHasStartedReview(true)
        setHasCompletedReview(true)
        break
    }
  }

  // Handle starting analysis for a specific document
  const handleStartAnalysisForDocument = (docId: string) => {
    const doc = uploadedDocuments.find((d) => d.id === docId)
    if (!doc) return

    // Update document status
    setUploadedDocuments((docs) => docs.map((d) => (d.id === docId ? { ...d, status: "analyzing", progress: 0 } : d)))

    setActiveTab("analysis")
    handleStartAnalysis()
  }

  // Handle file upload completion
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
      handleStartAnalysisForDocument(newDocId)
    }
  }

  // Render document section content
  const renderSectionContent = (section: DocumentSection) => {
    return (
      <div>
        {section.isModified && section.modifiedContent ? (
          <div className="relative">
            <div className="bg-green-50 border border-green-200 p-4 rounded-md">
              {section.modifiedContent.split("\n").map((line, i) => (
                <p key={i} className="text-sm text-gray-600 mb-1">
                  {line}
                </p>
              ))}
            </div>
          </div>
        ) : (
          <div>
            {section.content.split("\n").map((line, i) => (
              <p key={i} className="text-sm text-gray-600 mb-1">
                {line}
              </p>
            ))}
          </div>
        )}

        {section.images && section.images.length > 0 && (
          <div className="mt-4 space-y-4">
            {section.images.map((image) => (
              <div key={image.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{image.title}</h4>
                  <Badge variant="outline">{image.type}</Badge>
                </div>
                <div className="relative h-64 w-full bg-gray-100 rounded-md overflow-hidden mb-2">
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon className="h-16 w-16 text-gray-400" />
                  </div>
                </div>
                <p className="text-sm text-gray-600">{image.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Render document sections recursively
  const renderDocumentSections = (sections: DocumentSection[]) => {
    return sections.map((section) => (
      <div
        key={section.id}
        id={section.id}
        ref={(el) => (sectionRefs.current[section.id] = el)}
        className={`mb-6 ${selectedSection === section.id ? "bg-yellow-50 p-4 rounded-lg border border-yellow-200" : ""}`}
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{section.title}</h2>
        {renderSectionContent(section)}

        {section.children && (
          <div className="ml-4 mt-4 space-y-4">
            {section.children.map((child) => (
              <div
                key={child.id}
                id={child.id}
                ref={(el) => (sectionRefs.current[child.id] = el)}
                className={`${selectedSection === child.id ? "bg-yellow-50 p-4 rounded-lg border border-yellow-200" : ""}`}
              >
                <h3 className="font-medium text-gray-800 mb-2">{child.title}</h3>
                {renderSectionContent(child)}
              </div>
            ))}
          </div>
        )}
      </div>
    ))
  }

  // Render document outline
  const renderDocumentOutline = (sections: DocumentSection[], level = 0) => {
    return sections.map((section) => (
      <div key={section.id} className={`${level > 0 ? "ml-4" : ""}`}>
        <button
          onClick={() => handleSectionSelect(section.id)}
          className={`w-full text-left p-2 rounded-md text-sm transition-colors ${
            selectedSection === section.id
              ? "bg-orange-100 text-orange-700 border border-orange-200"
              : "hover:bg-gray-100 text-gray-700"
          }`}
        >
          <div className="flex items-center space-x-2">
            <ChevronRight className="w-4 h-4" />
            <span className="font-medium">{section.title}</span>
          </div>
        </button>

        {section.children && renderDocumentOutline(section.children, level + 1)}
      </div>
    ))
  }

  // Toggle sidebar and outline
  const handleToggleOutline = () => {
    setOutlineExpanded(!outlineExpanded)
    if (!outlineExpanded) {
      setSidebarCollapsed(true)
    } else {
      setSidebarCollapsed(false)
    }
  }

  // Reset workflow when going back to upload
  const handleResetWorkflow = () => {
    setActiveTab("upload")
    setHasStartedAnalysis(false)
    setHasCompletedAnalysis(false)
    setHasStartedReview(false)
    setHasCompletedReview(false)
    setReviewIssues([])
    setRealTimeResults([])
    setReviewProgress(0)
    setCurrentDocumentTitle("")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Team Evolve</h1>
            <Badge variant="secondary">需求助手</Badge>
            <span className="text-sm text-gray-500">TTPO</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">AI能力技能等级, 当前AI需求评估</span>
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              Q
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${sidebarCollapsed ? "w-16" : "w-64"} bg-white border-r border-gray-200 min-h-screen transition-all duration-300`}
        >
          <div className="flex justify-end p-2">
            <Button variant="ghost" size="sm" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
          </div>
          {!sidebarCollapsed && (
            <nav className="p-4">
              <div className="space-y-6">
                <div>
                  <div className="font-medium text-gray-900 mb-4">AI辅助需求能力</div>
                  <div className="space-y-1">
                    <a
                      href="#"
                      className="flex items-center px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100"
                    >
                      <FileText className="w-4 h-4 mr-3" />
                      <span>需求辅助分析</span>
                    </a>
                    <a
                      href="#"
                      className="flex items-center px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      <span>需求优化重构</span>
                    </a>
                    <a
                      href="#"
                      className="flex items-center px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100"
                    >
                      <Brain className="w-4 h-4 mr-3" />
                      <span>场景边界分析</span>
                    </a>
                    <a
                      href="#"
                      className="flex items-center px-3 py-2 text-sm rounded-md bg-orange-100 text-orange-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-3" />
                      <span>PRD智能评审</span>
                    </a>
                    <a
                      href="#"
                      className="flex items-center px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100"
                    >
                      <Database className="w-4 h-4 mr-3" />
                      <span>测试用例生成</span>
                    </a>
                    <a
                      href="#"
                      className="flex items-center px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100"
                    >
                      <MessageSquare className="w-4 h-4 mr-3" />
                      <span>测试执行结果分析</span>
                    </a>
                  </div>
                </div>

                <div>
                  <div className="font-medium text-gray-900 mb-4">知识熔炉</div>
                  <div className="space-y-1">
                    <a
                      href="#"
                      className="flex items-center px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100"
                    >
                      <FileText className="w-4 h-4 mr-3" />
                      <span>需求规范</span>
                    </a>
                    <a
                      href="#"
                      className="flex items-center px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100"
                    >
                      <FileText className="w-4 h-4 mr-3" />
                      <span>需求实例</span>
                    </a>
                    <a
                      href="#"
                      className="flex items-center px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100"
                    >
                      <CheckCircle className="w-4 h-4 mr-3" />
                      <span>需求评审规则</span>
                    </a>
                    <a
                      href="#"
                      className="flex items-center px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100"
                    >
                      <FileText className="w-4 h-4 mr-3" />
                      <span>需求模版</span>
                    </a>
                    <a
                      href="#"
                      className="flex items-center px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100"
                    >
                      <Brain className="w-4 h-4 mr-3" />
                      <span>领域概念与知识</span>
                    </a>
                    <a
                      href="#"
                      className="flex items-center px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100"
                    >
                      <Database className="w-4 h-4 mr-3" />
                      <span>行业产品功能</span>
                    </a>
                  </div>
                </div>
              </div>
            </nav>
          )}
          {sidebarCollapsed && (
            <nav className="p-2">
              <div className="space-y-8 flex flex-col items-center">
                <div className="space-y-4 flex flex-col items-center">
                  <FileText className="w-5 h-5 text-gray-500" />
                  <Settings className="w-5 h-5 text-gray-500" />
                  <Brain className="w-5 h-5 text-gray-500" />
                  <CheckCircle className="w-5 h-5 text-orange-500" />
                  <Database className="w-5 h-5 text-gray-500" />
                  <MessageSquare className="w-5 h-5 text-gray-500" />
                </div>
                <div className="space-y-4 flex flex-col items-center">
                  <FileText className="w-5 h-5 text-gray-500" />
                  <CheckCircle className="w-5 h-5 text-gray-500" />
                  <Brain className="w-5 h-5 text-gray-500" />
                </div>
              </div>
            </nav>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="upload">文档上传</TabsTrigger>
              <TabsTrigger value="analysis" disabled={!hasStartedAnalysis}>
                智能分析
              </TabsTrigger>
              <TabsTrigger value="review" disabled={!hasCompletedAnalysis}>
                评审确认
              </TabsTrigger>
              <TabsTrigger value="results" disabled={!hasStartedReview}>
                评审结果
              </TabsTrigger>
              <TabsTrigger value="report" disabled={!hasCompletedReview}>
                评估报告
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-6">
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
                      <Button variant="outline" onClick={() => handleFileUploadComplete()}>
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
                                    onClick={() => handleStartAnalysisForDocument(doc.id)}
                                    className="bg-orange-500 hover:bg-orange-600"
                                  >
                                    开始分析
                                  </Button>
                                ) : (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDocumentSelect(doc.id)}
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

                  {/* Removed the bottom "开始新解析用户故事" button */}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-6">
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
                              {step.status === "in-progress" && (
                                <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
                              )}
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
                        {realTimeResults.map((result) => {
                          if (!result || !result.type) return null
                          return (
                            <Card key={result.id} className="border-l-4 border-l-orange-500">
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-2">
                                      {result.type === "error" && <AlertTriangle className="w-4 h-4 text-red-500" />}
                                      {result.type === "warning" && (
                                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                                      )}
                                      {result.type === "suggestion" && (
                                        <MessageSquare className="w-4 h-4 text-blue-500" />
                                      )}
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
                    onClick={() => {
                      handleResetWorkflow()
                    }}
                    className="flex items-center space-x-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>上一步</span>
                  </Button>
                  <Button
                    onClick={() => {
                      setActiveTab("review")
                      setHasStartedReview(true)
                    }}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    下一步
                  </Button>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="review" className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-2"
                    onClick={handleToggleOutline}
                  >
                    <List className="w-4 h-4" />
                    <span>{outlineExpanded ? "隐藏大纲" : "显示大纲"}</span>
                    {outlineExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </Button>
                  <h2 className="text-xl font-semibold text-gray-900">{currentDocumentTitle || "智能驾驶系统PRD"}</h2>
                </div>
                <Badge variant="secondary">v1.2.0 汽车行业</Badge>
              </div>

              <div className="flex gap-6 h-[700px]">
                {/* Document Outline - Left Side (when expanded) */}
                {outlineExpanded && (
                  <div className="w-1/4 bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                      <h3 className="font-medium text-gray-900">文档大纲</h3>
                    </div>
                    <div className="p-4 overflow-y-auto h-full">
                      <div className="space-y-2">{renderDocumentOutline(documentSections)}</div>
                    </div>
                  </div>
                )}

                {/* Document Content - Center */}
                <div
                  className={`${outlineExpanded ? "w-1/2" : "w-2/3"} bg-white rounded-lg border border-gray-200 overflow-hidden`}
                >
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">文档内容</h3>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Copy className="w-4 h-4 mr-2" />
                          复制
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 overflow-y-auto h-full">
                    <div className="space-y-6">{renderDocumentSections(documentSections)}</div>
                  </div>
                </div>

                {/* Evaluation Results - Right Side */}
                <div
                  className={`${outlineExpanded ? "w-1/4" : "w-1/3"} bg-white rounded-lg border border-gray-200 overflow-hidden`}
                >
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="font-medium text-gray-900">评审结果</h3>
                    <p className="text-sm text-gray-500 mt-1">共发现 {reviewIssues.length} 个问题</p>
                  </div>
                  <div className="p-4 overflow-y-auto h-full">
                    <div className="space-y-4">
                      {reviewIssues &&
                        reviewIssues.length > 0 &&
                        reviewIssues.map((issue, index) => {
                          if (!issue || !issue.type) return null
                          return (
                            <Card
                              key={issue.id}
                              className={`border cursor-pointer transition-all ${
                                selectedIssue === issue.id
                                  ? "border-orange-300 bg-orange-50"
                                  : issue.accepted === true
                                    ? "border-green-300 bg-green-50"
                                    : issue.accepted === false
                                      ? "border-gray-300 bg-gray-50"
                                      : "border-gray-200 hover:border-gray-300"
                              }`}
                              onClick={() => handleIssueSelect(issue.id)}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-center space-x-2">
                                    <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                                    {issue.type === "error" && <AlertTriangle className="w-4 h-4 text-red-500" />}
                                    {issue.type === "warning" && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                                    {issue.type === "suggestion" && <MessageSquare className="w-4 h-4 text-blue-500" />}
                                  </div>
                                  <div className="flex space-x-1">
                                    {issue.accepted === true ? (
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              size="sm"
                                              variant="ghost"
                                              onClick={(e) => {
                                                e.stopPropagation()
                                                handleUndoModification(issue.id)
                                              }}
                                              className="w-8 h-8 p-0"
                                            >
                                              <Undo2 className="w-4 h-4 text-orange-500" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>撤销修改</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    ) : (
                                      <>
                                        <Button
                                          size="sm"
                                          variant={issue.accepted === true ? "default" : "ghost"}
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            handleAcceptModification(issue.id)
                                          }}
                                          className="w-8 h-8 p-0"
                                        >
                                          <CheckCircle className="w-4 h-4" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant={issue.accepted === false ? "default" : "ghost"}
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            setReviewIssues((prevIssues) =>
                                              prevIssues.map((i) =>
                                                i.id === issue.id ? { ...i, accepted: false } : i,
                                              ),
                                            )
                                          }}
                                          className="w-8 h-8 p-0"
                                        >
                                          <XCircle className="w-4 h-4" />
                                        </Button>
                                      </>
                                    )}
                                  </div>
                                </div>

                                <h4 className="font-medium text-gray-900 mb-2">{issue.title || ""}</h4>
                                <p className="text-sm text-blue-600 mb-2">
                                  所在章节：{issue.sectionTitle || issue.section || ""}
                                </p>
                                <p className="text-sm text-gray-600 mb-3">{issue.description || ""}</p>

                                <div className="mt-3 pt-3 border-t border-gray-100">
                                  <h5 className="text-sm font-medium text-gray-900 mb-1">修改建议</h5>
                                  <p className="text-sm text-gray-600">{issue.suggestion || ""}</p>
                                  {issue.accepted !== true && (
                                    <Button
                                      size="sm"
                                      className="mt-2 bg-orange-500 hover:bg-orange-600 text-white"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleAcceptModification(issue.id)
                                      }}
                                    >
                                      采纳修改
                                    </Button>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between mt-6">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("analysis")}
                  className="flex items-center space-x-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>上一步</span>
                </Button>
                <Button
                  onClick={() => {
                    setActiveTab("results")
                    setHasCompletedReview(true)
                  }}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  下一步
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="results" className="space-y-6">
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
                                    setActiveTab("review")
                                    handleIssueSelect(issue.id)
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
                  onClick={() => setActiveTab("review")}
                  className="flex items-center space-x-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>上一步</span>
                </Button>
                <Button
                  onClick={() => {
                    setActiveTab("report")
                    setHasCompletedReview(true)
                  }}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  下一步
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="report" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>评估报告 - {currentDocumentTitle || "智能驾驶系统PRD"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">8</div>
                        <div className="text-sm text-gray-600">已解决问题</div>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">3</div>
                        <div className="text-sm text-gray-600">待处理问题</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">95%</div>
                        <div className="text-sm text-gray-600">文档质量评分</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">73%</div>
                        <div className="text-sm text-gray-600">一次确认率</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">评审规则统计</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">启用规则数量</span>
                              <span className="font-medium">5/5</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">发现问题总数</span>
                              <span className="font-medium">11</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">发现问题总数</span>
                              <span className="font-medium">11</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">高优先级问题</span>
                              <span className="font-medium text-red-600">4</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">中优先级问题</span>
                              <span className="font-medium text-yellow-600">5</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">低优先级问题</span>
                              <span className="font-medium text-blue-600">2</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">问题分布</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">需求完整性</span>
                              <span className="font-medium">4 问题</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">需求明确性</span>
                              <span className="font-medium">3 问题</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">需求一致性</span>
                              <span className="font-medium">2 问题</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">需求可测试性</span>
                              <span className="font-medium">1 问题</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">需求可追溯性</span>
                              <span className="font-medium">1 问题</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">规则-问题-建议映射</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="border border-gray-200 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-2">需求完整性检查</h4>
                            <div className="space-y-2">
                              <div className="text-sm">
                                <span className="text-red-600">问题:</span>{" "}
                                用户场景描述不完整、缺少合规性要求、可靠性要求缺失、安全要求不够全面
                              </div>
                              <div className="text-sm">
                                <span className="text-blue-600">建议:</span>{" "}
                                补充边缘场景处理方案、添加法规标准要求、完善环境条件要求、扩展安全性要求维度
                              </div>
                            </div>
                          </div>

                          <div className="border border-gray-200 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-2">需求明确性检查</h4>
                            <div className="space-y-2">
                              <div className="text-sm">
                                <span className="text-red-600">问题:</span>{" "}
                                缺少具体性能指标、自动泊车激活条件不明确、用户界面交互细节不足
                              </div>
                              <div className="text-sm">
                                <span className="text-blue-600">建议:</span>{" "}
                                添加量化指标、明确激活条件和限制、补充界面布局和交互细节
                              </div>
                            </div>
                          </div>

                          <div className="border border-gray-200 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-2">需求一致性检查</h4>
                            <div className="space-y-2">
                              <div className="text-sm">
                                <span className="text-red-600">问题:</span> 性能指标与安全要求冲突、缺少系统异常处理机制
                              </div>
                              <div className="text-sm">
                                <span className="text-blue-600">建议:</span>{" "}
                                区分不同功能模块的响应时间要求、添加异常处理机制
                              </div>
                            </div>
                          </div>

                          <div className="border border-gray-200 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-2">需求可测试性检查</h4>
                            <div className="space-y-2">
                              <div className="text-sm">
                                <span className="text-red-600">问题:</span> 缺少测试验收标准
                              </div>
                              <div className="text-sm">
                                <span className="text-blue-600">建议:</span> 为每项性能指标添加具体的测试方法和验收标准
                              </div>
                            </div>
                          </div>

                          <div className="border border-gray-200 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-2">需求可追溯性检查</h4>
                            <div className="space-y-2">
                              <div className="text-sm">
                                <span className="text-red-600">问题:</span> 缺少与上层需求的关联
                              </div>
                              <div className="text-sm">
                                <span className="text-blue-600">建议:</span> 添加与上层业务目标或用户需求的关联说明
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="space-y-4">
                      <h3 className="font-medium text-gray-900">疑似有问题的评审规则</h3>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-yellow-800">需求一致性检查规则</h4>
                            <p className="text-sm text-yellow-700 mt-1">
                              该规则在检测性能指标与安全要求的冲突时，可能存在误报。建议优化规则逻辑，区分不同类型的性能要求。
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium text-gray-900">改进建议摘要</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start space-x-2">
                          <ChevronRight className="w-4 h-4 mt-0.5 text-gray-400" />
                          <span className="text-sm text-gray-600">建议为所有性能指标添加明确的测试方法和验收标准</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <ChevronRight className="w-4 h-4 mt-0.5 text-gray-400" />
                          <span className="text-sm text-gray-600">需要补充极端场景和边缘案例的处理方案</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <ChevronRight className="w-4 h-4 mt-0.5 text-gray-400" />
                          <span className="text-sm text-gray-600">建议增加法规标准要求和合规性说明</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <ChevronRight className="w-4 h-4 mt-0.5 text-gray-400" />
                          <span className="text-sm text-gray-600">完善用户界面交互设计的具体细节</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <ChevronRight className="w-4 h-4 mt-0.5 text-gray-400" />
                          <span className="text-sm text-gray-600">添加系统异常处理机制和故障安全设计</span>
                        </li>
                      </ul>
                    </div>

                    <Button className="w-full bg-orange-500 hover:bg-orange-600">下载完整评估报告</Button>
                  </div>
                </CardContent>
              </Card>
              <div className="flex justify-between mt-6">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("results")}
                  className="flex items-center space-x-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>上一步</span>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
