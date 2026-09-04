// صورة المشاركة ككل — مستقلة تماماً عن صور الكتل وعن وسائل الدعم.
// مصدرها إمّا رفع الأسرة (مخزنها الخاص) أو صورة من مكتبة الصور الجاهزة.
// لا خدمة صور خارجية جديدة، ولا أي مساس بمحتوى المكتبة المرجعية.

import { peekUploadedUrl } from "@/features/space/family-uploads";
import { resolveStepImage } from "@/features/space/step-image";
import type { LabParticipationImage } from "@/lab/slice/types";

export function participationImageSrc(image: LabParticipationImage | null | undefined): string | null {
  if (!image) return null;
  if (image.source === "family_upload") {
    return image.uploadedPath ? peekUploadedUrl(image.uploadedPath) : null;
  }
  return image.assetCode ? resolveStepImage({ sourceAssetCode: image.assetCode }).src : null;
}

export function participationImagePaths(
  image: LabParticipationImage | null | undefined,
): string[] {
  return image?.source === "family_upload" && image.uploadedPath ? [image.uploadedPath] : [];
}
