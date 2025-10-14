import { NextResponse } from "next/server";
import { S3StorageProvider } from "@/lib/storage/s3Service";

export async function POST(req: Request) {
  try {
    // Parse the multipart/form-data (browser File uploads)
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "collections";

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // const s3 = new S3StorageProvider();
    // // Upload file to S3 location with folder structure
    // const url = await s3.uploadFile(file, folder);

    return NextResponse.json({ url: "https://www.google.com" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Upload failed" },
      { status: 500 }
    );
  }
}
