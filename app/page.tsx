"use client"

import { useState } from "react"
import { Header } from "./components/layout/Header"
import { Sidebar } from "./components/layout/Sidebar"
import { MainContent } from "./components/layout/MainContent"

export default function TeamEvolveRequirementsAssistant() {
  const [activeTab, setActiveTab] = useState("upload")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [hasStartedAnalysis, setHasStartedAnalysis] = useState(false)
  const [hasCompletedAnalysis, setHasCompletedAnalysis] = useState(false)
  const [hasStartedReview, setHasStartedReview] = useState(false)
  const [hasCompletedReview, setHasCompletedReview] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed} />
        <MainContent
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          hasStartedAnalysis={hasStartedAnalysis}
          hasCompletedAnalysis={hasCompletedAnalysis}
          hasStartedReview={hasStartedReview}
          hasCompletedReview={hasCompletedReview}
        />
      </div>
    </div>
  )
}
