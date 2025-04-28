"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Definir el tipo para un registro
export type Registro = {
  id: number
  nombreCompleto: string
  numeroDocumento: string
  numeroCelular: string
  dia: string
  hora: string
  estado: "confirmado" | "pendiente" | "cancelado"
  fechaRegistro: string
}

// Crear el contexto
type RegistroContextType = {
  registros: Registro[]
  agregarRegistro: (
    registro: Omit<Registro, "id" | "fechaRegistro" | "estado">,
  ) => Promise<{ success: boolean; message: string }>
  existeDocumento: (documento: string) => boolean
  eliminarRegistro: (id: number) => Promise<{ success: boolean; message?: string }>
}

const RegistroContext = createContext<RegistroContextType | undefined>(undefined)

// Proveedor del contexto
export function RegistroProvider({ children }: { children: ReactNode }) {
  const [registros, setRegistros] = useState<Registro[]>([])

  // Cargar registros desde la API al iniciar
  useEffect(() => {
    async function loadRegistros() {
      try {
        const res = await fetch('/api/registros')
        if (!res.ok) throw new Error('Error al cargar registros')
        const data: Registro[] = await res.json()
        setRegistros(data)
      } catch (error) {
        console.error('Error al cargar registros:', error)
      }
    }
    loadRegistros()
  }, [])

  // Verificar si ya existe un documento
  const existeDocumento = (documento: string): boolean => {
    return registros.some((reg) => reg.numeroDocumento === documento)
  }

  // Agregar un nuevo registro via API
  const agregarRegistro = async (
    nuevoRegistro: Omit<Registro, "id" | "fechaRegistro" | "estado">,
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch('/api/registros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoRegistro),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setRegistros((prev) => [...prev, data.registro])
        return { success: true, message: 'Registro completado con éxito.' }
      } else {
        return { success: false, message: data.message || 'Error al registrar' }
      }
    } catch (error) {
      console.error('Error al agregar registro:', error)
      return { success: false, message: 'Ocurrió un error al registrar' }
    }
  }

  // Función para eliminar un registro via API
  const eliminarRegistro = async (id: number) => {
    try {
      const res = await fetch(`/api/registros/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Error al eliminar registro')
      setRegistros((prev) => prev.filter((r) => r.id !== id))
      return { success: true }
    } catch (error) {
      console.error('Error al eliminar registro:', error)
      return { success: false, message: 'Ocurrió un error al eliminar' }
    }
  }

  return (
    <RegistroContext.Provider
      value={{
        registros,
        agregarRegistro,
        existeDocumento,
        eliminarRegistro,
      }}
    >
      {children}
    </RegistroContext.Provider>
  )
}

// Hook personalizado para usar el contexto
export function useRegistros() {
  const context = useContext(RegistroContext)
  if (context === undefined) {
    throw new Error("useRegistros debe ser usado dentro de un RegistroProvider")
  }
  return context
}
