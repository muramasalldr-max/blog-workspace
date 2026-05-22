import { RefreshCw, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import type { WorkspaceState } from "@/lib/types"

interface Pane3EditorProps {
  state: WorkspaceState
  content: string
  onRetry: () => void
}

export function Pane3Editor({ state, content, onRetry }: Pane3EditorProps) {
  return (
    <main
      role="main"
      aria-label="記事エディター"
      className="flex h-full flex-col bg-surface overflow-hidden"
    >
      {/* 本文エリア */}
      <div className="flex-1 overflow-y-auto">
        {state === "idle" && (
          <div className="flex h-full flex-col items-center justify-center gap-4 px-6 py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-lg bg-muted">
              <Upload className="size-5 text-muted-foreground" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-foreground">
                ソースをアップロードして下書きを生成
              </p>
              <p className="text-sm text-muted-foreground">
                テキスト・PDF・URL・音声ファイルに対応しています
              </p>
            </div>
            <Button variant="outline" size="sm">
              <Upload />
              ソースを追加
            </Button>
          </div>
        )}

        {state === "loading" && (
          <div className="mx-auto max-w-2xl px-6 py-8 flex flex-col gap-3">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full mt-2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-6 w-1/2 mt-6" />
            <Skeleton className="h-4 w-full mt-1" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-6 w-2/5 mt-6" />
            <Skeleton className="h-4 w-full mt-1" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        )}

        {state === "error" && (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-6 py-16 text-center">
            <p className="text-sm text-muted-foreground">
              下書きの生成に失敗しました
            </p>
            <Button variant="outline" size="sm" onClick={onRetry}>
              <RefreshCw />
              再試行
            </Button>
          </div>
        )}

        {state === "content" && (
          <div className="flex min-h-full flex-col mx-auto max-w-2xl px-6 py-8">
            <textarea
              defaultValue={content}
              className="w-full flex-1 min-h-0 resize-none bg-transparent font-editor text-base leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none"
              placeholder="本文を入力..."
              aria-label="記事本文"
            />
          </div>
        )}
      </div>
    </main>
  )
}
