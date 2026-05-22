import { WorkspaceClient } from "@/components/workspace/WorkspaceClient"

export function BlogWorkspace() {
  return (
    <>
      {/* デスクトップ（1280px 以上）: 4ペインワークスペース */}
      <div className="hidden min-[1280px]:block h-screen bg-canvas">
        <WorkspaceClient />
      </div>

      {/* モバイル・タブレット: フォールバック */}
      <div className="flex min-[1280px]:hidden h-screen items-center justify-center bg-canvas px-6">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <div className="flex size-14 items-center justify-center rounded-lg bg-muted">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground"
              aria-hidden="true"
            >
              <rect width="20" height="14" x="2" y="3" rx="2" />
              <line x1="8" x2="16" y1="21" y2="21" />
              <line x1="12" x2="12" y1="17" y2="21" />
            </svg>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-foreground">
              デスクトップブラウザでご利用ください
            </p>
            <p className="text-sm text-muted-foreground">
              このツールは幅 1280px 以上の画面に最適化されています
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
