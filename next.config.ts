import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_ACTIONS === "true" || process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isGithubPages ? "/minassat-lissaniatarabia" : "",
  env: {
    NEXT_PUBLIC_BASE_PATH: isGithubPages ? "/minassat-lissaniatarabia" : "",
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
