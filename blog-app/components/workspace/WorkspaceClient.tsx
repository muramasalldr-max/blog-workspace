"use client"

import { useState } from "react"
import {
  Group as PanelGroup,
  Panel,
  Separator as PanelResizeHandle,
} from "react-resizable-panels"

import { WorkspaceHeader } from "@/components/workspace/WorkspaceHeader"
import { Pane1ArticleList } from "@/components/workspace/Pane1ArticleList"
import { Pane2Headings } from "@/components/workspace/Pane2Headings"
import { Pane3Editor } from "@/components/workspace/Pane3Editor"
import { Pane4Images } from "@/components/workspace/Pane4Images"
import {
  MOCK_ARTICLES,
  MOCK_CONTENT,
  MOCK_HEADINGS,
  MOCK_SECTION_IMAGES,
  MOCK_SOURCES,
} from "@/lib/mock-data"
import type { WorkspaceState } from "@/lib/types"

export function WorkspaceClient() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [workspaceState, setWorkspaceState] = useState<WorkspaceState>("idle")
  const [title, setTitle] = useState("Next.js 16 の新機能まとめ")
  const [activeHeadingId, setActiveHeadingId] = useState<string | null>(null)

  const selectedArticle = MOCK_ARTICLES.find((a) => a.id === selectedId) ?? null

  function handleSelectArticle(id: string) {
    setSelectedId(id)
    const article = MOCK_ARTICLES.find((a) => a.id === id)
    if (article) setTitle(article.title)
    if (workspaceState === "idle") setWorkspaceState("content")
  }

  function handleNewArticle() {
    setSelectedId(null)
    setWorkspaceState("idle")
  }

  function handleHeadingClick(id: string) {
    setActiveHeadingId(id)
    console.log("scroll to heading:", id)
  }

  function handleRetry() {
    setWorkspaceState("loading")
    setTimeout(() => setWorkspaceState("content"), 1500)
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      {/* グローバルヘッダー */}
      <WorkspaceHeader
        title={title}
        articleStatus={selectedArticle?.status ?? null}
        workspaceState={workspaceState}
        onTitleSave={setTitle}
      />

      {/* 4ペインエリア */}
      <div className="flex-1 overflow-hidden">
        <PanelGroup orientation="horizontal" className="h-full w-full">
          {/* Pane 1: 記事一覧 */}
          <Panel defaultSize={16} minSize={12}>
            <Pane1ArticleList
              articles={MOCK_ARTICLES}
              selectedId={selectedId}
              onSelect={handleSelectArticle}
              onNew={handleNewArticle}
            />
          </Panel>

          <PanelResizeHandle className="w-px bg-border hover:w-1 hover:bg-selection-bg transition-all" />

          {/* Pane 2: 見出し */}
          <Panel defaultSize={15} minSize={10}>
            <Pane2Headings
              state={workspaceState}
              headings={MOCK_HEADINGS}
              activeHeadingId={activeHeadingId}
              onHeadingClick={handleHeadingClick}
              onRetry={handleRetry}
              sources={workspaceState === "content" ? MOCK_SOURCES : []}
            />
          </Panel>

          <PanelResizeHandle className="w-px bg-border hover:w-1 hover:bg-selection-bg transition-all" />

          {/* Pane 3: エディター（主役） */}
          <Panel defaultSize={54} minSize={35} className="h-full">
            <Pane3Editor
              state={workspaceState}
              content={MOCK_CONTENT}
              onRetry={handleRetry}
            />
          </Panel>

          <PanelResizeHandle className="w-px bg-border hover:w-1 hover:bg-selection-bg transition-all" />

          {/* Pane 4: 画像 */}
          <Panel defaultSize={15} minSize={10}>
            <Pane4Images sectionImages={MOCK_SECTION_IMAGES} />
          </Panel>
        </PanelGroup>
      </div>

      {/* デバッグバー（開発環境のみ） */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 shadow text-xs">
          <span className="text-muted-foreground mr-1">State:</span>
          {(["idle", "loading", "error", "content"] as WorkspaceState[]).map(
            (s) => (
              <button
                key={s}
                type="button"
                onClick={() => setWorkspaceState(s)}
                className={
                  workspaceState === s
                    ? "rounded px-2 py-0.5 bg-selection-bg text-selection-fg font-medium"
                    : "rounded px-2 py-0.5 hover:bg-muted text-muted-foreground"
                }
              >
                {s}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  )
}
