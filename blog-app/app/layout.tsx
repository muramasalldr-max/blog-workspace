import type { Metadata } from "next"
import { Noto_Serif_JP } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

const notoSerifJP = Noto_Serif_JP({
  weight: ["400", "700"],
  preload: false,
  variable: "--font-editor",
})

export const metadata: Metadata = {
  title: "Blog Workspace",
  description: "AI-assisted blog content creation workspace",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ja"
      suppressHydrationWarning
      className={cn("antialiased font-sans", notoSerifJP.variable)}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
