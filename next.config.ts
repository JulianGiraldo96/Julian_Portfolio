import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        /* ToDone was called Decisive when this route first shipped, and the
           old link is already out in the world. */
        source: "/decisive/preview",
        destination: "/todone/preview",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
