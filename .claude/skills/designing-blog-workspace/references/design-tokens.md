# デザイントークン

blog-workspace の `app/globals.css` に定義する `@theme` ブロックの SSoT。
トークンの追加・変更は必ず `globals.css` の `@theme` を経由し、呼び出し側で生の値を書かない。

---

## カラーパレット

### ブランドカラー（ハンターグリーン）

ハンターグリーン: ニュートラルな深緑。青み・黄みに偏らないクラシック・公式感のある色。

```css
@theme {
  /* ブランドパレット（oklch: lightness / chroma / hue） */
  --color-brand-950: oklch(18% 0.075 152);
  --color-brand-900: oklch(22% 0.082 152);
  --color-brand-800: oklch(28% 0.088 152); /* primary の軸 */
  --color-brand-700: oklch(35% 0.090 152);
  --color-brand-600: oklch(43% 0.088 152);
  --color-brand-500: oklch(52% 0.085 152);
  --color-brand-200: oklch(88% 0.040 152);
  --color-brand-100: oklch(94% 0.022 152); /* 選択背景 */
  --color-brand-50:  oklch(97% 0.012 152); /* ホバー背景 */
}
```

### サーフェス階層（3層）

| 層 | トークン名 | 用途 | oklch 値 |
|----|----------|------|----------|
| Layer 0: キャンバス | `--color-canvas` | 画面最背面・ペイン外の余白 | `oklch(97% 0.006 90)` |
| Layer 1: パネル | `--color-panel` | Pane 1 / Pane 2 / Pane 4 の背景 | `oklch(95% 0.008 90)` |
| Layer 2: サーフェス | `--color-surface` | Pane 3 エディターエリア・カード | `oklch(100% 0 0)` |

```css
@theme {
  --color-canvas:  oklch(97% 0.006 90);
  --color-panel:   oklch(95% 0.008 90);
  --color-surface: oklch(100% 0 0);
}
```

### セマンティックトークン

```css
@theme {
  /* Primary（ハンターグリーン） */
  --color-primary:            var(--color-brand-800);
  --color-primary-hover:      var(--color-brand-700);
  --color-primary-foreground: oklch(99% 0 0);

  /* 選択・アクティブ状態 */
  --color-selection-bg:       var(--color-brand-100);
  --color-selection-fg:       var(--color-brand-800);

  /* 背景・前景 */
  --color-background:         var(--color-canvas);
  --color-foreground:         oklch(15% 0.010 90);

  /* ミュート（補助テキスト・サイドパネル） */
  --color-muted:              var(--color-panel);
  --color-muted-foreground:   oklch(50% 0.010 90);

  /* ボーダー */
  --color-border:             oklch(88% 0.008 90);
  --color-border-subtle:      oklch(92% 0.006 90);

  /* フォーカスリング */
  --color-ring:               var(--color-brand-800);

  /* カード（エディター面と同じ白） */
  --color-card:               var(--color-surface);
  --color-card-foreground:    var(--color-foreground);

  /* 破壊的操作 */
  --color-destructive:        oklch(50% 0.200 25);
  --color-destructive-foreground: oklch(99% 0 0);

  /* AI生成中・情報 */
  --color-info:               oklch(58% 0.130 240);
  --color-info-foreground:    oklch(99% 0 0);

  /* 成功（公開済みステータス等） */
  --color-success:            var(--color-brand-700);
  --color-success-foreground: oklch(99% 0 0);

  /* 警告（下書き・レビュー中等） */
  --color-warning:            oklch(72% 0.170 75);
  --color-warning-foreground: oklch(20% 0.020 90);
}
```

### 使用禁止の色指定

```tsx
// NG: 生の色クラス
<span className="text-green-800">公開済み</span>
<div className="bg-green-100">選択中</div>

// OK: semantic token
<span className="text-success">公開済み</span>
<div className="bg-selection-bg text-selection-fg">選択中</div>
```

---

## タイポグラフィ

### フォントファミリー

```css
@theme {
  --font-sans:   ui-sans-serif, system-ui, -apple-system, sans-serif;
  --font-serif:  "Noto Serif JP", "Hiragino Mincho ProN", Georgia, serif;
  --font-editor: var(--font-serif);  /* エディター本文専用エイリアス */
  --font-mono:   ui-monospace, "SF Mono", Menlo, monospace;
}
```

### 使い分けルール

| 場所 | フォント | Tailwind クラス |
|------|----------|----------------|
| UIテキスト全般 | system sans-serif | デフォルト（指定不要） |
| Pane 3 エディター本文 | Noto Serif JP | `font-editor` |
| エディターの見出し (H1/H2/H3) | Noto Serif JP | `font-editor` |
| コードブロック | モノスペース | `font-mono` |

```tsx
// NG: エディターエリアに sans を使う
<div className="tiptap font-sans">...</div>

// OK: エディターエリアには font-editor
<div className="tiptap font-editor">...</div>
```

### タイプスケール

| トークン | サイズ | 用途 |
|----------|-------|------|
| `text-xs` | 0.75rem | バッジ・補助ラベル・ステータス |
| `text-sm` | 0.875rem | 行リスト・サイドパネルのテキスト |
| `text-base` | 1rem | エディター本文・通常テキスト |
| `text-lg` | 1.125rem | エディター H3 |
| `text-xl` | 1.25rem | エディター H2 |
| `text-2xl` | 1.5rem | エディター H1 |

---

## 角丸（Border Radius）

シャープ基調。`rounded-xl` 以上は使用禁止。

```css
@theme {
  --radius:    0.25rem;                    /* base: rounded-sm 相当 */
  --radius-sm: calc(var(--radius) * 0.5);  /* 最小 */
  --radius-md: calc(var(--radius) * 2);    /* 0.5rem: 入力フィールド */
  --radius-lg: calc(var(--radius) * 4);    /* 1rem: カード・モーダル上限 */
}
```

| 用途 | 値 | Tailwind クラス |
|------|---|----------------|
| ボタン・バッジ | `--radius` (0.25rem) | `rounded` |
| 入力フィールド・インライン編集 | `--radius-md` (0.5rem) | `rounded-md` |
| カード（島） | `--radius-lg` (1rem) | `rounded-lg` |
| モーダル・ドロワー | `--radius-lg` (1rem) | `rounded-lg` |

---

## スペーシング

Tailwind のデフォルトスケールを使う。以下はガイドライン。

| 用途 | 値 |
|------|---|
| ペイン内の横パディング | `px-3` (0.75rem) |
| ペイン内の縦パディング | `py-4` (1rem) |
| 行リストのアイテム間隔 | `gap-1` (0.25rem) |
| セクション間の間隔 | `gap-5` (1.25rem) |
| エディター本文の行間 | `leading-relaxed` |
| エディターの最大幅 | `max-w-2xl mx-auto`（集中型レイアウト） |

---

## シャドウ

集中型UIなのでシャドウは控えめ。

```css
@theme {
  --shadow-sm: 0 1px 2px oklch(0% 0 0 / 0.05);
  --shadow:    0 1px 3px oklch(0% 0 0 / 0.08), 0 1px 2px oklch(0% 0 0 / 0.05);
}
```

| 用途 | シャドウ |
|------|---------|
| カード（通常） | `shadow-sm` |
| ドロップダウン・ポップオーバー | `shadow` |
| モーダル | `shadow` |
| 浮遊要素（DnD等） | `shadow-lg`（Tailwind デフォルト） |

ボックスシャドウで立体感を演出しすぎない。境界は基本的にボーダーで区切る。

---

## ステータスバッジ

記事のステータスは `Badge` コンポーネントの variant で表現する。生の色クラスで表現しない。

| ステータス | Badge variant | 意味 |
|------------|--------------|------|
| `draft` | `secondary` | 下書き |
| `review` | `warning` | レビュー中 |
| `published` | `success` | 公開済み |

```tsx
// NG
<span className="text-green-700 bg-green-100">公開済み</span>

// OK
<Badge variant="success">公開済み</Badge>
```

---

## AI生成状態のパターン

Skeleton は shadcn の `<Skeleton>` コンポーネントを使う。独自実装しない。

```tsx
// AI生成中の見出しペイン
{isGenerating ? (
  <div className="flex flex-col gap-2 px-3 py-4">
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-4 w-2/3" />
  </div>
) : (
  <HeadingList headings={headings} />
)}

// AI生成中のエディターペイン
{isGenerating ? (
  <div className="flex flex-col gap-3 px-4 py-6 max-w-2xl mx-auto font-editor">
    <Skeleton className="h-8 w-3/4" />   {/* H1 */}
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-5/6" />
    <Skeleton className="h-6 w-1/2 mt-4" /> {/* H2 */}
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-4/5" />
  </div>
) : (
  <TiptapEditor content={content} />
)}
```
