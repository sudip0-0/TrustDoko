import { v2 as cloudinary } from "cloudinary";

import { getCloudinaryConfig } from "@/lib/storage/config";

let configured = false;

export function getCloudinary() {
  if (!configured) {
    const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
    configured = true;
  }
  return cloudinary;
}
