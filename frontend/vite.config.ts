import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
	base: "",
	plugins: [react(),
	VitePWA({
		registerType: 'autoUpdate',
		devOptions: {
			enabled: false, // Deshabilita PWA en desarrollo para evitar cache en localhost
		},
		workbox: {
			maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB
		},
		manifest: {
			name: 'Alpha Sentinel',
			short_name: 'Alpha Sentinel',
			description: 'Alpha Sentinel es una plataforma innovadora de gestión de fondos mutuos que brinda transparencia, seguridad y control total a los inversores. Nuestra misión es ayudarte a tomar decisiones informadas con tecnología confiable y automatizada.',
			theme_color: '#7cb9e8',
			background_color: '#ffffff',
			display: 'standalone',
			icons: [
				{
					src: '/192.png',
					sizes: '192x192',
					type: 'image/png',
				},
				{
					src: '/512.png',
					sizes: '512x512',
					type: 'image/png',
				},
			],
		},
	}),
	],
	define: { "process.env": {} },
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
		},
	},

});
