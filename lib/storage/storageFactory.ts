import { env } from '@/constants/env'
import { S3StorageProvider } from './s3Service'
import { MinioStorageProvider } from './minioService'
import type { SignedUrlParams, SignedUrlResult } from '@/types'

const STORAGE_PROVIDER = {
    s3: S3StorageProvider,
    minio: MinioStorageProvider,
}

const storageProvider: S3StorageProvider | MinioStorageProvider = new STORAGE_PROVIDER[env.NEXT_PUBLIC_STORAGE_TYPE]()
console.debug("test", storageProvider, env.NEXT_PUBLIC_STORAGE_TYPE)

export async function getPresignedUploadURLStorage(params: SignedUrlParams): Promise<SignedUrlResult> {
    return storageProvider.getPresignedUploadURL(params)
}

export async function getPresignedURLStorage(params: SignedUrlParams): Promise<SignedUrlResult> {
    return storageProvider.getPresignedURL(params)
}

export async function uploadFileStorage(file: File, presignedUrl: string): Promise<string> {
    console.debug("uploadFileStorage", storageProvider, env.NEXT_PUBLIC_STORAGE_TYPE, presignedUrl)
    return storageProvider.uploadFile(file, presignedUrl)
}

export async function deleteFileStorage(url: string): Promise<void> {
    return storageProvider.deleteFile(url)
}

