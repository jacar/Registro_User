import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="w-full bg-white">
        <div className="container mx-auto px-4">
          <div className="relative w-full">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/banner%20%281%29-kaXHzLYthSIFqx7ygL4jWoiTEzamuT.png"
              alt="Primer seguimiento CORAZÓN SEGURO - 05 y 06 de Mayo"
              width={1200}
              height={200}
              className="w-full h-auto"
              priority
            />
            <Link
              href="/registro"
              className="absolute right-[140px] bottom-[30px] md:right-[140px] md:bottom-[30px] z-10 hover:opacity-90 transition-opacity"
              aria-label="Ir a registro"
            >
              <span className="sr-only">Registrarse</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="bg-white rounded-lg shadow-xl p-8 border border-gray-100 relative overflow-hidden">
            <div className="absolute -right-12 -top-12 w-40 h-40 bg-red-100 rounded-full opacity-30"></div>
            <div className="absolute -left-12 -bottom-12 w-40 h-40 bg-red-100 rounded-full opacity-30"></div>

            <div className="mb-8 relative z-10">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-red-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Programa de Seguimiento Cardiovascular</h2>
              <p className="text-gray-600">Cuidamos tu corazón con seguimiento personalizado</p>
            </div>

            <div className="space-y-4 relative z-10">
              <Button asChild className="w-full py-6 text-lg bg-red-600 hover:bg-red-700 border-none">
                <Link href="/registro">Agendar Seguimiento</Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="w-full py-6 text-lg border-red-200 text-red-700 hover:bg-red-50"
              >
                <Link href="/admin">Acceso Administrador</Link>
              </Button>
            </div>
          </div>

          <div className="mt-8 text-sm text-gray-500">
            <p>Para soporte técnico, contacte al administrador del sistema</p>
          </div>
        </div>
      </main>

      <footer className="bg-gray-50 py-6 border-t border-gray-200">
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
