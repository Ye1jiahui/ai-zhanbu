# 腾讯云函数配置

这个目录是 DeepSeek 解读后端示例。GitHub Pages 只托管前端，API Key 必须放在腾讯云函数环境变量里。

## 环境变量

- `DEEPSEEK_API_KEY`：DeepSeek API Key。
- `DEEPSEEK_MODEL`：默认 `deepseek-v4-flash`。
- `ALLOWED_ORIGINS`：逗号分隔，例如 `http://localhost:5173,https://<user>.github.io`。

## 函数 URL

- 开启公网访问。
- 授权类型选择开放。
- 允许 `POST` 和 `OPTIONS`。
- 关闭 `Allow-Credentials`。
- 前端 `.env` 中填写完整接口地址：

```text
VITE_TAROT_API_URL=https://<your-function-url>.tencentscf.com
```
