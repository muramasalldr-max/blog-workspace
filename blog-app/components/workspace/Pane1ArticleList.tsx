import { Plus } from "lucide-react"

import { SectionLabel } from "@/components/primitives/SectionLabel"
import { cn } from "@/lib/utils"
import type { Article, ArticleStatus } from "@/lib/types"

interface Pane1ArticleListProps {
  articles: Article[]
  selectedId: string | null
  onSelect: (id: string) => void
  onNew: () => void
}

const IN_PROGRESS_STATUSES: ArticleStatus[] = ["draft", "review"]

export function Pane1ArticleList({
  articles,
  selectedId,
  onSelect,
  onNew,
}: Pane1ArticleListProps) {
  const inProgress = articles.filter((a) =>
    IN_PROGRESS_STATUSES.includes(a.status),
  )
  const published = articles.filter((a) => a.status === "published")

  return (
    <aside
      role="region"
      aria-label="記事一覧"
      className="flex h-full flex-col bg-panel"
    >
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-border">
        <SectionLabel>記事</SectionLabel>
        <button
          type="button"
          onClick={onNew}
          aria-label="新規記事を作成"
          className="flex size-7 items-center justify-center rounded text-muted-foreground hover:bg-muted transition-colors"
        >
          <Plus className="size-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pt-1">
        {/* 下書き・レビュー中グループ */}
        {inProgress.length > 0 && (
          <>
            <SectionGroup label="下書き" count={inProgress.length} chipVariant="info" />
            {inProgress.map((article) => (
              <ArticleRow
                key={article.id}
                article={article}
                isSelected={article.id === selectedId}
                onClick={() => onSelect(article.id)}
              />
            ))}
          </>
        )}

        {/* 公開済みグループ */}
        {published.length > 0 && (
          <>
            <SectionGroup label="公開済み" count={published.length} chipVariant="success" />
            {published.map((article) => (
              <ArticleRow
                key={article.id}
                article={article}
                isSelected={article.id === selectedId}
                onClick={() => onSelect(article.id)}
              />
            ))}
          </>
        )}

        {articles.length === 0 && (
          <p className="px-3 py-8 text-center text-sm text-muted-foreground">
            記事がありません
          </p>
        )}
      </div>

      {/* フッター: 新規記事ボタン */}
      <div className="border-t border-border p-1.5">
        <button
          type="button"
          onClick={onNew}
          className="flex w-full items-center justify-center gap-1.5 rounded border border-dashed border-border px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:border-solid hover:bg-muted/60"
        >
          <Plus className="size-3" />
          新規記事
        </button>
      </div>
    </aside>
  )
}

function SectionGroup({
  label,
  count,
  chipVariant,
}: {
  label: string
  count: number
  chipVariant: "info" | "success"
}) {
  const chipClass =
    chipVariant === "info"
      ? "bg-info/10 text-info"
      : "bg-success/10 text-success"

  return (
    <div className="flex items-center gap-2 px-3 pb-1 pt-2">
      <span className="text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span
        className={`inline-flex items-center justify-center rounded px-1.5 py-0.5 text-[0.625rem] font-medium tabular-nums ${chipClass}`}
      >
        {count}
      </span>
    </div>
  )
}

function ArticleRow({
  article,
  isSelected,
  onClick,
}: {
  article: Article
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={isSelected ? "true" : undefined}
      className={cn(
        "flex w-full flex-col gap-0.5 rounded px-3 py-2 text-left transition-colors mx-1 my-0.5",
        "w-[calc(100%-0.5rem)]",
        isSelected ? "bg-selection-bg" : "hover:bg-border-subtle",
      )}
    >
      <span
        className={cn(
          "truncate text-[0.8125rem] font-medium leading-snug",
          isSelected ? "text-selection-fg" : "text-foreground",
        )}
      >
        {article.title}
      </span>
      <span className="text-[0.6875rem] text-muted-foreground">
        {article.shortDate}
      </span>
    </button>
  )
}
