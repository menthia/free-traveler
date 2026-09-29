import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // MediaWiki imageinfo API로 확인한 실제 CDN 경로(해시 디렉터리 포함)만 사용한다
        // (Special:FilePath 리다이렉트는 동시 요청이 많을 때 429로 막혀 사용하지 않는다).
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
    ],
  },
};

export default nextConfig;
