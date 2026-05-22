import { getCloudinary } from "@/lib/storage/cloudinary";
import { PROOF_SIGNED_URL_TTL_SECONDS } from "@/lib/storage/constants";

/**
 * Returns a time-limited signed URL for a private Cloudinary asset.
 * @param storageKey Cloudinary public_id stored on FileAsset
 * @param mimeType Used to pick resource_type for delivery
 */
export function getPrivateProofUrl(storageKey: string, mimeType: string): string {
  const cloudinary = getCloudinary();
  const resourceType = mimeType === "application/pdf" ? "raw" : "image";
  const expiresAt = Math.floor(Date.now() / 1000) + PROOF_SIGNED_URL_TTL_SECONDS;

  return cloudinary.url(storageKey, {
    resource_type: resourceType,
    type: "private",
    sign_url: true,
    secure: true,
    expires_at: expiresAt,
  });
}
