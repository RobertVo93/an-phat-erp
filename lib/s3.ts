import { env } from '@/constants/env'
import AWS from 'aws-sdk'
import { withApiBase } from '@/lib/base-path'

const s3 = new AWS.S3({
  accessKeyId: env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
  secretAccessKey: env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  region: env.NEXT_PUBLIC_AWS_REGION,
  signatureVersion: 'v4',
})


export interface SignedUrlParams {
  key: string
  contentType: string
}

export interface SignedUrlResult {
  url: string
  key: string
}

export async function getSignedUploadUrl({ key, contentType }: SignedUrlParams): Promise<SignedUrlResult> {
  const params = {
    Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME,
    Key: key,
    Expires: 60, // seconds
    ContentType: contentType,
  }
  try {
    const url = await s3.getSignedUrlPromise('putObject', params)
    return { url, key }
  } catch (error) {
    throw new Error('Failed to generate signed S3 URL: ' + (error as Error).message)
  }
}

// Reusable client-side upload helper
export async function uploadFileToS3(file: File, pathname: string): Promise<string> {
  try {
    // 1. Get signed URL from API
    const res = await fetch(withApiBase("/api/upload-url"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: file.name, contentType: file.type, pathname, file: file }),
    })
    if (!res.ok) throw new Error("Failed to get upload URL")
    const { url, key } = await res.json()

    // 2. Upload file to S3
    const uploadRes = await fetch(url, {
      method: "PUT",
      headers: { 
        "Content-Type": file.type,
      },
      body: file,
    })
    if (!uploadRes.ok) throw new Error("Failed to upload to S3")

    // 3. Return public S3 URL
    
    if (!env.NEXT_PUBLIC_S3_BUCKET_NAME || !env.NEXT_PUBLIC_AWS_REGION) throw new Error("Missing S3 bucket or region env")
    const publicUrl = `https://${env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`
    return publicUrl
  } catch (err) {
    console.error(err)
    throw err
  }
}

export async function deleteFileFromS3(url: string): Promise<void> {
  try {
    if (!url) return

    const key = env.NEXT_PUBLIC_S3_ROOT_PATH + "/" + url.split(`/${env.NEXT_PUBLIC_S3_ROOT_PATH}/`)[1]
    const params = {
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME,
      Key: key,
    }
    await s3.deleteObject(params).promise()
  } catch (error) {
    throw new Error('Failed to delete file from S3: ' + (error as Error).message)
  }
}
