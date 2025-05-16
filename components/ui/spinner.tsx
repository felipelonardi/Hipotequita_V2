import { cn } from "@/lib/utils"

interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl" | "custom"
  className?: string
  message?: string
}

export function Spinner({ size = "md", className, message }: SpinnerProps) {
  const sizeClasses = {
    sm: "h-6 w-6 border-2",
    md: "h-10 w-10 border-3",
    lg: "h-16 w-16 border-4",
    xl: "h-24 w-24 border-[6px]",
    custom: "h-18 w-18 border-[5px]", // 75% del tamaño xl (24px * 0.75 = 18px)
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={cn(
          "rounded-full animate-spin",
          "border-t-transparent",
          "border-purple-500 border-r-blue-500 border-b-blue-500 border-l-purple-500",
          sizeClasses[size],
          className,
        )}
      />
      {message && <p className="mt-4 text-gray-600 dark:text-gray-300 animate-pulse text-center">{message}</p>}
    </div>
  )
}
