import type { ArticleStatus } from "@/lib/types"

export const STATUS_LABEL = {
  draft:     "下書き",
  review:    "レビュー中",
  published: "公開済み",
} as const satisfies Record<ArticleStatus, string>
