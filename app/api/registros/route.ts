import { NextRequest, NextResponse } from 'next/server'
import type { Registro } from "@/lib/store"
export const runtime = 'nodejs'

import fs from 'fs/promises'
import path from 'path'

const filePath = path.join(process.cwd(), 'data', 'registros.json')

export async function GET(req: NextRequest) {
  try {
    const json = await fs.readFile(filePath, 'utf-8')
    const registros: Registro[] = JSON.parse(json)
    return NextResponse.json(registros)
  } catch (error) {
    console.error('Error al leer registros:', error)
    return NextResponse.error()
  }
}

export async function POST(req: NextRequest) {
  try {
    const newRegistro = await req.json()
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || 'unknown'
    const json = await fs.readFile(filePath, 'utf-8')
    const registros: Registro[] = JSON.parse(json)
    const maxId = registros.reduce((max: number, r: Registro) => (r.id > max ? r.id : max), 0)
    const registro = {
      ip,
      id: maxId + 1,
      fechaRegistro: new Date().toISOString(),
      estado: 'confirmado',
      ...newRegistro,
    }
    registros.push(registro)
    await fs.writeFile(filePath, JSON.stringify(registros, null, 2))
    return NextResponse.json({ success: true, registro })
  } catch (error) {
    console.error('Error al agregar registro:', error)
    return NextResponse.error()
  }
}
