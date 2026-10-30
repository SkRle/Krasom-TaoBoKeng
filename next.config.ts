import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  experimental: {
    serverActions: {
      // รูปโปรไฟล์จำกัด 5MB + เผื่อข้อมูลฟอร์ม
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
