import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 typescript: { ignoreBuildErrors: false }, // kalıcı olarak false kalsın, hata varsa düzeltelim
  eslint: { ignoreDuringBuilds: true }      // CI’da lintten bloklanmasın};
};

export default nextConfig;
