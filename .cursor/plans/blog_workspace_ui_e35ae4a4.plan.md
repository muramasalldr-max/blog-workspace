---
name: Blog Workspace UI
overview: blog-app の画面を blog-workspace のデザインシステムに沿った 4 ペイン Next.js ワークスペースとして構築する。UX/エンジニアレビューの Critical 指摘を反映し、エラー状態・ARIAランドマーク・リサイズ可能ペイン・デスクトップ専用明記を追加。mock データで idle/loading/error/content の 4 状態を実装し、Tiptap / Zustand は後フェーズとする。
todos:
  - id: install-resizable
    content: npm install react-resizable-panels を実行
    status: pending
  - id: tokens
    content: globals.css に blog-workspace デザイントークンを適用（brand green / canvas / panel / surface / semantic / font-editor / radius / shadow）
    status: pending
  - id: layout
    content: app/layout.tsx に Noto Serif JP を追加（preload:false・weight指定）
    status: pending
  - id: shadcn-add
    content: npx shadcn@latest add badge skeleton separator を実行
    status: pending
  - id: workspace
    content: components/workspace/BlogWorkspace.tsx を作成（Server Component シェル + PanelGroupClient + 4状態 mock state + ARIA landmarks + デスクトップ専用ガード）
    status: pending
  - id: pane1
    content: Pane1ArticleList.tsx を作成（記事リスト・Badge・選択状態・空状態・role=region）
    status: pending
  - id: pane2
    content: Pane2Headings.tsx を作成（TOC・4状態・role=region）
    status: pending
  - id: pane3
    content: Pane3Editor.tsx を作成（タイトルインライン編集+aria-label・4状態・font-editor・role=main）
    status: pending
  - id: pane4
    content: Pane4Images.tsx を作成（アイキャッチドロップゾーン・グリッド・role=region）
    status: pending
  - id: page
    content: app/page.tsx を更新して BlogWorkspace をレンダー
    status: pending
isProject: false
---

# Blog Workspace UI 構築プラン（レビュー反映版）

## 現状

[`blog-app/app/page.tsx`](AI-Driven School/workspace-tool/blog-workspace/blog-app/app/page.tsx) は shadcn デフォルトのプレースホルダーのみ。`globals.css` にはデフォルトトークンが入っており、blog-workspace 用の Hunter Green / canvas / panel / surface トークンは未定義。

## UX/エンジニアレビューで反映する変更

| ID | 分類 | 変更内容 |
|---|---|---|
| S1 | Critical (UX) | 状態を 3 → **4 状態**へ: `"idle" \| "loading" \| "error" \| "content"` |
| A1 | Critical (UX) | 各ペインに **ARIA landmark**: Pane 3 → `role="main"`、Pane 1/2/4 → `role="region" aria-label="…"` |
| A2 | Critical (UX) | インライン編集 `<input>` に **`aria-label="記事タイトル"`** + 保存完了 live region (`role="status"`) |
| M1 | Critical (UX) | **デスクトップ専用**を明記: `min-width: 1280px` 未満は「デスクトップブラウザで開いてください」画面に差し替え |
| L1 | Major (UX) | 固定幅ペイン → **`react-resizable-panels`** でリサイズ可能に（デフォルト比率は維持） |
| C-1 | Critical (Eng) | Noto Serif JP: `subsets:["latin"]` 削除 → `preload:false` + `weight:["400","700"]` に変更（日本語グリフが全くロードされないバグ修正）|
| C-2 | Critical (Eng) | `globals.css` の radius トークン: Tailwind v4 では `--radius` 単体が無効 → `--radius-none / --radius-sm / --radius-md / --radius-lg` に個別定義 |
| C-3 | Critical (Eng) | RSC 境界設計: `BlogWorkspace.tsx` を **Server Component のまま**保ち、インタラクティブな部分のみ `'use client'` で切り出す |

## 変更ファイル一覧

### 0. 依存パッケージ追加

```bash
npm install react-resizable-panels
npx shadcn@latest add badge skeleton separator
```

### 1. [`app/globals.css`](AI-Driven School/workspace-tool/blog-workspace/blog-app/app/globals.css) — デザイントークン更新

`@theme` ブロックを blog-workspace の SSoT トークンで上書き:

- ブランドカラー: `--color-brand-50` ～ `--color-brand-950`（Hunter Green, oklch hue 152）
- サーフェス 3 層: `--color-canvas` / `--color-panel` / `--color-surface`
- セマンティック: `--color-primary` / `--color-selection-bg` / `--color-selection-fg` / `--color-border-subtle` 等
- タイポ: `--font-editor`（Noto Serif JP エイリアス）
- 角丸（C-2 対応）: Tailwind v4 では `--radius` 単体トークンは `rounded-*` クラスを生成しないため個別定義:

```css
@theme {
  --radius-none: 0rem;
  --radius-sm:   0.125rem;
  --radius-md:   0.25rem;   /* ボタン・バッジ基準 */
  --radius-lg:   0.5rem;    /* 入力フィールド */
  --radius-xl:   1rem;      /* カード・モーダル上限 */
}
```

- シャドウ: `--shadow-sm` / `--shadow`

### 2. [`app/layout.tsx`](AI-Driven School/workspace-tool/blog-workspace/blog-app/app/layout.tsx) — Noto Serif JP 追加

CJK フォントは `subsets: ["latin"]` では日本語グリフがロードされないため `preload: false` が必須（[next.js #44594](https://github.com/vercel/next.js/issues/44594)）。

```tsx
import { Noto_Serif_JP } from "next/font/google"
const notoSerifJP = Noto_Serif_JP({
  weight: ["400", "700"],
  preload: false,       // CJK フォント必須
  variable: "--font-editor",
})
```

`html` の `className` に `notoSerifJP.variable` を追加。

### 3. RSC 境界設計（C-3 対応）

`BlogWorkspace.tsx` はレイアウトシェルなので **Server Component のまま**維持する。`'use client'` は以下の葉ノードにのみ配置:

| コンポーネント | 理由 |
|---|---|
| `WorkspaceStateDebugBar.tsx` | useState（デバッグ切り替え） |
| `ArticleListClient.tsx` | 選択状態の useState |
| `TitleInlineEdit.tsx` | input の onChange / Enter/Esc |
| `PanelGroupClient.tsx` | react-resizable-panels（クライアント専用） |

`Pane1〜4` のシェル自体は Server Component として `PanelGroupClient` に children 渡し。静的なラベル・ARIA属性・Skeleton はサーバー側でレンダリング。

### 4. `components/workspace/BlogWorkspace.tsx` — 4 ペイン SSoT

#### ペイン幅: react-resizable-panels

固定幅から `PanelGroup` + `Panel` + `PanelResizeHandle` に変更。デフォルト比率は以下:

| ペイン | `defaultSize` | 最小 `minSize` |
|---|---|---|
| Pane 1（記事一覧） | 16 | 12 |
| Pane 2（見出し） | 15 | 10 |
| Pane 3（エディター） | 54 | 35 |
| Pane 4（画像） | 15 | 10 |

`PanelResizeHandle` は `border-r border-border` + ホバー時 `bg-selection-bg` の細い帯として実装。

#### デスクトップ専用ガード（M1 対応）

```tsx
// 1280px 未満はフォールバック画面を表示
<div className="hidden min-[1280px]:flex h-screen ...">
  {/* 4ペイン本体 */}
</div>
<div className="flex min-[1280px]:hidden h-screen items-center justify-center ...">
  <p>このツールはデスクトップブラウザ（幅 1280px 以上）でご利用ください。</p>
</div>
```

#### 状態型（S1 対応）

```tsx
type WorkspaceState = "idle" | "loading" | "error" | "content"
```

`idle` = 記事未選択 / `loading` = AI生成中 / `error` = 生成失敗 / `content` = 表示可能

mock state: `selectedArticleId: string | null` / `workspaceState: WorkspaceState`

全体は `h-screen flex overflow-hidden bg-canvas`。

#### デバッグバー

`fixed bottom-4 right-4` に `workspaceState` を `idle / loading / error / content` で切り替えるボタン群。`process.env.NODE_ENV === "development"` 時のみ表示。

### 4. `components/workspace/Pane1ArticleList.tsx`

```tsx
<aside role="region" aria-label="記事一覧">
```

- ヘッダー: 「記事一覧」ラベル + 新規作成ボタン（`ghost` `icon-sm`）
- 記事行: タイトル / `Badge` variant（`secondary`=下書き / `warning`=レビュー中 / `success`=公開済み）
- 選択行: `bg-selection-bg text-selection-fg`
- 空状態: 「記事がありません」+ 新規作成誘導

### 5. `components/workspace/Pane2Headings.tsx`

```tsx
<aside role="region" aria-label="見出し一覧">
```

- 4 状態:
  - `idle`: 「記事を選択してください」メッセージ
  - `loading`: `<Skeleton>` 3 ～ 5 行
  - `error`: 「生成に失敗しました。再試行してください」+ 再試行ボタン
  - `content`: 見出しリスト（H1/H2/H3 インデント差分）
- 見出し行クリックでエディタースクロール連動（この段階では `console.log` のみ）

### 6. `components/workspace/Pane3Editor.tsx`

```tsx
<main role="main" aria-label="記事エディター">
```

- ヘッダー: タイトルのインライン編集（A2 対応）

```tsx
<input
  aria-label="記事タイトル"
  onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") cancel(); }}
/>
{/* 保存完了通知 */}
<span role="status" aria-live="polite" className="sr-only">{savedMessage}</span>
```

- 4 状態:
  - `idle`: 「ソースをアップロードして下書きを生成」誘導テキスト
  - `loading`: `<Skeleton>` H1 + 段落ブロック複数
  - `error`: 「下書きの生成に失敗しました」+ 再試行ボタン
  - `content`: `<textarea>` に `font-editor` クラス（Tiptap 統合は後フェーズ）
- エディターエリア最大幅: `max-w-2xl mx-auto`、パディング `px-6 py-8`

### 7. `components/workspace/Pane4Images.tsx`

```tsx
<aside role="region" aria-label="画像管理">
```

- アイキャッチ枠: 破線ボーダーのドロップゾーン（モック）
- セクション画像グリッド: プレースホルダー

### 8. [`app/page.tsx`](AI-Driven School/workspace-tool/blog-workspace/blog-app/app/page.tsx) — 更新

```tsx
import { BlogWorkspace } from "@/components/workspace/BlogWorkspace"
export default function Page() {
  return <BlogWorkspace />
}
```

## 実装しないこと（このフェーズ）

- Tiptap エディター統合（placeholder textarea で代替）
- Zustand 状態管理（useState で代替）
- AI API 呼び出し
- ダークモード
- ペイン幅の localStorage 永続化（react-resizable-panels の内蔵機能は後フェーズで有効化）

---

## 後フェーズの積み残しメモ（レビュー指摘・未対応分）

### UX レビュー — Major

| ID | 内容 | 参考 |
|---|---|---|
| S2 | AI生成中の Skeleton は待機が長い場合に不十分。タイピングインジケーター → ストリーミング挿入へのロードマップを設計する | ストリーミング UI パターン |
| C1 | Badge の `warning` / `success` 配色のコントラスト比を WCAG 1.4.1 で検証する（oklch 値で確認必須） | WCAG 2.1 SC 1.4.1 |
| A3 | フォーカスリング（Hunter Green）が canvas 背景（L=97%）に対して 3:1 以上か WCAG 2.2 SC 2.4.11 で検証する | WCAG 2.2 SC 2.4.11 |
| A4 | ステータス Badge が色のみで区別されている。lucide-react アイコン + テキストラベルの二重表現を追加する | WCAG 1.4.1 |
| T1 | Noto Serif JP の FCP リスク対策: `next/font` の `display: "optional"` を明示して FOUT を防ぐ | next/font docs |
| E1 | インライン編集の blur 時保存 + `role="status"` トースト通知（Notion / Linear 方式）を実装する | - |

### エンジニアレビュー — Major

| ID | 内容 | 参考 |
|---|---|---|
| M-2 | `h-screen` → `h-dvh` に変更する（モバイルブラウザのアドレスバー問題、Baseline Widely Available・93%+ 対応） | MDN dvh |
| M-3 | `selectedArticleId` / `workspaceState` の prop drilling を `WorkspaceContext + useWorkspace()` カスタムフックで抽象化し、Zustand 移行時のインターフェース変更をゼロにする | - |
| M-4 | `WorkspaceState` 型を `types/workspace.ts` で一元 export する（各ファイルにインラインで散在させない） | - |

### エンジニアレビュー — Minor

| ID | 内容 |
|---|---|
| n-2 | `package.json` の `"radix-ui": "^1.4.3"` はパッケージ名の確認が必要（`@radix-ui/react-*` 形式が正しい可能性） |
| n-3 | React Compiler（Next.js 16 で stable）を `next.config.ts` の `experimental.reactCompiler: true` で有効化する |
