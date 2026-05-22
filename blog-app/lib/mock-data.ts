import type { Article, Heading, SectionImage, Source } from "@/lib/types"

export const MOCK_ARTICLES: Article[] = [
  { id: "1", title: "AI駆動型教育の未来：ChatGPTが変える学習体験", status: "draft",     shortDate: "5/14" },
  { id: "2", title: "生成AI時代のプロンプト設計入門",               status: "review",    shortDate: "5/11" },
  { id: "3", title: "Notion AIの使い方まとめ",                     status: "draft",     shortDate: "5/8"  },
  { id: "4", title: "Claude vs ChatGPT 徹底比較",                  status: "published", shortDate: "5/1"  },
  { id: "5", title: "RAGアーキテクチャ入門",                        status: "published", shortDate: "4/22" },
  { id: "6", title: "ベクトルDBの選び方",                           status: "published", shortDate: "4/15" },
]

export const MOCK_HEADINGS: Heading[] = [
  { id: "h-1", level: "h1", text: "AI駆動型教育の未来：ChatGPTが変える学習体験" },
  { id: "h-2", level: "h2", text: "ChatGPTとは何か" },
  { id: "h-3", level: "h3", text: "仕組みと技術背景" },
  { id: "h-4", level: "h3", text: "教育分野での活用例" },
  { id: "h-5", level: "h2", text: "学習体験の変化" },
  { id: "h-6", level: "h3", text: "個別最適化学習" },
  { id: "h-7", level: "h3", text: "フィードバックの高速化" },
  { id: "h-8", level: "h2", text: "課題とリスク" },
  { id: "h-9", level: "h2", text: "今後の展望" },
  { id: "h-10", level: "h2", text: "まとめ" },
]

export const MOCK_SOURCES: Source[] = [
  { id: "s1", type: "txt", name: "取材メモ.txt" },
  { id: "s2", type: "url", name: "openai.com/blog" },
  { id: "s3", type: "pdf", name: "研究論文.pdf" },
]

export const MOCK_SECTION_IMAGES: SectionImage[] = [
  { id: "img1", label: "ChatGPTとは", size: "1200×630" },
  { id: "img2", label: "学習体験の変化", size: "1200×630" },
]

export const MOCK_CONTENT = `近年、生成AIの急速な発展は教育分野においても大きな変革をもたらしている。特にOpenAIが開発したChatGPTは、その自然な対話能力と幅広い知識ベースにより、従来の教育ツールとは一線を画す存在として注目を集めている。

ChatGPTは、大規模言語モデル（LLM）を基盤とした対話型AIシステムである。GPT-4アーキテクチャを採用し、人間の言語を理解・生成する能力を持つ。教育場面では、質問への即時回答、個別化された説明、継続的なフィードバックを提供できる点が特に評価されている。

トランスフォーマーアーキテクチャと強化学習を組み合わせたRLHF（人間のフィードバックによる強化学習）訓練により、AIは文脈を理解した自然で一貫した応答を生成できる。このアプローチが、従来の検索型システムとの根本的な違いを生み出している。

世界中の教育機関が実験的な導入を進めている。ハーバード大学のCS50コースでは、AIティーチングアシスタントを配置し学生の質問対応を24時間体制で実現した事例が知られている。`
