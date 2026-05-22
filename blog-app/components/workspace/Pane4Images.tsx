"use client"

import { useState } from "react"
import { ImagePlus, Plus, Trash2, Upload, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SectionLabel } from "@/components/primitives/SectionLabel"
import type { SectionImage } from "@/lib/types"

interface Pane4ImagesProps {
  sectionImages: SectionImage[]
}

export function Pane4Images({ sectionImages: initialImages }: Pane4ImagesProps) {
  const [prompt, setPrompt] = useState("")

  return (
    <aside
      role="region"
      aria-label="画像管理"
      className="flex h-full flex-col bg-panel"
    >
      <div className="flex items-center px-3 py-2.5 border-b border-border shrink-0">
        <SectionLabel>画像</SectionLabel>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* アイキャッチ */}
        <div className="px-3 pb-1 pt-2.5 text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground">
          アイキャッチ
        </div>
        <div className="mx-3 mb-3 overflow-hidden rounded-md border border-border bg-canvas">
          {/* プレビュー */}
          <div
            className="flex aspect-video w-full items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, oklch(88% 0.040 152), oklch(94% 0.022 152))",
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-brand-600 opacity-50"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
          {/* アクションボタン */}
          <div className="flex gap-1.5 p-2">
            <Button variant="outline" size="sm" className="flex-1 text-xs">
              <Upload />
              アップロード
            </Button>
            <Button variant="outline" size="sm" className="flex-1 text-xs">
              <Zap />
              AI生成
            </Button>
          </div>
        </div>

        {/* セクション口絵 */}
        <div className="px-3 pb-1 text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground">
          セクション口絵
        </div>
        <div className="flex flex-col gap-1.5 px-3 pb-2">
          {initialImages.map((img) => (
            <div
              key={img.id}
              className="flex items-center gap-2 rounded border border-border bg-surface p-1.5"
            >
              {/* サムネイル */}
              <div
                className="size-7 shrink-0 rounded-sm"
                style={{
                  width: 36,
                  height: 28,
                  background:
                    "linear-gradient(135deg, oklch(85% 0.045 152), oklch(92% 0.025 152))",
                }}
                aria-hidden="true"
              />
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="truncate text-[0.6875rem] font-medium text-foreground">
                  {img.label}
                </span>
                <span className="text-[0.625rem] text-muted-foreground">
                  {img.size}
                </span>
              </div>
              <button
                type="button"
                aria-label={`${img.label}を削除`}
                className="flex size-5 shrink-0 items-center justify-center rounded text-muted-foreground hover:bg-muted transition-colors"
              >
                <Trash2 className="size-2.5" />
              </button>
            </div>
          ))}

          <button
            type="button"
            className="flex w-full items-center justify-center gap-1.5 rounded border border-dashed border-border py-1.5 text-xs text-muted-foreground transition-colors hover:border-solid hover:bg-muted/60"
          >
            <Plus className="size-3" />
            セクションを追加
          </button>
        </div>

        {/* AI生成プロンプト */}
        <div className="mx-3 mb-3 mt-1 rounded-md border border-dashed border-border bg-canvas p-2.5">
          <div className="mb-1.5 flex items-center gap-1 text-[0.6875rem] font-semibold text-muted-foreground">
            <Zap className="size-2.5" />
            AI生成プロンプト
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="例：シンプルでモダンな教育をテーマにしたイラスト、ハンターグリーン系"
            aria-label="画像生成プロンプト"
            className="mb-1.5 h-13 w-full resize-none rounded-md border border-border bg-surface px-2 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            rows={3}
          />
          <Button variant="outline" size="sm" className="w-full text-xs">
            生成する
          </Button>
        </div>
      </div>
    </aside>
  )
}
