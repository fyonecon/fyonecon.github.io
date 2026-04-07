//import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-cloudflare';

// ⚠️ 下面配置为静态网站配置：1️⃣“域名直接是根目录文件型，如https://aaa.com”；2️⃣“域名含有一级文件夹型，如https://aaa.com/xxx”。
// ⚠️ 服务端或CDN中输出文件配置，请开启“忽略 html 扩展名”。
// 🍂 本配置可以在github pages里“根目录”或“一级文件夹”中CICD自动化部署；或者在CDN静态网站环境中“dist文件”部署（需在CDN中配置“忽略 html 扩展名”）。
// 🍂 推荐 Cache-Control: max-age=43210 。
/** @type {import('@sveltejs/kit').Config} */
const config = { kit: { adapter: adapter(), paths: { base: '', assets: '' } } };

export default config;
