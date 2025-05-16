import { Loader } from "@/components/ui/loader"

interface BancoLoaderProps {
  bancoId?: string | null
}

export function BancoLoader({ bancoId }: BancoLoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader size="lg" />
      <p className="text-gray-600 dark:text-gray-300 animate-pulse mt-4">
        {bancoId ? `Cargando simulador para ${getBancoName(bancoId)}...` : "Cargando simulador..."}
      </p>
    </div>
  )
}

// Función auxiliar para obtener el nombre del banco a partir de su ID
function getBancoName(bancoId: string): string {
  const bancoNames: Record<string, string> = {
    hipotecario: "Banco Hipotecario",
    ciudad: "Banco Ciudad",
    supervielle: "Banco Supervielle",
    icbc: "ICBC",
    brubank: "Brubank",
    nacion: "Banco Nación",
    santander: "Santander",
    macro: "Banco Macro",
    bbva: "BBVA",
    galicia: "Banco Galicia",
    patagonia: "Banco Patagonia",
    credicoop: "Banco Credicoop",
    sol: "Banco del Sol",
  }

  return bancoNames[bancoId] || "el banco seleccionado"
}
