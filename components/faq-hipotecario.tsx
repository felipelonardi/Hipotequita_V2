import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"

export default function FaqHipotecario() {
  return (
    <Card className="border-pastel-purple/30 shadow-md hover:shadow-lg transition-shadow duration-300 bg-pastel-purple/5">
      <CardContent className="pt-4">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1" className="border-b border-pastel-purple/20">
            <AccordionTrigger className="text-base font-medium hover:text-pastel-purple hover:no-underline">
              <span className="flex items-center gap-2">
                <span className="bg-pastel-purple/20 text-pastel-purple/80 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </span>
                ¿Qué es un préstamo hipotecario UVA?
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-gray-700 dark:text-gray-300 pl-8">
              Es un crédito para comprar una vivienda donde el monto a pagar se ajusta según la inflación. UVA significa
              Unidad de Valor Adquisitivo, y su valor cambia todos los días.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="border-b border-pastel-purple/20">
            <AccordionTrigger className="text-base font-medium hover:text-pastel-purple hover:no-underline">
              <span className="flex items-center gap-2">
                <span className="bg-pastel-purple/20 text-pastel-purple/80 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </span>
                ¿Cómo funciona un préstamo UVA?
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-gray-700 dark:text-gray-300 pl-8">
              Pedís un monto en pesos, pero en realidad se convierte en UVAs. Cada mes pagás una cantidad fija de UVAs,
              pero el valor de cada UVA cambia con la inflación.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="border-b border-pastel-purple/20">
            <AccordionTrigger className="text-base font-medium hover:text-pastel-purple hover:no-underline">
              <span className="flex items-center gap-2">
                <span className="bg-pastel-purple/20 text-pastel-purple/80 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </span>
                ¿Qué pasa si sube la inflación?
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-gray-700 dark:text-gray-300 pl-8">
              Si la inflación sube, el valor de cada UVA también sube, por lo que la cuota que pagás se vuelve más cara.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="border-b border-pastel-purple/20">
            <AccordionTrigger className="text-base font-medium hover:text-pastel-purple hover:no-underline">
              <span className="flex items-center gap-2">
                <span className="bg-pastel-purple/20 text-pastel-purple/80 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </span>
                ¿Y si la inflación baja?
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-gray-700 dark:text-gray-300 pl-8">
              Si la inflación baja, la cuota también se mantiene más accesible porque el valor de los UVAs sube más
              lento.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5" className="border-b border-pastel-purple/20">
            <AccordionTrigger className="text-base font-medium hover:text-pastel-purple hover:no-underline">
              <span className="flex items-center gap-2">
                <span className="bg-pastel-purple/20 text-pastel-purple/80 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
                  5
                </span>
                ¿Es mejor un préstamo UVA o uno tradicional?
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-gray-700 dark:text-gray-300 pl-8">
              Los préstamos UVA tienen cuotas más bajas al inicio, pero pueden subir con la inflación. En cambio, los
              préstamos tradicionales tienen cuotas más altas desde el principio, pero más predecibles.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6" className="border-b border-pastel-purple/20">
            <AccordionTrigger className="text-base font-medium hover:text-pastel-purple hover:no-underline">
              <span className="flex items-center gap-2">
                <span className="bg-pastel-purple/20 text-pastel-purple/80 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
                  6
                </span>
                ¿Cómo se calcula el valor de la UVA?
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-gray-700 dark:text-gray-300 pl-8">
              El Banco Central actualiza el valor de la UVA todos los días según la inflación medida por el INDEC.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-7" className="border-b border-pastel-purple/20">
            <AccordionTrigger className="text-base font-medium hover:text-pastel-purple hover:no-underline">
              <span className="flex items-center gap-2">
                <span className="bg-pastel-purple/20 text-pastel-purple/80 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
                  7
                </span>
                ¿Puedo cancelar un préstamo UVA antes de tiempo?
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-gray-700 dark:text-gray-300 pl-8">
              Sí, podés hacer pagos anticipados o cancelarlo totalmente antes del tiempo pactado, aunque algunas
              entidades pueden cobrar un pequeño extra.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-8" className="border-b border-pastel-purple/20">
            <AccordionTrigger className="text-base font-medium hover:text-pastel-purple hover:no-underline">
              <span className="flex items-center gap-2">
                <span className="bg-pastel-purple/20 text-pastel-purple/80 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
                  8
                </span>
                ¿Hay algún límite para que la cuota no se dispare?
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-gray-700 dark:text-gray-300 pl-8">
              Algunas regulaciones establecen que si la cuota sube demasiado respecto a los sueldos, se pueden hacer
              ajustes para aliviar el pago.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-9" className="border-b border-pastel-purple/20">
            <AccordionTrigger className="text-base font-medium hover:text-pastel-purple hover:no-underline">
              <span className="flex items-center gap-2">
                <span className="bg-pastel-purple/20 text-pastel-purple/80 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
                  9
                </span>
                ¿Cuánto dinero puedo pedir en un préstamo UVA?
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-gray-700 dark:text-gray-300 pl-8">
              Depende del banco, tu sueldo y tu capacidad de pago. En general, los bancos prestan hasta el 25-30% de tus
              ingresos en cuota.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-10" className="border-b border-pastel-purple/20">
            <AccordionTrigger className="text-base font-medium hover:text-pastel-purple hover:no-underline">
              <span className="flex items-center gap-2">
                <span className="bg-pastel-purple/20 text-pastel-purple/80 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
                  10
                </span>
                ¿Qué pasa si no puedo pagar la cuota?
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-gray-700 dark:text-gray-300 pl-8">
              Si dejás de pagar, el banco puede ejecutar la hipoteca y quedarse con la propiedad. Si ves que la cuota se
              vuelve difícil de pagar, es clave hablar con el banco para buscar soluciones.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}
