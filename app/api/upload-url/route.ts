import { NextRequest, NextResponse } from 'next/server'
import { getSignedUploadUrl } from '@/lib/s3'
import { env } from '@/constants/env'

export async function POST(req: NextRequest) {
  try {
    const { filename, contentType, pathname } = await req.json()
    if (!filename || !contentType) {
      return NextResponse.json({ error: 'Missing filename or contentType' }, { status: 400 })
    }
    // Optionally, add a folder or timestamp to the key
    const key = `${env.NEXT_PUBLIC_S3_ROOT_PATH}/${pathname}/${Date.now()}-${filename}`
    const { url } = await getSignedUploadUrl({ key, contentType })
    return NextResponse.json({ url, key })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
} 