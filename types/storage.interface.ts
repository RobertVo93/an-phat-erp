
export interface SignedUrlParams {
    key: string
    contentType?: string
    expires?: number
}

export interface SignedUrlResult {
    url: string
    key: string
}