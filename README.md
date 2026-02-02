# ViewOnSvelte

项目：https://github.com/fyonecon/fyonecon.github.io

工作流：https://fyonecon.github.io

### 推荐IDE（webstorm）：
```
https://www.jetbrains.com/webstorm/download/?section=mac
```

===================================
# Svelte应用（默认）

### 常用命令：
在/frontend/view/目录运行：
```
npx sv create svelte
```

更改端口为9770（本地开发环境用）:
```
在vite.config.js中设置：

server: {
    port: 9770, // 固定端口为 9770
    strictPort: true, // 如果端口被占用，不自动选择其他端口
    host: true // 允许外部访问（可选）
}
```

项目所在文件夹：/frontend/view/svelte/
```
npm install

npm run dev

npm run build
```

### Svelte打包静态网站：
静态网站请参考：
https://svelte.dev/docs/kit/adapters
```
npm i -D @sveltejs/adapter-static
```
在/frontend/view/svelte/svelte.config.js添加如下内容:
```
//import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-static';

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
            base: '', // 根据你的部署路径设置
            assets: '' // 根据你的部署路径设置。CDN如：'http://127.0.0.1:9750/view/svelte/dist'，，结尾无/
        },
	}
};

export default config;
```



=================================
# 2026-02-02