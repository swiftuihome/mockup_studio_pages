# Mockup Studio Page

这是一个 Apple App Beta 下载页项目。

## 项目设置

### 安装依赖

```bash
pnpm install
```

### 本地开发

```bash
pnpm run dev
```

### 构建生产版本

```bash
pnpm run build
```

## GitHub Pages 自动部署

本项目包含一个 GitHub Actions 工作流（`.github/workflows/deploy.yml`），当代码推送到 `main` 分支时，会自动构建项目并将结果部署到 GitHub Pages。

### 配置步骤

1.  **配置 Vite Base 路径**
    
    确保 `vite.config.js` 中的 `base` 路径配置为您的仓库名称（已配置）：
    
    ```javascript
    export default defineConfig({
      // ...
      base: '/mockup_studio_page/', 
    })
    ```

2.  **推送到 GitHub**

    初始化 Git 仓库（如果尚未初始化）并将代码推送到 GitHub：

    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    # 请将下面的 URL 替换为您的 GitHub 仓库地址
    git remote add origin https://github.com/<your-username>/mockup_studio_page.git
    git push -u origin main
    ```

3.  **启用 GitHub Pages**

    首次推送后，GitHub Action 会自动运行并创建一个 `gh-pages` 分支。待 Action 执行成功后：

    1.  进入 GitHub 仓库的 **Settings**（设置）。
    2.  在左侧菜单栏找到 **Pages**（页面）选项。
    3.  在 **Build and deployment**（构建与部署）下，确认来源设置为 **Deploy from a branch**（从分支部署）。
    4.  选择 **gh-pages** 分支和 **/(root)** 文件夹。
    5.  点击 **Save**（保存）。

    您的页面将会在 `https://<your-username>.github.io/mockup_studio_page/` 上线。

### 工作流详情

部署工作流定义在 `.github/workflows/deploy.yml` 中。它执行以下步骤：
- 检出代码。
- 安装 `pnpm` (版本 9)。
- 设置 Node.js 环境 (版本 20)。
- 安装依赖。
- 构建项目 (`pnpm run build`)。
- 将 `dist` 文件夹部署到 `gh-pages` 分支。
