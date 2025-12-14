#!/usr/bin/env node
/**
 * 将语雀导出的 Markdown 文件快速导入到博客中
 * 用法：node scripts/import-yuque.js <语雀文件路径> [--title "文章标题"] [--tags "标签1,标签2"] [--category "分类"] [--time "2025-12-14T15:30:00"] [--address "发表地址"]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getDateTime(timeStr = null) {
  let date;
  if (timeStr) {
    // 验证时间格式
    date = new Date(timeStr);
    if (isNaN(date.getTime())) {
      console.error(`错误：提供的时间格式无效 ${timeStr}，请使用 ISO 格式（如 2025-12-14T15:30:00）`);
      process.exit(1);
    }
  } else {
    date = new Date();
  }
  // 返回完整的 ISO 字符串，确保能被解析为 Date
  return date.toISOString();
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
    time: null,
    address: '',
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
      if (key === 'time') result.time = value;
      if (key === 'address') result.address = value;
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
  const { filePath, title, tags, category, draft, lang, time, address } = parseArgs();

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
published: ${getDateTime(time)}
description: ''
image: ''
tags: [${tags.map(t => `"${t}"`).join(', ')}]
category: ${category}
draft: ${draft}
lang: ${lang}
address: ${address}
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
  console.log(`发布时间：${getDateTime(time)}`);
  console.log(`标签：${tags.join(', ')}`);
  console.log(`分类：${category}`);
  console.log(`地址：${address}`);
  console.log(`草稿：${draft}`);
  console.log(`语言：${lang}`);
  console.log('\n接下来您可以：');
  console.log('1. 编辑 frontmatter（如 description、image 等）');
  console.log('2. 运行 pnpm dev 预览');
  console.log('3. 推送到仓库以部署');
}

main();