import { z } from "zod"

export const PRDSchema = z.object({
  oneliner: z.string().min(10, "至少10个字符 / At least 10 characters"),
  users: z.string().min(20, "至少20个字符 / At least 20 characters"),
  value: z.string().min(10, "至少10个字符 / At least 10 characters"),
  keypath: z.string().min(20, "至少20个字符 / At least 20 characters"),
  features: z.string().min(20, "至少20个字符 / At least 20 characters"),
  nongoals: z.string().min(10, "至少10个字符 / At least 10 characters"),
  success: z.string().min(20, "至少20个字符 / At least 20 characters"),
  dependencies: z.string().min(10, "至少10个字符 / At least 10 characters"),
  risks: z.string().min(20, "至少20个字符 / At least 20 characters"),
})

export type PRDData = z.infer<typeof PRDSchema>

export interface SavedPRD {
  id: string
  data: PRDData
  createdAt: string
  updatedAt: string
}
