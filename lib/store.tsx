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
}

const RegistroContext = createContext<RegistroContextType | undefined>(undefined)

// Proveedor del contexto
export function RegistroProvider({ children }: { children: ReactNode }) {
  const [registros, setRegistros] = useState<Registro[]>([])

  // Cargar registros del localStorage al iniciar
  useEffect(() => {
    const savedRegistros = localStorage.getItem("registros")
    if (savedRegistros) {
      try {
        setRegistros(JSON.parse(savedRegistros))
      } catch (error) {
        console.error("Error al cargar registros:", error)
      }
    }
  }, [])

  // Guardar registros en localStorage cuando cambian
  useEffect(() => {
    if (registros.length > 0) {
      localStorage.setItem("registros", JSON.stringify(registros))
    }
  }, [registros])

  // Verificar si ya existe un documento
  const existeDocumento = (documento: string): boolean => {
    return registros.some((reg) => reg.numeroDocumento === documento)
  }

  // Agregar un nuevo registro
  const agregarRegistro = async (
    nuevoRegistro: Omit<Registro, "id" | "fechaRegistro" | "estado">,
  ): Promise<{ success: boolean; message: string }> => {
    // Verificar si el documento ya existe
    if (existeDocumento(nuevoRegistro.numeroDocumento)) {
      return {
        success: false,
        message: "Este número de documento ya se encuentra registrado en el sistema.",
      }
    }

    // Verificar si el horario ya está ocupado para ese día
    const existeHorario = registros.some(
      (r) => r.dia === nuevoRegistro.dia && r.hora === nuevoRegistro.hora
    )
    if (existeHorario) {
      return {
        success: false,
        message: "Ese horario ya está reservado para ese día. Por favor, elija otro.",
      }
    }

    // Simular una demora de red
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Crear el nuevo registro con ID del 1 al 16
    const asignarId = () => {
      // Obtener IDs ya utilizados
      const idsUtilizados = registros.map((r) => r.id)

      // Buscar el primer ID disponible entre 1 y 16
      for (let i = 1; i <= 16; i++) {
        if (!idsUtilizados.includes(i)) {
          return i
        }
      }

      // Si todos los IDs del 1 al 16 están ocupados, usar el siguiente disponible
      return registros.length > 0 ? Math.max(...idsUtilizados) + 1 : 1
    }

    // Crear el nuevo registro
    const registro: Registro = {
      ...nuevoRegistro,
      id: asignarId(),
      fechaRegistro: new Date().toISOString(),
      estado: "confirmado",
    }

    // Agregar el registro a la lista
    setRegistros((prev) => [...prev, registro])

    return {
      success: true,
      message: "Registro completado con éxito.",
    }
  }

  return (
    <RegistroContext.Provider
      value={{
        registros,
        agregarRegistro,
        existeDocumento,
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
