# 🍥 我的个人博客（基于 Fuwari 模板）

![Node.js >= 20](https://img.shields.io/badge/node.js-%3E%3D20-brightgreen) 
![pnpm >= 9](https://img.shields.io/badge/pnpm-%3E%3D9-blue) 
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

这是我的个人博客，基于 [Fuwari](https://github.com/saicaca/fuwari) 模板（一个使用 [Astro](https://astro.build) 构建的静态博客模板）进行定制和扩展。

**在线地址**：[https://your-blog.netlify.app](https://your-blog.netlify.app)（请替换为您的实际部署地址）

## ✨ 主要修改与增强

在原模板基础上，我进行了以下定制：

### 1. **个性化配置**
- 更新了 `src/config.ts` 中的站点标题、副标题、个人资料（头像、姓名、简介）和导航栏链接。
- 移除了评论功能（Giscus），简化了页面结构。

### 2. **文章导入自动化**
- 编写了 `scripts/import-yuque.js` 脚本，可将语雀导出的 Markdown 文章一键导入博客。
- 支持命令行参数（标题、标签、分类、发布时间、地址等）。
- 集成到 `package.json` 的 `scripts` 中，可通过 `pnpm import-yuque` 快速调用。

### 3. **时间与地址显示**
- 文章发布时间精确到分钟，显示格式为 `YYYY-MM-DD HH:mm`（使用 UTC 时间避免时区偏移）。
- 新增 `address` 字段，可在文章元数据中显示发表地址（如“南京”）。

### 4. **排序优化**
- 修改 `src/utils/content-utils.ts` 中的排序逻辑，确保文章按发布时间降序排列（最新的在最上方），同一天的文章按标题字母顺序稳定排序。

### 5. **修复构建问题**
- 移除了导致构建失败的 `Comment.svelte` 组件。
- 修复了 `src/styles/markdown.css` 中无效的 `@apply link` 规则。

## 🚀 部署流程

1. **本地开发**
   ```bash
   pnpm dev
   ```

2. **构建生产版本**
   ```bash
   pnpm build
   ```
   构建产物位于 `dist/` 目录。

3. **推送到 GitHub**
   ```bash
   git add .
   git commit -m "更新"
   git push origin main
   ```

4. **自动部署**
   - 使用 **Netlify**（或 Vercel）连接 GitHub 仓库。
   - 构建设置：构建命令 `pnpm build`，发布目录 `dist`。
   - 每次推送后自动构建并发布。

## 📝 写作工作流

1. 在 **语雀** 中撰写文章。
2. 导出为 Markdown 文件（保存到 `myPosts/` 目录）。
3. 运行导入脚本：
   ```bash
   pnpm import-yuque ../myPosts/文章.md --title "标题" --tags "标签1,标签2" --category "分类" --address "南京"
   ```
4. 本地预览（`pnpm dev`），确认无误后推送并部署。

## ⚡ 常用命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动本地开发服务器（`localhost:4321`） |
| `pnpm build` | 构建生产版本 |
| `pnpm preview` | 预览构建结果 |
| `pnpm new-post <文件名>` | 创建新文章（空白模板） |
| `pnpm import-yuque <文件>` | 导入语雀文章 |
| `pnpm format` | 代码格式化（Biome） |
| `pnpm check` | 代码检查 |

## 🧩 项目结构

```
myBlog/
├── src/
│   ├── config.ts              # 站点配置
│   ├── content/posts/         # 文章目录
│   ├── components/            # 组件（布局、元数据等）
│   ├── layouts/               # 页面布局
│   ├── pages/                 # 页面路由
│   ├── styles/                # 样式文件
│   └── utils/                 # 工具函数
├── scripts/
│   └── import-yuque.js        # 语雀导入脚本
├── public/                    # 静态资源
└── package.json
```

## 🙏 致谢

- 感谢 [saicaca](https://github.com/saicaca) 开发的优秀模板 [Fuwari](https://github.com/saicaca/fuwari)。
- 感谢 Astro、Tailwind CSS、Pagefind 等开源项目。

## 📄 许可证

本项目基于 MIT 许可证开源。详见 [LICENSE](LICENSE) 文件。
