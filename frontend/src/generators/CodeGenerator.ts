import { Node, Edge } from 'reactflow';
import { nodeRegistry } from '../registry/NodeRegistry';

export interface GeneratedFiles {
    'model.py': string;
    'train.py': string;
    'config.json': string;
    'README.md': string;
}

export class CodeGenerator {
    private nodes: Node[];
    private edges: Edge[];

    constructor(nodes: Node[], edges: Edge[]) {
        this.nodes = nodes;
        this.edges = edges;
    }

    // 拓撲排序 - 確保節點順序正確
    private topologicalSort(): Node[] {
        const inDegree = new Map<string, number>();
        const adjList = new Map<string, string[]>();

        // 初始化
        this.nodes.forEach(node => {
            inDegree.set(node.id, 0);
            adjList.set(node.id, []);
        });

        // 建立鄰接表
        this.edges.forEach(edge => {
            inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
            const neighbors = adjList.get(edge.source) || [];
            neighbors.push(edge.target);
            adjList.set(edge.source, neighbors);
        });

        // Kahn's Algorithm
        const queue: string[] = [];
        inDegree.forEach((degree, id) => {
            if (degree === 0) queue.push(id);
        });

        const sorted: Node[] = [];
        while (queue.length > 0) {
            const nodeId = queue.shift()!;
            const node = this.nodes.find(n => n.id === nodeId);
            if (node) sorted.push(node);

            const neighbors = adjList.get(nodeId) || [];
            neighbors.forEach(neighbor => {
                inDegree.set(neighbor, (inDegree.get(neighbor) || 0) - 1);
                if (inDegree.get(neighbor) === 0) {
                    queue.push(neighbor);
                }
            });
        }

        return sorted;
    }

    // 生成層名稱
    private generateLayerName(node: Node, index: number): string {
        const nodeType = node.data.type;
        return `${nodeType}${index + 1}`;
    }

    // 生成 model.py
    generateModel(): string {
        const sorted = this.topologicalSort();
        const layers: string[] = [];
        const forwardLines: string[] = [];
        const layerNames = new Map<string, string>();

        sorted.forEach((node, index) => {
            const nodeDef = nodeRegistry.getNode(node.data.type);
            if (!nodeDef) return;

            const layerName = this.generateLayerName(node, index);
            layerNames.set(node.id, layerName);

            // 生成層定義
            if (nodeDef.id !== 'input') {
                const code = nodeDef.pythonTemplate(node.data.params);
                const layerDef = code.replace('self.', `self.${layerName} = `);
                layers.push(`        ${layerDef}`);
            }

            // 生成 forward 邏輯
            if (nodeDef.id === 'input') {
                // Input 節點不需要處理
            } else {
                forwardLines.push(`        x = self.${layerName}(x)`);
            }
        });

        return `import torch
import torch.nn as nn

class CustomModel(nn.Module):
    def __init__(self, config):
        super().__init__()
${layers.join('\n')}
    
    def forward(self, x):
${forwardLines.join('\n')}
        return x
`;
    }

    // 生成 train.py
    generateTrain(): string {
        return `import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
from model import CustomModel
import json

# Load configuration
with open('config.json', 'r') as f:
    config = json.load(f)

# Initialize model
model = CustomModel(config)
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = model.to(device)

# Loss function and optimizer
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=config['learning_rate'])

# Training loop
def train(model, train_loader, criterion, optimizer, epochs):
    model.train()
    for epoch in range(epochs):
        running_loss = 0.0
        for batch_idx, (data, target) in enumerate(train_loader):
            data, target = data.to(device), target.to(device)
            
            # Forward pass
            optimizer.zero_grad()
            output = model(data)
            loss = criterion(output, target)
            
            # Backward pass
            loss.backward()
            optimizer.step()
            
            running_loss += loss.item()
            
            if batch_idx % 10 == 0:
                print(f'Epoch [{epoch+1}/{epochs}], Step [{batch_idx}], Loss: {loss.item():.4f}')
        
        avg_loss = running_loss / len(train_loader)
        print(f'Epoch [{epoch+1}/{epochs}] Average Loss: {avg_loss:.4f}')

if __name__ == '__main__':
    # TODO: Load your dataset here
    # train_loader = DataLoader(your_dataset, batch_size=config['batch_size'], shuffle=True)
    
    print("Model architecture:")
    print(model)
    print(f"\\nTraining for {config['epochs']} epochs...")
    # train(model, train_loader, criterion, optimizer, config['epochs'])
`;
    }

    // 生成 config.json
    generateConfig(): string {
        const layerConfigs: Record<string, any> = {};
        const sorted = this.topologicalSort();

        sorted.forEach((node, index) => {
            const layerName = this.generateLayerName(node, index);
            layerConfigs[layerName] = node.data.params;
        });

        const config = {
            model_name: 'CustomModel',
            epochs: 10,
            batch_size: 32,
            learning_rate: 0.001,
            layers: layerConfigs,
        };

        return JSON.stringify(config, null, 2);
    }

    // 生成 README.md
    generateReadme(): string {
        return `# DeepBlocks Generated Project

This project was automatically generated by DeepBlocks.

## Model Architecture

- Total Layers: ${this.nodes.filter(n => n.data.type !== 'input').length}
- Framework: PyTorch

## Files

- \`model.py\`: Model definition (CustomModel class)
- \`train.py\`: Training script template
- \`config.json\`: Model configuration

## Usage

1. Install dependencies:
\`\`\`bash
pip install torch torchvision
\`\`\`

2. Load your dataset in \`train.py\`

3. Run training:
\`\`\`bash
python train.py
\`\`\`

## Model Summary

\`\`\`python
${this.nodes.map((n, i) => `${i + 1}. ${n.data.label} - ${n.data.type}`).join('\n')}
\`\`\`

---

Generated by [DeepBlocks](https://github.com/Sytwu/DeepBlocks)
`;
    }

    // 生成所有文件
    generateAll(): GeneratedFiles {
        return {
            'model.py': this.generateModel(),
            'train.py': this.generateTrain(),
            'config.json': this.generateConfig(),
            'README.md': this.generateReadme(),
        };
    }
}
