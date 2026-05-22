import { BookOpen, Download, Save, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { TitleInlineEdit } from "@/components/workspace/TitleInlineEdit"
import type { ArticleStatus, WorkspaceState } from "@/lib/types"

interface WorkspaceHeaderProps {
  title: string
  articleStatus: ArticleStatus | null
  workspaceState: WorkspaceState
  onTitleSave: (title: string) => void
}

const STATUS_DOT: Record<ArticleStatus, string> = {
  draft:     "bg-muted-foreground/50",
  review:    "bg-warning",
  published: "bg-success",
}

function formatTime(d: Date) {
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`
}

export function WorkspaceHeader({
  title,
  articleStatus,
  workspaceState,
  onTitleSave,
}: WorkspaceHeaderProps) {
  return (
    <header className="flex h-12 shrink-0 items-center gap-3 border-b border-border bg-surface px-4 shadow-sm">
      {/* ロゴ */}
      <div className="flex items-center gap-1.5 shrink-0">
        <div className="flex size-5 items-center justify-center rounded bg-primary text-[11px] font-bold text-primary-foreground">
          B
        </div>
        <span className="text-sm font-semibold tracking-tight text-primary">
          Blog Workspace
        </span>
      </div>

      <div className="h-5 w-px bg-border shrink-0" />

      {/* タイトル */}
      <div className="min-w-0 flex-1">
        {workspaceState === "content" || workspaceState === "loading" ? (
          <TitleInlineEdit
            key={title}
            initialTitle={title}
            onSave={onTitleSave}
          />
        ) : (
          <span className="text-sm text-muted-foreground">
            記事を選択してください
          </span>
        )}
      </div>

      {/* 自動保存ステータス */}
      {workspaceState === "content" && articleStatus && (
        <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
          <span
            className={`size-1.5 rounded-full ${STATUS_DOT[articleStatus]}`}
          />
          自動保存済み {formatTime(new Date())}
        </span>
      )}

      {/* アクションボタン */}
      <div className="flex shrink-0 items-center gap-2">
        <Button variant="outline" size="sm">
          <Upload />
          ソースを追加
        </Button>
        <Button variant="outline" size="sm">
          <Save />
          保存
        </Button>
        <Button size="sm">
          <Download />
          書き出し
        </Button>
      </div>
    </header>
  )
}
