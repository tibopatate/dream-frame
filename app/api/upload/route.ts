import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { put } from '@vercel/blob'
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'

// Max 50MB per file
const MAX_FILE_SIZE = 50 * 1024 * 1024

function validateMagicBytes(buffer: Buffer, originalFilename?: string): { valid: boolean; ext: string; mime: string } {
  if (buffer.length < 4) {
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

  // GIF: 47 49 46 38 (GIF87a / GIF89a)
  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x38) {
    return { valid: true, ext: '.gif', mime: 'image/gif' }
  }

  // WebP: 52 49 46 46 ... 57 45 42 50 (RIFF .... WEBP)
  if (
    buffer.length >= 12 &&
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

  // MP4 / QuickTime / AVIF / HEIC (ftyp container)
  if (buffer.length >= 8 && buffer[4] === 0x66 && buffer[5] === 0x74 && buffer[6] === 0x79 && buffer[7] === 0x70) {
    const subtype = buffer.slice(8, 12).toString('ascii').toLowerCase()
    if (subtype.includes('avif')) return { valid: true, ext: '.avif', mime: 'image/avif' }
    if (subtype.includes('heic') || subtype.includes('heif')) return { valid: true, ext: '.heic', mime: 'image/heic' }
    if (subtype.includes('qt')) return { valid: true, ext: '.mov', mime: 'video/quicktime' }
    return { valid: true, ext: '.mp4', mime: 'video/mp4' }
  }

  // WebM: 1A 45 DF A3
  if (buffer[0] === 0x1a && buffer[1] === 0x45 && buffer[2] === 0xdf && buffer[3] === 0xa3) {
    return { valid: true, ext: '.webm', mime: 'video/webm' }
  }

  // Fallback par extension de fichier reconnue
  if (originalFilename) {
    const ext = path.extname(originalFilename).toLowerCase()
    if (['.jpg', '.jpeg'].includes(ext)) return { valid: true, ext: '.jpg', mime: 'image/jpeg' }
    if (['.png'].includes(ext)) return { valid: true, ext: '.png', mime: 'image/png' }
    if (['.webp'].includes(ext)) return { valid: true, ext: '.webp', mime: 'image/webp' }
    if (['.gif'].includes(ext)) return { valid: true, ext: '.gif', mime: 'image/gif' }
    if (['.avif'].includes(ext)) return { valid: true, ext: '.avif', mime: 'image/avif' }
    if (['.heic', '.heif'].includes(ext)) return { valid: true, ext: '.heic', mime: 'image/heic' }
    if (['.mp4'].includes(ext)) return { valid: true, ext: '.mp4', mime: 'video/mp4' }
    if (['.mov'].includes(ext)) return { valid: true, ext: '.mov', mime: 'video/quicktime' }
    if (['.webm'].includes(ext)) return { valid: true, ext: '.webm', mime: 'video/webm' }
  }

  return { valid: false, ext: '', mime: '' }
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || ''
    
    // --- 1. VERCEL BLOB CLIENT UPLOAD ---
    // Géré directement par le SDK @vercel/blob/client
    if (contentType.includes('application/json')) {
      const body = (await req.json()) as HandleUploadBody
      try {
        const jsonResponse = await handleUpload({
          body,
          request: req,
          onBeforeGenerateToken: async (pathname) => {
            // Vérification Admin au moment de la génération du token par le navigateur
            const session = await auth()
            const userRole = (session?.user as any)?.role
            const isAdmin =
              userRole === 'ADMIN' ||
              req.cookies.get('admin-session')?.value ||
              req.cookies.get('next-auth.session-token')?.value ||
              req.cookies.get('__Secure-next-auth.session-token')?.value

            if (!isAdmin) {
              throw new Error('Non autorisé. Veuillez vous connecter en tant qu’administrateur.')
            }

            return {
              allowedContentTypes: [
                'image/jpeg',
                'image/png',
                'image/webp',
                'image/gif',
                'image/avif',
                'image/heic',
                'image/heif',
                'video/mp4',
                'video/webm',
                'video/quicktime',
              ],
              maximumSizeInBytes: MAX_FILE_SIZE,
            }
          },
          onUploadCompleted: async ({ blob }) => {
            console.log('Upload completed:', blob.url)
          },
        })
        return NextResponse.json(jsonResponse)
      } catch (err: any) {
        console.error('Vercel Blob handleUpload error:', err)
        if (err.message?.includes('private store')) {
          return NextResponse.json(
            { error: "Votre store Vercel Blob est en mode 'Privé'. Créez un Blob Store en mode 'Public' sur Vercel pour les images du site." },
            { status: 400 }
          )
        }
        return NextResponse.json({ error: err.message }, { status: 400 })
      }
    }

    // --- 2. FALLBACK LOCAL / MULTIPART FORMDATA ---
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

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Fichier trop volumineux. La taille maximale autorisée est de 50 Mo.' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { valid, ext, mime } = validateMagicBytes(buffer, file.name)
    if (!valid) {
      return NextResponse.json({ error: 'Format non supporté. Formats acceptés : JPG, PNG, WebP, GIF, AVIF, HEIC, MP4, MOV.' }, { status: 400 })
    }

    const safeFilename = `${crypto.randomUUID()}${ext}`

    // Essai Vercel Blob côté serveur si token configuré
    if (process.env.BLOB_READ_WRITE_TOKEN && !process.env.BLOB_READ_WRITE_TOKEN.includes('CHANGE_ME')) {
      try {
        const blobResult = await put(safeFilename, buffer, {
          access: 'public',
          contentType: mime,
        })
        return NextResponse.json({ url: blobResult.url, filename: safeFilename })
      } catch (blobErr: any) {
        console.error('Vercel Blob put failed:', blobErr)
        if (blobErr.message?.includes('private store')) {
          // En dev local, on bascule silencieusement sur le disque local pour ne pas bloquer l'utilisateur !
          if (process.env.NODE_ENV !== 'production' && process.env.VERCEL !== '1') {
            console.warn('Fallback disque local activé en développement.')
            const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
            if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })
            const filePath = path.join(uploadsDir, safeFilename)
            fs.writeFileSync(filePath, buffer)
            return NextResponse.json({ url: `/uploads/${safeFilename}`, filename: safeFilename })
          }

          return NextResponse.json({
            error: "Votre store Vercel Blob est en mode 'Privé'. Les images d'une boutique doivent être publiques : créez un Blob Store en mode 'Public' sur Vercel.",
          }, { status: 500 })
        }

        // Fallback local dev si erreur réseau
        if (process.env.NODE_ENV !== 'production' && process.env.VERCEL !== '1') {
          const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
          if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })
          const filePath = path.join(uploadsDir, safeFilename)
          fs.writeFileSync(filePath, buffer)
          return NextResponse.json({ url: `/uploads/${safeFilename}`, filename: safeFilename })
        }

        return NextResponse.json({ error: blobErr.message || 'Erreur lors du téléversement Vercel Blob.' }, { status: 500 })
      }
    }

    // Fallback disque local (développement local)
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
    return NextResponse.json({ error: err.message || 'Erreur lors du téléversement du fichier.' }, { status: 500 })
  }
}
