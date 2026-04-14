import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import * as esbuild from "esbuild";
import apiRoutes from "vite-plugin-api-routes";

function extractHostname(value: string): string {
	try {
		if (value.includes("://")) {
			return new URL(value).host;
		}
		return value;
	} catch {
		return value;
	}
}

function serverBundlePlugin(): Plugin {
	let built = false;
	return {
		name: "server-bundle",
		apply: "build",
		closeBundle: async () => {
			if (built) return;
			built = true;
			console.log("Bundling server code with esbuild...");
			await esbuild.build({
				entryPoints: [path.resolve(__dirname, "dist", "app.js")],
				bundle: true,
				platform: "node",
				target: "node22",
				format: "esm",
				outfile: path.resolve(__dirname, "dist", "server.bundle.mjs"),
				packages: "bundle",
				sourcemap: true,
				banner: {
					js: `import { createRequire } from 'module';
const require = createRequire(import.meta.url);`,
				},
			});
			console.log("Server bundle created at dist/server.bundle.mjs");
		},
	};
}

const allowedHosts: string[] = [];
const corsOrigins: string[] = [];

if (process.env.FRONTEND_DOMAIN) {
	const frontendHost = extractHostname(process.env.FRONTEND_DOMAIN);
	allowedHosts.push(frontendHost);
	corsOrigins.push(`http://${frontendHost}`, `https://${frontendHost}`);
}
if (process.env.ALLOWED_ORIGINS) {
	const origins = process.env.ALLOWED_ORIGINS.split(",");
	allowedHosts.push(...origins.map(extractHostname));
	corsOrigins.push(...origins);
}
if (process.env.VITE_PARENT_ORIGIN) {
	allowedHosts.push(extractHostname(process.env.VITE_PARENT_ORIGIN));
	corsOrigins.push(process.env.VITE_PARENT_ORIGIN);
}
if (allowedHosts.length === 0) {
	allowedHosts.push("*");
}
if (corsOrigins.length === 0) {
	corsOrigins.push("*");
}

async function loadOptionalPlugins(mode: string): Promise<{
	devPlugins: Plugin[];
	reactBabelPlugins: unknown[];
}> {
	const devPlugins: Plugin[] = [];
	const reactBabelPlugins: unknown[] = [];

	try {
		const mod = await import("./source-mapper/src/index");
		const maybePlugin = (mod as any)?.default ?? mod;
		if (maybePlugin) reactBabelPlugins.push(maybePlugin);
	} catch {
		// Optional: repo may not include source-mapper
	}

	if (mode === "development") {
		try {
			const mod = await import("./dev-tools/src/vite-plugin");
			if ((mod as any)?.devToolsPlugin) devPlugins.push((mod as any).devToolsPlugin() as Plugin);
		} catch {
			// Optional: repo may not include dev-tools
		}
		try {
			const mod = await import("./fullstory-plugin");
			if ((mod as any)?.fullStoryPlugin) devPlugins.push((mod as any).fullStoryPlugin() as Plugin);
		} catch {
			// Optional: repo may not include fullstory plugin
		}
		try {
			const mod = await import("./dev-tools/src/vite-error-interceptor");
			if ((mod as any)?.errorInterceptorPlugin)
				devPlugins.push((mod as any).errorInterceptorPlugin() as Plugin);
		} catch {
			// Optional: repo may not include dev-tools
		}
		try {
			const mod = await import("./dev-tools/src/vite-media-versions-plugin");
			if ((mod as any)?.mediaVersionsPlugin)
				devPlugins.push((mod as any).mediaVersionsPlugin() as Plugin);
		} catch {
			// Optional: repo may not include dev-tools
		}
	}

	return { devPlugins, reactBabelPlugins };
}

export default defineConfig(async ({ mode }) => {
	const { devPlugins, reactBabelPlugins } = await loadOptionalPlugins(mode);

	const reactOptions: Parameters<typeof react>[0] = {};
	if (reactBabelPlugins.length > 0) {
		reactOptions.babel = { plugins: reactBabelPlugins as any[] };
	}

	return ({
	// Expose SITE_ID to import.meta.env (same as app id) for client deep links; keep VITE_ as default
	envPrefix: ["VITE_", "SITE_"],

	plugins: [
		react(reactOptions),
		apiRoutes({
			mode: "isolated",
			configure: "src/server/configure.js",
			dirs: [{ dir: "./src/server/api", route: "" }],
			forceRestart: mode === "development",
		}),
		...devPlugins,
		serverBundlePlugin(),
	],

	resolve: {
		dedupe: ["react", "react-dom"],
		alias: {
			nothing: "/src/fallbacks/missingModule.ts",
			"@/api": path.resolve(__dirname, "./src/server/api"),
			"@": path.resolve(__dirname, "./src"),
		},
	},

	server: {
		host: process.env.HOST || "0.0.0.0",
		port: parseInt(process.env.PORT || "5173"),
		strictPort: !!process.env.PORT,
		allowedHosts,
		cors: {
			origin: corsOrigins,
			credentials: true,
			methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
			allowedHeaders: ["Content-Type", "Authorization", "Accept", "User-Agent"],
		},
		hmr: {
			overlay: false,
		},
		watch: {
			ignored: ["**/dist/**", "**/.api/**"],
		},
	},

	preview: {
		host: process.env.HOST || "0.0.0.0",
		port: parseInt(process.env.PORT || "5173"),
		strictPort: !!process.env.PORT,
		allowedHosts,
		cors: {
			origin: corsOrigins,
			credentials: true,
			methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
			allowedHeaders: ["Content-Type", "Authorization", "Accept", "User-Agent"],
		},
	},

	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					"react-vendor": ["react", "react-dom"],
					"radix-ui": [
						"@radix-ui/react-accordion",
						"@radix-ui/react-alert-dialog",
						"@radix-ui/react-aspect-ratio",
						"@radix-ui/react-avatar",
						"@radix-ui/react-checkbox",
						"@radix-ui/react-collapsible",
						"@radix-ui/react-context-menu",
						"@radix-ui/react-dialog",
						"@radix-ui/react-dropdown-menu",
						"@radix-ui/react-hover-card",
						"@radix-ui/react-label",
						"@radix-ui/react-menubar",
						"@radix-ui/react-navigation-menu",
						"@radix-ui/react-popover",
						"@radix-ui/react-progress",
						"@radix-ui/react-scroll-area",
						"@radix-ui/react-select",
						"@radix-ui/react-separator",
						"@radix-ui/react-slider",
						"@radix-ui/react-slot",
						"@radix-ui/react-switch",
						"@radix-ui/react-tabs",
						"@radix-ui/react-toast",
						"@radix-ui/react-toggle",
						"@radix-ui/react-toggle-group",
						"@radix-ui/react-tooltip",
					],
					query: ["@tanstack/react-query"],
				},
			},
		},
	},
	});
});
