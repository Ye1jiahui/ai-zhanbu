# AI Tarot Table

沉浸式塔罗占卜网页：前端部署到 GitHub Pages，AI 解读通过腾讯云函数调用 DeepSeek。

## 本地开发

```bash
npm install
npm run dev
```

如果还没有部署腾讯云函数，可以不配置 `.env`，页面会显示本地预览解读。接入云函数后复制 `.env.example`：

```bash
cp .env.example .env
```

然后填写公开函数 URL：

```text
VITE_TAROT_API_URL=https://1457336238-91vkr9tkvt.ap-guangzhou.tencentscf.com
```

如果你想本地直接联调，也可以把同样的值写进 `.env.local`，Vite 会自动读取。

## 部署

1. 在腾讯云函数中部署 `functions/tencent/index.js`。
2. 在腾讯云函数环境变量中配置：
   - `DEEPSEEK_API_KEY`
   - `DEEPSEEK_MODEL=deepseek-v4-flash`
   - `ALLOWED_ORIGINS=http://localhost:5173,https://<user>.github.io`
3. 在 GitHub Pages 构建里，`.github/workflows/pages.yml` 已经写死当前函数 URL。
4. 如果你后面更换了腾讯云函数，再同步修改 workflow 里的 URL。
5. 在 GitHub Pages 设置里选择 GitHub Actions。
6. 如果 Actions 里 `configure-pages` 还报 `Get Pages site failed`，在仓库 Secrets 里新增 `PAGES_TOKEN`（一个有 Pages/Repo 写权限的 GitHub PAT），workflow 会自动用它完成 Pages 启用。
7. 推送到 `main` 后由 `.github/workflows/pages.yml` 构建并发布。

## 设计说明

首屏不是营销页，而是完整牌桌：输入问题、选择牌阵、洗牌、翻牌、获得解读都在同一条体验路径里完成。视觉采用深色牌桌、旧金细线和纸质牌面，避免泛紫渐变和模板化卡片堆叠。

卡片图像是项目内置的本地静态 SVG 牌面，生成在 `public/assets/tarot/`，上线后不依赖外部图片服务。

## 隐私

首版不做登录、数据库或历史记录。前端只保留当前会话状态；云函数只转发本次解读请求，不主动保存用户问题。
