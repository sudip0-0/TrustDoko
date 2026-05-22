import path from "path";
import { fileURLToPath } from "url";
import type { NextConfig } from "next";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: projectRoot,
  experimental: {
    serverActions: {
      /** Allow proof uploads up to 5 MB plus form fields */
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
