# **機器學習視覺化拖曳平台 (Visual ML Pipeline) 開發指南**

這份指南旨在協助你開發一個類似 Scratch 的機器學習/深度學習圖形化介面工具。該工具的核心價值在於將抽象的數學模型與程式碼邏輯具象化，並能即時生成可執行的 Python (PyTorch/TensorFlow) 程式碼。

## **一、 完整專案結構 (Project Structure)**

除了一般的 src 之外，為了滿足「GitHub 開源」與「高品質視覺化」的需求，建議採用以下結構：

my-visual-ml-project/  
├── .github/                 \# GitHub Actions (CI/CD, 自動檢查 Type 錯誤)  
├── public/                  \# 靜態資源 (瀏覽器直接存取)  
│   ├── assets/  
│   │   ├── architectures/   \# \[關鍵\] 存放論文風格的架構圖 (SVG/PNG)  
│   │   │   ├── resnet-block.svg  
│   │   │   └── transformer-encoder.svg  
│   │   └── icons/           \# 節點的小圖示 (Conv, Linear, ReLU)  
│   └── placeholders/        \# 預設的 Pipeline 中間產物預覽圖 (Placeholder)  
│  
├── docs/                    \# 專案文檔 (架構圖、使用說明)  
│   ├── architecture.md  
│   └── contributing.md  
│  
├── examples/                \# \[Demo\] 預設範例存檔 (.json)  
│   ├── resnet50.json        \# 讓使用者可以一鍵匯入看到完整的 ResNet  
│   └── stable-diffusion.json  
│  
├── src/                     \# 前端原始碼 (React)  
│   ├── components/          \# UI 元件  
│   ├── nodes/               \# 節點視覺邏輯  
│   ├── registry/            \# 節點資料定義  
│   ├── compiler/            \# Python 生成邏輯  
│   └── store/               \# 狀態管理  
│  
├── backend/                 \# (選配) 後端服務或 Python 模板庫  
│   ├── app/                 \# FastAPI server (若未來要支援線上執行)  
│   └── templates/           \# 若生成的 Code 很複雜，可用 Jinja2 模板存放於此  
│  
├── .gitignore               \# 必備，忽略 node\_modules, .env 等  
├── README.md                \# 專案門面，放 Demo GIF 和徽章  
├── package.json  
└── vite.config.ts

### **關於「論文等級的視覺化」資源策略**

你提到想參考 CV 頂會論文的圖示，這是一個很棒的亮點。建議做法：

1. **不要把圖寫死在 JS 裡**：把這些精美的架構圖存成 SVG 放在 public/assets/architectures/。  
2. **在 Registry 引用**：在你的 NodeDefinition 裡增加一個欄位 thumbnail: '/assets/architectures/resnet-block.svg'。  
3. **前端渲染**：當使用者將節點縮小 (Collapse) 或滑鼠懸停時，顯示這張精美的圖，而不是醜醜的參數框。

## **二、 UI/UX 設計決策：打造類 IDE 體驗**

為了讓使用者在拖曳時也能保有寫程式的嚴謹感，建議採用 **「三欄式 IDE 佈局」**。這種佈局在 ComfyUI、Unreal Engine Blueprints 等專業工具中非常常見。

### **1\. 視覺佈局建議**

* **左側欄 (Node Library)**：  
  * **功能**: 元件庫，分類顯示 (Input, Layers, Models, Optimizers)。  
  * **互動**: 支援「拖曳 (Drag)」到畫布，或點擊後在畫布中心生成。  
  * **AI 輔助**: 可加入搜尋框，未來可做「自然語言搜尋」(例如搜 "圖片分類" 自動跳出 ResNet)。  
* **中間 (Canvas)**：  
  * **功能**: 無限畫布，核心工作區。  
  * **互動**: 網格背景 (Grid background)、滑鼠滾輪縮放、空白處右鍵選單 (Quick Add Menu)。  
* **右側欄 (Inspector / Property Panel)**：  
  * **功能**: **上下文敏感 (Context-Sensitive)** 的屬性面板。  
  * **邏輯**: 當使用者點擊畫布上的 Conv2d 節點，這裡會變成該節點的參數表單 (Kernel Size, Stride, Padding)。這是 UI 乾淨的關鍵，不要把所有輸入框都塞在節點上。  
* **底部/側邊懸浮 (Code Preview)**：  
  * **功能**: 即時顯示生成的 Python Code。  
  * **互動**: 唯讀 (Read-only) 但可複製，隨著畫布變動即時更新。

### **2\. UI 風格參考**

* **推薦風格**: **Dark Mode (深色模式)** 是開發者工具的標配。  
* **參考對象**:  
  * **ComfyUI**: 參考它的節點連接點 (Dot handles) 和連線曲線 (Bezier curves)。  
  * **Retool Workflows**: 參考它的右側屬性面板設計。

## **三、 核心系統架構 (System Architecture)**

你的應用程式主要會分為三個部分：**前端畫布 (Frontend Canvas)**、**轉譯引擎 (Compiler Engine)**、**後端服務 (Backend Service)**。

### **1\. 前端畫布 (The Canvas)**

* **功能**：管理節點 (Nodes) 與連線 (Edges)。  
* **挑戰**：需要處理無限畫布、縮放、拖曳、節點的輸入/輸出錨點 (Handles) 對接邏輯。

### **2\. 狀態管理與中間表示層 (IR)**

* **功能**：維護一份 JSON 結構 (IR)，描述整個圖 (Graph) 的邏輯。  
* **重要性**：這份 JSON 是生成 Python 程式碼的依據。

### **3\. 程式碼生成器 (Code Generator)**

* **功能**：解析 IR (JSON)，透過拓撲排序決定執行順序，並將參數填入模板，組合成 .py 檔案。

## **四、 程式碼架構：AI Agent 友善設計 (重要)**

為了讓你方便用 AI (Cursor/Copilot) 生成程式碼，你需要一個**高度結構化、重複性高**的架構。

### **1\. 推薦的目錄結構 (AI-First Modularity)**

我們將目錄分為 **「邏輯定義 (Registry)」** 與 **「視覺呈現 (Components)」** 兩大塊。邏輯定義建議盡早拆分。

src/  
├── components/  
│   ├── flow/            \# React Flow 專屬設定 (Canvas, MiniMap, Controls)  
│   ├── panels/          \# 左側庫與右側屬性面板  
│   └── ui/              \# 通用 UI (Button, Input, Slider \- 建議使用 shadcn/ui)  
│  
├── nodes/               \# \[視覺層\] 決定節點在畫布上長什麼樣子  
│   ├── BaseNode.tsx     \# 封裝通用的樣式 (如外框、標題列、選取狀態)  
│   ├── layers/          \# 各種類型的節點外觀 (通常大同小異，可共用)  
│   │   ├── LayerNode.tsx  
│   │   └── ModelNode.tsx  
│   └── index.ts         \# 註冊給 React Flow 的 nodeTypes  
│  
├── registry/            \# \[邏輯層\] 這是 AI 工作的核心區域，建議細分  
│   ├── definitions/     \# 這裡存放實際的節點數據結構  
│   │   ├── inputs.ts    \# 定義 Input, DataLoader  
│   │   ├── layers.ts    \# 定義 Conv2d, Linear, ReLU  
│   │   ├── models.ts    \# 定義 ResNet, ViT  
│   │   └── ops.ts       \# 定義 Math operations (Add, Concat)  
│   ├── types.ts         \# TypeScript Interfaces  
│   └── index.ts         \# 匯出所有定義  
│  
├── compiler/            \# 轉譯邏輯  
│   ├── templates/       \# (選配) 如果 Python 模板太長，可以抽離到這裡  
│   ├── generator.ts     \# 遍歷 Graph 並生成 Code  
│   └── topological.ts   \# 排序演算法  
│  
└── store/               \# Zustand 狀態管理  
    ├── flowStore.ts     \# 管理節點與連線  
    └── selectionStore.ts\# 管理當前選中的節點 (連動右側面板)

### **2\. 核心設計模式：註冊表模式 (The Registry Pattern)**

這是最關鍵的一點。不要把節點邏輯散落在各處。建立一個 **NodeRegistry**，把每一個節點的「長相」、「參數」、「Python 模板」都定義在一個物件裡。

為什麼這樣對 AI 友善？  
當你想新增一個 Transformer 層時，你只需要把 Registry 的型別定義丟給 AI，然後說：「請幫我新增一個 Transformer 的定義」，AI 就能精準生成符合格式的 Code，而不會破壞其他部分。  
**Registry 範例代碼 (src/registry/definitions/layers.ts)**:

import { NodeDefinition } from '../types';

// 這種結構讓 AI 非常容易擴充，且檔案拆開後，AI 不會被幾千行的檔案搞混  
export const Conv2dDef: NodeDefinition \= {  
  id: 'conv2d',  
  label: 'Conv2d',  
  category: 'Layers',  
    
  // \[新增\] 這裡可以指定頂會論文風格的圖示  
  thumbnail: '/assets/icons/conv2d\_schematic.svg',  
    
  params: \[  
    { name: 'in\_channels', type: 'int', default: 3 },  
    { name: 'out\_channels', type: 'int', default: 64 },  
    { name: 'kernel\_size', type: 'int', default: 3 }  
  \],  
  inputs: \[{ name: 'input', type: 'tensor' }\],  
  outputs: \[{ name: 'output', type: 'tensor' }\],  
  // Python 程式碼生成模板  
  pythonTemplate: (params, inputs, outputVar) \=\>   
    \`${outputVar} \= nn.Conv2d(${params.in\_channels}, ${params.out\_channels}, kernel\_size=${params.kernel\_size})(${inputs.input})\`  
};

## **五、 開發流程五階段 (Development Roadmap)**

### **第一階段：原型驗證 (POC \- Proof of Concept)**

**目標**：能拖出兩個方塊，連線，並在右側看到簡單的 print 程式碼。

1. **環境建置**: React \+ Vite \+ React Flow。  
2. **架構搭建**: 建立上述的 registry 和 store 資料夾。  
3. **基礎節點**: 實作 Input 和 Linear 的 Registry 定義。  
4. **簡單轉譯**: 寫一個函數遍歷當前的節點，將字串串接起來顯示。

### **第二階段：深度學習元件化 (DL Components)**

**目標**：實作 PyTorch/TensorFlow 的常用層。

1. **節點庫擴充**: 利用 AI 批量生成 Conv2d, MaxPool, ReLU, Softmax 的 Registry 定義。  
2. **屬性面板**: 實作一個通用的 Property Panel，它會讀取 Registry 中的 params 列表，自動產生對應的 Input 欄位 (Form Generator)。

### **第三階段：圖算法與程式碼生成 (Graph Logic)**

**目標**：處理複雜的連接邏輯，生成可執行的 Python 程式碼。

1. **拓撲排序**: 確保程式碼順序正確 (資料讀取 \-\> 預處理 \-\> 模型)。  
2. **變數管理**: 自動生成 x1, x2 等變數名，確保變數傳遞正確。  
3. **Import 管理**: 自動生成 import torch 等檔頭。

### **第四階段：Pipeline 與 進階功能**

**目標**：支援 SDEdit 等複雜流程。

1. **巢狀節點 (Sub-graphs)**: 封裝節點群組 (如 ResNet Block)。  
2. **錯誤檢查**: 簡單檢查 Tensor 形狀是否匹配。

## **六、 技術棧與資源 (Tech Stack)**

### **前端 (Frontend)**

* **框架**: **React**  
* **圖形庫**: **React Flow** (核心)  
* **狀態管理**: **Zustand** (輕量、高效，適合頻繁更新的畫布)  
* **UI 元件庫**: **Chakra UI** 或 **Shadcn/UI** (後者基於 Tailwind，非常容易客製化且 Code 乾淨)

### **轉譯與邏輯 (Logic)**

* **語言**: **TypeScript** (必須使用，為了 Registry 的型別安全)  
* **工具**: **Prettier** (用於在瀏覽器端美化生成的 Python 字串)

## **七、 總結與建議起手式**

**給你的第一條 Prompt (當你開始寫 Code 時)**：

"我正在做一個基於 React Flow 的機器學習節點編輯器。請幫我設計一個 NodeDefinition 的 TypeScript Interface。這個 Interface 需要包含節點的 UI 標籤、參數列表（包含參數名稱、類型、預設值）、輸入輸出錨點的定義，以及一個能夠回傳 Python 程式碼字串的模板函數。請考慮到我需要自動生成右側的屬性面板表單。"

從定義資料結構開始，你的開發之路會順暢非常多。祝開發順利！