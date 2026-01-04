# DeepBlocks 部署指南
## GitHub Pages 部署完整教學

> **確認**：✅ DeepBlocks 可以完美部署在 GitHub Pages 上

---

## 📌 **為什麼可以用 GitHub Pages？**

根據您的需求分析：
- ✅ **前端**：純 React 靜態應用（Vite 打包）
- ✅ **初期專案儲存**：使用 LocalStorage（瀏覽器本地）
- ✅ **PWA**：支援離線使用
- ⚠️ **後端**（可選）：使用者登入與雲端儲存需要額外服務

**結論**：第一版完全可以用 GitHub Pages 部署，後期再加入後端服務！

---

## 🚀 **部署步驟**

### 方案一：自動化部署（推薦）

#### Step 1: 安裝 gh-pages
```bash
cd frontend
npm install --save-dev gh-pages
```

#### Step 2: 修改 package.json
```json
{
  "name": "deepblocks-frontend",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "vite build && gh-pages -d dist"
  },
  "homepage": "https://YOUR_USERNAME.github.io/DeepBlocks"
}
```

#### Step 3: 修改 vite.config.ts
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/DeepBlocks/',  // 改成你的 repo 名稱
})
```

#### Step 4: 部署
```bash
npm run deploy
```

#### Step 5: 啟用 GitHub Pages
1. 到 GitHub repo → Settings → Pages
2. Source 選擇 `gh-pages` branch
3. 等待 1-2 分鐘
4. 訪問 `https://YOUR_USERNAME.github.io/DeepBlocks`

---

### 方案二：GitHub Actions 自動部署

#### 創建 .github/workflows/deploy.yml
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd frontend
          npm install
      
      - name: Build
        run: |
          cd frontend
          npm run build
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./frontend/dist
```

**優點**：每次 push 到 main 就自動部署，無需手動執行！

---

## 🔧 **LocalStorage 暫存專案**

初期不用後端，用瀏覽器儲存專案：

```typescript
// src/utils/storage.ts
export const saveProject = (projectData) => {
  const projects = JSON.parse(localStorage.getItem('deepblocks_projects') || '[]');
  projects.push({
    id: Date.now(),
    name: projectData.name,
    data: projectData,
    updatedAt: new Date().toISOString()
  });
  localStorage.setItem('deepblocks_projects', JSON.stringify(projects));
};

export const loadProjects = () => {
  return JSON.parse(localStorage.getItem('deepblocks_projects') || '[]');
};

export const exportProject = (project) => {
  const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${project.name}.json`;
  a.click();
};
```

**優點**：
- 無需後端
- 立即可用
- 用戶可匯出 JSON 備份

**限制**：
- 無法跨裝置同步
- 清除瀏覽器資料會遺失

---

## 🌐 **PWA 設定（離線支援）**

### Step 1: 安裝 vite-plugin-pwa
```bash
npm install -D vite-plugin-pwa
```

### Step 2: 修改 vite.config.ts
```typescript
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'DeepBlocks',
        short_name: 'DeepBlocks',
        description: '視覺化機器學習拖曳平台',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ]
})
```

**效果**：
- ✅ 可安裝到桌面/手機
- ✅ 離線使用（重要！）
- ✅ 快速載入

---

## 🔮 **未來加入後端（可選）**

### 後端部署選項

| 服務 | 優點 | 免費額度 |
|------|------|----------|
| **Railway** | 最簡單，支援 FastAPI | 每月 500 小時 |
| **Render** | 自動部署，穩定 | 750 小時/月 |
| **Vercel** (Serverless) | 與前端同平台 | 100GB 頻寬 |
| **Fly.io** | 全球部署 | 3GB 儲存 |

### 混合架構
```
前端（GitHub Pages）
    ↓ HTTPS API 請求
後端（Railway）
    ↓
資料庫（Supabase/MongoDB Atlas）
```

**優點**：
- 前端免費無限流量
- 後端獨立擴展
- 可逐步遷移

---

## ✅ **部署檢查清單**

### 部署前
- [ ] `npm run build` 成功
- [ ] 檢查 dist/ 目錄有檔案
- [ ] vite.config.ts 的 base 設定正確

### 部署後
- [ ] 網站可正常訪問
- [ ] 拖曳功能正常
- [ ] LocalStorage 儲存有效
- [ ] PWA 可安裝（在瀏覽器地址欄看到安裝圖示）

### SEO 優化（選配）
- [ ] 添加 robots.txt
- [ ] 添加 sitemap.xml
- [ ] 設定 Open Graph meta tags

---

## 🎯 **總結**

### 第一版部署策略
1. **立即可用**：GitHub Pages（免費、穩定）
2. **專案儲存**：LocalStorage（簡單、無需後端）
3. **離線支援**：PWA（提升用戶體驗）

### 未來擴展（v1.1+）
1. **使用者認證**：加入 Railway 後端
2. **雲端同步**：專案儲存到資料庫
3. **協作功能**：WebSocket 即時同步

---

## 📚 **參考資源**

- [GitHub Pages 官方文檔](https://docs.github.com/pages)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)
- [PWA 完整教學](https://web.dev/progressive-web-apps/)

---

**結論**：✅ 完全可以部署在 GitHub Pages，無需擔心！

**下一步**：測試原型 → 開始開發 → 部署第一版
