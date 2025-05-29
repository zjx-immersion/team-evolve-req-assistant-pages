# 项目架构设计文档

## 1. 整体架构

```
src/
├── app/                    # Next.js 应用
│   ├── (routes)/          # 路由分组
│   │   ├── requirements/  # 需求相关页面
│   │   └── review/       # 评审相关页面
│   └── layout.tsx        # 根布局
├── components/            # UI组件
│   ├── common/           # 通用组件
│   └── features/         # 功能组件
├── lib/                  # 核心库
│   ├── agents/          # Agent系统
│   ├── api/             # API层
│   └── store/           # 状态管理
└── types/               # 类型定义
```

## 2. 核心模块设计

### 2.1 UI层 - 页面模块化

```typescript
// src/app/(routes)/requirements/page.tsx
export default function RequirementsPage() {
  return (
    <PageLayout>
      <RequirementsHeader />
      <RequirementsContent />
      <RequirementsSidebar />
    </PageLayout>
  );
}

// src/components/features/requirements/RequirementsContent.tsx
export const RequirementsContent: React.FC = () => {
  const { requirements, loading } = useRequirementsStore();
  
  return (
    <div className="requirements-content">
      <RequirementsList items={requirements} />
      <RequirementsActions />
    </div>
  );
};
```

### 2.2 状态管理 - 轻量级状态管理

```typescript
// src/lib/store/requirementsStore.ts
interface RequirementsState {
  items: Requirement[];
  selectedId: string | null;
  loading: boolean;
}

export const useRequirementsStore = create<RequirementsState>((set) => ({
  items: [],
  selectedId: null,
  loading: false,
  
  setItems: (items: Requirement[]) => set({ items }),
  setSelectedId: (id: string) => set({ selectedId: id }),
  setLoading: (loading: boolean) => set({ loading }),
}));
```

### 2.3 Agent系统 - 灵活集成

```typescript
// src/lib/agents/types.ts
export interface Agent {
  id: string;
  name: string;
  type: 'local' | 'remote' | 'python';
  capabilities: string[];
  execute(task: AgentTask): Promise<AgentResult>;
}

// src/lib/agents/registry.ts
export class AgentRegistry {
  private static instance: AgentRegistry;
  private agents: Map<string, Agent> = new Map();

  static getInstance(): AgentRegistry {
    if (!AgentRegistry.instance) {
      AgentRegistry.instance = new AgentRegistry();
    }
    return AgentRegistry.instance;
  }

  registerAgent(agent: Agent): void {
    this.agents.set(agent.id, agent);
  }

  getAgent(id: string): Agent | undefined {
    return this.agents.get(id);
  }
}
```

### 2.4 API层 - 统一接口

```typescript
// src/lib/api/client.ts
export class ApiClient {
  private static instance: ApiClient;
  
  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  async request<T>(endpoint: string, options: RequestOptions): Promise<T> {
    // 实现统一的请求处理
  }
}

// src/lib/api/requirements.ts
export const requirementsApi = {
  async analyze(data: AnalyzeRequest): Promise<AnalysisResult> {
    return ApiClient.getInstance().request('/api/requirements/analyze', {
      method: 'POST',
      body: data,
    });
  },
  
  async review(data: ReviewRequest): Promise<ReviewResult> {
    return ApiClient.getInstance().request('/api/requirements/review', {
      method: 'POST',
      body: data,
    });
  },
};
```

## 3. 扩展新功能示例

### 3.1 添加新的Agent

```typescript
// src/lib/agents/requirements/RequirementsReviewAgent.ts
export class RequirementsReviewAgent implements Agent {
  id = 'requirements-review';
  name = 'Requirements Review Agent';
  type = 'local' as const;
  capabilities = ['analyze', 'review'];

  async execute(task: AgentTask): Promise<AgentResult> {
    switch (task.action) {
      case 'analyze':
        return this.analyze(task.data);
      case 'review':
        return this.review(task.data);
      default:
        throw new Error(`Unknown action: ${task.action}`);
    }
  }

  private async analyze(data: any): Promise<AgentResult> {
    // 实现分析逻辑
  }

  private async review(data: any): Promise<AgentResult> {
    // 实现评审逻辑
  }
}

// 注册Agent
const registry = AgentRegistry.getInstance();
registry.registerAgent(new RequirementsReviewAgent());
```

### 3.2 添加新的页面功能

```typescript
// src/app/(routes)/requirements/analysis/page.tsx
export default function RequirementsAnalysisPage() {
  return (
    <PageLayout>
      <AnalysisHeader />
      <AnalysisContent />
      <AnalysisSidebar />
    </PageLayout>
  );
}

// src/components/features/requirements/analysis/AnalysisContent.tsx
export const AnalysisContent: React.FC = () => {
  const { analysis, loading } = useAnalysisStore();
  
  return (
    <div className="analysis-content">
      <AnalysisResults results={analysis} />
      <AnalysisActions />
    </div>
  );
};
```

### 3.3 添加新的API端点

```typescript
// src/app/api/requirements/analysis/route.ts
export async function POST(req: Request) {
  const data = await req.json();
  const agent = AgentRegistry.getInstance().getAgent('requirements-review');
  
  if (!agent) {
    return new Response('Agent not found', { status: 404 });
  }
  
  const result = await agent.execute({
    action: 'analyze',
    data,
  });
  
  return Response.json(result);
}
```

## 4. 配置管理

```typescript
// src/config/index.ts
export const config = {
  agents: {
    requirements: {
      id: 'requirements-review',
      name: 'Requirements Review Agent',
      type: 'local',
      capabilities: ['analyze', 'review'],
    },
    // 可以轻松添加新的Agent配置
  },
  
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    timeout: 5000,
  },
  
  features: {
    enableAnalysis: true,
    enableReview: true,
    // 可以轻松添加新的功能开关
  },
};
```

## 5. 使用示例

```typescript
// 在组件中使用
export const RequirementsPanel: React.FC = () => {
  const { requirements } = useRequirementsStore();
  const [result, setResult] = useState<AgentResult | null>(null);

  const handleAnalyze = async () => {
    const agent = AgentRegistry.getInstance().getAgent('requirements-review');
    if (!agent) return;
    
    const result = await agent.execute({
      action: 'analyze',
      data: { requirements },
    });
    
    setResult(result);
  };

  return (
    <div>
      <Button onClick={handleAnalyze}>Analyze</Button>
      {result && <AnalysisResult result={result} />}
    </div>
  );
};
```

## 6. 架构优势

### 6.1 轻量级
- 最小化依赖
- 简单的状态管理
- 清晰的代码组织

### 6.2 易于扩展
- 模块化的页面结构
- 插件式的Agent系统
- 统一的API接口

### 6.3 低耦合
- 各模块独立
- 清晰的接口定义
- 可替换的组件

### 6.4 易于维护
- 统一的代码风格
- 类型安全
- 清晰的错误处理

### 6.5 灵活部署
- 支持多种Agent实现
- 可配置的特性
- 环境适配

## 7. 扩展新功能流程

当需要添加新功能时，只需要：

1. 添加新的页面组件
2. 注册新的Agent（如果需要）
3. 添加新的API端点
4. 更新配置

所有的变化都是增量的，不会影响现有代码。 

## 8. 前端模块化架构

将前端状态管理移到 `app` 目录下，`lib` 目录用于后端 API 服务。

```
app/
├── components/              # 组件目录
│   ├── layout/             # 布局相关组件
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── MainLayout.tsx
│   │
│   ├── features/           # 功能模块组件
│   │   ├── upload/        # 上传相关组件
│   │   │   ├── UploadPanel.tsx
│   │   │   ├── DocumentList.tsx
│   │   │   └── UploadProgress.tsx
│   │   │
│   │   ├── analysis/      # 分析相关组件
│   │   │   ├── AnalysisPanel.tsx
│   │   │   ├── AnalysisSteps.tsx
│   │   │   ├── AssessmentRules.tsx
│   │   │   └── RealTimeResults.tsx
│   │   │
│   │   ├── review/        # 评审相关组件
│   │   │   ├── ReviewPanel.tsx
│   │   │   ├── DocumentOutline.tsx
│   │   │   ├── DocumentContent.tsx
│   │   │   └── ReviewIssues.tsx
│   │   │
│   │   ├── results/       # 结果相关组件
│   │   │   ├── ResultsPanel.tsx
│   │   │   ├── RuleResults.tsx
│   │   │   ├── IssuesList.tsx
│   │   │   └── ComparisonView.tsx
│   │   │
│   │   └── report/        # 报告相关组件
│   │       ├── ReportPanel.tsx
│   │       ├── Statistics.tsx
│   │       ├── RuleMapping.tsx
│   │       └── Suggestions.tsx
│   │
│   └── common/            # 通用组件
│       ├── DocumentSection.tsx
│       ├── IssueCard.tsx
│       └── ProgressBar.tsx
│
├── store/                 # 前端状态管理
│   ├── documentStore.ts   # 文档相关状态
│   ├── analysisStore.ts   # 分析相关状态
│   ├── reviewStore.ts     # 评审相关状态
│   └── reportStore.ts     # 报告相关状态
│
├── types/                # 类型定义
│   ├── document.ts
│   ├── analysis.ts
│   ├── review.ts
│   └── report.ts
│
└── page.tsx             # 主页面

lib/                    # 后端服务API
├── api/                # API 接口
│   ├── document.ts     # 文档相关API
│   ├── analysis.ts     # 分析相关API
│   ├── review.ts       # 评审相关API
│   └── report.ts       # 报告相关API
│
└── mock/               # 模拟数据
    ├── documents.ts    # 文档模拟数据
    ├── analysis.ts     # 分析模拟数据
    ├── review.ts       # 评审模拟数据
    └── report.ts       # 报告模拟数据
```

让我们看一些具体的实现示例：

1. **API 服务层**:

```typescript
// lib/api/document.ts
import { Document, UploadResponse } from '@/app/types/document'
import { mockDocuments } from '../mock/documents'

export const documentApi = {
  // 上传文档
  async uploadDocument(file: File): Promise<UploadResponse> {
    // 模拟上传延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    return {
      id: `doc-${Date.now()}`,
      title: file.name,
      uploadDate: new Date().toISOString(),
      status: 'uploaded',
      progress: 0,
      issues: 0,
      fixed: 0
    }
  },

  // 获取文档列表
  async getDocuments(): Promise<Document[]> {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockDocuments
  },

  // 获取文档详情
  async getDocumentById(id: string): Promise<Document | null> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return mockDocuments.find(doc => doc.id === id) || null
  }
}
```

2. **模拟数据**:

```typescript
// lib/mock/documents.ts
import { Document } from '@/app/types/document'

export const mockDocuments: Document[] = [
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
  }
  // ... 更多模拟数据
]
```

3. **前端状态管理**:

```typescript
// app/store/documentStore.ts
import { create } from 'zustand'
import { Document } from '@/app/types/document'
import { documentApi } from '@/lib/api/document'

interface DocumentState {
  documents: Document[]
  currentDocument: Document | null
  loading: boolean
  error: string | null
  
  // Actions
  fetchDocuments: () => Promise<void>
  uploadDocument: (file: File) => Promise<void>
  selectDocument: (id: string) => Promise<void>
}

export const useDocumentStore = create<DocumentState>((set, get) => ({
  documents: [],
  currentDocument: null,
  loading: false,
  error: null,

  fetchDocuments: async () => {
    set({ loading: true, error: null })
    try {
      const documents = await documentApi.getDocuments()
      set({ documents, loading: false })
    } catch (error) {
      set({ error: 'Failed to fetch documents', loading: false })
    }
  },

  uploadDocument: async (file: File) => {
    set({ loading: true, error: null })
    try {
      const response = await documentApi.uploadDocument(file)
      set(state => ({
        documents: [...state.documents, response],
        loading: false
      }))
    } catch (error) {
      set({ error: 'Failed to upload document', loading: false })
    }
  },

  selectDocument: async (id: string) => {
    set({ loading: true, error: null })
    try {
      const document = await documentApi.getDocumentById(id)
      set({ currentDocument: document, loading: false })
    } catch (error) {
      set({ error: 'Failed to fetch document', loading: false })
    }
  }
}))
```

4. **组件使用示例**:

```typescript
// app/components/features/upload/UploadPanel.tsx
"use client"

import { useDocumentStore } from '@/app/store/documentStore'
import { DocumentList } from './DocumentList'
import { UploadProgress } from './UploadProgress'

export const UploadPanel: React.FC = () => {
  const { 
    documents, 
    loading, 
    error,
    fetchDocuments,
    uploadDocument 
  } = useDocumentStore()

  // 组件加载时获取文档列表
  useEffect(() => {
    fetchDocuments()
  }, [])

  const handleFileUpload = async (file: File) => {
    await uploadDocument(file)
  }

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFileUpload(file)
          }}
        />
      </div>

      {loading && <UploadProgress />}
      {error && <div className="text-red-500">{error}</div>}
      <DocumentList documents={documents} />
    </div>
  )
}
```

5. **类型定义**:

```typescript
// app/types/document.ts
export interface Document {
  id: string
  title: string
  uploadDate: string
  status: 'uploaded' | 'analyzing' | 'reviewing' | 'completed'
  progress: number
  issues: number
  fixed: number
}

export interface UploadResponse {
  id: string
  title: string
  uploadDate: string
  status: 'uploaded'
  progress: number
  issues: number
  fixed: number
}
```

这个重构后的架构主要特点：

1. **清晰的职责分离**
   - `lib` 目录专注于后端 API 和模拟数据
   - `app` 目录包含所有前端相关代码
   - 状态管理集中在 `app/store` 目录

2. **可扩展的 API 层**
   - 易于替换为真实 API
   - 统一的错误处理
   - 类型安全的 API 调用

3. **模块化的状态管理**
   - 按功能模块划分状态
   - 清晰的状态更新逻辑
   - 类型安全的状态操作

4. **可测试性**
   - 模拟数据易于维护
   - 组件逻辑与数据获取分离
   - 状态管理可独立测试

要开始实施这个重构，建议按以下步骤进行：

1. 设置基础目录结构
2. 实现 API 层和模拟数据
3. 创建类型定义
4. 实现状态管理
5. 重构组件
6. 添加错误处理和加载状态


