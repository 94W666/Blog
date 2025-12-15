/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />

// Allow client directives on Svelte components
declare module "*.svelte" {
	import type { SvelteComponent } from "svelte";
	class Component extends SvelteComponent<Record<string, unknown>> {}
	export default Component;
}
