import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the default (non-cacheComponents) behaviour: this app has many
  // dynamic, per-tenant routes and must not be statically cached.
};

export default nextConfig;
