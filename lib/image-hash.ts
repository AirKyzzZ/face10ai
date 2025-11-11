import crypto from 'crypto'

export function generateImageHash(buffer: Buffer): string {
  return crypto.createHash('sha256').update(buffer).digest('hex')
}

export async function hashImageFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  return generateImageHash(buffer)
}
