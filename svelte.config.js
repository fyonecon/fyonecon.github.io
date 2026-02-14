//import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-static';

// ⚠️ 下面配置为静态网站配置，适合“直接根目录文件型，如https://aaa.com”或者“含有域名含有文件夹型，，如https://aaa.com/xxx”，服务端输出文件时请配置“忽略 html 扩展名”。

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
	}
};

export default config;
