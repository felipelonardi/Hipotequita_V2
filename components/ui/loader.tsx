import type React from "react"
import { cn } from "@/lib/utils"

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
}

export function Loader({ size = "md", className, ...props }: LoaderProps) {
  const sizeClasses = {
    sm: "h-5 w-5 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  }

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-t-transparent",
        "bg-gradient-to-r from-purple-500 to-blue-500 border-t-white",
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  )
}
