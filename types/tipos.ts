export interface Banco {
  id: string
  nombre: string
  tasaAnual: number
  tasaAnualConSueldo: number
  financiacionMaxima: number
  logo?: string
}

export interface ResultadoCalculo {
  cuotaMensualPesos: number
  cuotaMensualUVA: number
  montoTotalPesos: number
  montoTotalUVA: number
  proyeccion: ProyeccionCuota[]
}

export interface ProyeccionCuota {
  mes: number
  fecha: Date
  cuotaPesos: number
  cuotaUVA: number
  amortizacion: number
  interes: number
  saldoCapital: number
  valorUVA: number
}

export interface Propiedad {
  id: string
  titulo: string
  precioDolares: number
  moneda?: string
  ubicacion: string
  ambientes: number
  dormitorios: number
  cochera: boolean
  metrosCubiertos: number
  metrosTotales: number
  aptaCredito: boolean
  imagen: string
  thumbnail: string
  plataforma: string
  url: string
  operacion: string
}
