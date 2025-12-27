# 🚀 部署到 Cloudflare Pages 完整指南

本指南将帮助你将 2026 跨时空烟花项目部署到 Cloudflare Pages，通过 GitHub 自动部署。

---

## 📋 前置要求

1. **GitHub 账户** - 用于托管代码
2. **Cloudflare 账户** - 免费账户即可
3. **本地 Git** - 用于推送代码

---

## 🎯 部署步骤

### 第一步：准备 GitHub 仓库

#### 选项 A: 推送到现有仓库

```bash
# 检查当前 git 状态
git status

# 添加所有新文件
git add .

# 提交更改
git commit -m "✨ 完成跨时空烟花项目 - Project Epoch

- 添加完整的粒子系统和烟花引擎
- 实现智能时空检测和双日历主题
- 添加史册摘要和音频系统
- 整合所有资源文件
- 可直接部署到 Cloudflare Pages"

# 推送到 GitHub
git push origin main
```

#### 选项 B: 创建新的 GitHub 仓库

1. 访问 https://github.com/new
2. 创建新仓库，命名为 `newyear-2026` 或其他名称
3. **不要**初始化 README、.gitignore 或 license
4. 创建后，GitHub 会显示推送现有仓库的命令：

```bash
# 添加远程仓库（替换 YOUR_USERNAME 为你的 GitHub 用户名）
git remote add github https://github.com/YOUR_USERNAME/newyear-2026.git

# 或者修改现有的 remote
git remote set-url origin https://github.com/YOUR_USERNAME/newyear-2026.git

# 推送代码
git push -u origin main
```

### 第二步：在 Cloudflare Pages 创建项目

#### 方法 1: 通过 Cloudflare Dashboard（推荐）

1. **登录 Cloudflare**
   - 访问 https://dash.cloudflare.com/
   - 登录你的账户

2. **创建 Pages 项目**
   - 在左侧菜单选择 "Workers & Pages"
   - 点击 "Create application"
   - 选择 "Pages" 标签
   - 点击 "Connect to Git"

3. **连接 GitHub**
   - 如果是第一次，需要授权 Cloudflare 访问你的 GitHub
   - 选择刚才推送代码的仓库
   - 选择 `main` 分支

4. **配置构建设置**
   ```
   Project name: newyear-2026 (或其他)
   Production branch: main
   Build command: (留空，因为我们不需要构建步骤)
   Build output directory: / (根目录)
   ```

5. **环境变量（可选）**
   - 不需要设置额外的环境变量

6. **部署**
   - 点击 "Save and Deploy"
   - Cloudflare Pages 会自动部署你的项目
   - 首次部署约需 1-2 分钟

#### 方法 2: 通过 Wrangler CLI

```bash
# 安装 Wrangler CLI
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 部署到 Cloudflare Pages
wrangler pages project create newyear-2026 --production-branch=main

# 或直接部署当前目录
wrangler pages deploy . --project-name=newyear-2026
```

### 第三步：验证部署

1. **获取部署 URL**
   - Cloudflare Pages 会提供一个类似 `https://newyear-2026.pages.dev` 的 URL
   - 在 Dashboard 中可以看到你的项目 URL

2. **测试功能**
   - 访问主页: `https://your-project.pages.dev/index.html`
   - 访问纯享模式: `https://your-project.pages.dev/firecracker.html`

3. **检查控制台**
   - 打开浏览器开发者工具（F12）
   - 检查是否有任何错误
   - 确认所有资源正确加载

---

## 🔄 自动部署

配置完成后，每次推送到 `main` 分支都会自动触发部署：

```bash
# 做一些修改
echo "# 测试修改" >> TEST.md

# 提交并推送
git add TEST.md
git commit -m "测试自动部署"
git push origin main

# Cloudflare Pages 会自动检测并重新部署
```

---

## 🌐 自定义域名（可选）

### 方法 1: 使用 Cloudflare 提供的域名

默认情况下，Cloudflare Pages 会提供：
```
https://your-project-name.pages.dev
```

### 方法 2: 使用自定义域名

1. **在 Cloudflare Pages 项目中**
   - 进入你的项目设置
   - 点击 "Custom domains"
   - 点击 "Set up a custom domain"

2. **添加域名**
   - 输入你的域名（如 `fireworks.yourdomain.com`）
   - Cloudflare 会自动配置 DNS

3. **更新 DNS（如果域名不在 Cloudflare）**
   - 添加 CNAME 记录指向你的 Pages 项目

---

## 🛠️ 配置文件说明

项目包含以下 Cloudflare Pages 配置文件：

### `_headers`
- 自定义 HTTP 头
- 确保正确的 MIME 类型
- 安全头配置

### `_redirects`
- URL 重定向规则
- 目前配置为默认路由

### `wrangler.toml`
- Wrangler CLI 配置文件
- 用于命令行部署

---

## 📊 部署检查清单

在部署前，确保：

- [ ] 所有文件已推送到 GitHub
- [ ] `.gitignore` 已配置（不包含备份文件）
- [ ] 资源文件（音频、图片）已包含在仓库中
- [ ] `_headers` 和 `_redirects` 文件已添加
- [ ] 项目可以在本地正常运行
- [ ] 使用 `bash start.sh` 测试本地运行

---

## 🐛 常见问题

### 1. 模块加载失败

**问题**: 浏览器控制台显示 "Failed to resolve module specifier"

**解决方案**:
- 确保所有 `.js` 文件使用正确的相对路径
- 检查 `_headers` 文件中的 MIME 类型配置
- 确认服务器正确设置 `Content-Type: application/javascript`

### 2. 音频无法播放

**问题**: 音频文件加载但无法播放

**解决方案**:
- 检查音频文件是否已推送到 GitHub
- 确认用户交互后才解锁 AudioContext
- 查看浏览器控制台的错误信息

### 3. 资源文件 404

**问题**: 图片或音频文件返回 404

**解决方案**:
- 检查文件路径大小写（区分大小写）
- 确认文件已包含在 git 仓库中
- 检查 `_headers` 文件中的路径配置

### 4. 部署失败

**问题**: Cloudflare Pages 部署失败

**解决方案**:
- 检查 Cloudflare Dashboard 中的部署日志
- 确保构建命令为空（我们不需要构建）
- 验证输出目录设置为 `/`

---

## 🔐 安全配置

项目已配置以下安全头：

```http
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

---

## 📈 性能优化

### 缓存策略

- **JavaScript 模块**: 1年缓存（immutable）
- **音频文件**: 1年缓存（immutable）
- **图片文件**: 1年缓存（immutable）
- **HTML 文件**: 不缓存（每次重新验证）

### CDN

Cloudflare Pages 自动提供：
- 全球 CDN 分发
- HTTP/3 支持
- 自动压缩
- 图片优化

---

## 🎉 部署成功后

部署成功后，你可以：

1. **分享链接**
   - 将项目 URL 分享给朋友
   - 在社交媒体上分享

2. **监控访问**
   - 在 Cloudflare Dashboard 查看访问统计
   - 分析流量来源

3. **持续改进**
   - 通过 Git 提交更新
   - 自动部署到生产环境

---

## 📝 更新项目

更新项目非常简单：

```bash
# 1. 修改文件
# 2. 测试本地运行
bash start.sh

# 3. 提交更改
git add .
git commit -m "描述你的更改"
git push origin main

# 4. Cloudflare Pages 自动部署
```

---

## 🆘 获取帮助

如果遇到问题：

1. 查看 Cloudflare Pages 文档: https://developers.cloudflare.com/pages/
2. 检查项目 Issues: https://github.com/YOUR_USERNAME/newyear-2026/issues
3. 查看浏览器控制台错误信息

---

**🎊 祝部署顺利！🎊**
