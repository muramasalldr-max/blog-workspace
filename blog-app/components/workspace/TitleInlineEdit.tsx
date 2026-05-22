"use client"

import { useRef, useState } from "react"

interface TitleInlineEditProps {
  initialTitle: string
  onSave: (title: string) => void
}

export function TitleInlineEdit({ initialTitle, onSave }: TitleInlineEditProps) {
  const [value, setValue] = useState(initialTitle)
  const [savedMessage, setSavedMessage] = useState("")
  const originalRef = useRef(initialTitle)

  function save() {
    const trimmed = value.trim()
    if (trimmed && trimmed !== originalRef.current) {
      onSave(trimmed)
      originalRef.current = trimmed
      setSavedMessage("タイトルを保存しました")
      setTimeout(() => setSavedMessage(""), 2000)
    }
  }

  function cancel() {
    setValue(originalRef.current)
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault()
            save()
            e.currentTarget.blur()
          }
          if (e.key === "Escape") {
            cancel()
            e.currentTarget.blur()
          }
        }}
        onBlur={save}
        aria-label="記事タイトル"
        className="w-full bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none rounded-md px-1 -mx-1 hover:bg-muted/60 focus:bg-muted/60 transition-colors"
        placeholder="タイトルを入力..."
      />
      <span
        role="status"
        aria-live="polite"
        className="sr-only"
      >
        {savedMessage}
      </span>
    </div>
  )
}
