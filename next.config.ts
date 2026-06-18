import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "cdn.discordapp.com",
				pathname: "/avatars/**",
			},
			{
				protocol: "https",
				hostname: "cdn.discordapp.com",
				pathname: "/embed/avatars/**",
			},
			{
				protocol: "https",
				hostname: "pub-7c01c0c9dcf446fdbc33785dd711e81f.r2.dev",
			},
		],
	},
};

export default nextConfig;
