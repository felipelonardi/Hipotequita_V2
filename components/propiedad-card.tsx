import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface PropiedadCardProps {
  propiedad: any
  onVerDetalle?: () => void
  children?: React.ReactNode
}

export function PropiedadCard({ propiedad, onVerDetalle, children }: PropiedadCardProps) {
  return (
    <Card className="overflow-hidden h-full flex flex-col dark:bg-gray-800 dark:border-gray-700">
      <CardContent className="p-0 flex flex-col h-full">
        <div className="relative h-[180px] w-full">
          <img
            src={propiedad.thumbnail || "/placeholder.svg?height=200&width=300"}
            alt="Propiedad"
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg?height=200&width=300"
            }}
          />
          <Badge className="absolute top-2 right-2 bg-green-600 text-xs">Apta crédito</Badge>
        </div>
        <div className="p-2 flex flex-col justify-center items-center">
          {children}
          <Button className="w-full text-sm mt-1" variant="outline" size="sm" asChild>
            <a href={propiedad.permalink} target="_blank" rel="noopener noreferrer">
              Ver
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
