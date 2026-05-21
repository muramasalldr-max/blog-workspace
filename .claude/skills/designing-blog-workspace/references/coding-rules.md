# コーディングルール詳細

blog-workspace 固有の Incorrect / Correct ペアを収録する。
shadcn の汎用ルールではなく、**このプロジェクトの実コードに基づく固有パターン**を扱う。

## 目次

- base（Base UI）固有のパターン
- スペーシング
- タイポグラフィ（エディター・UI）
- セマンティックカラー
- アイコン
- コンポジション
- フォーム
- ペイン責務とエディター
- AI生成状態
- ステータス表示

---

## base（Base UI）固有のパターン

このプロジェクトは base（Base UI）を使用している（`components.json` の `style` フィールドで確認）。AI は radix の API をデフォルトで生成しやすいので特に注意する。

**Incorrect:**

```tsx
<DialogTrigger asChild>
  <Button>下書き生成</Button>
</DialogTrigger>
```

**Correct:**

```tsx
<DialogTrigger render={<Button />}>
  下書き生成
</DialogTrigger>
```

**Incorrect:**

```tsx
<SelectTrigger asChild>
  <Button variant="outline">{selectedStatus}</Button>
</SelectTrigger>
```

**Correct:**

```tsx
<SelectTrigger>
  <SelectValue placeholder="ステータスを選択" />
</SelectTrigger>
```

---

## スペーシング

**Incorrect — 子要素に余白を持たせる:**

```tsx
<div className="space-y-2">
  <HeadingRow heading={h} />
  {isActive && <HeadingActions />}
</div>
```

**Correct — 入れ物が子同士の隙間を管理:**

```tsx
<div className="flex flex-col gap-2">
  <HeadingRow heading={h} />
  {isActive && <HeadingActions />}
</div>
```

`isActive` が `false` のとき `space-y-2` は最後の要素に余計な `margin-top` を残すことがある。`gap-2` なら親管理なので子が何個でも崩れない。

**Incorrect — エディター本文に過剰な上下パディング:**

```tsx
<div className="px-8 py-12">
  <TiptapEditor />
</div>
```

**Correct — 最大幅制約＋適切な余白でコラム型レイアウト:**

```tsx
<div className="mx-auto max-w-2xl px-6 py-8">
  <TiptapEditor />
</div>
```

集中型UIのエディターは中央コラムに収めることで「書く」モードを演出する。

---

## タイポグラフィ（エディター・UI）

**Incorrect — エディターエリアに sans-serif を使う:**

```tsx
<div className="tiptap prose font-sans">
  {/* エディター本文 */}
</div>
```

**Correct — エディターには font-editor トークンを使う:**

```tsx
<div className="tiptap prose font-editor leading-relaxed">
  {/* エディター本文 */}
</div>
```

エディター本文は Noto Serif JP。UIとの境界を視覚的に明確にする。

**Incorrect — セクション見出しを h2 + className で毎回書く:**

```tsx
<h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase mb-3">
  見出し一覧
</h2>
```

**Correct — SectionLabel プリミティブを使う:**

```tsx
<SectionLabel>見出し一覧</SectionLabel>
```

`components/primitives/SectionLabel.tsx` に定義済みのプリミティブを再利用する。

---

## セマンティックカラー

**Incorrect — 生の色クラスでステータスを表す:**

```tsx
<span className="text-green-800">公開済み</span>
<span className="text-yellow-600">レビュー中</span>
<span className="text-gray-500">下書き</span>
```

**Correct — semantic token または Badge variant:**

```tsx
<Badge variant="success">公開済み</Badge>
<Badge variant="warning">レビュー中</Badge>
<Badge variant="secondary">下書き</Badge>
```

**Incorrect — 選択状態に生の色を使う:**

```tsx
<li className={cn(isSelected && "bg-green-100 text-green-800")}>
  {article.title}
</li>
```

**Correct — selection トークンを使う:**

```tsx
<li className={cn(isSelected && "bg-selection-bg text-selection-fg")}>
  {article.title}
</li>
```

---

## アイコン

**Incorrect — Button 内のアイコンにサイジングクラスを付ける:**

```tsx
<Button variant="ghost" size="icon">
  <Upload className="h-4 w-4" />
</Button>
```

**Correct — 部品が CSS でアイコンサイズを制御:**

```tsx
<Button variant="ghost" size="icon">
  <Upload />
</Button>
```

正方形のアイコンコンテナには `size-*` を使う:

```tsx
<span className="flex size-8 items-center justify-center rounded-md bg-muted">
  <FileText />
</span>
```

---

## コンポジション

**Card はフル構成で使う。CardContent に全部詰めない:**

```tsx
// Incorrect
<Card>
  <CardContent>
    <h3>記事タイトル</h3>
    <p>本文の抜粋...</p>
  </CardContent>
</Card>

// Correct
<Card>
  <CardHeader>
    <CardTitle>記事タイトル</CardTitle>
  </CardHeader>
  <CardContent>
    <p>本文の抜粋...</p>
  </CardContent>
</Card>
```

**Dialog / Sheet には Title が必須。視覚的に不要でも `sr-only` で付ける:**

```tsx
<DialogContent>
  <DialogTitle className="sr-only">ソースをアップロード</DialogTitle>
  {/* フォーム */}
</DialogContent>
```

---

## フォーム

shadcn の `Field` + `Label` で構成する。生の `div` + `label` で組まない。

```tsx
// Incorrect
<div>
  <label htmlFor="title">タイトル</label>
  <Input id="title" />
</div>

// Correct
<Field>
  <Label htmlFor="title">タイトル</Label>
  <Input id="title" />
</Field>
```

2〜5択の選択肢には `ToggleGroup` を使う:

```tsx
// Incorrect: Button をループして独自 active 管理
{STATUS_OPTIONS.map((s) => (
  <Button
    key={s.value}
    variant={status === s.value ? "default" : "outline"}
    onClick={() => setStatus(s.value)}
  >
    {s.label}
  </Button>
))}

// Correct
<ToggleGroup
  type="single"
  value={status}
  onValueChange={setStatus}
>
  <ToggleGroupItem value="draft">下書き</ToggleGroupItem>
  <ToggleGroupItem value="review">レビュー中</ToggleGroupItem>
  <ToggleGroupItem value="published">公開済み</ToggleGroupItem>
</ToggleGroup>
```

---

## ペイン責務とエディター

**Incorrect — Pane 1 / 2 / 4 に装飾的なカードを置く:**

```tsx
// Pane 1 の記事リスト行をカード化してはいけない
<Card className="mb-2">
  <CardHeader>
    <CardTitle>{article.title}</CardTitle>
    <CardDescription>{article.createdAt}</CardDescription>
  </CardHeader>
</Card>
```

**Correct — サイドペインは行リストに徹する:**

```tsx
<li
  className={cn(
    "flex w-full items-center gap-2 rounded px-2.5 py-2 text-left text-sm",
    isSelected ? "bg-selection-bg text-selection-fg" : "hover:bg-muted",
  )}
>
  <FileText className="shrink-0" />
  <span className="min-w-0 flex-1 truncate">{article.title}</span>
  <Badge variant={STATUS_VARIANT[article.status]} size="xs">
    {STATUS_LABEL[article.status]}
  </Badge>
</li>
```

サイドペインはコンパクトな行リストに徹する。カードは Pane 3 エディター内のコンテンツブロックにのみ使う。

---

## AI生成状態

**Incorrect — AI生成中に空表示のままにする:**

```tsx
{content ? <TiptapEditor content={content} /> : null}
```

**Correct — Skeleton で「生成中」状態を明示する:**

```tsx
{isGenerating ? (
  <div className="mx-auto max-w-2xl px-6 py-8 flex flex-col gap-3">
    <Skeleton className="h-8 w-3/4" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-5/6" />
  </div>
) : content ? (
  <TiptapEditor content={content} />
) : (
  <EmptyEditorState />
)}
```

空状態・ローディング・コンテンツあり、の3状態を必ず実装する。

---

## ステータス表示

記事ステータスの表示は常に `Badge` コンポーネントを通じて行う。

```tsx
// NG
<span className="rounded bg-green-100 px-1.5 py-0.5 text-xs text-green-800">
  公開済み
</span>

// OK
<Badge variant="success" size="xs">公開済み</Badge>
```

ステータス → variant のマッピングは定数で一元管理する:

```tsx
// lib/labels.ts
export const STATUS_VARIANT = {
  draft:     "secondary",
  review:    "warning",
  published: "success",
} as const satisfies Record<ArticleStatus, string>;

export const STATUS_LABEL = {
  draft:     "下書き",
  review:    "レビュー中",
  published: "公開済み",
} as const satisfies Record<ArticleStatus, string>;
```

呼び出し側でステータスを直接文字列に変換しない。必ずこのマッピング定数を経由する。
