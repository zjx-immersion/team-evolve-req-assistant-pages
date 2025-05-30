import { ApiClient } from './client';
import { ApiResponse } from '@/app/types/api';

export interface AssessmentRule {
  id: string;
  title: string;
  description: string;
  category: string;
  severity: "high" | "medium" | "low";
  enabled: boolean;
}

export interface AnalysisStep {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed" | "skipped";
  progress: number;
}

export interface ReviewIssue {
  id: string;
  type: "error" | "warning" | "suggestion";
  title: string;
  description: string;
  section: string;
  sectionTitle: string;
  suggestion: string;
}

export class AnalysisService {
  private static instance: AnalysisService;
  private apiClient: ApiClient;

  private constructor() {
    this.apiClient = ApiClient.getInstance();
  }

  static getInstance(): AnalysisService {
    if (!AnalysisService.instance) {
      AnalysisService.instance = new AnalysisService();
    }
    return AnalysisService.instance;
  }

  async getAssessmentRules(): Promise<ApiResponse<AssessmentRule[]>> {
    // 临时返回模拟数据，后续会替换为实际的 API 调用
    return Promise.resolve({
      data: [
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
      ],
      status: 'success',
      message: 'Assessment rules retrieved successfully'
    });
  }

  async getAnalysisSteps(): Promise<ApiResponse<AnalysisStep[]>> {
    // 临时返回模拟数据，后续会替换为实际的 API 调用
    return Promise.resolve({
      data: [
        { id: "step1", title: "文档解析", description: "解析文档结构和内容", status: "completed", progress: 100 },
        { id: "step2", title: "需求提取", description: "提取文档中的需求项", status: "completed", progress: 100 },
        { id: "step3", title: "规则加载", description: "加载评估规则库", status: "completed", progress: 100 },
        { id: "step4", title: "完整性评估", description: "评估需求的完整性", status: "in-progress", progress: 65 },
        { id: "step5", title: "一致性评估", description: "评估需求的一致性", status: "pending", progress: 0 },
        { id: "step6", title: "可测试性评估", description: "评估需求的可测试性", status: "pending", progress: 0 },
        { id: "step7", title: "可追溯性评估", description: "评估需求的可追溯性", status: "pending", progress: 0 },
        { id: "step8", title: "明确性评估", description: "评估需求的明确性", status: "pending", progress: 0 },
        { id: "step9", title: "生成评估报告", description: "生成最终评估报告", status: "pending", progress: 0 },
      ],
      status: 'success',
      message: 'Analysis steps retrieved successfully'
    });
  }

  async getReviewIssues(): Promise<ApiResponse<ReviewIssue[]>> {
    // 临时返回模拟数据，后续会替换为实际的 API 调用
    return Promise.resolve({
      data: [
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
      ],
      status: 'success',
      message: 'Review issues retrieved successfully'
    });
  }

  async updateAnalysisProgress(
    documentId: string,
    progress: number,
    stepIndex: number
  ): Promise<ApiResponse<{ currentStep: string; currentSection: string; reviewProgress: number }>> {
    // 临时返回模拟数据，后续会替换为实际的 API 调用
    return Promise.resolve({
      data: {
        currentStep: `step${stepIndex + 1}`,
        currentSection: `section-${Math.floor(progress / 15) % 6 + 1}`,
        reviewProgress: Math.floor((progress / 100) * 100)
      },
      status: 'success',
      message: 'Analysis progress updated successfully'
    });
  }
} 