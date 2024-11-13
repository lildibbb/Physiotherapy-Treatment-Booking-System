import path from "node:path";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		TanStackRouterVite(),
		viteReact(),
		// ...,
	],
	server: {
		port: 3000,
		open: true,
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
