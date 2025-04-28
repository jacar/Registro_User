"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Lock, User } from "lucide-react"
import Link from "next/link"

export default function AdminLoginPage() {
  const router = useRouter()
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCredentials((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validación básica
    if (!credentials.username || !credentials.password) {
      toast({
        title: "Error de inicio de sesión",
        description: "Por favor ingrese su nombre de usuario y contraseña",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Aquí iría la lógica de autenticación real
      // Por ahora simulamos un inicio de sesión exitoso con las nuevas credenciales
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (credentials.username === "Monica" && credentials.password === "123456") {
        toast({
          title: "Inicio de sesión exitoso",
          description: "Bienvenido al panel de administración",
        })

        // Redirigir al panel de administración
        setTimeout(() => {
          router.push("/admin/dashboard")
        }, 1000)
      } else {
        toast({
          title: "Error de inicio de sesión",
          description: "Credenciales incorrectas. Intente nuevamente.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error de inicio de sesión",
        description: "Ocurrió un problema al procesar su solicitud. Intente nuevamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">CORAZÓN SEGURO</CardTitle>
          <CardDescription className="text-center">Panel de Administración</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-base font-medium">
                <User className="h-4 w-4 inline mr-2" />
                Usuario
              </Label>
              <Input
                id="username"
                name="username"
                placeholder="Ingrese su nombre de usuario"
                value={credentials.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-base font-medium">
                <Lock className="h-4 w-4 inline mr-2" />
                Contraseña
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Ingrese su contraseña"
                value={credentials.password}
                onChange={handleChange}
                required
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>

            <div className="text-center">
              <Link href="/" className="text-sm text-red-600 hover:text-red-700">
                Volver al inicio
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
      <Toaster />
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
