---
title: 我的第一篇博客
published: 2025-12-14T15:33:00.000Z
description: 记录基于 Astro 框架搭建个人博客的过程，分享从模板定制到部署上线的实践心得。
tags: [Astro, Markdown, 博客搭建, 静态站点, Netlify]
category: 技术实践
draft: false
lang: zh_CN
address: 南京
---

## 引言

这是我的第三轮个人博客搭建之旅。前两次尝试或因技术选型、或因时间精力未能持续，而这次我选择了 **Astro** 框架，基于社区优秀的模板 [Fuwari](https://github.com/saicaca/fuwari) 快速定制，并将站点成功部署到了 **Netlify**。

本文既是对本次搭建过程的记录，也是一次对 Astro 静态站点生成器的初探。我会简要分享关键步骤，并展示本博客支持的一些 Markdown 扩展语法。

## 为什么选择 Astro？

在众多静态站点生成器（如 Hugo、Jekyll、Next.js）中，我选择 Astro 主要出于以下几点考虑：

- **组件化开发**：支持 React、Svelte、Vue 等框架的组件，但最终输出为轻量静态 HTML。
- **内容驱动**：对 Markdown 的原生支持非常友好，配合 Collections 可实现类型安全的内容管理。
- **性能优异**：默认移除所有客户端 JavaScript，实现极快的加载速度。
- **生态丰富**：有大量现成主题和插件（如本模板使用的 Expressive Code、Pagefind 搜索等）。

## 搭建步骤回顾

### 1. 模板初始化
直接使用 Fuwari 模板，通过以下命令创建项目：
```bash
pnpm create fuwari@latest
```
然后进入项目目录安装依赖：
```bash
cd myBlog
pnpm install
```

### 2. 个性化配置
修改 `src/config.ts` 中的站点标题、个人资料、导航栏等：
```typescript
export const siteConfig: SiteConfig = {
    title: "94w的小站",
    subtitle: "我的个人博客",
    lang: "zh_CN",
    // ...
};
```

### 3. 内容创作
使用内置脚本创建新文章：
```bash
pnpm new-post my-first-post
```
然后在 `src/content/posts/` 目录下编辑 Markdown 文件即可。

### 4. 本地预览
启动开发服务器，实时查看效果：
```bash
pnpm dev
```
访问 `http://localhost:4321` 即可。

### 5. 部署上线
将代码推送到 GitHub 仓库，在 Netlify 中导入项目，设置构建命令为 `pnpm build`，输出目录为 `dist`，即可自动部署。

## 本博客的 Markdown 扩展功能

Fuwari 模板在标准 Markdown 基础上增加了许多实用语法，下面展示几个例子：

### 提示框（Admonitions）
::note
**注意**：这是一个普通提示框，用于补充说明或提醒。
::

::tip
**技巧**：这是一个技巧提示，可以分享最佳实践。
::

::warning
**警告**：这是一个警告提示，用于标识需要注意的事项。
::

### GitHub 仓库卡片
::github{repo="saicaca/fuwari"}

### 代码块增强
支持语法高亮、行号、折叠、复制按钮等（以下为 TypeScript 示例）：
```typescript
interface BlogPost {
    title: string;
    published: Date;
    tags: string[];
}

const post: BlogPost = {
    title: "我的第一篇博客",
    published: new Date("2025-12-14"),
    tags: ["Astro", "Markdown"],
};
```

### 数学公式
行内公式：$E = mc^2$

块公式：
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

## 遇到的问题与解决

1. **环境配置**：最初因 Node.js 版本过低导致安装失败，升级至 Node 20 后解决。
2. **部署路径**：Netlify 默认识别 `public` 目录，但 Astro 构建输出为 `dist`，需在 Netlify 设置中手动指定。
3. **图片资源**：将图片放入 `src/assets/images/` 后，需使用相对路径引用，如 `![头像](./demo-avatar.png)`。

## 后续计划

- 从零开始手写一个 Astro 主题，深入理解其架构。
- 添加更多交互组件（如音乐播放器、项目展示墙）。
- 持续撰写技术笔记，涵盖前端、后端、算法等领域。

## 结语

博客不仅是技术输出的载体，也是个人成长的见证。正如我在关于页面中所写：“你走的每一步都算数”。希望这个小小的站点能陪伴我记录更多学习与思考的痕迹。

感谢阅读，欢迎通过 [GitHub](https://github.com/94W666) 与我交流。

> 本文撰写于 2025 年 12 月 14 日，使用 Astro + Fuwari 模板构建。