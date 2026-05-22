import { File, FileText, Link, Plus, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { SectionLabel } from "@/components/primitives/SectionLabel"
import { cn } from "@/lib/utils"
import type { Heading, Source, WorkspaceState } from "@/lib/types"

interface Pane2HeadingsProps {
  state: WorkspaceState
  headings: Heading[]
  activeHeadingId: string | null
  onHeadingClick: (id: string) => void
  onRetry: () => void
  sources: Source[]
}

const HEADING_PADDING: Record<Heading["level"], string> = {
  h1: "pl-3",
  h2: "pl-5",
  h3: "pl-8",
}

const SOURCE_ICON: Record<Source["type"], React.ElementType> = {
  txt: FileText,
  url: Link,
  pdf: File,
}

export function Pane2Headings({
  state,
  headings,
  activeHeadingId,
  onHeadingClick,
  onRetry,
  sources,
}: Pane2HeadingsProps) {
  return (
    <aside
      role="region"
      aria-label="見出し一覧"
      className="flex h-full flex-col bg-panel"
    >
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-border shrink-0">
        <SectionLabel>見出し</SectionLabel>
        <button
          type="button"
          aria-label="見出しを追加"
          className="flex size-7 items-center justify-center rounded text-muted-foreground hover:bg-muted transition-colors"
        >
          <Plus className="size-3.5" />
        </button>
      </div>

      {/* 見出しリスト */}
      <div className="flex-1 overflow-y-auto pt-1.5">
        {state === "idle" && (
          <div className="flex flex-col items-center justify-center gap-2 px-3 py-10 text-center">
            <p className="text-sm text-muted-foreground">
              記事を選択してください
            </p>
          </div>
        )}

        {state === "loading" && (
          <div className="flex flex-col gap-2 px-3 py-3">
            <Skeleton className="h-3.5 w-3/4" />
            <Skeleton className="h-3.5 w-1/2 ml-3" />
            <Skeleton className="h-3.5 w-2/3 ml-3" />
            <Skeleton className="h-3.5 w-5/6 ml-3" />
            <Skeleton className="h-3.5 w-1/2 mt-1" />
            <Skeleton className="h-3.5 w-3/4 ml-3" />
          </div>
        )}

        {state === "error" && (
          <div className="flex flex-col items-center gap-3 px-3 py-8 text-center">
            <p className="text-sm text-muted-foreground">
              見出しの取得に失敗しました
            </p>
            <Button variant="outline" size="sm" onClick={onRetry}>
              <RefreshCw />
              再試行
            </Button>
          </div>
        )}

        {state === "content" && (
          <ul className="flex flex-col">
            {headings.map((heading) => {
              const isActive = heading.id === activeHeadingId
              return (
                <li key={heading.id}>
                  <button
                    type="button"
                    onClick={() => onHeadingClick(heading.id)}
                    className={cn(
                      "flex w-full items-center gap-1.5 rounded py-1.5 pr-3 text-left text-[0.8125rem] transition-colors mx-1 my-[1px]",
                      "w-[calc(100%-0.5rem)]",
                      HEADING_PADDING[heading.level],
                      isActive
                        ? "bg-selection-bg text-selection-fg"
                        : "hover:bg-border-subtle",
                    )}
                  >
                    <span
                      className={cn(
                        "shrink-0 font-mono text-[0.625rem] font-bold min-w-[1.25rem]",
                        isActive
                          ? "text-selection-fg"
                          : "text-muted-foreground",
                      )}
                    >
                      {heading.level.toUpperCase()}
                    </span>
                    <span
                      className={cn(
                        "truncate leading-snug",
                        isActive ? "font-medium" : "",
                      )}
                    >
                      {heading.text}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {/* ソース素材フッター */}
      {sources.length > 0 && (
        <div className="shrink-0 border-t border-border-subtle px-3 py-2.5">
          <div className="mb-1.5 text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground">
            ソース素材
          </div>
          <ul className="flex flex-col gap-1">
            {sources.map((source) => {
              const Icon = SOURCE_ICON[source.type]
              return (
                <li
                  key={source.id}
                  className="flex items-center gap-1.5 rounded border border-border bg-surface px-1.5 py-1"
                >
                  <Icon className="size-3.5 shrink-0 text-muted-foreground" />
                  <span className="truncate text-[0.6875rem] text-muted-foreground">
                    {source.name}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </aside>
  )
}
