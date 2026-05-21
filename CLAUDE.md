# blog-workspace

ブログコンテンツ作成ツールの **4ペイン Next.js × shadcn/ui × Tiptap ワークスペース**。
ソース素材（テキスト・PDF・URL・音声等）をアップロードするとAIが見出しと本文の下書きを生成し、エディターで人間が仕上げる。
設計方針・決定事項の詳細は README.md を参照。

## 視覚 SSoT

画面の SSoT は `components/workspace/BlogWorkspace.tsx`。
デザイントークンの SSoT は `app/globals.css`（`@theme` ブロック）。
**globals.css のトークンと実装で矛盾したら globals.css が正。実装は段階的に追従する。**

## 同梱スキル

| スキル | いつ発動するか | パス |
| --- | --- | --- |
| designing-blog-workspace | ペイン変更・色変更・コンポーネント追加など UI 作業全般 | [SKILL.md](.claude/skills/designing-blog-workspace/SKILL.md) |
| shadcn | shadcn 部品の追加・カスタマイズ | [SKILL.md](.claude/skills/shadcn/SKILL.md) |
| next-best-practices | Next.js のファイル規約・RSC 境界・async パターン等 | [SKILL.md](.claude/skills/next-best-practices/SKILL.md) |

MUST: Next.js のコードを書く前に `node_modules/next/dist/docs/` の該当ドキュメントを読む。学習データではなくバンドル版が正。

## 編集の方針

IMPORTANT: 以下を守ること。

- **UI 変更を始める前に `designing-blog-workspace` スキルを起動する**。トークン・部品・レイアウトで足りないときは決定木 3a〜3d でユーザー確認し、独断で SSoT を広げない
- **インライン編集は `components/primitives/Inline*` を再利用**。鉛筆アイコン式・「編集」ボタン式・モーダル一括編集式に逃がさない
- **shadcn 部品の更新は `npx shadcn@latest add ... --diff` で確認**。`--overwrite` は本人の明示許可なしに使わない（独自 variant が消えるため）
- **Pane 3（エディター）が主役**。Pane 1/2/4 はコンパクトな行リスト・サポートパネルに徹し、Pane 3 を圧迫しない

## コード生成ルール

`components/` 配下のファイルを編集する際は、以下を必ず守る。詳しい根拠と Incorrect/Correct ペアは [coding-rules.md](.claude/skills/designing-blog-workspace/references/coding-rules.md) に集約している:

- 子要素の間隔は親で管理する（`flex flex-col gap-*` を使う、`space-y-*` は使わない）
- 部品の見た目を呼び出し側で打ち消さない（色・フォントサイズ・フォントウェイトの `className` 上書き禁止。部品側に variant を追加する）
- 色は semantic token を使う（`bg-primary`・`bg-selection-bg` 等。`bg-green-800` のような生の色番号は使わない）
- 正方形の要素には `size-N` を使う（`w-N h-N` ではなく）
- このプロジェクトは shadcn の **base**（Base UI）を使用。カスタムトリガーには `asChild` ではなく `render` を使う
- shadcn の部品（Button / Card / Badge / Skeleton 等）が使えるなら自前の div で代替しない
- **エディター本文には必ず `font-editor` トークン（Noto Serif JP）を使う。`font-sans` は使わない**
- AI生成中・空状態・コンテンツあり、の3状態を必ず実装する。生成完了だけ実装して終わらない
- 派生 state を Effect で複製しない（レンダーで計算する）。props 変更追従の Effect+setState は避け、リセットは key でリマウント

## デザインシステム（概要）

詳細トークンは [design-tokens.md](.claude/skills/designing-blog-workspace/references/design-tokens.md) を参照。

| 軸 | 決定 |
|---|---|
| ブランドカラー | ハンターグリーン（`--color-brand-800: oklch(28% 0.088 152)`） |
| ムード | 集中・没入型（余白多め・ミニマル） |
| カラーモード | ライトモードのみ（ダークモードは後フェーズ） |
| フォント | エディター本文のみ Noto Serif JP / UI は system sans-serif |
| 背景色 | 3層（キャンバス → パネル → エディター純白） |
| 角丸 | シャープ寄り（`rounded-xl` 以上は使用禁止） |
| グリーン使いどころ | 選択状態・フォーカスリング・プライマリボタンの3点に限定 |
| AI生成ローディング | Skeleton UI（Pane 2/3 にプレースホルダー） |

## 技術スタック

- Next.js / React 19 / TypeScript（strict）
- Tailwind CSS v4（`@theme` で CSS 変数）
- shadcn/ui（base-nova / `@base-ui/react`）
- Tiptap（WYSIWYG リッチテキストエディター）
- Zustand + localStorage（状態管理・永続化）
- lucide-react（アイコン）
- zod（ランタイム検証）

## コマンド

```bash
npm run dev     # 開発サーバー起動
npm run build   # 本番ビルド
npm run lint    # ESLint
npm run test    # Vitest スモークテスト
npm run format  # Prettier
```

## やらないこと（現フェーズ）

- DB 接続・認証（データ保存は localStorage のみ）
- AI API の実呼び出し（モック関数を返す）
- ダークモード（ライトモード完成後に追加）
- 本文内への画像インライン挿入（アイキャッチ・セクション口絵のみ）
- Markdown 以外の書き出しフォーマット
