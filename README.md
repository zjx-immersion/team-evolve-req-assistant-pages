# 需求智能评估智能体 (Requirements Assessment Agent)

## 项目背景

在软件开发过程中，需求文档的评估是一个关键环节，它直接影响着项目的质量、进度和成本。传统的需求评估过程往往存在以下问题：

1. 评估效率低：人工评估耗时且容易疲劳
2. 评估标准不统一：不同评估者可能有不同的标准
3. 评估结果难以追踪：评估意见分散，难以系统化管理
4. 评估反馈周期长：评估结果难以及时反馈给需求提出者

## 项目目标

本项目旨在开发一个智能需求评估助手，通过 AI 技术提升需求评估的效率和质量：

1. 提升评估效率：自动化评估流程，减少人工评估时间
2. 保证评估质量：基于最佳实践和行业标准进行评估
3. 统一评估标准：提供标准化的评估框架和标准
4. 优化协作流程：促进产品、开发、测试等角色的有效协作
5. 加速需求优化：提供及时、可操作的评估反馈

## 核心功能

### 1. 需求文档智能分析
- 自动解析需求文档结构
- 识别关键需求要素
- 评估需求完整性
- 检测潜在问题和风险

### 2. 多维度评估
- 业务价值评估
- 技术可行性评估
- 测试覆盖度评估
- 风险评估
- 成本效益分析

### 3. 智能建议生成
- 提供改进建议
- 生成优化方案
- 推荐最佳实践
- 自动生成评估报告

### 4. 协作与反馈
- 多角色评审支持
- 评估意见追踪
- 需求变更管理
- 评估结果可视化

## 技术栈

- 前端：Next.js 15.2.4 + React 19 + TypeScript
- UI 组件：Radix UI + Tailwind CSS
- AI 模型：DeepSeek Reasoner
- 开发工具：VS Code + Cursor

## 快速开始

1. 克隆项目
```bash
git clone https://github.com/zjx-immersion/req-assessment-agent.git
cd req-assessment-agent
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
创建 `.env.local` 文件并添加以下配置：
```
DEEPSEEK_API_KEY=你的DeepSeek API密钥
NODE_TLS_REJECT_UNAUTHORIZED=0
```

4. 启动开发服务器
```bash
npm run dev
```

5. 访问应用
打开浏览器访问 http://localhost:3000

## 项目状态

当前项目处于开发阶段，主要功能正在逐步实现中。欢迎提交 Issue 和 Pull Request 来帮助改进项目。

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件 

## 项目架构

本项目采用模块化设计，支持灵活的扩展和定制。详细的架构设计请参考 [架构文档](./ARCH.md)。

主要特点：
- 模块化的页面结构
- 插件式的 Agent 系统
- 统一的状态管理
- 可配置的特性开关


## 许可证

MIT License 