import { env } from '@/constants/env'
import * as Minio from 'minio'
import { SignedUrlParams, SignedUrlResult } from '@/types'

export class MinioStorageProvider {
  private readonly minioClient: Minio.Client

  constructor() {
    this.minioClient = new Minio.Client({
        endPoint: env.NEXT_PUBLIC_MINIO_ENDPOINT,
        port: env.NEXT_PUBLIC_MINIO_PORT,
        useSSL: true,
        accessKey: env.NEXT_PUBLIC_MINIO_ACCESS_KEY_ID,
        secretKey: env.NEXT_PUBLIC_MINIO_SECRET_ACCESS_KEY,
      })
  }

  async getPresignedURL({ key, expires }: SignedUrlParams): Promise<SignedUrlResult> {
    try {
      const url = await this.minioClient.presignedGetObject(env.NEXT_PUBLIC_MINIO_BUCKET_NAME, key, expires)
      return { url, key }
    } catch (error) {
      throw new Error('Failed to generate signed MinIO URL: ' + (error as Error).message)
    }
  }

  async getPresignedUploadURL({ key }: SignedUrlParams): Promise<SignedUrlResult> {
    try {
      const url = await this.minioClient.presignedPutObject(env.NEXT_PUBLIC_MINIO_BUCKET_NAME, key, 120)
      return { url, key }
    } catch (error) {
      throw new Error('Failed to generate signed MinIO URL: ' + (error as Error).message)
    }
  }

  async uploadFile(file: File, url: string): Promise<string> {
    // 1. Get signed URL from API
    // const { url, key } = await this.getPresignedUploadURL(`${pathname}/${Date.now()}-${file.name}`)

    // 2. Upload file to MinIO
    const uploadRes = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    })
    if (!uploadRes.ok) throw new Error("File upload failed")
    // Return the public URL for 7 days
    // const publicUrl = await this.getPresignedURL({ key, expires: 7 * 24 * 60 * 60 })
    // return publicUrl.url
    return url
  }

  async deleteFile(url: string): Promise<void> {
    // // Extract the key from url
    // let key: string | undefined
    // const bucketUrl = env.NEXT_PUBLIC_MINIO_PUBLIC_URL || ""
    // if (url.startsWith(bucketUrl)) {
    //   key = url.replace(bucketUrl + "/", "")
    // } else {
    //   // Try to parse s3/minio style URLs
    //   try {
    //     const u = new URL(url)
    //     key = u.pathname.replace(/^\//, "")
    //   } catch {
    //     key = url
    //   }
    // }
    // if (!key) throw new Error("Invalid file URL for deletion")
    // await this.minioClient
    //   .deleteObject({
    //     Bucket: env.NEXT_PUBLIC_MINIO_BUCKET_NAME,
    //     Key: key,
    //   })
    //   .promise()
  }
}

