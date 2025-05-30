import { z } from 'zod';

export const DocumentSchema = z.object({
  id: z.string(),
  title: z.string(),
  uploadDate: z.string(),
  status: z.enum(['uploaded', 'analyzing', 'reviewing', 'completed']),
  progress: z.number().min(0).max(100),
  issues: z.number().min(0),
  fixed: z.number().min(0),
});

export const AnalysisRuleSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  status: z.enum(['active', 'inactive']),
});

export const ReviewIssueSchema = z.object({
  id: z.string(),
  type: z.enum(['error', 'warning', 'suggestion']),
  title: z.string(),
  description: z.string(),
  section: z.string(),
  sectionTitle: z.string(),
  suggestion: z.string(),
  accepted: z.boolean(),
}); 