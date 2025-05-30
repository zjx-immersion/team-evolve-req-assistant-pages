"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  AlertTriangle,
  MessageSquare,
  CheckCircle,
  XCircle,
  Undo2,
  List,
  ChevronUp,
  ChevronDown,
  Copy,
  ChevronRight,
} from "lucide-react"
import { ReviewService, DocumentSection, ReviewIssue } from "@/lib/api/review"

interface ReviewTabProps {
  onCompleteReview: () => void
  onBackToAnalysis: () => void
}

export function ReviewTab({ onCompleteReview, onBackToAnalysis }: ReviewTabProps) {
  const [outlineExpanded, setOutlineExpanded] = useState(false)
  const [selectedSection, setSelectedSection] = useState<string>("")
  const [selectedIssue, setSelectedIssue] = useState<string>("")
  const [reviewIssues, setReviewIssues] = useState<ReviewIssue[]>([])
  const [documentSections, setDocumentSections] = useState<DocumentSection[]>([])
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  // Initialize data
  useEffect(() => {
    const reviewService = ReviewService.getInstance();
    
    // Get document sections
    reviewService.getDocumentSections().then(response => {
      if (response.status === 'success' && response.data) {
        setDocumentSections(response.data);
      }
    });

    // Get review issues
    reviewService.getReviewIssues().then(response => {
      if (response.status === 'success' && response.data) {
        setReviewIssues(response.data);
      }
    });
  }, []);

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
    const issue = reviewIssues.find((i) => i && i.id === issueId)
    if (!issue || !issue.modifiedContent || !issue.section) return

    const reviewService = ReviewService.getInstance();
    
    // Update section content
    setDocumentSections((prevSections) =>
      updateSectionContent(prevSections, issue.section, issue.modifiedContent!, true),
    )

    // Update issue status
    setReviewIssues((prevIssues) => prevIssues.map((i) => (i && i.id === issueId ? { ...i, accepted: true } : i)))

    // Call API to update section content
    reviewService.updateSectionContent("doc1", issue.section, issue.modifiedContent, true).then(response => {
      if (response.status === 'success') {
        console.log('Section content updated successfully');
      }
    });

    // Call API to update issue status
    reviewService.updateIssueStatus("doc1", issueId, true).then(response => {
      if (response.status === 'success') {
        console.log('Issue status updated successfully');
      }
    });
  }

  // Handle undoing a modification
  const handleUndoModification = (issueId: string) => {
    const issue = reviewIssues.find((i) => i && i.id === issueId)
    if (!issue || !issue.originalContent || !issue.section) return

    const reviewService = ReviewService.getInstance();
    
    // Update section content
    setDocumentSections((prevSections) =>
      updateSectionContent(prevSections, issue.section, issue.originalContent!, false),
    )

    // Update issue status
    setReviewIssues((prevIssues) => prevIssues.map((i) => (i && i.id === issueId ? { ...i, accepted: undefined } : i)))

    // Call API to update section content
    reviewService.updateSectionContent("doc1", issue.section, issue.originalContent, false).then(response => {
      if (response.status === 'success') {
        console.log('Section content updated successfully');
      }
    });

    // Call API to update issue status
    reviewService.updateIssueStatus("doc1", issueId, false).then(response => {
      if (response.status === 'success') {
        console.log('Issue status updated successfully');
      }
    });
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
    const issue = reviewIssues.find((i) => i && i.id === issueId)
    if (issue && issue.section) {
      setSelectedIssue(issueId)
      setSelectedSection(issue.section)
      scrollToSection(issue.section)
    }
  }

  // Toggle sidebar and outline
  const handleToggleOutline = () => {
    setOutlineExpanded(!outlineExpanded)
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
                    <span className="text-gray-400">图片预览</span>
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
        ref={(el) => {
          sectionRefs.current[section.id] = el
        }}
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
                ref={(el) => {
                  sectionRefs.current[child.id] = el
                }}
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

  return (
    <div className="space-y-6">
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
          <h2 className="text-xl font-semibold text-gray-900">智能驾驶系统PRD</h2>
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
                                  variant={Boolean(issue.accepted) ? "default" : "ghost"}
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
                          {typeof issue.accepted === "undefined" && (
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
          onClick={onBackToAnalysis}
          className="flex items-center space-x-2"
        >
          <span>上一步</span>
        </Button>
        <Button
          onClick={onCompleteReview}
          className="bg-orange-500 hover:bg-orange-600"
        >
          下一步
        </Button>
      </div>
    </div>
  )
} 