export type ArticleStatus = "draft" | "review" | "published"

export type WorkspaceState = "idle" | "loading" | "error" | "content"

export type HeadingLevel = "h1" | "h2" | "h3"

export type SourceType = "txt" | "url" | "pdf"

export interface Article {
  id: string
  title: string
  status: ArticleStatus
  shortDate: string
}

export interface Heading {
  id: string
  level: HeadingLevel
  text: string
}

export interface Source {
  id: string
  type: SourceType
  name: string
}

export interface SectionImage {
  id: string
  label: string
  size: string
}
