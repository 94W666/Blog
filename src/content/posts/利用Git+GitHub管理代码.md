---
title: 利用 Git+GitHub 管理代码
published: 2025-12-14T16:11:00.000Z
description: 将本地代码推送到 GitHub 的完整指南，包括初次推送、日常更新工作流和常见问题解决。
tags: ["Git", "GitHub", "版本控制"]
category: 开发工具
draft: false
lang: zh_CN
address: 南京
---

<h1 id="a1jKu">将本地代码推送到 GitHub 的完整指南</h1>
下面是将本地代码推送到 GitHub 的详细步骤，包括初次推送和后续更新的流程。

<h2 id="FX3HY">准备工作</h2>
1. **安装 Git**
    - 下载地址：[https://git-scm.com/downloads](https://git-scm.com/downloads)
    - 安装后配置用户信息：

```bash
git config --global user.name "你的用户名"
git config --global user.email "你的邮箱"
```

2. **创建 GitHub 账户**
    - 访问 [https://github.com](https://github.com) 注册账户
3. **生成 SSH 密钥**（推荐）

```bash
ssh-keygen -t ed25519 -C "你的邮箱"
# 将公钥(~/.ssh/id_ed25519.pub)添加到 GitHub SSH keys
```

<h2 id="S36Qz">方法一：从零开始推送新项目</h2>
<h3 id="jH2P6">步骤 1：在 GitHub 创建新仓库</h3>
+ 登录 GitHub
+ 点击右上角 "+" → "New repository"
+ 输入仓库名称，选择公开/私有，**不要**初始化 README

<h3 id="wfazN">步骤 2：初始化本地仓库</h3>
```bash
# 进入项目目录
cd your-project-directory

# 初始化 Git 仓库
git init

# 添加所有文件到暂存区
git add .

# 提交更改
git commit -m "Initial commit"
```

<h3 id="yIGtv">步骤 3：连接远程仓库并推送</h3>
```bash
# 添加远程仓库（替换为你的仓库URL）
git remote add origin https://github.com/你的用户名/仓库名.git

# 首次推送
git push -u origin main
# 如果使用 master 分支，则改为：
# git push -u origin master
```

<h2 id="ChXiK">方法二：推送现有本地仓库</h2>
如果你已经有一个本地 Git 仓库：

```bash
# 添加远程仓库
git remote add origin https://github.com/你的用户名/仓库名.git

# 重命名分支（如果需要）
git branch -M main

# 推送代码
git push -u origin main
```

<h2 id="n5sAf">方法三：使用 SSH（更安全）</h2>
```bash
# 添加 SSH 远程仓库
git remote add origin git@github.com:你的用户名/仓库名.git

# 推送代码
git push -u origin main
```

<h2 id="HGu31">日常更新工作流程</h2>
<h3 id="f6U0J">基本流程</h3>
```bash
# 1. 查看当前状态
git status

# 2. 添加更改的文件
git add .  # 添加所有更改
# 或
git add 文件名  # 添加特定文件

# 3. 提交更改
git commit -m "描述这次提交的内容"

# 4. 推送到远程仓库
git push
```

<h3 id="loJsM">从远程拉取更新</h3>
```bash
# 拉取远程更改并合并
git pull

# 或分别执行
git fetch
git merge
```

<h2 id="qOBAn">常见问题解决</h2>
<h3 id="QIOoU">1. 首次推送冲突</h3>
```bash
# 如果远程有 README 等文件
git pull origin main --allow-unrelated-histories
git push
```

<h3 id="wuZj5">2. 认证失败</h3>
+ 使用 Personal Access Token 替代密码
+ 或配置 SSH 密钥

<h3 id="y1Aim">3. 分支名称问题</h3>
```bash
# 查看当前分支
git branch

# 重命名分支
git branch -M 新分支名
```

<h2 id="U2uAK">实用命令参考</h2>
```bash
# 查看远程仓库
git remote -v

# 查看提交历史
git log --oneline

# 撤销本地更改
git checkout -- 文件名

# 撤销暂存的文件
git reset HEAD 文件名
```

<h2 id="OwJUR">最佳实践</h2>
1. **提交信息**：写清晰的提交说明
2. **频繁提交**：小步提交，便于追踪
3. **分支策略**：使用功能分支开发
4. **忽略文件**：创建 `.gitignore` 文件排除不需要版本控制的文件

示例 `.gitignore`：

```plain
# 依赖目录
node_modules/
vendor/

# 日志文件
*.log

# 环境变量文件
.env
.env.local

# 系统文件
.DS_Store
Thumbs.db
```

按照这些步骤，你就能成功将本地代码推送到 GitHub 并建立有效的版本控制工作流。