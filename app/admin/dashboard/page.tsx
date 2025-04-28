"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Calendar, Download, Search, Users, Trash } from "lucide-react"
import { useRegistros } from "@/lib/store"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import * as XLSX from "xlsx"

export default function AdminDashboardPage() {
  const { registros, eliminarRegistro } = useRegistros()
  const [searchTerm, setSearchTerm] = useState("")
  const [diaFilter, setDiaFilter] = useState("todos")

  // Filtrar reservas según los criterios de búsqueda
  const reservasFiltradas = registros.filter((reserva) => {
    const matchesSearch =
      reserva.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reserva.numeroDocumento.includes(searchTerm) ||
      reserva.numeroCelular.includes(searchTerm)

    const matchesDia = diaFilter === "todos" || reserva.dia === diaFilter

    return matchesSearch && matchesDia
  })

  // Estadísticas
  const totalReservas = registros.length
  const reservasDia5 = registros.filter((r) => r.dia === "5-mayo").length
  const reservasDia6 = registros.filter((r) => r.dia === "6-mayo").length
  const reservasConfirmadas = registros.filter((r) => r.estado === "confirmado").length

  // Reemplazar la función exportarExcel con esta versión compatible con navegadores
  const exportarExcel = () => {
    try {
      // Preparar los datos para Excel
      const datosExcel = reservasFiltradas.map((r) => ({
        ID: r.id,
        "Nombre Completo": r.nombreCompleto,
        Documento: r.numeroDocumento,
        Celular: r.numeroCelular,
        Día: r.dia === "5-mayo" ? "5 de Mayo" : "6 de Mayo",
        Hora: r.hora,
        Estado: r.estado.charAt(0).toUpperCase() + r.estado.slice(1),
        "Fecha de Registro": new Date(r.fechaRegistro).toLocaleString(),
      }))

      // Crear libro y hoja
      const libro = XLSX.utils.book_new()
      const hoja = XLSX.utils.json_to_sheet(datosExcel)

      // Añadir la hoja al libro
      XLSX.utils.book_append_sheet(libro, hoja, "Registros")

      // Convertir el libro a un array buffer
      const excelBuffer = XLSX.write(libro, { bookType: "xlsx", type: "array" })

      // Crear un Blob con el array buffer
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })

      // Crear URL para el blob
      const url = URL.createObjectURL(blob)

      // Crear un elemento de enlace para descargar
      const enlaceDescarga = document.createElement("a")
      enlaceDescarga.href = url
      enlaceDescarga.download = "Registros_Corazon_Seguro.xlsx"

      // Añadir el enlace al documento, hacer clic y luego eliminarlo
      document.body.appendChild(enlaceDescarga)
      enlaceDescarga.click()

      // Limpiar
      setTimeout(() => {
        document.body.removeChild(enlaceDescarga)
        URL.revokeObjectURL(url)
      }, 100)

      toast({
        title: "Exportación exitosa",
        description: "Los datos han sido exportados a Excel correctamente",
      })
    } catch (error) {
      console.error("Error al exportar a Excel:", error)
      toast({
        title: "Error al exportar",
        description: "No se pudieron exportar los datos. Intente nuevamente.",
        variant: "destructive",
      })
    }
  }

  // Obtener horarios ocupados por día
  const getHorariosOcupados = (dia: string) => {
    return registros
      .filter((r) => r.dia === dia)
      .reduce(
        (acc, registro) => {
          acc[registro.hora] = {
            nombre: registro.nombreCompleto,
            documento: registro.numeroDocumento,
            celular: registro.numeroCelular,
            estado: registro.estado,
          }
          return acc
        },
        {} as Record<string, { nombre: string; documento: string; celular: string; estado: string }>,
      )
  }

  const horariosOcupados5Mayo = getHorariosOcupados("5-mayo")
  const horariosOcupados6Mayo = getHorariosOcupados("6-mayo")

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-red-600 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <h1 className="text-xl font-bold text-gray-800">CORAZÓN SEGURO - Administración</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Monica</span>
            <Button asChild variant="ghost" size="sm">
              <Link href="/">Cerrar Sesión</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-red-600 hover:text-red-700 mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al inicio
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Reservas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-2xl font-bold">{totalReservas}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Reservas 5 de Mayo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-2xl font-bold">{reservasDia5}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Reservas 6 de Mayo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-2xl font-bold">{reservasDia6}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Confirmadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-2xl font-bold">{reservasConfirmadas}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="reservas" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="reservas">Reservas</TabsTrigger>
            <TabsTrigger value="horarios">Horarios</TabsTrigger>
          </TabsList>

          <TabsContent value="reservas" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Listado de Reservas</CardTitle>
                <CardDescription>Gestione todas las reservas registradas en el sistema</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Buscar por nombre, documento o celular..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div className="w-full md:w-48">
                    <Select value={diaFilter} onValueChange={setDiaFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filtrar por día" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos los días</SelectItem>
                        <SelectItem value="5-mayo">5 de Mayo</SelectItem>
                        <SelectItem value="6-mayo">6 de Mayo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full md:w-auto border-red-200 text-red-700 hover:bg-red-50"
                    onClick={exportarExcel}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar a Excel
                  </Button>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Nombre Completo</TableHead>
                        <TableHead>Documento</TableHead>
                        <TableHead>Celular</TableHead>
                        <TableHead>Día</TableHead>
                        <TableHead>Hora</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reservasFiltradas.length > 0 ? (
                        reservasFiltradas.map((reserva) => (
                          <TableRow key={reserva.id}>
                            <TableCell>{reserva.id}</TableCell>
                            <TableCell>{reserva.nombreCompleto}</TableCell>
                            <TableCell>{reserva.numeroDocumento}</TableCell>
                            <TableCell>{reserva.numeroCelular}</TableCell>
                            <TableCell>{reserva.dia === "5-mayo" ? "5 de Mayo" : "6 de Mayo"}</TableCell>
                            <TableCell>{reserva.hora}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  reserva.estado === "confirmado"
                                    ? "default"
                                    : reserva.estado === "pendiente"
                                      ? "outline"
                                      : "destructive"
                                }
                              >
                                {reserva.estado === "confirmado"
                                  ? "Confirmado"
                                  : reserva.estado === "pendiente"
                                    ? "Pendiente"
                                    : "Cancelado"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm" onClick={() => {
                                eliminarRegistro(reserva.id)
                                toast({ title: "Registro eliminado", description: `El registro con ID ${reserva.id} ha sido eliminado.` })
                              }}>
                                <Trash className="h-4 w-4 text-red-500" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-4 text-gray-500">
                            No se encontraron reservas con los criterios de búsqueda
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="horarios" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Horarios Disponibles</CardTitle>
                <CardDescription>Visualice la disponibilidad de horarios para cada día</CardDescription>
              </CardHeader>

              <CardContent>
                <Tabs defaultValue="5-mayo">
                  <TabsList className="mb-6">
                    <TabsTrigger value="5-mayo">5 de Mayo</TabsTrigger>
                    <TabsTrigger value="6-mayo">6 de Mayo</TabsTrigger>
                  </TabsList>

                  <TabsContent value="5-mayo">
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Hora</TableHead>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Documento</TableHead>
                            <TableHead>Celular</TableHead>
                            <TableHead>Estado</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {[
                            { id: 1, hora: "7:30:00 AM" },
                            { id: 2, hora: "8:00:00 AM" },
                            { id: 3, hora: "8:30:00 AM" },
                            { id: 4, hora: "9:00:00 AM" },
                            { id: 5, hora: "9:30:00 AM" },
                            { id: 6, hora: "10:30:00 AM" },
                            { id: 7, hora: "11:00:00 AM" },
                            { id: 8, hora: "11:30:00 AM" },
                            { id: 9, hora: "12:00:00 PM" },
                            { id: 10, hora: "12:30:00 PM" },
                            { id: 11, hora: "1:30 PM" },
                            { id: 12, hora: "2:00 PM" },
                            { id: 13, hora: "2:30 PM" },
                            { id: 14, hora: "3:00 PM" },
                            { id: 15, hora: "3:30 PM" },
                            { id: 16, hora: "4:00 PM" },
                            { id: 17, hora: "4:30 PM" },
                          ].map((horario) => {
                            const reserva = horariosOcupados5Mayo[horario.hora]
                            const reservado = !!reserva

                            return (
                              <TableRow key={horario.id}>
                                <TableCell>{horario.id}</TableCell>
                                <TableCell>{horario.hora}</TableCell>
                                <TableCell>{reservado ? reserva.nombre : "-"}</TableCell>
                                <TableCell>{reservado ? reserva.documento : "-"}</TableCell>
                                <TableCell>{reservado ? reserva.celular : "-"}</TableCell>
                                <TableCell>
                                  {reservado ? (
                                    <Badge
                                      variant={
                                        reserva.estado === "confirmado"
                                          ? "default"
                                          : reserva.estado === "pendiente"
                                            ? "outline"
                                            : "destructive"
                                      }
                                    >
                                      {reserva.estado === "confirmado"
                                        ? "Confirmado"
                                        : reserva.estado === "pendiente"
                                          ? "Pendiente"
                                          : "Cancelado"}
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline">Disponible</Badge>
                                  )}
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>

                  <TabsContent value="6-mayo">
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Hora</TableHead>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Documento</TableHead>
                            <TableHead>Celular</TableHead>
                            <TableHead>Estado</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {[
                            { id: 1, hora: "7:30:00 AM" },
                            { id: 2, hora: "8:00:00 AM" },
                            { id: 3, hora: "8:30:00 AM" },
                            { id: 4, hora: "9:00:00 AM" },
                            { id: 5, hora: "9:30:00 AM" },
                            { id: 6, hora: "10:30:00 AM" },
                            { id: 7, hora: "11:00:00 AM" },
                            { id: 8, hora: "11:30:00 AM" },
                            { id: 9, hora: "12:00:00 PM" },
                            { id: 10, hora: "12:30:00 PM" },
                            { id: 11, hora: "1:30 PM" },
                            { id: 12, hora: "2:00 PM" },
                            { id: 13, hora: "2:30 PM" },
                            { id: 14, hora: "3:00 PM" },
                            { id: 15, hora: "3:30 PM" },
                            { id: 16, hora: "4:00 PM" },
                            { id: 17, hora: "4:30 PM" },
                          ].map((horario) => {
                            const reserva = horariosOcupados6Mayo[horario.hora]
                            const reservado = !!reserva

                            return (
                              <TableRow key={horario.id}>
                                <TableCell>{horario.id}</TableCell>
                                <TableCell>{horario.hora}</TableCell>
                                <TableCell>{reservado ? reserva.nombre : "-"}</TableCell>
                                <TableCell>{reservado ? reserva.documento : "-"}</TableCell>
                                <TableCell>{reservado ? reserva.celular : "-"}</TableCell>
                                <TableCell>
                                  {reservado ? (
                                    <Badge
                                      variant={
                                        reserva.estado === "confirmado"
                                          ? "default"
                                          : reserva.estado === "pendiente"
                                            ? "outline"
                                            : "destructive"
                                      }
                                    >
                                      {reserva.estado === "confirmado"
                                        ? "Confirmado"
                                        : reserva.estado === "pendiente"
                                          ? "Pendiente"
                                          : "Cancelado"}
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline">Disponible</Badge>
                                  )}
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Toaster />
      <footer className="bg-gray-50 py-6 border-t border-gray-200 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p> {new Date().getFullYear()} CORAZÓN SEGURO. Todos los derechos reservados.</p>
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
