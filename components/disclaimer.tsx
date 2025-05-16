import { AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"

export function DisclaimerAlert() {
  return (
    <Alert className="bg-amber-50/70 border-amber-200/70 mb-2">
      <AlertTriangle className="h-4 w-4 text-amber-500" />
      <AlertDescription className="text-amber-700 text-sm">
        Este simulador ofrece resultados aproximados con fines informativos. No constituye una oferta de préstamo.{" "}
        <DisclaimerDialog />
      </AlertDescription>
    </Alert>
  )
}

export function DisclaimerDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="text-amber-700 p-0 h-auto font-medium underline">
          Ver aviso legal completo
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Aviso Legal - Simulador Hipotecario</DialogTitle>
          <DialogDescription>
            Por favor, lee atentamente esta información antes de utilizar el simulador.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300 max-h-[60vh] overflow-y-auto pr-2">
          <p>
            <strong>Fines informativos:</strong> Este simulador de préstamos hipotecarios es una herramienta con fines
            exclusivamente informativos y educativos.
          </p>
          <p>
            <strong>No constituye oferta:</strong> Los resultados obtenidos no constituyen una oferta, propuesta,
            aprobación ni recomendación de ningún producto financiero por parte de Hipotequita ni de las entidades
            financieras mencionadas.
          </p>
          <p>
            <strong>Resultados aproximados:</strong> Los cálculos son aproximados y están basados en la información
            disponible al momento de la simulación. Las tasas de interés, condiciones y requisitos pueden variar según
            cada entidad financiera y están sujetos a cambios sin previo aviso.
          </p>
          <p>
            <strong>Valores UVA:</strong> Las proyecciones de valores UVA son estimativas y no representan una
            predicción exacta de la inflación futura.
          </p>
          <p>
            <strong>Propiedades:</strong> La información sobre propiedades proviene de fuentes públicas y puede no estar
            actualizada. No garantizamos la disponibilidad, precio exacto ni condiciones de las propiedades mostradas.
          </p>
          <p>
            <strong>Consulta profesional:</strong> Para obtener información precisa y actualizada sobre préstamos
            hipotecarios, te recomendamos consultar directamente con las entidades financieras correspondientes y
            asesorarte con un profesional financiero o legal.
          </p>
          <p>
            <strong>Limitación de responsabilidad:</strong> Hipotequita no se responsabiliza por decisiones tomadas en
            base a la información proporcionada por este simulador, ni por errores, inexactitudes u omisiones en los
            cálculos o en la información mostrada.
          </p>
          <p>
            <strong>Uso de cookies y datos:</strong> Este sitio utiliza cookies y tecnologías similares para mejorar la
            experiencia del usuario. No compartimos información personal con terceros sin tu consentimiento.
          </p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button">Entendido</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Mantenemos esta función por si se necesita en el futuro, pero ya no se usa en el footer
export function DisclaimerFooter() {
  return (
    <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
      Los resultados son aproximados y con fines informativos. No constituyen una oferta de préstamo.{" "}
      <DisclaimerDialog />
    </p>
  )
}
