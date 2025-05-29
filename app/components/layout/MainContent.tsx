import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UploadTab } from "../features/upload/UploadTab"
import { AnalysisTab } from "../features/analysis/AnalysisTab"
import { ReviewTab } from "../features/review/ReviewTab"
import { ResultsTab } from "../features/results/ResultsTab"
import { ReportTab } from "../features/report/ReportTab"

interface MainContentProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  hasStartedAnalysis: boolean
  hasCompletedAnalysis: boolean
  hasStartedReview: boolean
  hasCompletedReview: boolean
}

export function MainContent({
  activeTab,
  setActiveTab,
  hasStartedAnalysis,
  hasCompletedAnalysis,
  hasStartedReview,
  hasCompletedReview,
}: MainContentProps) {
  function handleStartAnalysis(docId: string) {
    setActiveTab("analysis")
  }

  function handleDocumentSelect(docId: string) {
    // Example: just log or handle document selection
    // console.log('Selected document:', docId)
  }

  function handleResetWorkflow() {
    setActiveTab("upload")
  }

  function handleCompleteAnalysis() {
    setActiveTab("review")
  }

  function handleCompleteReview() {
    setActiveTab("results")
  }

  function handleBackToAnalysis() {
    setActiveTab("analysis")
  }

  function handleNextStep() {
    setActiveTab("report");
  }

  function handleBackToResults() {
    setActiveTab("results");
  }

  function handleBackToReview() {
    setActiveTab("review");
  }

  return (
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

        <TabsContent value="upload">
          <UploadTab onStartAnalysis={handleStartAnalysis} onDocumentSelect={handleDocumentSelect} />
        </TabsContent>

        <TabsContent value="analysis">
          <AnalysisTab onResetWorkflow={handleResetWorkflow} onCompleteAnalysis={handleCompleteAnalysis} />
        </TabsContent>

        <TabsContent value="review">
          <ReviewTab onCompleteReview={handleCompleteReview} onBackToAnalysis={handleBackToAnalysis} />
        </TabsContent>

        <TabsContent value="results">
          <ResultsTab onNextStep={handleNextStep} onBackToReview={handleBackToReview} />
        </TabsContent>

        <TabsContent value="report">
          <ReportTab onBackToResults={handleBackToResults} />
        </TabsContent>
      </Tabs>
    </main>
  )
} 