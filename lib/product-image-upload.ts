import { deleteFileFromS3, uploadFileToS3 } from "@/lib/s3";
import { base64ToFile } from "@/lib/utils";
import type { Product, ProductFormData } from "@/types/product";

const PRODUCT_IMAGE_PATH = "products";

const isDataImage = (value?: string): value is string => {
  return typeof value === "string" && value.startsWith("data:");
};

const normalizeImages = (images?: string[]): string[] => {
  return (images || []).filter((image) => typeof image === "string" && image.trim().length > 0);
};

const uploadImageIfNeeded = async (image: string | undefined, filename: string): Promise<string | undefined> => {
  if (!isDataImage(image)) {
    return image;
  }

  const file = base64ToFile(image, filename);
  return uploadFileToS3(file, PRODUCT_IMAGE_PATH);
};

const deleteImageIfSafe = async (image?: string): Promise<void> => {
  if (!image || isDataImage(image)) {
    return;
  }

  await deleteFileFromS3(image);
};

export async function prepareProductImagesForSubmit(
  data: ProductFormData,
  previousProduct?: Product | null,
): Promise<ProductFormData> {
  const nextData: ProductFormData = {
    ...data,
    subImages: normalizeImages(data.subImages),
  };

  const previousImage = previousProduct?.image;
  const previousSubImages = normalizeImages(previousProduct?.subImages);

  const uploadedMainImage = await uploadImageIfNeeded(nextData.image, "product-image.png");
  const uploadedSubImages = await Promise.all(
    normalizeImages(nextData.subImages).map((image, index) =>
      uploadImageIfNeeded(image, `product-sub-image-${index + 1}.png`),
    ),
  );

  nextData.image = uploadedMainImage;
  nextData.subImages = uploadedSubImages.filter((image): image is string => Boolean(image));

  if (previousImage && previousImage !== nextData.image) {
    await deleteImageIfSafe(previousImage);
  }

  const nextSubImageSet = new Set(nextData.subImages);
  await Promise.all(
    previousSubImages
      .filter((image) => !nextSubImageSet.has(image))
      .map((image) => deleteImageIfSafe(image)),
  );

  return nextData;
}

export async function deleteProductImages(product?: Product | null): Promise<void> {
  if (!product) {
    return;
  }

  await Promise.all([
    deleteImageIfSafe(product.image),
    ...normalizeImages(product.subImages).map((image) => deleteImageIfSafe(image)),
  ]);
}
