import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function ConfirmacionPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-10 w-10 text-green-500" />
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">¡Seguimiento Agendado!</h1>

        <p className="text-gray-600 mb-6">
          Su cita para el primer seguimiento del programa CORAZÓN SEGURO ha sido registrada exitosamente. Hemos enviado
          los detalles a su número de contacto.
        </p>

        <div className="bg-red-50 p-4 rounded-lg mb-6 border border-red-100">
          <p className="text-sm text-gray-700">
            Por favor, llegue 10 minutos antes de su cita programada. Recuerde traer su documento de identidad y
            cualquier examen médico reciente.
          </p>
        </div>

        <Button asChild className="w-full bg-red-600 hover:bg-red-700">
          <Link href="/">Volver al Inicio</Link>
        </Button>
      </div>
      <footer className="w-full bg-gray-50 py-6 border-t border-gray-200 mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} CORAZÓN SEGURO. Todos los derechos reservados.</p>
          <p className="mt-2">
            Desarrollado por{" "}
            <a
              href="https://www.armandomi.space/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 hover:underline"
            >
              Armando Ovalle J.
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
