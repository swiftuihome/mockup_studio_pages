# 部署问题排查与修复记录 (Deployment Troubleshooting)

本文档记录了 `mockup_studio_pages` 项目在部署到 GitHub Pages 过程中遇到的网络连接、路径配置及资源加载问题及其详细解决方案。

## 1. Git 推送失败 (SSL_ERROR_SYSCALL)

### 问题描述
在执行 `git push` 时遇到以下错误，导致无法连接到 GitHub：
```bash
fatal: unable to access 'https://github.com/swiftuihome/mockup_studio_pages.git/': 
LibreSSL SSL_connect: SSL_ERROR_SYSCALL in connection to github.com:443
```

### 原因分析
由于本地网络环境限制，通过 HTTPS 协议直接访问 `github.com` 的 443 端口被阻断。

### 解决方案
切换远程仓库地址，使用 SSH 协议并通过 `ssh.github.com` 的 443 端口绕过 HTTPS 阻断。

1.  **检查 SSH 配置** (`~/.ssh/config`)：确保已配置通过 `hostname ssh.github.com` 连接的别名。
    ```ssh
    Host github.com-swiftuihome
        HostName ssh.github.com
        Port 443
        User git
        IdentityFile ~/.ssh/id_ed25519_swiftuihome
    ```
2.  **修改远程仓库 URL**：
    ```bash
    git remote set-url origin git@github.com-swiftuihome:swiftuihome/mockup_studio_pages.git
    ```
3.  **验证连接**：之前的 `https` 协议被替换为 `git+ssh` 协议，成功绕过 HTTPS 干扰。

---

## 2. 部署后页面白屏 (404)

### 问题描述
GitHub Action 构建并部署成功后，访问页面 `https://swiftuix.com/mockup_studio_pages/` 显示空白。浏览器控制台报错显示资源加载失败。

### 原因分析
`vite.config.js` 中的 `base` 路径配置错误。
*   **错误配置**：`base: '/mockup_studio_page/'` (少了一个 `s`)
*   **实际仓库名**：`mockup_studio_pages`

这导致 HTML 中引用的 JS/CSS 资源路径不匹配实际部署的子目录，服务器返回 404。

### 解决方案
修正 `vite.config.js` 中的 `base` 配置：
```javascript
export default defineConfig({
    // ...
    base: '/mockup_studio_pages/', // 确保与 GitHub 仓库名称一致
})
```

---

## 3. 静态资源加载失败 (Data & Images 404)

### 问题描述
页面加载后，控制台显示以下错误：
```
GET https://swiftuix.com/data/app_data.json 404 (Not Found)
Error fetching data: Error: Network response was not ok
```
背景图片和封面图片也无法显示。

### 原因分析
代码中使用了硬编码的绝对路径（如 `/data/app_data.json`）。
*   在本地开发（`localhost:5173`）时，根路径即为项目根目录，可以正常访问。
*   在 GitHub Pages 部署（`https://example.com/repo-name/`）时，`/data/...` 会指向域名的根目录（`https://example.com/data/...`），而不是仓库子目录，导致资源找不到。

### 解决方案
在 `src/main.js` 中引入 Vite 提供的环境变量 `import.meta.env.BASE_URL`，动态拼接资源路径。

**修改前**：
```javascript
fetch('/data/app_data.json')
style="background-image: url('/images/MockupStudio.jpg');"
```

**修改后**：
```javascript
// 自动根据 vite.config.js 中的 base 配置拼接路径
fetch(import.meta.env.BASE_URL + 'data/app_data.json')

// 图片路径动态拼接
element.style.backgroundImage = `url('${import.meta.env.BASE_URL}images/MockupStudio.jpg')`;
```

通过以上修复，所有资源均能正确指向 `/mockup_studio_pages/` 子目录下。
