import { Badge } from "@/components/ui/badge"

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">Team Evolve</h1>
          <Badge variant="secondary">需求助手</Badge>
          <span className="text-sm text-gray-500">Agent-PO</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">AI能力技能等级, 当前AI需求评估</span>
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
            Q
          </div>
        </div>
      </div>
    </header>
  )
} 