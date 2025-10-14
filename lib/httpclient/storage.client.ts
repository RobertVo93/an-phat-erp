import type { SignedUrlParams, SignedUrlResult } from "@/types";
import { apiHref, createApiUrl } from "@/lib/httpclient/base";



export async function uploadFileClient(file: File, folder: string = "collections") {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const res = await fetch("/api/storage", {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to upload file");
  return res.json(); // Returns { url }
}