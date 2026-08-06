import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_Ca7Bna2Z.mjs';
import { manifest } from './manifest_DE4qP-wu.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/game-stats.astro.mjs');
const _page2 = () => import('./pages/api/leaderboard.astro.mjs');
const _page3 = () => import('./pages/api/ping.astro.mjs');
const _page4 = () => import('./pages/api/profile.astro.mjs');
const _page5 = () => import('./pages/api/projects.astro.mjs');
const _page6 = () => import('./pages/api/seed.astro.mjs');
const _page7 = () => import('./pages/api/stats.astro.mjs');
const _page8 = () => import('./pages/login.astro.mjs');
const _page9 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/api/game-stats.js", _page1],
    ["src/pages/api/leaderboard.js", _page2],
    ["src/pages/api/ping.js", _page3],
    ["src/pages/api/profile.js", _page4],
    ["src/pages/api/projects.js", _page5],
    ["src/pages/api/seed.js", _page6],
    ["src/pages/api/stats.js", _page7],
    ["src/pages/login.astro", _page8],
    ["src/pages/index.astro", _page9]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = {
    "middlewareSecret": "a69e05fb-12e6-4c38-b757-7816c32fcb7d",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
