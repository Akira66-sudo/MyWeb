import { renderers } from './renderers.mjs';
import { s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CvSoi7hX.mjs';
import { manifest } from './manifest_TmEqHr0L.mjs';
import { createExports } from '@astrojs/netlify/ssr-function.js';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/api/contact.astro.mjs');
const _page3 = () => import('./pages/api/keepalive.astro.mjs');
const _page4 = () => import('./pages/api/score.astro.mjs');
const _page5 = () => import('./pages/api/seed.astro.mjs');
const _page6 = () => import('./pages/api/stats.astro.mjs');
const _page7 = () => import('./pages/api/wakeup.astro.mjs');
const _page8 = () => import('./pages/lab.astro.mjs');
const _page9 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/api/contact.js", _page2],
    ["src/pages/api/keepalive.js", _page3],
    ["src/pages/api/score.js", _page4],
    ["src/pages/api/seed.js", _page5],
    ["src/pages/api/stats.js", _page6],
    ["src/pages/api/wakeup.js", _page7],
    ["src/pages/lab/index.astro", _page8],
    ["src/pages/index.astro", _page9]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "08b979f5-98ee-4bfd-a677-85a8d907567d"
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
