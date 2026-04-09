//import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-static';

// ⚠️ 下面配置为静态网站配置：1️⃣“域名直接是根目录文件型，如https://aaa.com”；2️⃣“域名含有一级文件夹型，如https://aaa.com/xxx”。
// ⚠️ 服务端或CDN中输出文件配置，请开启“忽略 html 扩展名”。
// 🍂 本配置可以在github pages里“根目录”或“一级文件夹”中CICD自动化部署；或者在CDN静态网站环境中“dist文件”部署（需在CDN中配置“忽略 html 扩展名”）。
// 🍂 推荐 Cache-Control: max-age=43210 。

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter({
			// default options are shown. On some platforms
			// these options are set automatically — see below
			pages: './dist',
			assets: './dist',
			fallback: '404.html',
			precompress: false,
			strict: true
		}),
        // 添加路径重写配置
        paths: {
            base: '', // 根据你的部署路径设置，''、'/view'、'/view_static'，此值请同样在 config.js--sys--base_route 里面设置
            assets: '', // 根据你的部署路径设置。CDN如：'http(s)://127.0.0.1:9750/view/svelte/dist'，结尾无/
        },
        // 防止资源文件过期失效
        version: {
            // 每次部署时更改这个值（或使用 git rev-parse HEAD）
            name: Date.now().toString(),
            // 当检测到版本更新时，在后台静默刷新
            pollInterval: 600*1000 // ms 每 10 分钟检查一次
        }
	}
};

export default config;
