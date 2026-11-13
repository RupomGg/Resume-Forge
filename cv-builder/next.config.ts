import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Native/binary packages must not be bundled into the server build.
  serverExternalPackages: ["puppeteer", "puppeteer-core", "@sparticuz/chromium", "@libsql/client"],
  experimental: {
    serverActions: { bodySizeLimit: "2mb" }, // resume JSON may embed a photo
  },
  async redirects() {
    return [{ source: "/editor", destination: "/app/resumes", permanent: false }];
  },
};

export default nextConfig;
