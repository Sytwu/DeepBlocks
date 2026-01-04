# DeepBlocks 開發路線圖
## Development Roadmap

> **版本**：1.0.0  
> **預計總時程**：8-10 週（第一版完成）  
> **開始日期**：2026-01-06

---

## 🎯 **整體目標與階段劃分**

### 階段概覽

```
Phase 0: 環境建置 (1 週)
    ↓
Phase 1: MVP - 基礎畫布 (2 週)
    ↓
Phase 2: 節點系統 (2 週)
    ↓
Phase 3: 程式碼生成 (1.5 週)
    ↓
Phase 4: 後端與認證 (1.5 週)
    ↓
Phase 5: 優化與部署 (1 週)
    ↓
🚀 第一版發布
```

---

## 📅 **Phase 0: 環境建置與專案初始化**
**時程**：第 1 週（1/6 - 1/12）  
**目標**：建立開發環境，確保所有工具鏈就緒

### 產出清單
- [ ] 前端專案初始化（Vite + React + TypeScript）
- [ ] Shadcn/UI + Tailwind CSS 設定完成
- [ ] React Flow 基礎整合
- [ ] Zustand 狀態管理架構
- [ ] 後端專案初始化（FastAPI + PostgreSQL）
- [ ] Git 版本控制與分支策略
- [ ] CI/CD Pipeline（GitHub Actions）

### 技術任務
1. **前端設置**
   ```bash
   npm create vite@latest frontend -- --template react-ts
   cd frontend
   npx shadcn-ui@latest init
   npm install react-flow-renderer zustand
   ```

2. **後端設置**
   ```bash
   mkdir backend && cd backend
   python -m venv venv
   source venv/bin/activate
   pip install fastapi uvicorn sqlalchemy psycopg2-binary
   ```

3. **開發環境**
   - VS Code + 推薦擴充套件（ESLint, Prettier, Tailwind CSS IntelliSense）
   - Docker Desktop（PostgreSQL 容器）
   - Postman / Thunder Client（API 測試）

### 驗收標準
✅ 前端可啟動並顯示 "Hello World"  
✅ 後端可啟動並回應 `/health` 端點  
✅ 資料庫連線成功

---

## 📅 **Phase 1: MVP - 基礎畫布與節點拖曳**
**時程**：第 2-3 週（1/13 - 1/26）  
**目標**：實現最基本的節點編輯器功能

### 產出清單
- [ ] 三欄式 IDE 佈局完成
- [ ] React Flow 畫布基礎功能（拖曳、縮放、平移）
- [ ] 左側節點庫（2 個示範節點：Input, Conv2d）
- [ ] 右側屬性面板（基礎版，靜態表單）
- [ ] 節點可拖曳到畫布
- [ ] 節點間可連線
- [ ] Mini Map 顯示

### 技術任務

#### 1.1 建立佈局架構
```tsx
// src/components/layout/AppLayout.tsx
<div className="app-layout">
  <Header />
  <div className="main-content">
    <NodeLibrary />  {/* 左：280px */}
    <FlowCanvas />   {/* 中：flex-1 */}
    <PropertyPanel /> {/* 右：350px */}
  </div>
</div>
```

#### 1.2 React Flow 整合
```tsx
// src/components/flow/FlowCanvas.tsx
import ReactFlow, { Controls, Background, MiniMap } from 'react-flow-renderer';

export const FlowCanvas = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
    >
      <Background variant="dots" />
      <Controls />
      <MiniMap />
    </ReactFlow>
  );
};
```

#### 1.3 建立 2 個示範節點
- **Input 節點**：簡單的資料輸入節點
- **Conv2d 節點**：展示參數編輯

### 驗收標準
✅ 可從左側拖曳節點到畫布  
✅ 節點間可成功連線  
✅ 畫布支援縮放、平移  
✅ 點擊節點後右側顯示屬性面板  
✅ Mini Map 正確顯示畫布內容

### 技術風險
⚠️ **React Flow 學習曲線**  
**解決方案**：先研讀官方範例，從最簡單的 Demo 開始

---

## 📅 **Phase 2: 節點系統與 Registry**
**時程**：第 4-5 週（1/27 - 2/9）  
**目標**：實現完整的節點定義系統與自動表單生成

### 產出清單
- [ ] Registry 架構完成（types.ts + definitions/）
- [ ] 20+ 基礎節點定義完成
  - Data Processing: Input, ImageLoader, DataLoader, Output
  - Layers: Conv2d, Conv3d, Linear, MaxPool2d, AvgPool2d, BatchNorm2d, Dropout
  - Activations: ReLU, LeakyReLU, Sigmoid, Tanh, Softmax
  - Operations: Add, Concat, Reshape
  - Blocks: ResNet Block, Transformer Encoder, U-Net Block
- [ ] 自動表單生成器（根據 ParamConfig）
- [ ] 節點分類系統（4 大類）
- [ ] 節點搜尋功能

### 技術任務

#### 2.1 定義核心 Interface
```typescript
// src/registry/types.ts
export interface NodeDefinition {
  id: string;
  label: string;
  category: string;
  params: ParamConfig[];
  inputs: IOConfig[];
  outputs: IOConfig[];
  pythonTemplate: (params, inputs, outputVar) => string;
  // ...
}
```

#### 2.2 建立節點定義（範例）
```typescript
// src/registry/definitions/model-architecture/layers/conv2d.ts
export const Conv2dDef: NodeDefinition = {
  id: 'conv2d',
  label: 'Conv2d',
  category: 'Model Architecture/Layers',
  params: [
    { name: 'in_channels', type: 'int', default: 3 },
    { name: 'out_channels', type: 'int', default: 64 },
    // ...
  ],
  pythonTemplate: (params, inputs, outputVar) => {
    return `${outputVar} = nn.Conv2d(...)(${inputs.input})`;
  }
};
```

#### 2.3 屬性面板自動生成
```tsx
// src/components/panels/PropertyPanel.tsx
const PropertyPanel = ({ selectedNode }) => {
  const nodeDef = getNodeDefinition(selectedNode.type);
  
  return (
    <div>
      {nodeDef.params.map(param => (
        <FormField key={param.name} config={param} />
      ))}
    </div>
  );
};
```

#### 2.4 左側節點庫分類
```tsx
// src/components/panels/NodeLibrary.tsx
const categories = [
  'Data Processing',
  'Model Architecture',
  'Training',
  'Evaluation'
];
```

### 驗收標準
✅ 所有 20+ 節點可正常拖曳到畫布  
✅ 屬性面板根據節點類型自動生成對應表單  
✅ Slider、Dropdown 等控制元件正常運作  
✅ 節點庫支援搜尋功能（模糊匹配）  
✅ Advanced 參數可摺疊

### 技術風險
⚠️ **Registry 設計過於複雜**  
**解決方案**：先實作 3 個節點驗證架構，再批量生成其他節點

---

## 📅 **Phase 3: 程式碼生成引擎**
**時程**：第 6-7 週前半（2/10 - 2/19）  
**目標**：實現 PyTorch 程式碼即時生成

### 產出清單
- [ ] 拓撲排序演算法（確保程式碼順序正確）
- [ ] 變數管理器（自動命名：x1, x2...）
- [ ] 模組化程式碼生成（model.py, train.py, config.py）
- [ ] Python 程式碼格式化（使用 Prettier 或類似工具）
- [ ] 右側面板新增 "Code Preview" Tab
- [ ] 程式碼可編輯 + 雙向同步（選配）
- [ ] 下載 ZIP 功能

### 技術任務

#### 3.1 拓撲排序
```typescript
// src/compiler/topological.ts
export function topologicalSort(nodes, edges) {
  // Kahn's Algorithm
  const sorted = [];
  const inDegree = new Map();
  // ... 實作細節
  return sorted;
}
```

#### 3.2 程式碼生成器
```typescript
// src/compiler/generator.ts
export function generatePyTorchCode(graph) {
  const sortedNodes = topologicalSort(graph.nodes, graph.edges);
  
  const modelCode = generateModelPy(sortedNodes);
  const trainCode = generateTrainPy();
  const configCode = generateConfigPy();
  
  return { modelCode, trainCode, configCode };
}
```

#### 3.3 模板系統
```typescript
// src/compiler/templates/model-template.ts
export const modelTemplate = (layers: string[]) => `
import torch
import torch.nn as nn

class CustomModel(nn.Module):
    def __init__(self):
        super().__init__()
        ${layers.join('\n        ')}
    
    def forward(self, x):
        ${/* forward logic */}
        return x
`;
```

#### 3.4 ZIP 打包
```typescript
// src/utils/file-export.ts
import JSZip from 'jszip';

export async function exportAsZip(codes) {
  const zip = new JSZip();
  zip.file('model.py', codes.modelCode);
  zip.file('train.py', codes.trainCode);
  zip.file('config.py', codes.configCode);
  zip.file('README.md', generateReadme());
  
  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, 'deepblocks-project.zip');
}
```

### 驗收標準
✅ 畫布變動時程式碼即時更新  
✅ 生成的程式碼可在 Python 中執行  
✅ 模組化輸出結構清晰  
✅ 程式碼符合 PEP 8 規範  
✅ ZIP 檔案包含所有必要檔案

### 技術風險
⚠️ **複雜圖結構的程式碼生成錯誤**  
**解決方案**：先從線性架構測試，逐步增加複雜度（分支、合併）

---

## 📅 **Phase 4: 後端服務與使用者認證**
**時程**：第 7 週後半 - 第 8 週（2/20 - 3/2）  
**目標**：實現使用者登入與專案雲端儲存

### 產出清單
- [ ] FastAPI 後端架構完成
- [ ] PostgreSQL 資料庫 Schema
- [ ] JWT 認證系統
- [ ] 使用者註冊/登入 API
- [ ] 專案 CRUD API
- [ ] 前端整合登入功能
- [ ] 專案自動儲存（Auto-save）
- [ ] 專案列表頁面

### 技術任務

#### 4.1 資料庫 Schema
```sql
-- users 表
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- projects 表
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  data JSONB NOT NULL,
  preview_image TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 4.2 認證 API
```python
# backend/app/api/auth.py
from fastapi import APIRouter, Depends
from app.services.auth_service import AuthService

router = APIRouter()

@router.post("/register")
async def register(user_data: UserCreate):
    return await AuthService.register(user_data)

@router.post("/login")
async def login(credentials: LoginRequest):
    return await AuthService.login(credentials)
```

#### 4.3 前端整合
```typescript
// src/store/authStore.ts
export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  login: async (email, password) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    const { access_token, user } = await response.json();
    set({ token: access_token, user });
  }
}));
```

### 驗收標準
✅ 使用者可註冊/登入  
✅ JWT Token 正確儲存與驗證  
✅ 專案可儲存到雲端  
✅ 專案列表可正確載入  
✅ Auto-save 每 30 秒觸發一次

### 技術風險
⚠️ **資料庫連線與部署問題**  
**解決方案**：先用 Docker 本地測試，確認無誤後再部署到雲端

---

## 📅 **Phase 5: 優化、測試與部署**
**時程**：第 9-10 週（3/3 - 3/16）  
**目標**：效能優化、bug 修復、正式上線

### 產出清單
- [ ] 效能優化（大型圖性能測試）
- [ ] 錯誤檢查功能（Tensor 形狀驗證）
- [ ] 預設範例載入（3 個範例）
- [ ] 論文級視覺化（至少 3 個複雜節點的架構圖）
- [ ] PWA 設定（支援離線）
- [ ] 部署到 Vercel + Railway
- [ ] README 與文檔完善
- [ ] Demo 影片錄製

### 技術任務

#### 5.1 錯誤檢查
```typescript
// src/utils/validation.ts
export function validateGraph(nodes, edges) {
  for (const edge of edges) {
    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);
    
    const sourceShape = getOutputShape(sourceNode);
    const targetShape = getExpectedInputShape(targetNode);
    
    if (!shapesMatch(sourceShape, targetShape)) {
      return {
        valid: false,
        error: `Shape mismatch: ${sourceShape} -> ${targetShape}`
      };
    }
  }
  return { valid: true };
}
```

#### 5.2 預設範例
```json
// public/examples/mnist-classifier.json
{
  "projectName": "MNIST Classifier",
  "graph": {
    "nodes": [/* ... */],
    "edges": [/* ... */]
  }
}
```

#### 5.3 PWA 設定
```typescript
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'DeepBlocks',
        short_name: 'DeepBlocks',
        description: '視覺化機器學習拖曳平台',
        theme_color: '#0f172a'
      }
    })
  ]
});
```

#### 5.4 部署
```bash
# 前端部署到 Vercel
vercel --prod

# 後端部署到 Railway
railway up
```

### 驗收標準
✅ 50+ 節點的圖可流暢運作  
✅ 錯誤檢查可捕捉常見問題  
✅ 3 個預設範例可一鍵載入  
✅ PWA 可離線使用基礎功能  
✅ 部署成功，可公開存取  
✅ README 包含 Demo GIF 與使用說明

---

## 🚀 **Post-Launch: 未來迭代計畫**

### v1.1（發布後 1 個月）
- [ ] 巢狀節點/子圖功能
- [ ] 自訂節點（UI 介面定義）
- [ ] 更多預設範例（Stable Diffusion, YOLO）
- [ ] 多語言完整支援

### v1.2（發布後 3 個月）
- [ ] AI 搜尋節點（自然語言）
- [ ] 即時協作功能（Multi-user）
- [ ] 程式碼驗證服務（Colab 整合）

### v2.0（發布後 6 個月）
- [ ] TensorFlow 支援
- [ ] 自動化 Hyperparameter Tuning
- [ ] 社群節點庫（使用者分享）

---

## 📊 **關鍵指標 (KPIs)**

### 開發階段
- **程式碼覆蓋率**：> 70%
- **TypeScript 型別覆蓋**：100%
- **API 回應時間**：< 200ms
- **前端 Bundle Size**：< 500KB (gzipped)

### 上線後
- **週活躍使用者 (WAU)**：目標 100 人（第一個月）
- **專案建立數**：目標 500 個
- **平均使用時長**：> 15 分鐘
- **轉換率（註冊 → 建立專案）**：> 60%

---

## ⚠️ **風險管理**

| 風險 | 影響 | 機率 | 緩解策略 |
|------|------|------|----------|
| React Flow 學習曲線陡峭 | 高 | 中 | 提前研讀文檔，先做簡單 Demo |
| 程式碼生成邏輯複雜 | 高 | 高 | 從簡單架構開始，逐步增加複雜度 |
| 後端部署問題 | 中 | 中 | 先用 Docker 本地測試 |
| 效能問題（大型圖） | 中 | 低 | 預留優化時間，虛擬化渲染 |
| 時程延誤 | 中 | 中 | 每週 Review 進度，調整優先級 |

---

## ✅ **總結**

- **總時程**：8-10 週
- **核心里程碑**：5 個 Phase
- **總節點數**：20+ 個（第一版）
- **部署平台**：Vercel (前端) + Railway (後端)
- **授權**：MIT

**第一版發布目標日期**：2026 年 3 月中旬  
**Beta 測試開始**：2026 年 2 月底

---

**文件版本**：1.0.0  
**最後更新**：2026-01-04  
**維護者**：DeepBlocks Team
