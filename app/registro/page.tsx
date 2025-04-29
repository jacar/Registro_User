"use client"

import type React from "react"
import type { Registro } from "@/lib/store"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { ArrowLeft, Calendar, Clock, User } from "lucide-react"
import Link from "next/link"
import { useRegistros } from "@/lib/store"

const horarios = [
  { id: 1, hora: "7:30:00 AM" },
  { id: 2, hora: "8:00:00 AM" },
  { id: 3, hora: "8:30:00 AM" },
  { id: 4, hora: "9:00:00 AM" },
  { id: 5, hora: "9:30:00 AM" },
  // Descanso
  { id: 6, hora: "10:30:00 AM" },
  { id: 7, hora: "11:00:00 AM" },
  { id: 8, hora: "11:30:00 AM" },
  { id: 9, hora: "12:00:00 PM" },
  { id: 10, hora: "12:30:00 PM" },
  // Almuerzo
  { id: 11, hora: "1:30 PM" },
  { id: 12, hora: "2:00 PM" },
  { id: 13, hora: "2:30 PM" },
  { id: 14, hora: "3:00 PM" },
  { id: 15, hora: "3:30 PM" },
  { id: 16, hora: "4:00 PM" },
  { id: 17, hora: "4:30 PM" },
]

export default function RegistroPage() {
  const router = useRouter()
  const { agregarRegistro, existeDocumento, registros } = useRegistros()

  const [formData, setFormData] = useState({
    nombreCompleto: "",
    numeroDocumento: "",
    numeroCelular: "",
    dia: "",
    horarioId: "",
  })

  const [loading, setLoading] = useState(false)

  const [selectedRegistro, setSelectedRegistro] = useState<Registro | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDiaChange = (value: string) => {
    setFormData((prev) => ({ ...prev, dia: value }))
  }

  const handleHorarioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, horarioId: value }))
  }

  const handleViewRegistro = (registro: Registro) => setSelectedRegistro(registro)

  // Validar documento en tiempo real
  const validarDocumento = () => {
    if (formData.numeroDocumento && existeDocumento(formData.numeroDocumento)) {
      return "Este número de documento ya está registrado"
    }
    return null
  }

  const documentoError = validarDocumento()

  // Obtener horarios ocupados para el día seleccionado
  const horariosOcupados = formData.dia
    ? registros.filter((r) => r.dia === formData.dia).map((r) => r.hora)
    : []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validación básica
    if (
      !formData.nombreCompleto ||
      !formData.numeroDocumento ||
      !formData.numeroCelular ||
      !formData.dia ||
      !formData.horarioId
    ) {
      toast({
        title: "Error en el formulario",
        description: "Por favor complete todos los campos requeridos",
        variant: "destructive",
      })
      return
    }

    // Validar si el documento ya existe
    if (documentoError) {
      toast({
        title: "Error de registro",
        description: documentoError,
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Obtener la hora seleccionada
      const horarioSeleccionado = horarios.find((h) => h.id.toString() === formData.horarioId)

      if (!horarioSeleccionado) {
        throw new Error("Horario no válido")
      }

      // Validar si el horario está ocupado antes de enviar (doble validación)
      const ocupado = registros.some(
        (r) => r.dia === formData.dia && r.hora === horarioSeleccionado.hora
      )
      if (ocupado) {
        toast({
          title: "Horario no disponible",
          description: "La fecha y hora seleccionadas ya fueron reservadas. Por favor, elija otra combinación y vuelva a llenar el formulario.",
          variant: "destructive",
        })
        // Limpiar selección de horario y día para forzar al usuario a volver a elegir
        setFormData((prev) => ({ ...prev, dia: "", horarioId: "" }))
        return
      }

      // Agregar el registro
      const resultado = await agregarRegistro({
        nombreCompleto: formData.nombreCompleto,
        numeroDocumento: formData.numeroDocumento,
        numeroCelular: formData.numeroCelular,
        dia: formData.dia,
        hora: horarioSeleccionado.hora,
      })

      if (resultado.success) {
        toast({
          title: "Registro exitoso",
          description: "Su cita ha sido registrada correctamente",
        })

        // Redirigir a una página de confirmación
        setTimeout(() => {
          router.push("/confirmacion")
        }, 2000)
      } else {
        toast({
          title: "Error al registrar",
          description: resultado.message,
          variant: "destructive",
        })
        // Si el error es por horario ocupado, limpiar selección para forzar nueva elección
        if (resultado.message && resultado.message.includes("horario ya está reservado")) {
          setFormData((prev) => ({ ...prev, dia: "", horarioId: "" }))
        }
      }
    } catch (error) {
      toast({
        title: "Error al registrar",
        description: "Ocurrió un problema al procesar su solicitud. Intente nuevamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-red-600 hover:text-red-700 mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al inicio
        </Link>

        <Card className="max-w-2xl mx-auto">
          <CardHeader className="bg-gradient-to-r from-red-600 to-red-800 text-white rounded-t-lg">
            <CardTitle className="text-2xl">Agendar Seguimiento</CardTitle>
            <CardDescription className="text-red-50">
              Complete sus datos para su primer control cardiovascular
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nombreCompleto" className="text-base font-medium">
                    <User className="h-4 w-4 inline mr-2" />
                    Nombre Completo *
                  </Label>
                  <Input
                    id="nombreCompleto"
                    name="nombreCompleto"
                    placeholder="Ingrese su nombre completo"
                    value={formData.nombreCompleto}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numeroDocumento" className="text-base font-medium">
                    Número de Documento *
                  </Label>
                  <Input
                    id="numeroDocumento"
                    name="numeroDocumento"
                    placeholder="Ingrese su número de documento"
                    value={formData.numeroDocumento}
                    onChange={handleChange}
                    required
                    className={documentoError ? "border-red-500" : ""}
                  />
                  {documentoError && <p className="text-sm text-red-500 mt-1">{documentoError}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numeroCelular" className="text-base font-medium">
                    Número Celular *
                  </Label>
                  <Input
                    id="numeroCelular"
                    name="numeroCelular"
                    placeholder="Ingrese su número de celular"
                    value={formData.numeroCelular}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="mb-4">
                  <Label className="text-base font-medium flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Seleccione el día *
                  </Label>
                </div>

                <RadioGroup
                  value={formData.dia}
                  onValueChange={handleDiaChange}
                  className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4"
                >
                  <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-red-50 cursor-pointer">
                    <RadioGroupItem value="5-mayo" id="dia-5" />
                    <Label htmlFor="dia-5" className="cursor-pointer">
                      5 de Mayo
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-red-50 cursor-pointer">
                    <RadioGroupItem value="6-mayo" id="dia-6" />
                    <Label htmlFor="dia-6" className="cursor-pointer">
                      6 de Mayo
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="border-t pt-4">
                <div className="mb-4">
                  <Label className="text-base font-medium flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Seleccione el horario *
                  </Label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {horarios.map((horario) => {
                    const ocupado = horariosOcupados.includes(horario.hora) || horario.id === 10 || horario.id === 5
                    return (
                      <div key={horario.id} className="relative">
                        <div
                          className={`
                            border rounded-md p-3 hover:bg-red-50 cursor-pointer
                            ${formData.horarioId === horario.id.toString() ? "border-red-500 bg-red-50" : ""}
                            ${ocupado ? "opacity-50 cursor-not-allowed" : ""}
                          `}
                          onClick={() => {
                            if (!ocupado) handleHorarioChange(horario.id.toString())
                          }}
                        >
                          <div className="flex items-center">
                            <Checkbox
                              id={`horario-${horario.id}`}
                              checked={formData.horarioId === horario.id.toString()}
                              onCheckedChange={() => {
                                if (!ocupado) handleHorarioChange(horario.id.toString())
                              }}
                              className="mr-2"
                              disabled={ocupado}
                            />
                            <Label htmlFor={`horario-${horario.id}`} className={`cursor-pointer ${ocupado ? "line-through text-gray-400" : ""}`}>
                              {horario.id === 10 || horario.id === 5 ? "" : horario.hora}
                              {(ocupado && horario.id !== 10 && horario.id !== 5) && " (Ocupado)"}
                            </Label>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
                {loading ? "Procesando..." : "Confirmar Reserva"}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                Al registrarse, acepta nuestros términos y condiciones de servicio.
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
      <Toaster />
      {registros.length > 0 && (
        <div className="container mx-auto px-4 mt-10">
          <h2 className="text-xl font-semibold mb-4">Registros Existentes</h2>
          <ul className="space-y-2">
            {registros.map((r) => (
              <li key={r.id} className="flex justify-between items-center p-4 bg-white rounded shadow">
                <span>{`${r.nombreCompleto} - ${r.dia} ${r.hora}`}</span>
                <Button variant="outline" size="sm" onClick={() => handleViewRegistro(r)}>
                  Ver
                </Button>
              </li>
            ))}
          </ul>
          {selectedRegistro && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Detalle Registro #{selectedRegistro.id}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>Nombre:</strong> {selectedRegistro.nombreCompleto}</p>
                <p><strong>Documento:</strong> {selectedRegistro.numeroDocumento}</p>
                <p><strong>Celular:</strong> {selectedRegistro.numeroCelular}</p>
                <p><strong>Fecha:</strong> {selectedRegistro.dia}</p>
                <p><strong>Hora:</strong> {selectedRegistro.hora}</p>
                <p><strong>Registrado en:</strong> {new Date(selectedRegistro.fechaRegistro).toLocaleString()}</p>
                <p><strong>Estado:</strong> {selectedRegistro.estado}</p>
              </CardContent>
              <CardFooter>
                <Button size="sm" onClick={() => setSelectedRegistro(null)}>Cerrar</Button>
              </CardFooter>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
