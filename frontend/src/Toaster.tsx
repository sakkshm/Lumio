"use client"
import type React from "react"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { useTheme } from "next-themes"

const Toaster = (props: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="bottom-right"
      richColors
      style={{
        "--normal-bg": "#111",
        "--normal-text": "#fff",
        "--normal-border": "#222",
      } as React.CSSProperties}
      {...props}
    />
  )
}

export default Toaster
