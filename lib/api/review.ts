import { ApiClient } from './client';
import { ApiResponse } from '@/app/types/api';

export interface DocumentSection {
  id: string;
  title: string;
  content: string;
  modifiedContent?: string;
  isModified?: boolean;
  children?: DocumentSection[];
  images?: DocumentImage[];
}

export interface DocumentImage {
  id: string;
  title: string;
  url: string;
  description: string;
  type: "architecture" | "flow" | "interaction" | "other";
}

export interface ReviewIssue {
  id: string;
  type: "error" | "warning" | "suggestion";
  title: string;
  description: string;
  section: string;
  sectionTitle: string;
  suggestion: string;
  accepted?: boolean;
  originalContent?: string;
  modifiedContent?: string;
  rule?: string;
  ruleId?: string;
}

export class ReviewService {
  private static instance: ReviewService;
  private apiClient: ApiClient;

  private constructor() {
    this.apiClient = ApiClient.getInstance();
  }

  static getInstance(): ReviewService {
    if (!ReviewService.instance) {
      ReviewService.instance = new ReviewService();
    }
    return ReviewService.instance;
  }

  async getDocumentSections(): Promise<ApiResponse<DocumentSection[]>> {
    // 临时返回模拟数据，后续会替换为实际的 API 调用
    return Promise.resolve({
      data: [
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
      ],
      status: 'success',
      message: 'Document sections retrieved successfully'
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
      ],
      status: 'success',
      message: 'Review issues retrieved successfully'
    });
  }

  async updateSectionContent(
    documentId: string,
    sectionId: string,
    content: string,
    isModified: boolean
  ): Promise<ApiResponse<DocumentSection[]>> {
    // 临时返回模拟数据，后续会替换为实际的 API 调用
    return Promise.resolve({
      data: [],
      status: 'success',
      message: 'Section content updated successfully'
    });
  }

  async updateIssueStatus(
    documentId: string,
    issueId: string,
    accepted: boolean
  ): Promise<ApiResponse<ReviewIssue[]>> {
    // 临时返回模拟数据，后续会替换为实际的 API 调用
    return Promise.resolve({
      data: [],
      status: 'success',
      message: 'Issue status updated successfully'
    });
  }
} 