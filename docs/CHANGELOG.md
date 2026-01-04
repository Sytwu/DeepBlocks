# DeepBlocks 變更記錄
## CHANGELOG

本文件記錄 DeepBlocks 專案的所有重大變更。

格式基於 [Keep a Changelog](https://keepachangelog.com/zh-TW/1.0.0/)，版本號遵循 [語意化版本](https://semver.org/lang/zh-TW/)。

---

## [未發布] - 進行中

### Phase 0: 專案規劃 ✅
**日期**: 2026-01-04

#### 新增
- ✅ 完整設計問卷與用戶需求分析
- ✅ 技術選型分析文檔（UI 元件庫、後端框架）
- ✅ 技術規格文件（系統架構、API 設計、資料結構）
- ✅ 開發路線圖（5 個階段、8-10 週時程）
- ✅ 第一階段實作清單（詳細步驟）
- ✅ 視覺設計指南（節點樣式、配色系統）
- ✅ 互動式 HTML 原型（可拖曳節點、屬性編輯）
- ✅ GitHub Pages 部署指南
- ✅ 文檔管理系統（CHANGELOG.md）

#### 決策
- **前端框架**: React + TypeScript + Vite
- **UI 元件庫**: Shadcn/UI + Tailwind CSS
- **圖形庫**: React Flow
- **狀態管理**: Zustand
- **後端框架**: FastAPI + PostgreSQL
- **部署策略**: GitHub Pages (前端) + Railway (後端)

#### 文檔結構
```
DeepBlocks/
├── docs/                          # 📚 所有規劃文檔
│   ├── design-questionnaire.md    # 設計問卷
│   ├── clarifications-and-tech-analysis.md  # 技術分析
│   ├── technical-specification.md # 技術規格
│   ├── development-roadmap.md     # 開發路線圖
│   ├── implementation-phase1.md   # 實作清單
│   ├── visual-design-guide.md     # 視覺設計
│   ├── DEPLOYMENT.md              # 部署指南
│   └── CHANGELOG.md               # 本文件
├── prototype.html                 # 互動式原型
└── deepblock-spec.md              # 原始規格
```

---

## [即將開始] - Phase 0: 環境建置

### 預計完成日期
2026-01-12（第 1 週）

### 規劃項目
- [ ] 前端專案初始化（Vite + React + TypeScript）
- [ ] Shadcn/UI 設定與元件安裝
- [ ] React Flow 整合
- [ ] Zustand 狀態管理架構
- [ ] 後端專案初始化（FastAPI）
- [ ] PostgreSQL Docker 容器設定
- [ ] Git 版本控制與分支策略
- [ ] CI/CD Pipeline（GitHub Actions）

### 預期產出
- ✅ 前端可啟動並顯示 "Hello World"
- ✅ 後端可啟動並回應 `/health` 端點
- ✅ 資料庫連線成功
- ✅ 基礎三欄式佈局顯示

---

## 版本規劃

### v0.1.0 - MVP Alpha（目標：2026-02-09）
**Phase 1-2 完成**
- 基礎畫布與節點拖曳
- 20+ 節點定義完成
- 自動屬性面板生成
- 節點搜尋功能

### v0.2.0 - 程式碼生成（目標：2026-02-23）
**Phase 3 完成**
- 拓撲排序演算法
- PyTorch 程式碼生成
- 模組化輸出（model.py, train.py, config.py）
- ZIP 下載功能

### v0.3.0 - 後端整合（目標：2026-03-09）
**Phase 4 完成**
- 使用者認證（JWT）
- 專案雲端儲存
- 專案列表與管理

### v1.0.0 - 正式發布（目標：2026-03-16）
**Phase 5 完成**
- 效能優化
- 錯誤檢查功能
- 3 個預設範例
- 論文級視覺化
- PWA 離線支援
- 完整部署

---

## 重大變更說明

### 為什麼選擇 Shadcn/UI？
- **高度客製化**: 程式碼在專案內，AI 可直接修改
- **現代化設計**: 2024-2026 主流選擇
- **Tailwind 整合**: 完美配合暗色模式切換
- **專業工具風格**: 符合類 IDE 的專案定位

### 為什麼選擇 FastAPI？
- **Python 生態整合**: 與 PyTorch 同語言
- **極快開發速度**: 自動生成 API 文檔
- **高效能**: 接近 Node.js 速度
- **未來擴充性**: 可整合 ML 功能（程式碼驗證）

### 為什麼先用 LocalStorage？
- **快速上線**: 無需等待後端開發
- **GitHub Pages 友善**: 純靜態部署
- **漸進式增強**: 後期可無縫升級到雲端儲存

---

## 貢獻指南

### 文檔更新規範
1. 所有文檔放在 `docs/` 目錄
2. 重大變更必須更新本 CHANGELOG
3. 使用繁體中文（專有名詞保留英文）
4. 遵循 Markdown 格式規範

### Changelog 格式
- **新增 (Added)**: 新功能
- **變更 (Changed)**: 現有功能的變更
- **棄用 (Deprecated)**: 即將移除的功能
- **移除 (Removed)**: 已移除的功能
- **修復 (Fixed)**: 錯誤修復
- **安全性 (Security)**: 安全性相關變更

---

**文檔版本**: 1.0.0  
**最後更新**: 2026-01-04  
**維護者**: DeepBlocks Team
