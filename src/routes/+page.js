// 本页面
export const prerender = true;
export const csr = true; // 确保客户端渲染
export const ssr = false // false关闭服务端渲染，false 关闭SEO，true 编译成SEO页面。（false可以让js正确访问“window”对象）