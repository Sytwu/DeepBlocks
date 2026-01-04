# DeepBlocks 節點視覺設計指南
## Node Visual Design Guide

> **目的**：定義節點的視覺風格，確保一致性與專業性  
> **風格參考**：ComfyUI, Retool Workflows, Figma

---

## 🎨 **一、設計原則**

### 1.1 核心理念
- **清晰勝於炫麗**：確保資訊易讀，避免過度設計
- **分層架構**：基礎層用簡單設計，複雜層用視覺化架構圖
- **一致性**：同類別節點使用相同配色與樣式
- **可擴展性**：設計需支援未來新增節點類型

### 1.2 視覺層級
```
Level 1: 基礎層 (Conv2d, Linear, ReLU)
  → 簡單卡片 + 參數列表

Level 2: 複雜層 (ResNet Block, Transformer)
  → 可摺疊卡片 + 架構圖縮略圖

Level 3: 自訂節點 (使用者定義)
  → 可自訂顏色與圖示
```

---

## 🖼️ **二、節點類型與設計範例**

### 2.1 基礎層節點 (Simple Layer Node)

#### 視覺規格
```
┌────────────────────────────┐
│ 🔷 Conv2d                  │ ← Header (深色背景 + 藍色強調)
├────────────────────────────┤
│ in_channels: 64            │
│ out_channels: 128          │ ← Parameters (淺色文字)
│ kernel_size: 3×3           │
└────────────────────────────┘
  ●                        ●   ← Handles (連接點)
```

#### CSS 樣式
```css
.node-simple {
  background: #1e293b;      /* 節點背景 */
  border: 2px solid #3b82f6; /* 藍色邊框 */
  border-radius: 8px;
  padding: 12px;
  min-width: 180px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.node-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-weight: 600;
  color: #f1f5f9;          /* 白色文字 */
}

.node-params {
  font-size: 12px;
  color: #cbd5e1;          /* 淺灰文字 */
  line-height: 1.6;
}
```

#### React 元件範例
```tsx
// BaseLayerNode.tsx
interface LayerNodeProps {
  data: {
    label: string;
    icon?: string;
    params: Record<string, any>;
  };
}

export const BaseLayerNode: React.FC<LayerNodeProps> = ({ data }) => {
  return (
    <div className="node-simple">
      <Handle type="target" position={Position.Left} />
      
      <div className="node-header">
        {data.icon && <img src={data.icon} className="w-4 h-4" />}
        <span>{data.label}</span>
      </div>
      
      <div className="node-params">
        {Object.entries(data.params).map(([key, value]) => (
          <div key={key}>
            {key}: <span className="font-mono">{value}</span>
          </div>
        ))}
      </div>
      
      <Handle type="source" position={Position.Right} />
    </div>
  );
};
```

---

### 2.2 激活函數節點 (Activation Node)

#### 視覺規格
```
┌──────────────┐
│ ⚡ ReLU      │  ← 更小更緊湊
└──────────────┘
  ●          ●
```

#### 特色
- **更小尺寸**：120px 寬
- **綠色強調**：`#10b981`
- **無參數顯示**：只有標題與圖示

```tsx
export const ActivationNode: React.FC = ({ data }) => {
  return (
    <div className="px-3 py-2 bg-node-bg border-2 border-green-500 rounded-lg">
      <Handle type="target" position={Position.Left} />
      <div className="flex items-center gap-2 text-white text-sm">
        <span>⚡</span>
        <span className="font-semibold">{data.label}</span>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
};
```

---

### 2.3 複雜 Block 節點 (Complex Block Node)

#### 展開狀態 (Expanded)
```
┌─────────────────────────────────┐
│ 🟣 ResNet Block          [─]   │ ← 摺疊按鈕
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │ Conv2d (in:64, out:64)      │ │
│ │ BatchNorm2d                 │ │
│ │ ReLU                        │ │ ← 內部結構
│ │ Conv2d (in:64, out:64)      │ │
│ │ BatchNorm2d                 │ │
│ │ Add (skip connection)       │ │
│ │ ReLU                        │ │
│ └─────────────────────────────┘ │
│                                 │
│ num_layers: 2                   │
│ stride: 1                       │
└─────────────────────────────────┘
```

#### 摺疊狀態 (Collapsed)
```
┌─────────────────────────────────┐
│ 🟣 ResNet Block          [+]   │
├─────────────────────────────────┤
│   ╔═══════════════════════╗     │
│   ║   [架構圖 SVG]        ║     │
│   ║                       ║     │
│   ║   Input → Conv → BN   ║     │
│   ║      ↓         ↓      ║     │ ← 精美架構圖
│   ║   Conv → BN → Add →   ║     │
│   ║              ↑        ║     │
│   ║            Skip       ║     │
│   ╚═══════════════════════╝     │
└─────────────────────────────────┘
```

#### React 元件
```tsx
export const BlockNode: React.FC<{ data }> = ({ data }) => {
  const [collapsed, setCollapsed] = useState(false);
  
  return (
    <div className="node-complex border-2 border-purple-500 rounded-lg bg-node-bg">
      <Handle type="target" position={Position.Left} />
      
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-600">
        <div className="flex items-center gap-2 text-white font-semibold">
          <span>🟣</span>
          <span>{data.label}</span>
        </div>
        <button onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? '[+]' : '[─]'}
        </button>
      </div>
      
      {/* Content */}
      {collapsed ? (
        <div className="p-4">
          <img 
            src={data.thumbnail} 
            alt="Architecture" 
            className="w-full h-auto"
          />
        </div>
      ) : (
        <div className="p-4 space-y-2">
          {data.subLayers.map((layer, idx) => (
            <div key={idx} className="text-sm text-slate-300">
              {layer}
            </div>
          ))}
        </div>
      )}
      
      <Handle type="source" position={Position.Right} />
    </div>
  );
};
```

---

## 🎨 **三、配色系統**

### 3.1 節點類別配色

| 類別 | 顏色 | Hex | 用途 |
|------|------|-----|------|
| Data Processing | 🔵 藍色 | `#3b82f6` | Input, DataLoader |
| Layers | 🟦 深藍 | `#2563eb` | Conv2d, Linear |
| Activations | 🟢 綠色 | `#10b981` | ReLU, Sigmoid |
| Blocks | 🟣 紫色 | `#8b5cf6` | ResNet, Transformer |
| Operations | 🟡 黃色 | `#f59e0b` | Add, Concat |
| Training | 🔴 紅色 | `#ef4444` | Loss, Optimizer |
| Evaluation | 🟠 橙色 | `#f97316` | Metrics |

### 3.2 狀態配色
```css
/* 正常狀態 */
.node { border-color: var(--category-color); }

/* 選中狀態 */
.node.selected { 
  border-color: #60a5fa;  /* 亮藍 */
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.3);
}

/* 錯誤狀態 */
.node.error { 
  border-color: #ef4444;  /* 紅色 */
  background: rgba(239, 68, 68, 0.1);
}

/* 懸停狀態 */
.node:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
  transition: all 0.2s ease;
}
```

---

## 🔗 **四、連線樣式 (Edge Styles)**

### 4.1 貝茲曲線配置
```tsx
// React Flow 連線設定
<ReactFlow
  defaultEdgeOptions={{
    type: 'smoothstep',  // 或 'default' (貝茲曲線)
    animated: false,     // 可選：動畫效果
    style: {
      stroke: '#64748b',
      strokeWidth: 2,
    }
  }}
/>
```

### 4.2 連線類型視覺化
```css
/* 一般資料流 */
.edge-default {
  stroke: #64748b;      /* 灰色 */
  stroke-width: 2px;
}

/* Tensor 流 */
.edge-tensor {
  stroke: #3b82f6;      /* 藍色 */
  stroke-width: 2.5px;
}

/* Skip Connection (跳躍連接) */
.edge-skip {
  stroke: #8b5cf6;      /* 紫色 */
  stroke-width: 2px;
  stroke-dasharray: 5, 5;  /* 虛線 */
}

/* 錯誤連線 */
.edge-error {
  stroke: #ef4444;      /* 紅色 */
  stroke-width: 3px;
  animation: pulse 1s infinite;
}
```

---

## 📐 **五、尺寸規範**

### 5.1 節點尺寸
```
簡單節點:
  最小寬度: 180px
  最小高度: 80px
  內邊距: 12px

激活節點:
  最小寬度: 120px
  最小高度: 50px
  內邊距: 8px

複雜 Block (展開):
  最小寬度: 280px
  最大寬度: 400px
  最小高度: 200px

複雜 Block (摺疊):
  固定寬度: 280px
  固定高度: 200px
```

### 5.2 連接點 (Handles)
```css
.react-flow__handle {
  width: 12px;
  height: 12px;
  background: #64748b;
  border: 2px solid #1e293b;
  border-radius: 50%;
}

.react-flow__handle:hover {
  background: #3b82f6;
  transform: scale(1.3);
}
```

---

## 🖼️ **六、架構圖縮略圖設計**

### 6.1 ResNet Block 架構圖範例
```svg
<!-- public/assets/architectures/resnet-block.svg -->
<svg width="200" height="160" viewBox="0 0 200 160">
  <!-- 主路徑 -->
  <rect x="70" y="10" width="60" height="30" fill="#3b82f6" rx="4"/>
  <text x="100" y="28" fill="white" text-anchor="middle">Conv</text>
  
  <rect x="70" y="50" width="60" height="30" fill="#10b981" rx="4"/>
  <text x="100" y="68" fill="white" text-anchor="middle">BN</text>
  
  <rect x="70" y="90" width="60" height="30" fill="#f59e0b" rx="4"/>
  <text x="100" y="108" fill="white" text-anchor="middle">ReLU</text>
  
  <!-- Skip Connection -->
  <path d="M 30,25 L 30,140 L 100,140" 
        stroke="#8b5cf6" 
        stroke-width="2" 
        fill="none" 
        stroke-dasharray="5,5"/>
  
  <!-- Add 節點 -->
  <circle cx="100" cy="140" r="15" fill="#f59e0b"/>
  <text x="100" y="145" fill="white" text-anchor="middle">+</text>
</svg>
```

### 6.2 製作建議
1. **手動繪製**（推薦）：使用 Figma 繪製，匯出 SVG
2. **程式生成**：使用 D3.js 或類似庫自動生成
3. **論文截圖**：從論文截圖後用 Illustrator 描圖

---

## 🎬 **七、動畫與過渡效果**

### 7.1 節點動畫
```css
/* 新增節點動畫 */
@keyframes nodeAppear {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.node-new {
  animation: nodeAppear 0.3s ease-out;
}

/* 選中動畫 */
.node.selected {
  transition: all 0.2s ease;
  transform: translateY(-2px);
}

/* 錯誤脈衝 */
@keyframes errorPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.node.error {
  animation: errorPulse 1s infinite;
}
```

### 7.2 連線動畫（選配）
```css
/* 資料流動畫 */
.edge-animated {
  stroke-dasharray: 5;
  animation: dash 1s linear infinite;
}

@keyframes dash {
  to {
    stroke-dashoffset: -10;
  }
}
```

---

## ✅ **八、實作檢查清單**

### Phase 1 (基礎視覺)
- [ ] 3 種基礎節點樣式完成（Layer, Activation, Block）
- [ ] 配色系統套用
- [ ] 連線貝茲曲線顯示正確
- [ ] Handles 懸停效果正常

### Phase 2 (進階功能)
- [ ] 複雜節點可摺疊/展開
- [ ] 至少 3 個架構圖縮略圖製作完成
- [ ] 節點選中狀態視覺化
- [ ] 錯誤節點標記顯示

### Phase 3 (優化)
- [ ] 動畫過渡平滑
- [ ] 深色/淺色模式切換
- [ ] 響應式尺寸調整

---

## 📚 **參考資源**

### 設計靈感
- **ComfyUI**：https://github.com/comfyanonymous/ComfyUI
- **Retool Workflows**：https://retool.com/products/workflows
- **Figma**：多人協作的節點選中效果

### React Flow 文檔
- Custom Nodes: https://reactflow.dev/docs/examples/nodes/custom-node/
- Edge Types: https://reactflow.dev/docs/examples/edges/edge-types/

### SVG 工具
- Figma (推薦)
- Adobe Illustrator
- Inkscape (免費)

---

**視覺設計完成後，請產出**：
1. 節點範例截圖（3-5 張）
2. 架構圖 SVG 檔案（至少 3 個）
3. Figma 設計稿（選配）

---

**文件版本**：1.0.0  
**最後更新**：2026-01-04
