# DeepBlocks 快速開始指南
## Quick Start Guide

> **目標**: 10 分鐘內完成開發環境設定並啟動專案

---

## 📋 **前置需求檢查**

在開始之前，請確認您的系統已安裝：

### 必要軟體
- [ ] **Node.js** >= 18.0.0
- [ ] **Python** >= 3.10
- [ ] **Git**
- [ ] **Docker Desktop**（用於資料庫）

---

## 🔧 **Step 1: 安裝 Node.js**

### Linux (Ubuntu/Debian)
```bash
# 使用 NodeSource 安裝最新 LTS 版本
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 驗證安裝
node --version  # 應顯示 v20.x.x
npm --version   # 應顯示 10.x.x
```

### macOS
```bash
# 使用 Homebrew
brew install node@20

# 驗證
node --version
npm --version
```

### Windows
1. 下載並安裝：https://nodejs.org/zh-tw/download/
2. 選擇 LTS 版本（建議 20.x）
3. 開啟終端驗證：`node --version`

---

## 🚀 **Step 2: 初始化前端專案**

### 2.1 建立 React + TypeScript 專案
```bash
cd /project2/cookies/DeepBlocks

# 使用 Vite 建立專案（選擇 React + TypeScript）
npm create vite@latest frontend -- --template react-ts

cd frontend
npm install
```

### 2.2 啟動開發伺服器
```bash
npm run dev
```

**預期結果**：
- 終端顯示：`Local: http://localhost:5173/`
- 瀏覽器開啟後看到 Vite + React 歡迎頁面

---

## 🎨 **Step 3: 安裝 UI 元件庫**

### 3.1 設定 Tailwind CSS
```bash
# 在 frontend/ 目錄下執行
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 3.2 設定 Shadcn/UI
```bash
npx shadcn-ui@latest init
```

**互動式選項**（按順序選擇）：
```
✔ Would you like to use TypeScript? … Yes
✔ Which style would you like to use? › Default
✔ Which color would you like to use as base color? › Slate
✔ Where is your global CSS file? … src/index.css
✔ Would you like to use CSS variables for colors? … Yes
✔ Where is your tailwind.config.js located? … tailwind.config.js
✔ Configure the import alias for components: … @/components
✔ Configure the import alias for utils: … @/lib/utils
```

### 3.3 安裝常用元件
```bash
npx shadcn-ui@latest add button input slider tabs dropdown-menu scroll-area separator
```

---

## 📦 **Step 4: 安裝核心依賴**

```bash
# React Flow（圖形編輯器）
npm install reactflow

# Zustand（狀態管理）
npm install zustand

# 其他工具
npm install clsx tailwind-merge
npm install -D @types/node
```

---

## 🐍 **Step 5: 初始化後端專案**

### 5.1 建立 Python 虛擬環境
```bash
cd /project2/cookies/DeepBlocks
mkdir backend && cd backend

# 建立虛擬環境
python3 -m venv venv

# 啟動虛擬環境
source venv/bin/activate  # Linux/macOS
# 或
venv\Scripts\activate     # Windows
```

### 5.2 安裝 FastAPI
```bash
pip install fastapi uvicorn sqlalchemy psycopg2-binary python-jose[cryptography] passlib[bcrypt] python-multipart

# 生成 requirements.txt
pip freeze > requirements.txt
```

### 5.3 建立基礎結構
```bash
mkdir -p app/{api,models,schemas,services,utils}
touch app/__init__.py
touch app/main.py
touch app/config.py
```

### 5.4 創建簡單的 FastAPI 應用
```bash
cat > app/main.py << 'EOF'
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="DeepBlocks API", version="1.0.0")

# CORS 設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "DeepBlocks API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}
EOF
```

### 5.5 啟動後端
```bash
uvicorn app.main:app --reload
```

**預期結果**：
- 終端顯示：`Uvicorn running on http://127.0.0.1:8000`
- 訪問 http://127.0.0.1:8000/docs 看到 Swagger UI

---

## 🐳 **Step 6: 設定資料庫（Docker）**

### 6.1 安裝 Docker Desktop
- 下載：https://www.docker.com/products/docker-desktop/
- 安裝後啟動 Docker Desktop

### 6.2 建立 docker-compose.yml
```bash
cd /project2/cookies/DeepBlocks

cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: deepblocks
      POSTGRES_PASSWORD: devpassword
      POSTGRES_DB: deepblocks_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
EOF
```

### 6.3 啟動資料庫
```bash
docker-compose up -d

# 檢查狀態
docker-compose ps
```

---

## ✅ **Step 7: 驗證安裝**

### 檢查清單
```bash
# 1. 前端
cd /project2/cookies/DeepBlocks/frontend
npm run dev
# ✅ 訪問 http://localhost:5173 看到 Vite 頁面

# 2. 後端
cd /project2/cookies/DeepBlocks/backend
source venv/bin/activate
uvicorn app.main:app --reload
# ✅ 訪問 http://127.0.0.1:8000/docs 看到 API 文檔

# 3. 資料庫
docker-compose ps
# ✅ postgres 容器顯示 Up
```

---

## 📁 **最終專案結構**

```
DeepBlocks/
├── frontend/                  # ✅ Vite + React + TypeScript
│   ├── src/
│   │   ├── components/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                   # ✅ FastAPI
│   ├── venv/                  # 虛擬環境
│   ├── app/
│   │   ├── main.py
│   │   └── config.py
│   └── requirements.txt
│
├── docs/                      # ✅ 所有文檔
│   ├── CHANGELOG.md
│   ├── DEPLOYMENT.md
│   └── ...
│
├── docker-compose.yml         # ✅ PostgreSQL
├── prototype.html             # ✅ 互動原型參考
└── README.md
```

---

## 🎯 **下一步**

環境建置完成後，開始實作：

### Week 1 任務
1. ✅ 環境建置完成（以上步驟）
2. [ ] 建立三欄式佈局
3. [ ] 整合 React Flow
4. [ ] 實作左側節點庫
5. [ ] 實作右側屬性面板

**參考文檔**：`docs/implementation-phase1.md`

---

## 🆘 **常見問題**

### Q: npm 安裝失敗
**A**: 確保網路通暢，或使用淘寶鏡像：
```bash
npm config set registry https://registry.npmmirror.com
```

### Q: Python 虛擬環境無法啟動
**A**: 確認 Python 版本 >= 3.10
```bash
python3 --version
```

### Q: Docker 無法啟動
**A**: 確保 Docker Desktop 已啟動，檢查系統資源

### Q: Port 已被佔用（5173 或 8000）
**A**: 修改 port 或關閉佔用程式
```bash
# 前端改 port
vite --port 5174

# 後端改 port
uvicorn app.main:app --port 8001
```

---

## 📞 **需要幫助？**

- 📚 查看 `docs/implementation-phase1.md` 詳細步驟
- 🐛 檢查 `docs/CHANGELOG.md` 了解已知問題
- 💬 提交 GitHub Issue

---

**版本**: 1.0.0  
**最後更新**: 2026-01-04  
**預計完成時間**: 30-60 分鐘（取決於網路速度）
