# DeepBlocks Phase 1 實作清單
## 第一階段：環境建置與 MVP 開發

> **目標**：完成開發環境設置，並實現基礎的節點拖曳與屬性編輯功能  
> **時程**：第 1-3 週  
> **產出**：可運作的基礎節點編輯器

---

## 🚀 **Week 1: 環境建置**

### Day 1-2: 前端專案初始化

#### Step 1: 建立 Vite + React + TypeScript 專案
```bash
# 在 DeepBlocks 目錄下
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
```

#### Step 2: 安裝核心依賴
```bash
# React Flow
npm install reactflow

# 狀態管理
npm install zustand

# UI 元件庫基礎
npm install tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Shadcn/UI CLI
npx shadcn-ui@latest init
```

**Shadcn/UI 設定時選擇**：
- Style: Default
- Base color: Slate
- CSS variables: Yes

#### Step 3: 安裝常用元件
```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add slider
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add scroll-area
npx shadcn-ui@latest add separator
```

#### Step 4: 設定 Tailwind CSS
```javascript
// tailwind.config.js
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // 自訂配色
        'canvas-bg': '#0f172a',
        'node-bg': '#1e293b',
      }
    },
  },
  plugins: [require('tailwindcss-animate')],
}
```

#### Step 5: 建立基礎目錄結構
```bash
cd src
mkdir -p components/{layout,panels,flow,ui}
mkdir -p nodes
mkdir -p registry/{types,definitions}
mkdir -p compiler
mkdir -p store
mkdir -p hooks
mkdir -p utils
mkdir -p types
```

---

### Day 3-4: 後端專案初始化

#### Step 1: 建立 FastAPI 專案
```bash
# 回到 DeepBlocks 根目錄
cd ..
mkdir backend && cd backend

# 建立虛擬環境
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 安裝依賴
pip install fastapi uvicorn sqlalchemy psycopg2-binary python-jose[cryptography] passlib[bcrypt] python-multipart
```

#### Step 2: 建立後端目錄結構
```bash
mkdir -p app/{api,models,schemas,services,utils}
touch app/{main.py,config.py}
touch app/api/{auth.py,projects.py,files.py}
```

#### Step 3: 建立基礎 FastAPI 應用
```python
# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="DeepBlocks API", version="1.0.0")

# CORS 設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite 預設 port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}
```

#### Step 4: 測試執行
```bash
# 啟動後端
uvicorn app.main:app --reload

# 在瀏覽器開啟 http://localhost:8000/docs
# 應該看到 Swagger UI
```

---

### Day 5: Docker 與資料庫設定

#### Step 1: 建立 Docker Compose
```yaml
# DeepBlocks/docker-compose.yml
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
```

#### Step 2: 啟動資料庫
```bash
docker-compose up -d
```

#### Step 3: 建立資料庫模型
```python
# backend/app/models/user.py
from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
```

---

### Day 6-7: CI/CD 與 Git 設定

#### Step 1: 建立 .gitignore
```gitignore
# Frontend
frontend/node_modules/
frontend/dist/
frontend/.env

# Backend
backend/venv/
backend/__pycache__/
backend/*.pyc
backend/.env

# Database
*.db
*.sqlite

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db
```

#### Step 2: 建立 GitHub Actions
```yaml
# .github/workflows/frontend-ci.yml
name: Frontend CI

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd frontend && npm install
      - run: cd frontend && npm run build
      - run: cd frontend && npm run lint
```

#### Step 3: 初始化 Git
```bash
# 在 DeepBlocks 根目錄
git init
git add .
git commit -m "Initial commit: Project setup"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

---

## 🎨 **Week 2: MVP - 佈局與畫布**

### Day 8-9: 建立三欄式佈局

#### Step 1: 建立主佈局元件
```tsx
// frontend/src/components/layout/AppLayout.tsx
import React from 'react';
import { Header } from './Header';
import { NodeLibrary } from '../panels/NodeLibrary';
import { FlowCanvas } from '../flow/FlowCanvas';
import { PropertyPanel } from '../panels/PropertyPanel';

export const AppLayout: React.FC = () => {
  return (
    <div className="h-screen flex flex-col bg-canvas-bg">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <NodeLibrary />
        <FlowCanvas />
        <PropertyPanel />
      </div>
    </div>
  );
};
```

#### Step 2: 建立 Header
```tsx
// frontend/src/components/layout/Header.tsx
import { Button } from '@/components/ui/button';

export const Header: React.FC = () => {
  return (
    <header className="h-14 border-b border-slate-700 flex items-center px-4">
      <h1 className="text-xl font-bold text-white">DeepBlocks</h1>
      <div className="ml-6 flex gap-2">
        <Button variant="ghost">File</Button>
        <Button variant="ghost">Edit</Button>
        <Button variant="ghost">View</Button>
      </div>
      <div className="ml-auto">
        <Button>Login</Button>
      </div>
    </header>
  );
};
```

#### Step 3: 建立左側節點庫
```tsx
// frontend/src/components/panels/NodeLibrary.tsx
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';

export const NodeLibrary: React.FC = () => {
  return (
    <div className="w-[280px] border-r border-slate-700 flex flex-col">
      <div className="p-4">
        <Input placeholder="Search nodes..." className="w-full" />
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4">
          <h3 className="text-sm font-semibold text-slate-400 mb-2">
            Data Processing
          </h3>
          <div className="space-y-2">
            <NodeLibraryItem label="Input" type="input" />
            <NodeLibraryItem label="DataLoader" type="dataloader" />
          </div>
          
          <h3 className="text-sm font-semibold text-slate-400 mt-4 mb-2">
            Model Architecture
          </h3>
          <div className="space-y-2">
            <NodeLibraryItem label="Conv2d" type="conv2d" />
            <NodeLibraryItem label="Linear" type="linear" />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

const NodeLibraryItem = ({ label, type }) => {
  const onDragStart = (event) => {
    event.dataTransfer.setData('application/reactflow', type);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className="p-2 bg-node-bg rounded cursor-move hover:bg-slate-600"
      draggable
      onDragStart={onDragStart}
    >
      {label}
    </div>
  );
};
```

#### Step 4: 建立右側屬性面板
```tsx
// frontend/src/components/panels/PropertyPanel.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const PropertyPanel: React.FC = () => {
  return (
    <div className="w-[350px] border-l border-slate-700 flex flex-col">
      <Tabs defaultValue="properties" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        
        <TabsContent value="properties" className="flex-1 p-4">
          <p className="text-sm text-slate-400">
            Select a node to edit properties
          </p>
        </TabsContent>
        
        <TabsContent value="code" className="flex-1 p-4">
          <pre className="text-sm bg-slate-900 p-4 rounded">
            <code>// Generated code will appear here</code>
          </pre>
        </TabsContent>
      </Tabs>
    </div>
  );
};
```

---

### Day 10-12: React Flow 整合

#### Step 1: 建立 Zustand Store
```typescript
// frontend/src/store/flowStore.ts
import { create } from 'zustand';
import { Node, Edge } from 'reactflow';

interface FlowState {
  nodes: Node[];
  edges: Edge[];
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (node: Node) => void;
}

export const useFlowStore = create<FlowState>((set) => ({
  nodes: [],
  edges: [],
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] })),
}));
```

#### Step 2: 建立 FlowCanvas
```tsx
// frontend/src/components/flow/FlowCanvas.tsx
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useCallback, useRef } from 'react';

export const FlowCanvas: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const reactFlowWrapper = useRef(null);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      const position = {
        x: event.clientX,
        y: event.clientY,
      };

      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { label: type },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  return (
    <div className="flex-1 relative" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        fitView
      >
        <Background variant="dots" gap={16} size={1} />
        <Controls />
        <MiniMap
          nodeStrokeWidth={3}
          zoomable
          pannable
        />
      </ReactFlow>
    </div>
  );
};
```

#### Step 3: 建立第一個自訂節點
```tsx
// frontend/src/nodes/BaseNode.tsx
import { Handle, Position } from 'reactflow';

export const BaseNode = ({ data }) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-node-bg border-2 border-slate-600">
      <Handle type="target" position={Position.Left} />
      <div className="text-white">
        <div className="font-bold">{data.label}</div>
        {data.params && (
          <div className="text-xs text-slate-400 mt-1">
            {Object.entries(data.params).map(([key, value]) => (
              <div key={key}>{key}: {value}</div>
            ))}
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
};
```

#### Step 4: 註冊節點類型
```tsx
// frontend/src/nodes/index.ts
import { BaseNode } from './BaseNode';

export const nodeTypes = {
  input: BaseNode,
  conv2d: BaseNode,
  linear: BaseNode,
  dataloader: BaseNode,
};
```

```tsx
// 在 FlowCanvas.tsx 中使用
import { nodeTypes } from '@/nodes';

<ReactFlow
  nodeTypes={nodeTypes}
  // ... other props
/>
```

---

### Day 13-14: 屬性編輯功能

#### Step 1: 建立選中狀態管理
```typescript
// frontend/src/store/selectionStore.ts
import { create } from 'zustand';

interface SelectionState {
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
}

export const useSelectionStore = create<SelectionState>((set) => ({
  selectedNodeId: null,
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
}));
```

#### Step 2: 更新屬性面板
```tsx
// frontend/src/components/panels/PropertyPanel.tsx (更新版)
import { useSelectionStore } from '@/store/selectionStore';
import { useFlowStore } from '@/store/flowStore';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';

export const PropertyPanel: React.FC = () => {
  const selectedNodeId = useSelectionStore((s) => s.selectedNodeId);
  const nodes = useFlowStore((s) => s.nodes);
  const updateNode = useFlowStore((s) => s.updateNode);
  
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  
  if (!selectedNode) {
    return <div className="p-4 text-slate-400">Select a node</div>;
  }
  
  return (
    <div className="p-4 space-y-4">
      <h3 className="font-bold text-white">{selectedNode.data.label}</h3>
      
      {/* 假設是 Conv2d 節點 */}
      <div className="space-y-2">
        <Label>in_channels</Label>
        <Input
          type="number"
          defaultValue={selectedNode.data.params?.in_channels || 3}
          onChange={(e) => {
            updateNode(selectedNodeId, {
              params: {
                ...selectedNode.data.params,
                in_channels: parseInt(e.target.value)
              }
            });
          }}
        />
      </div>
      
      <div className="space-y-2">
        <Label>out_channels</Label>
        <Input
          type="number"
          defaultValue={selectedNode.data.params?.out_channels || 64}
        />
      </div>
    </div>
  );
};
```

---

## ✅ **驗收檢查清單**

### Week 1 完成標準
- [ ] 前端專案可啟動（`npm run dev`）
- [ ] Shadcn/UI 元件可正常使用
- [ ] 後端 API 可啟動（`uvicorn app.main:app --reload`）
- [ ] PostgreSQL Docker 容器正常運行
- [ ] Git 版本控制建立完成

### Week 2-3 完成標準
- [ ] 三欄式佈局顯示正確
- [ ] 可從左側拖曳節點到畫布
- [ ] 節點間可拖曳連線
- [ ] 點擊節點後右側顯示屬性
- [ ] Mini Map 正確顯示畫布內容
- [ ] 網格背景與縮放控制正常

---

## 🔧 **常見問題與解決方案**

### Q1: Shadcn/UI 安裝失敗
**解決**：確保 Node.js 版本 >= 18，使用 `npm install -g npm@latest` 更新 npm

### Q2: React Flow 節點拖曳沒反應
**解決**：檢查 `onDrop` 和 `onDragOver` 事件是否正確綁定

### Q3: Tailwind 樣式沒生效
**解決**：確認 `tailwind.config.js` 的 content 路徑包含所有元件檔案

---

## 📚 **參考資源**

- [React Flow 官方文檔](https://reactflow.dev/)
- [Shadcn/UI 元件庫](https://ui.shadcn.com/)
- [Zustand 文檔](https://github.com/pmndrs/zustand)
- [FastAPI 教學](https://fastapi.tiangolo.com/tutorial/)

---

**下一階段**：Week 4-5 - 節點系統與 Registry 開發  
**參考文檔**：`technical-specification.md` 第四章

---

**文件版本**：1.0.0  
**最後更新**：2026-01-04
