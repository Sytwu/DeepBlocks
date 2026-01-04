# Git 工作流程指南
## Git Workflow Guide

> **目的**: 定義 DeepBlocks 專案的 Git 分支策略與提交規範

---

## 🌳 分支策略 (Branching Strategy)

### 分支類型

```
main (穩定版本，僅 Phase 完成後合併)
  │
  └─── dev (開發分支，Phase 進行中的工作)
         │
         ├─── feature/three-column-layout (功能分支)
         ├─── feature/node-system (功能分支)
         └─── feature/code-generation (功能分支)
```

### 分支說明

#### 1. `main` - 主分支（穩定版本）
**用途**: 僅用於穩定、經過測試的版本  
**合併時機**: 每個 Phase 完全完成後  
**保護規則**: 
- ✅ 僅接受來自 `dev` 分支的 PR 或 merge
- ✅ 每次合併必須附帶版本號（如 v0.1.0）
- ✅ 合併前必須通過驗收測試

**命名規範**:
- Phase 0 完成 → `v0.0.1`
- Phase 1 完成 → `v0.1.0` (MVP Alpha)
- Phase 2 完成 → `v0.2.0`
- Phase 3 完成 → `v0.3.0`
- Phase 4 完成 → `v0.4.0`
- Phase 5 完成 → `v1.0.0` (正式發布)

#### 2. `dev` - 開發分支
**用途**: Phase 進行中的工作  
**當前狀態**: Phase 1 開發中  
**推送頻率**: 每完成一個小功能就推送

**Commit 規範**:
```bash
# 新增功能
git commit -m "feat: add three-column layout component"

# 修復 Bug
git commit -m "fix: resolve node dragging issue"

# 文檔更新
git commit -m "docs: update implementation guide"

# 重構
git commit -m "refactor: optimize state management"
```

#### 3. `feature/*` - 功能分支
**用途**: 開發特定功能  
**命名格式**: `feature/<功能名稱>`  
**生命週期**: 功能完成後合併到 `dev`，然後刪除

**範例**:
- `feature/three-column-layout`
- `feature/node-library`
- `feature/property-panel`
- `feature/react-flow-integration`

---

## 📋 工作流程範例

### Phase 1 開發流程

#### Week 2: 三欄式佈局
```bash
# 1. 從 dev 創建功能分支
git checkout dev
git checkout -b feature/three-column-layout

# 2. 開發並提交
git add src/components/layout/
git commit -m "feat: implement three-column IDE layout"

# 3. 推送到遠端
git push origin feature/three-column-layout

# 4. 合併回 dev
git checkout dev
git merge feature/three-column-layout

# 5. 推送 dev
git push origin dev

# 6. 刪除功能分支（可選）
git branch -d feature/three-column-layout
```

#### Week 3: React Flow 整合
```bash
git checkout dev
git checkout -b feature/react-flow-integration
# ... 開發 ...
git commit -m "feat: integrate React Flow canvas"
git checkout dev
git merge feature/react-flow-integration
git push origin dev
```

#### Phase 1 完成後
```bash
# 1. 確認 dev 分支所有功能完成
git checkout dev
npm run build  # 前端建置測試
# ... 執行驗收測試 ...

# 2. 合併到 main
git checkout main
git merge dev

# 3. 打上版本標籤
git tag -a v0.1.0 -m "Release v0.1.0 - MVP Alpha

Phase 1 完成:
- 基礎畫布與節點拖曳
- 20+ 節點定義
- 自動屬性面板生成
- 節點搜尋功能"

# 4. 推送 main 和標籤
git push origin main
git push origin v0.1.0

# 5. 回到 dev 繼續下一個 Phase
git checkout dev
```

---

## 📝 Commit Message 規範

### 格式
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 類型
- `feat`: 新功能
- `fix`: Bug 修復
- `docs`: 文檔更新
- `style`: 格式調整（不影響程式碼運行）
- `refactor`: 重構
- `perf`: 效能優化
- `test`: 測試相關
- `chore`: 建置工具或輔助工具變動
- `ci`: CI/CD 相關

### Scope（選填）
- `frontend`: 前端相關
- `backend`: 後端相關
- `docs`: 文檔相關
- `registry`: 節點註冊表
- `compiler`: 程式碼生成器

### 範例
```bash
# 簡單版
git commit -m "feat: add Conv2d node definition"

# 完整版
git commit -m "feat(registry): add Conv2d node definition

Implement Conv2d layer node with:
- Parameter validation
- Python template generation
- Input/output shape inference

Closes #12"
```

---

## 🔄 日常工作流程

### 開始一天的工作
```bash
# 1. 切換到 dev 分支
git checkout dev

# 2. 拉取最新變更
git pull origin dev

# 3. 創建功能分支（如果開發新功能）
git checkout -b feature/my-feature
```

### 開發中
```bash
# 頻繁提交（每完成一小部分）
git add .
git commit -m "feat: implement basic layout"

# 定期推送到遠端備份
git push origin feature/my-feature
```

### 完成功能
```bash
# 1. 合併回 dev
git checkout dev
git merge feature/my-feature

# 2. 推送 dev
git push origin dev

# 3. 刪除功能分支
git branch -d feature/my-feature
git push origin --delete feature/my-feature  # 刪除遠端分支
```

---

## 🚨 緊急修復 (Hotfix)

如果 main 分支出現嚴重 bug：

```bash
# 1. 從 main 創建 hotfix 分支
git checkout main
git checkout -b hotfix/critical-bug

# 2. 修復並提交
git commit -m "fix: resolve critical rendering bug"

# 3. 合併回 main
git checkout main
git merge hotfix/critical-bug
git tag -a v0.1.1 -m "Hotfix v0.1.1 - Fix critical bug"
git push origin main
git push origin v0.1.1

# 4. 也合併到 dev
git checkout dev
git merge hotfix/critical-bug
git push origin dev

# 5. 刪除 hotfix 分支
git branch -d hotfix/critical-bug
```

---

## 📊 當前狀態

**主分支**: `main` (v0.0.1 - Phase 0 完成)  
**開發分支**: `dev` (Phase 1 進行中)  
**當前 Phase**: Phase 1 - MVP 基礎畫布  
**預計完成**: 2026-02-09

---

## 🔍 常用指令速查

```bash
# 查看所有分支
git branch -a

# 查看當前狀態
git status

# 查看提交歷史
git log --oneline --graph --all

# 查看某個 tag 的詳細資訊
git show v0.1.0

# 切換分支
git checkout <branch-name>

# 刪除本地分支
git branch -d <branch-name>

# 刪除遠端分支
git push origin --delete <branch-name>

# 查看所有 tag
git tag -l

# 推送特定 tag
git push origin <tag-name>
```

---

## ✅ 檢查清單

### 每次推送 dev 前
- [ ] 程式碼可正常運行
- [ ] 無明顯 console 錯誤
- [ ] Commit message 清晰明瞭

### Phase 完成合併到 main 前
- [ ] 所有功能已實作完成
- [ ] 通過基本測試
- [ ] 文檔已更新（CHANGELOG.md）
- [ ] 建置成功（`npm run build`）
- [ ] 版本號已規劃

### 發布新版本時
- [ ] 更新 CHANGELOG.md
- [ ] 打上版本標籤
- [ ] 推送 tag 到遠端
- [ ] （選填）創建 GitHub Release

---

**版本**: 1.0.0  
**最後更新**: 2026-01-04  
**適用於**: DeepBlocks Phase 1-5
