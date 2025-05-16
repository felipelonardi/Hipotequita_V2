import Link from "next/link"
import { X } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-gray-50 dark:bg-gray-900 dark:border-gray-800">
      <div className="container mx-auto py-4 px-4 flex flex-col items-center justify-center">
        <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
          &copy; 2025 - Felipe Lonardi -
          <Link
            href="https://www.linkedin.com/in/felipelonardi/"
            target="_blank"
            rel="noopener noreferrer"
            className="mx-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-bold"
          >
            LinkedIn
          </Link>
          -
          <Link
            href="https://x.com/hipotequita"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-bold flex items-center"
          >
            <X className="h-3.5 w-3.5 mx-1" /> @hipotequita
          </Link>
        </div>
      </div>
    </footer>
  )
}
