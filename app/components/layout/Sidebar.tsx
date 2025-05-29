import { Button } from "@/components/ui/button"
import {
  FileText,
  CheckCircle,
  Settings,
  Database,
  Brain,
  ChevronRight,
  ChevronLeft,
  MessageSquare,
} from "lucide-react"

interface SidebarProps {
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
}

export function Sidebar({ sidebarCollapsed, setSidebarCollapsed }: SidebarProps) {
  return (
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
                <a href="#" className="flex items-center px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100">
                  <FileText className="w-4 h-4 mr-3" />
                  <span>需求辅助分析</span>
                </a>
                <a href="#" className="flex items-center px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100">
                  <Settings className="w-4 h-4 mr-3" />
                  <span>需求优化重构</span>
                </a>
                <a href="#" className="flex items-center px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100">
                  <Brain className="w-4 h-4 mr-3" />
                  <span>场景边界分析</span>
                </a>
                <a href="#" className="flex items-center px-3 py-2 text-sm rounded-md bg-orange-100 text-orange-700">
                  <CheckCircle className="w-4 h-4 mr-3" />
                  <span>PRD智能评审</span>
                </a>
                <a href="#" className="flex items-center px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100">
                  <Database className="w-4 h-4 mr-3" />
                  <span>测试用例生成</span>
                </a>
                <a href="#" className="flex items-center px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100">
                  <MessageSquare className="w-4 h-4 mr-3" />
                  <span>测试执行结果分析</span>
                </a>
              </div>
            </div>

            <div>
              <div className="font-medium text-gray-900 mb-4">知识熔炉</div>
              <div className="space-y-1">
                <a href="#" className="flex items-center px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100">
                  <FileText className="w-4 h-4 mr-3" />
                  <span>需求规范</span>
                </a>
                <a href="#" className="flex items-center px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100">
                  <FileText className="w-4 h-4 mr-3" />
                  <span>需求实例</span>
                </a>
                <a href="#" className="flex items-center px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100">
                  <CheckCircle className="w-4 h-4 mr-3" />
                  <span>需求评审规则</span>
                </a>
                <a href="#" className="flex items-center px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100">
                  <FileText className="w-4 h-4 mr-3" />
                  <span>需求模版</span>
                </a>
                <a href="#" className="flex items-center px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100">
                  <Brain className="w-4 h-4 mr-3" />
                  <span>领域概念与知识</span>
                </a>
                <a href="#" className="flex items-center px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100">
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
  )
} 