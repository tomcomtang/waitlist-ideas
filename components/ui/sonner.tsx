"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:!bg-white/[0.08] group-[.toaster]:dark:!bg-black/[0.15] group-[.toaster]:!text-white/90 group-[.toaster]:!border-border/30 group-[.toaster]:!shadow-2xl group-[.toaster]:!backdrop-blur-xl group-[.toaster]:!rounded-3xl group-[.toaster]:!border group-[.toaster]:!border-white/20 group-[.toaster]:!px-5 group-[.toaster]:!py-4 group-[.toaster]:!text-center",
          description: "group-[.toast]:!text-white/70 group-[.toast]:!opacity-90",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-2xl group-[.toast]:backdrop-blur-sm",
          cancelButton:
            "group-[.toast]:bg-muted/80 group-[.toast]:text-muted-foreground group-[.toast]:rounded-2xl group-[.toast]:backdrop-blur-sm",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
