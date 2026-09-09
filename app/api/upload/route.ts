import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { put } from '@vercel/blob'

// Max 50MB per file
const MAX_FILE_SIZE = 50 * 1024 * 1024

function validateMagicBytes(buffer: Buffer): { valid: boolean; ext: string; mime: string } {
  if (buffer.length < 12) {
    return { valid: false, ext: '', mime: '' }
  }

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { valid: true, ext: '.jpg', mime: 'image/jpeg' }
  }

  // PNG: 89 50 4E 47
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
    return { valid: true, ext: '.png', mime: 'image/png' }
  }

  // WebP: 52 49 46 46 ... 57 45 42 50 (RIFF .... WEBP)
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return { valid: true, ext: '.webp', mime: 'image/webp' }
  }

  // MP4 / QuickTime (ftyp)
  if (buffer.length >= 8 && buffer[4] === 0x66 && buffer[5] === 0x74 && buffer[6] === 0x79 && buffer[7] === 0x70) {
    return { valid: true, ext: '.mp4', mime: 'video/mp4' }
  }

  // WebM: 1A 45 DF A3
  if (buffer[0] === 0x1a && buffer[1] === 0x45 && buffer[2] === 0xdf && buffer[3] === 0xa3) {
    return { valid: true, ext: '.webm', mime: 'video/webm' }
  }

  return { valid: false, ext: '', mime: '' }
}

export async function POST(req: NextRequest) {
  try {
    // 1. Mandatory Admin Authentication
    const session = await auth()
    const userRole = (session?.user as any)?.role
    const isAdmin =
      userRole === 'ADMIN' ||
      req.cookies.get('admin-session')?.value ||
      req.cookies.get('next-auth.session-token')?.value ||
      req.cookies.get('__Secure-next-auth.session-token')?.value

    if (!isAdmin) {
      return NextResponse.json({ error: 'Non autorisé. Veuillez vous connecter en tant qu’administrateur.' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier reçu.' }, { status: 400 })
    }

    // 2. File size validation
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Fichier trop volumineux. La taille maximale autorisée est de 10 Mo.' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // 3. Magic bytes validation (prevent malicious mime spoofing)
    const { valid, ext, mime } = validateMagicBytes(buffer)
    if (!valid) {
      return NextResponse.json({ error: 'Format non supporté. Seuls JPEG, PNG, WebP, MP4 et WebM sont autorisés.' }, { status: 400 })
    }

    // 4. Regenerate safe filename (prevents directory traversal attacks)
    const safeFilename = `${crypto.randomUUID()}${ext}`

    // 5. Storage handling (Vercel Blob in production, local storage in dev / fallback)
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN
    const isBlobConfigured = blobToken && !blobToken.includes('CHANGE_ME')

    if (isBlobConfigured) {
      try {
        const blobResult = await put(safeFilename, buffer, {
          access: 'public',
          contentType: mime,
        })
        return NextResponse.json({ url: blobResult.url, filename: safeFilename })
      } catch (blobErr: any) {
        console.error('Vercel Blob upload failed, falling back to local:', blobErr)
      }
    }

    // Fallback: Local filesystem storage under public/uploads/
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }

    const filePath = path.join(uploadsDir, safeFilename)
    fs.writeFileSync(filePath, buffer)

    return NextResponse.json({
      url: `/uploads/${safeFilename}`,
      filename: safeFilename,
    })
  } catch (err: any) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: err.message || 'Erreur lors de l’envoi de l’image.' }, { status: 500 })
  }
}
