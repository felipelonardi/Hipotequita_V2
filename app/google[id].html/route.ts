import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  // Crear el HTML de verificación de Google
  const googleVerificationHtml = `google-site-verification: google${id}.html`

  // Devolver el HTML con el tipo de contenido correcto
  return new NextResponse(googleVerificationHtml, {
    headers: {
      "Content-Type": "text/html",
    },
  })
}
