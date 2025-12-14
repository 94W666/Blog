---
title: 如何将语雀文章自动导入到 Astro 博客
published: 2025-12-14T16:27:00.000Z
description: 本文详细介绍如何通过自建 Node.js 脚本，将语雀导出的 Markdown 文章快速导入到基于 Astro 的静态博客中，实现写作与发布的顺畅衔接。
tags: ["语雀", "Astro", "博客", "自动化", "Markdown", "Node.js"]
category: 技术实践
draft: false
lang: zh_CN
address: 南京
---

## 引言

作为一名技术博主，我习惯在 **语雀** 上撰写文章，因为它提供了优秀的编辑体验、团队协作和版本管理。然而，我的个人博客是基于 **Astro** 搭建的静态站点，文章以 Markdown 文件形式存放在 `src/content/posts/` 目录中。每次发布都需要手动导出、复制、添加 frontmatter，流程繁琐且容易出错。

为了解决这个问题，我编写了一个 **Node.js 导入脚本**，能够一键将语雀导出的 Markdown 文件转换为符合 Astro 要求的格式，并自动放入正确目录。本文将分享整个实现过程，你可以直接使用这个脚本，或根据自身需求进行定制。

## 准备工作

### 1. 博客项目结构
假设你的 Astro 博客项目结构如下（基于 Fuwari 模板）：
```
myBlog/
├── src/
│   └── content/
│       └── posts/          # 博客文章目录
├── scripts/
│   └── import-yuque.js     # 导入脚本（我们将创建）
└── package.json
```

### 2. 语雀文章导出
在语雀文档页面，点击右上角「…」→ **导出** → **Markdown**，即可下载得到一个 `.md` 文件。语雀导出的 Markdown 通常包含以下特点：
- 可能带有 HTML 标签（如 `<h1>`、`<div>`）。
- 可能包含语雀特定的元数据（如 `id` 属性）。
- 图片链接为绝对路径（需后续处理）。

我们将导出的文件统一放在项目外的某个目录（例如 `myPosts/`），避免污染源码。

## 脚本实现

### 1. 脚本功能设计
脚本需要完成以下任务：
- 读取语雀导出的 Markdown 文件。
- 解析命令行参数（标题、标签、分类等）。
- 生成符合 Astro 要求的 frontmatter（YAML 格式）。
- 将 frontmatter 与原文内容合并。
- 将最终文件保存到 `src/content/posts/`。

### 2. 代码实现
以下是完整的脚本代码（保存为 `scripts/import-yuque.js`）：

```javascript
#!/usr/bin/env node
/**
 * 将语雀导出的 Markdown 文件快速导入到博客中
 * 用法：node scripts/import-yuque.js <语雀文件路径> [--title "文章标题"] [--tags "标签1,标签2"] [--category "分类"]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseArgs() {
  const args = process.argv.slice(2);
  const result = {
    filePath: null,
    title: '',
    tags: [],
    category: '',
    draft: false,
    lang: 'zh_CN',
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const value = args[i + 1];
      if (key === 'title') result.title = value;
      if (key === 'tags') result.tags = value.split(',').map(t => t.trim());
      if (key === 'category') result.category = value;
      if (key === 'draft') result.draft = value === 'true';
      if (key === 'lang') result.lang = value;
      i++; // 跳过下一个参数
    } else if (!result.filePath) {
      result.filePath = arg;
    }
  }

  // 如果未提供标题，使用文件名（不含扩展名）
  if (!result.title && result.filePath) {
    result.title = path.basename(result.filePath, path.extname(result.filePath));
  }

  return result;
}

function main() {
  const { filePath, title, tags, category, draft, lang } = parseArgs();

  if (!filePath) {
    console.error('错误：请提供语雀导出的 Markdown 文件路径');
    console.error('示例：node scripts/import-yuque.js ~/Downloads/语雀文章.md --title "文章标题" --tags "前端,JavaScript" --category "技术"');
    process.exit(1);
  }

  if (!fs.existsSync(filePath)) {
    console.error(`错误：文件不存在 ${filePath}`);
    process.exit(1);
  }

  // 读取语雀文件内容
  const content = fs.readFileSync(filePath, 'utf-8');

  // 检查是否已包含 frontmatter（以 --- 开头）
  const hasFrontmatter = content.startsWith('---');
  let body = content;
  if (hasFrontmatter) {
    // 简单处理：假设第一个 --- 到第二个 --- 之间是 frontmatter，我们将其替换
    const end = content.indexOf('---', 3);
    if (end !== -1) {
      body = content.slice(end + 3).trim();
    }
  }

  // 构建 frontmatter
  const frontmatter = `---
title: ${title}
published: ${getDate()}
description: ''
image: ''
tags: [${tags.map(t => `"${t}"`).join(', ')}]
category: ${category}
draft: ${draft}
lang: ${lang}
---`;

  // 新文件路径
  const targetDir = path.join(__dirname, '../src/content/posts/');
  const fileName = path.basename(filePath);
  const targetPath = path.join(targetDir, fileName);

  // 如果文件已存在，询问是否覆盖
  if (fs.existsSync(targetPath)) {
    console.warn(`警告：文件 ${targetPath} 已存在，将跳过导入。`);
    console.warn('请删除或重命名原文件后再试。');
    process.exit(1);
  }

  // 确保目录存在
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // 写入新文件
  const fullContent = `${frontmatter}\n\n${body}`;
  fs.writeFileSync(targetPath, fullContent, 'utf-8');

  console.log(`✅ 文章已导入：${targetPath}`);
  console.log(`标题：${title}`);
  console.log(`标签：${tags.join(', ')}`);
  console.log(`分类：${category}`);
  console.log(`草稿：${draft}`);
  console.log(`语言：${lang}`);
  console.log('\n接下来您可以：');
  console.log('1. 编辑 frontmatter（如 description、image 等）');
  console.log('2. 运行 pnpm dev 预览');
  console.log('3. 推送到仓库以部署');
}

main();
```

### 3. 脚本使用方式

#### 基本命令
```bash
cd myBlog
node scripts/import-yuque.js ../myPosts/语雀文章.md --title "文章标题" --tags "标签1,标签2" --category "分类"
```

#### 实际案例
假设语雀导出了 `树.md`，我们希望将其导入博客，标签为“树,数据结构,算法”，分类为“数据结构”：
```bash
node scripts/import-yuque.js ../myPosts/树.md --title "树的知识总结" --tags "树,数据结构,算法" --category "数据结构"
```

执行后输出：
```
✅ 文章已导入：D:\Blog\myBlog\src\content\posts\树.md
标题：树的知识总结
标签：树, 数据结构, 算法
分类：数据结构
草稿：false
语言：zh_CN
```

#### 参数说明
- `--title`：文章标题（默认使用文件名）
- `--tags`：标签，逗号分隔（例如 `"Git,GitHub"`）
- `--category`：分类名称
- `--draft`：是否为草稿（`true`/`false`，默认 `false`）
- `--lang`：语言代码（默认 `zh_CN`）

## 工作流整合

### 1. 日常写作流程
1. 在语雀中撰写、修订文章。
2. 导出为 Markdown 文件，保存到 `myPosts/` 目录。
3. 运行导入脚本，一键添加到博客。
4. 本地预览（`pnpm dev`），确认无误后推送到 GitHub。

### 2. 自动化改进（可选）
- 将脚本添加到 `package.json` 的 `scripts` 中：
  ```json
  "scripts": {
    "import-yuque": "node scripts/import-yuque.js"
  }
  ```
  之后可通过 `pnpm import-yuque <文件>` 调用。
- 编写批处理脚本，遍历 `myPosts/` 目录下的所有 `.md` 文件并自动导入。

#### 实际集成示例
我已经将 `import-yuque` 命令集成到本博客的 `package.json` 中，因此可以直接使用以下简化命令：

```bash
# 进入博客项目目录
cd myBlog

# 使用 pnpm 调用导入命令
pnpm import-yuque ../myPosts/语雀文章.md --title "文章标题" --tags "标签1,标签2" --category "分类"
```

**完整工作流**：
1. **写作**：在语雀中撰写文章。
2. **导出**：导出为 Markdown 文件，保存到 `myPosts/` 目录。
3. **导入**：运行 `pnpm import-yuque` 命令（如上）。
4. **预览**：运行 `pnpm dev` 启动本地服务器，检查文章渲染效果。
5. **发布**：推送到 GitHub，Netlify 自动部署。

#### 其他有用命令
- `pnpm new-post <文件名>`：创建新的空白文章（自动生成 frontmatter）。
- `pnpm dev`：启动开发服务器。
- `pnpm build`：构建生产版本。
- `pnpm preview`：预览构建结果。

### 3. 处理图片资源
语雀导出的图片链接通常是绝对路径（指向语雀 CDN）。若希望将图片本地化，可以：
- 手动下载图片到 `src/assets/images/`。
- 修改 Markdown 中的图片路径为相对路径。
- 或编写脚本自动下载并替换（需额外实现）。

## 常见问题

### 1. 脚本执行报错“Cannot find module”
确保脚本文件名正确（`import-yuque.js`）且位于 `scripts/` 目录下。如果使用 Windows，注意路径分隔符。

### 2. 导入后文章格式错乱
语雀导出的 Markdown 可能包含 HTML 标签（如 `<h1>`）。这些标签在 Astro 中仍可渲染，但若希望纯 Markdown，可使用工具（如 `turndown`）进行转换。

### 3. Frontmatter 字段不满足需求
编辑 `scripts/import-yuque.js` 中的 `frontmatter` 模板（第 78–85 行），添加或修改字段（例如 `updated`、`cover`）。

### 4. 如何避免重复导入
脚本会检查目标文件是否已存在，若存在则跳过并提示。你可以手动删除旧文件后再导入，或使用 `--force` 参数覆盖（需自行实现）。

## 总结

通过这个简单的 Node.js 脚本，我成功将语雀写作流程与 Astro 博客发布流程无缝衔接。整个过程仅需一条命令，大大提升了效率。

**核心优势**：
- **保持写作习惯**：继续使用语雀的强大编辑器。
- **自动化**：避免手动复制、粘贴、编辑 frontmatter。
- **灵活可扩展**：脚本可根据个人需求定制。

如果你也使用语雀和 Astro，不妨尝试这个方案。脚本源码已包含在文中，你可以直接复制使用。

## 源码下载
本文涉及的脚本文件可在 [GitHub Gist](https://gist.github.com) 上获取（暂未上传，可直接复制文中代码）。

---

> 本文撰写于 2025 年 12 月 14 日，使用语雀导出 + 自建脚本导入到本博客。
