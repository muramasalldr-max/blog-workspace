---
name: designing-blog-workspace
description: blog-workspace の UI 作業（ペイン修正・コンポーネント追加・色や角丸や余白の変更・レイアウト調整・情報設計の検討・JSX の編集）で、このプロジェクトのデザインシステムに準拠したコード生成とデザイン規律を強制するスキル。「Pane を変えたい」「ボタンを追加したい」「色を変えたい」「コンポーネントを作りたい」「エディターを直したい」「余白を直したい」「フォームを追加したい」「レイアウトを調整したい」と依頼された際に使用する。次の場合は使用しない: components/ 配下を編集しない単純な質問・タイポ修正・README やドキュメントのみの編集・テストコードのみの修正・依存パッケージ更新。
---

# Designing Blog Workspace

blog-workspace で UI を編集する際は、以下の2軸を必ず両方適用する:

1. **shadcn idiom に従ってコード生成する** — base UI / semantic token / 親管理の余白
2. **SSoT を経由しないデザイン変更を拒否する** — トークン・部品・パターン・情報設計の不足は4分岐で診断し、ユーザーに確認する

## デザインシステム概要

このプロジェクトの世界観:

| 軸 | 方針 |
|---|---|
| ブランドカラー | ハンターグリーン（ニュートラルな深緑、クラシック・公式感） |
| ムード | 集中・没入型。余白多め・ミニマル。Notion 小ぎみな静けさ |
| カラーモード | ライトモードのみ（ダークモードは後フェーズ） |
| フォント | エディター本文のみ Noto Serif JP。UI は system sans-serif |
| 背景色 | 3層構造（後述） |
| 角丸 | シャープ寄り（`rounded-sm` / `rounded-md` 中心） |
| グリーンの使いどころ | 選択状態・フォーカスリング・プライマリボタンの3点に限定 |
| AI生成ローディング | Skeleton UI（ペインにプレースホルダー） |

## 依存

このスキルが参照する SSoT:

- `app/globals.css` — デザイントークン（`@theme` 内の CSS 変数）
- `components.json` — shadcn 設定（base / style / iconLibrary / alias。ファイルを読んで確認する）
- `components/ui/` — shadcn 素体（編集可能。方針は後述）
- `components/primitives/` — プロジェクト固有プリミティブ（`ls` して確認する。名前はハードコードしない）
- `.claude/skills/designing-blog-workspace/references/design-tokens.md` — カラー・タイポ・余白・角丸の全トークン一覧
- `.claude/skills/designing-blog-workspace/references/coding-rules.md` — Incorrect / Correct ペア集

## コード生成ルール

### 中心の禁止事項

| 禁止 | 正しい方法 | なぜ |
|------|-----------|------|
| `space-y-*` / `space-x-*` | `flex flex-col gap-*` / `flex gap-*` | 子要素が条件で消えたとき余白が崩れる |
| `className` で色・フォントサイズ・ウェイトを上書き | variant / semantic token / CSS 変数 | ダークモード追加時に全ファイル書き換えになる |
| 生の色クラス（`bg-green-800` 等） | `bg-primary` 等の semantic token | テーマ変更時に全ファイル書き換えになる |
| `w-N h-N`（正方形時） | `size-N` | 「正方形にしたい」意図が明確になる |
| `asChild`（radix の API） | `render`（base の API） | このプロジェクトは base を使用。radix の書き方は動かない |
| shadcn 部品がある場面で自前の div | `Badge` / `Separator` / `Skeleton` 等 | a11y・テーマ連動が組み込み済み |
| エディターエリアに `font-sans` | `font-serif` または `font-editor` トークン | エディター本文はセリフ体が SSoT |

最も誤りやすいパターン（**必ず暗記**）:

```tsx
// Incorrect — radix の書き方は base では動かない
<DialogTrigger asChild>
  <Button variant="outline">保存</Button>
</DialogTrigger>

// Correct — base の API
<DialogTrigger render={<Button variant="outline" />}>
  保存
</DialogTrigger>
```

詳細な Incorrect / Correct ペアは [references/coding-rules.md](references/coding-rules.md) を参照。

### components/ui/ の編集方針

shadcn の Open Code 思想に基づき、`components/ui/` は**プロジェクトのコード**として編集してよい。ただし:

**OK**:
- 部品に新しい variant を追加する
- 部品の間隔やスタイルを構造的に変更する
- 新しい CSS 変数を `globals.css` に定義して部品から参照する

**NG**:
- 呼び出し側で `className` を使って見た目を毎回打ち消す
- 部品ファイルを丸ごとコピーして別名で作る

### 出力後セルフレビュー

コードを出力した後、以下の4点をセルフレビューし、違反があれば修正版を出す:

1. **shadcn の書き方**: 間隔は親管理（`gap-*`）か？ 色は semantic token か？
2. **base 準拠**: `asChild` ではなく `render` を使っているか？
3. **プロジェクトトークン**: `globals.css` の既存トークンで表現できるか？
4. **エディター本文**: `font-editor` / `font-serif` を使っているか？

---

## SSoT エスカレーション規律

**SSoT を経由しない UI 変更は禁止。** 既存 SSoT で作れないものが出てきたら、以下の4分岐で診断し、必ずユーザーに聞く。

### 作業前の確認（必ず実行）

```
SSoT 把握:
- [ ] app/globals.css を読み、既存の semantic token を列挙した
- [ ] components/ui/ を ls し、利用可能な shadcn 部品を列挙した
- [ ] components/primitives/ を ls し、プロジェクト固有部品を列挙した
- [ ] references/design-tokens.md を読み、使えるトークンを確認した
```

このチェックが全て埋まる前にコード生成を開始してはならない。

### 4分岐の決定木

既存 SSoT で作れる → そのまま実装。作れない → 以下に進む。

**いずれの分岐でも、ユーザーの判断なしに実装に進んではならない。**

#### 3a. トークンの穴

色・余白・角丸・影・フォント等の値が既存トークンで足りない。

やること: 何が足りないかを1行で説明 → `@theme` への追加案を提示 → ユーザーの判断を仰ぐ

やってはいけないこと: 生の色クラスの使用 / 「一時的に hardcoded で後で直す」仮対応 / ユーザーに聞かず `@theme` を変更

#### 3b. 部品の穴

既存部品で表現できない形・variant が必要。

やること: 既存部品の variant / size で代替できないか先に試す → 不可能なら新 variant または新プリミティブを起案 → ユーザーの判断を仰ぐ

やってはいけないこと: 部品ファイルを fork コピー / 呼び出し側で className の上書きで済ませる

#### 3c. パターンの穴

レイアウトパターン・複数部品の組み合わせ規則・状態（empty / error / loading / AI生成中）の規律がない。

やること: 既存決定を確認し、本当に規律がないことを確かめる → 規律案を起案 → ユーザーの判断を仰ぐ

やってはいけないこと: 「とりあえず置いてみる」で恒久パターンを既成事実化

#### 3d. 情報設計の穴

ペインに何を載せるか・並び順・情報の増減の規律がない。

やること: **コードを書かない**。何を載せるか・優先順位・並び順を質問する → ユーザーが決めてから実装

やってはいけないこと: 「ブログツールならこれが普通だろう」と独断で情報を足す / 削る / 並び替える

### エスカレーションのテンプレート

```
[診断]
何が足りない: <1行説明>
分岐: 3a / 3b / 3c / 3d のどれか

[根拠]
Refactoring UI の <軸> / デザインシステムの <規律> / shadcn idiom 上の <理由>

[提案]
案1: <内容>（メリット / デメリット）
案2: <内容>（メリット / デメリット）

[ユーザーへの質問]
どちらで進めますか？別案ありますか？
```

### 評価軸（Refactoring UI）

エスカレーション時の根拠に使う:

- Hierarchy（階層）/ Spacing（余白）/ Typography（タイポ）/ Color（色）/ Depth（影）/ Polish（空状態・エラー状態・ローディング状態・微調整）

---

## ペイン編集導線

### 4ペインの責務分離

```
Pane 1: 記事一覧    → 記事の選択・ステータス管理
Pane 2: 見出し      → 目次ナビ（クリックでエディターへスクロール）・見出し編集
Pane 3: エディター  → 本文の読み書き（Tiptap）。ここがこのツールの主役
Pane 4: 画像        → アイキャッチ・セクション口絵の管理
```

**「Pane 3 = 書く場所、Pane 1/2/4 = 支援ツール」**。Pane 3 を最も目立たせ、他のペインは Pane 3 を邪魔しない密度に抑える。

- Pane 1 / 2 はコンパクトな行リスト。カード化・装飾過多は禁止
- Pane 4 は画像グリッドとプロンプト入力。テキスト要素を最小化する
- Pane 3 のエディターエリアに `font-editor`（Noto Serif JP）を必ず適用する

### AI生成フロー

ソースアップロード → AI が下書き生成 → Pane 2/3 に結果を挿入、というフローで状態が変わる。

| 状態 | Pane 2（見出し） | Pane 3（エディター） |
|------|----------------|-------------------|
| 記事未選択 | 空状態メッセージ | 空状態メッセージ |
| ソース未アップロード | 空状態メッセージ | 「ソースをアップロードして下書き生成」の誘導 |
| AI生成中 | Skeleton（3〜5行） | Skeleton（段落ブロック複数） |
| 生成完了 | 見出しリスト表示 | 本文テキスト表示（フェードイン） |
| 編集中 | 見出しのハイライト追従 | 通常編集状態 |

空状態・ローディング・エラーの3状態は必ず設計する。「生成完了」だけ実装してはならない。

### インライン編集規約

- 1行 `input`: Enter で保存 / Esc でキャンセル / blur で保存
- 複数行 `textarea`: **Cmd+Enter で保存**（Enter は改行）/ Esc でキャンセル / blur で保存
- ホバー時のみ薄い枠を出す。常時の枠は出さない

---

## 角丸（border-radius）の階層ルール

### ルール 1: 親 R ≧ 子 R

親の箱に当てた R より大きな R を、その中の要素に付けない。

### ルール 2: シャープ基調を守る

このプロジェクトは `--radius: 0.25rem`（= `rounded-sm` 相当）をベースとする。

| 用途 | クラス |
|------|--------|
| ボタン・バッジ・タグ | `rounded` / `rounded-sm` |
| 入力フィールド・インライン編集 | `rounded-md` |
| カード（島） | `rounded-lg`（例外的な上限） |
| モーダル・ドロワー | `rounded-lg` |

`rounded-xl` 以上は使用禁止。丸みが強いとハンターグリーンの格調と矛盾する。

### ルール 3: 高密度エリアでの例外

行リスト（Pane 1 / Pane 2）は `rounded-sm` を維持。島を作る必要があるときも `rounded-md` どまり。

---

## React 19 ルール

### Effect 内同期 setState 禁止

`useEffect` の中で同期的に `setState` を呼んで初期値を入れ直すパターンは禁止。

代替パターン:
- 親側で `key` を変更して子コンポーネントを再マウントし、`useState(initialValue)` で初期化する
- フォーカス + 全選択は `autoFocus` + `onFocus={(e) => e.target.select()}` で実現する
