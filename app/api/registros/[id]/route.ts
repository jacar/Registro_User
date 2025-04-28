import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const filePath = path.join(process.cwd(), 'data', 'registros.json')

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10)
    const json = await fs.readFile(filePath, 'utf-8')
    const registros = JSON.parse(json)
    const updated = registros.filter((r: any) => r.id !== id)
    await fs.writeFile(filePath, JSON.stringify(updated, null, 2))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error al eliminar registro:', error)
    return NextResponse.error()
  }
}
