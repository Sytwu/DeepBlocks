import { NodeDefinition } from '../../types/nodes';

// ==================== Data Processing ====================

export const InputNode: NodeDefinition = {
    id: 'input',
    label: 'Input',
    category: 'Data Processing',
    description: 'Input tensor node',
    color: '#3b82f6',
    params: [
        {
            name: 'shape',
            label: 'Shape',
            type: 'string',
            default: '[1, 3, 224, 224]',
        },
        {
            name: 'dtype',
            label: 'Data Type',
            type: 'select',
            default: 'float32',
            options: ['float32', 'float64', 'int32', 'int64'],
        },
    ],
    inputs: [],
    outputs: [{ name: 'output', label: 'Output', type: 'tensor' }],
    pythonTemplate: (params: Record<string, any>) => `# Input Node
x = torch.randn(${params.shape}, dtype=torch.${params.dtype})`,
};

export const DataLoaderNode: NodeDefinition = {
    id: 'dataloader',
    label: 'DataLoader',
    category: 'Data Processing',
    description: 'PyTorch DataLoader',
    color: '#3b82f6',
    params: [
        { name: 'batch_size', label: 'Batch Size', type: 'number', default: 32, min: 1 },
        { name: 'shuffle', label: 'Shuffle', type: 'boolean', default: true },
        { name: 'num_workers', label: 'Num Workers', type: 'number', default: 4, min: 0 },
    ],
    inputs: [],
    outputs: [{ name: 'output', label: 'Output', type: 'tensor' }],
    pythonTemplate: (params: Record<string, any>) => `train_loader = DataLoader(
    dataset,
    batch_size=${params.batch_size},
    shuffle=${params.shuffle},
    num_workers=${params.num_workers}
)`,
};

export const OutputNode: NodeDefinition = {
    id: 'output',
    label: 'Output',
    category: 'Data Processing',
    description: 'Output node',
    color: '#3b82f6',
    params: [],
    inputs: [{ name: 'input', label: 'Input', type: 'tensor' }],
    outputs: [],
    pythonTemplate: () => `return x`,
};

// ==================== Model Architecture - Layers ====================

export const Conv2dNode: NodeDefinition = {
    id: 'conv2d',
    label: 'Conv2d',
    category: 'Model Architecture',
    description: '2D Convolution layer',
    color: '#2563eb',
    params: [
        { name: 'in_channels', label: 'In Channels', type: 'number', default: 3, min: 1 },
        { name: 'out_channels', label: 'Out Channels', type: 'number', default: 64, min: 1 },
        { name: 'kernel_size', label: 'Kernel Size', type: 'number', default: 3, min: 1 },
        { name: 'stride', label: 'Stride', type: 'number', default: 1, min: 1 },
        { name: 'padding', label: 'Padding', type: 'number', default: 1, min: 0 },
    ],
    inputs: [{ name: 'input', label: 'Input', type: 'tensor' }],
    outputs: [{ name: 'output', label: 'Output', type: 'tensor' }],
    pythonTemplate: (params: Record<string, any>) => `self.conv = nn.Conv2d(
    in_channels=${params.in_channels},
    out_channels=${params.out_channels},
    kernel_size=${params.kernel_size},
    stride=${params.stride},
    padding=${params.padding}
)`,
};

export const Conv3dNode: NodeDefinition = {
    id: 'conv3d',
    label: 'Conv3d',
    category: 'Model Architecture',
    description: '3D Convolution layer',
    color: '#2563eb',
    params: [
        { name: 'in_channels', label: 'In Channels', type: 'number', default: 3, min: 1 },
        { name: 'out_channels', label: 'Out Channels', type: 'number', default: 64, min: 1 },
        { name: 'kernel_size', label: 'Kernel Size', type: 'number', default: 3, min: 1 },
        { name: 'stride', label: 'Stride', type: 'number', default: 1, min: 1 },
        { name: 'padding', label: 'Padding', type: 'number', default: 1, min: 0 },
    ],
    inputs: [{ name: 'input', label: 'Input', type: 'tensor' }],
    outputs: [{ name: 'output', label: 'Output', type: 'tensor' }],
    pythonTemplate: (params: Record<string, any>) => `self.conv3d = nn.Conv3d(
    in_channels=${params.in_channels},
    out_channels=${params.out_channels},
    kernel_size=${params.kernel_size},
    stride=${params.stride},
    padding=${params.padding}
)`,
};

export const LinearNode: NodeDefinition = {
    id: 'linear',
    label: 'Linear',
    category: 'Model Architecture',
    description: 'Fully connected layer',
    color: '#2563eb',
    params: [
        { name: 'in_features', label: 'In Features', type: 'number', default: 512, min: 1 },
        { name: 'out_features', label: 'Out Features', type: 'number', default: 10, min: 1 },
        { name: 'bias', label: 'Use Bias', type: 'boolean', default: true },
    ],
    inputs: [{ name: 'input', label: 'Input', type: 'tensor' }],
    outputs: [{ name: 'output', label: 'Output', type: 'tensor' }],
    pythonTemplate: (params: Record<string, any>) => `self.fc = nn.Linear(
    in_features=${params.in_features},
    out_features=${params.out_features},
    bias=${params.bias}
)`,
};

export const BatchNorm2dNode: NodeDefinition = {
    id: 'batchnorm2d',
    label: 'BatchNorm2d',
    category: 'Model Architecture',
    description: 'Batch Normalization 2D',
    color: '#8b5cf6',
    params: [
        { name: 'num_features', label: 'Num Features', type: 'number', default: 64, min: 1 },
        { name: 'eps', label: 'Epsilon', type: 'number', default: 0.00001, min: 0, step: 0.00001 },
        { name: 'momentum', label: 'Momentum', type: 'number', default: 0.1, min: 0, max: 1, step: 0.01 },
    ],
    inputs: [{ name: 'input', label: 'Input', type: 'tensor' }],
    outputs: [{ name: 'output', label: 'Output', type: 'tensor' }],
    pythonTemplate: (params: Record<string, any>) => `self.bn = nn.BatchNorm2d(
    num_features=${params.num_features},
    eps=${params.eps},
    momentum=${params.momentum}
)`,
};

export const MaxPool2dNode: NodeDefinition = {
    id: 'maxpool2d',
    label: 'MaxPool2d',
    category: 'Model Architecture',
    description: 'Max Pooling 2D',
    color: '#f59e0b',
    params: [
        { name: 'kernel_size', label: 'Kernel Size', type: 'number', default: 2, min: 1 },
        { name: 'stride', label: 'Stride', type: 'number', default: 2, min: 1 },
        { name: 'padding', label: 'Padding', type: 'number', default: 0, min: 0 },
    ],
    inputs: [{ name: 'input', label: 'Input', type: 'tensor' }],
    outputs: [{ name: 'output', label: 'Output', type: 'tensor' }],
    pythonTemplate: (params: Record<string, any>) => `self.pool = nn.MaxPool2d(
    kernel_size=${params.kernel_size},
    stride=${params.stride},
    padding=${params.padding}
)`,
};

export const AvgPool2dNode: NodeDefinition = {
    id: 'avgpool2d',
    label: 'AvgPool2d',
    category: 'Model Architecture',
    description: 'Average Pooling 2D',
    color: '#f59e0b',
    params: [
        { name: 'kernel_size', label: 'Kernel Size', type: 'number', default: 2, min: 1 },
        { name: 'stride', label: 'Stride', type: 'number', default: 2, min: 1 },
        { name: 'padding', label: 'Padding', type: 'number', default: 0, min: 0 },
    ],
    inputs: [{ name: 'input', label: 'Input', type: 'tensor' }],
    outputs: [{ name: 'output', label: 'Output', type: 'tensor' }],
    pythonTemplate: (params: Record<string, any>) => `self.avgpool = nn.AvgPool2d(
    kernel_size=${params.kernel_size},
    stride=${params.stride},
    padding=${params.padding}
)`,
};

export const DropoutNode: NodeDefinition = {
    id: 'dropout',
    label: 'Dropout',
    category: 'Model Architecture',
    description: 'Dropout layer',
    color: '#8b5cf6',
    params: [
        { name: 'p', label: 'Dropout Rate', type: 'number', default: 0.5, min: 0, max: 1, step: 0.1 },
        { name: 'inplace', label: 'Inplace', type: 'boolean', default: false },
    ],
    inputs: [{ name: 'input', label: 'Input', type: 'tensor' }],
    outputs: [{ name: 'output', label: 'Output', type: 'tensor' }],
    pythonTemplate: (params: Record<string, any>) => `self.dropout = nn.Dropout(p=${params.p}, inplace=${params.inplace})`,
};

export const FlattenNode: NodeDefinition = {
    id: 'flatten',
    label: 'Flatten',
    category: 'Model Architecture',
    description: 'Flatten layer',
    color: '#8b5cf6',
    params: [
        { name: 'start_dim', label: 'Start Dim', type: 'number', default: 1, min: 0 },
    ],
    inputs: [{ name: 'input', label: 'Input', type: 'tensor' }],
    outputs: [{ name: 'output', label: 'Output', type: 'tensor' }],
    pythonTemplate: (params: Record<string, any>) => `self.flatten = nn.Flatten(start_dim=${params.start_dim})`,
};

// ==================== Activations ====================

export const ReLUNode: NodeDefinition = {
    id: 'relu',
    label: 'ReLU',
    category: 'Model Architecture',
    description: 'ReLU activation',
    color: '#10b981',
    params: [{ name: 'inplace', label: 'Inplace', type: 'boolean', default: false }],
    inputs: [{ name: 'input', label: 'Input', type: 'tensor' }],
    outputs: [{ name: 'output', label: 'Output', type: 'tensor' }],
    pythonTemplate: (params: Record<string, any>) => `self.relu = nn.ReLU(inplace=${params.inplace})`,
};

export const LeakyReLUNode: NodeDefinition = {
    id: 'leakyrelu',
    label: 'LeakyReLU',
    category: 'Model Architecture',
    description: 'Leaky ReLU activation',
    color: '#10b981',
    params: [
        { name: 'negative_slope', label: 'Negative Slope', type: 'number', default: 0.01, min: 0, step: 0.01 },
        { name: 'inplace', label: 'Inplace', type: 'boolean', default: false },
    ],
    inputs: [{ name: 'input', label: 'Input', type: 'tensor' }],
    outputs: [{ name: 'output', label: 'Output', type: 'tensor' }],
    pythonTemplate: (params: Record<string, any>) => `self.leakyrelu = nn.LeakyReLU(negative_slope=${params.negative_slope}, inplace=${params.inplace})`,
};

export const SigmoidNode: NodeDefinition = {
    id: 'sigmoid',
    label: 'Sigmoid',
    category: 'Model Architecture',
    description: 'Sigmoid activation',
    color: '#10b981',
    params: [],
    inputs: [{ name: 'input', label: 'Input', type: 'tensor' }],
    outputs: [{ name: 'output', label: 'Output', type: 'tensor' }],
    pythonTemplate: () => `self.sigmoid = nn.Sigmoid()`,
};

export const SoftmaxNode: NodeDefinition = {
    id: 'softmax',
    label: 'Softmax',
    category: 'Model Architecture',
    description: 'Softmax activation',
    color: '#10b981',
    params: [{ name: 'dim', label: 'Dimension', type: 'number', default: 1 }],
    inputs: [{ name: 'input', label: 'Input', type: 'tensor' }],
    outputs: [{ name: 'output', label: 'Output', type: 'tensor' }],
    pythonTemplate: (params: Record<string, any>) => `self.softmax = nn.Softmax(dim=${params.dim})`,
};

export const TanhNode: NodeDefinition = {
    id: 'tanh',
    label: 'Tanh',
    category: 'Model Architecture',
    description: 'Tanh activation',
    color: '#10b981',
    params: [],
    inputs: [{ name: 'input', label: 'Input', type: 'tensor' }],
    outputs: [{ name: 'output', label: 'Output', type: 'tensor' }],
    pythonTemplate: () => `self.tanh = nn.Tanh()`,
};

// ==================== Operations ====================

export const ConcatNode: NodeDefinition = {
    id: 'concat',
    label: 'Concat',
    category: 'Model Architecture',
    description: 'Concatenate tensors',
    color: '#ec4899',
    params: [{ name: 'dim', label: 'Dimension', type: 'number', default: 1 }],
    inputs: [
        { name: 'input1', label: 'Input 1', type: 'tensor' },
        { name: 'input2', label: 'Input 2', type: 'tensor' },
    ],
    outputs: [{ name: 'output', label: 'Output', type: 'tensor' }],
    pythonTemplate: (params: Record<string, any>) => `# Concat operation (dim=${params.dim})
x = torch.cat([x1, x2], dim=${params.dim})`,
};

export const AddNode: NodeDefinition = {
    id: 'add',
    label: 'Add',
    category: 'Model Architecture',
    description: 'Element-wise addition',
    color: '#ec4899',
    params: [],
    inputs: [
        { name: 'input1', label: 'Input 1', type: 'tensor' },
        { name: 'input2', label: 'Input 2', type: 'tensor' },
    ],
    outputs: [{ name: 'output', label: 'Output', type: 'tensor' }],
    pythonTemplate: () => `# Add operation
x = x1 + x2`,
};

export const ReshapeNode: NodeDefinition = {
    id: 'reshape',
    label: 'Reshape',
    category: 'Model Architecture',
    description: 'Reshape tensor',
    color: '#ec4899',
    params: [
        { name: 'shape', label: 'Target Shape', type: 'string', default: '[-1, 512]' },
    ],
    inputs: [{ name: 'input', label: 'Input', type: 'tensor' }],
    outputs: [{ name: 'output', label: 'Output', type: 'tensor' }],
    pythonTemplate: (params: Record<string, any>) => `# Reshape operation
x = x.view(${params.shape})`,
};

// ==================== Blocks ====================

export const ResNetBlockNode: NodeDefinition = {
    id: 'resnet_block',
    label: 'ResNet Block',
    category: 'Model Architecture - Blocks',
    description: 'Residual Block with skip connection (Conv-BN-ReLU-Conv-BN structure)',
    color: '#7c3aed',
    params: [
        { name: 'in_channels', label: 'In Channels', type: 'number', default: 64, min: 1 },
        { name: 'out_channels', label: 'Out Channels', type: 'number', default: 64, min: 1 },
        { name: 'stride', label: 'Stride', type: 'number', default: 1, min: 1 },
        { name: 'downsample', label: 'Downsample', type: 'boolean', default: false },
    ],
    inputs: [{ name: 'input', label: 'Input', type: 'tensor' }],
    outputs: [{ name: 'output', label: 'Output', type: 'tensor' }],
    pythonTemplate: (params: Record<string, any>) => `# ResNet Block
class ResNetBlock(nn.Module):
    def __init__(self, in_channels=${params.in_channels}, out_channels=${params.out_channels}, stride=${params.stride}):
        super().__init__()
        self.conv1 = nn.Conv2d(in_channels, out_channels, kernel_size=3, stride=stride, padding=1, bias=False)
        self.bn1 = nn.BatchNorm2d(out_channels)
        self.relu = nn.ReLU(inplace=True)
        self.conv2 = nn.Conv2d(out_channels, out_channels, kernel_size=3, stride=1, padding=1, bias=False)
        self.bn2 = nn.BatchNorm2d(out_channels)
        
        ${params.downsample ? `# Downsample for skip connection
        self.downsample = nn.Sequential(
            nn.Conv2d(in_channels, out_channels, kernel_size=1, stride=stride, bias=False),
            nn.BatchNorm2d(out_channels)
        )` : 'self.downsample = None'}
    
    def forward(self, x):
        identity = x
        
        out = self.conv1(x)
        out = self.bn1(out)
        out = self.relu(out)
        
        out = self.conv2(out)
        out = self.bn2(out)
        
        if self.downsample is not None:
            identity = self.downsample(x)
        
        out += identity
        out = self.relu(out)
        
        return out

self.resnet_block = ResNetBlock(in_channels=${params.in_channels}, out_channels=${params.out_channels}, stride=${params.stride})`,
};

// ==================== Transformer Components ====================

export const MultiHeadAttentionNode: NodeDefinition = {
    id: 'multihead_attention',
    label: 'Multi-Head Attention',
    category: 'Transformer',
    description: 'Multi-head attention mechanism',
    color: '#8b5cf6',
    params: [
        { name: 'embed_dim', label: 'Embed Dim', type: 'number', default: 512, min: 1 },
        { name: 'num_heads', label: 'Num Heads', type: 'number', default: 8, min: 1 },
        { name: 'dropout', label: 'Dropout', type: 'number', default: 0.1, min: 0, max: 1, step: 0.1 },
    ],
    inputs: [{ name: 'input', label: 'Input', type: 'tensor' }],
    outputs: [{ name: 'output', label: 'Output', type: 'tensor' }],
    pythonTemplate: (params: Record<string, any>) => `self.attn = nn.MultiheadAttention(embed_dim=${params.embed_dim}, num_heads=${params.num_heads}, dropout=${params.dropout})`,
};

export const TransformerEncoderNode: NodeDefinition = {
    id: 'transformer_encoder',
    label: 'Transformer Encoder',
    category: 'Transformer',
    description: 'Transformer encoder block',
    color: '#8b5cf6',
    params: [
        { name: 'd_model', label: 'Model Dim', type: 'number', default: 512, min: 1 },
        { name: 'nhead', label: 'Num Heads', type: 'number', default: 8, min: 1 },
        { name: 'num_layers', label: 'Num Layers', type: 'number', default: 6, min: 1 },
        { name: 'dropout', label: 'Dropout', type: 'number', default: 0.1, min: 0, max: 1, step: 0.1 },
    ],
    inputs: [{ name: 'input', label: 'Input', type: 'tensor' }],
    outputs: [{ name: 'output', label: 'Output', type: 'tensor' }],
    pythonTemplate: (params: Record<string, any>) => `encoder_layer = nn.TransformerEncoderLayer(d_model=${params.d_model}, nhead=${params.nhead}, dropout=${params.dropout})
self.transformer_encoder = nn.TransformerEncoder(encoder_layer, num_layers=${params.num_layers})`,
};

export const TransformerDecoderNode: NodeDefinition = {
    id: 'transformer_decoder',
    label: 'Transformer Decoder',
    category: 'Transformer',
    description: 'Transformer decoder block',
    color: '#8b5cf6',
    params: [
        { name: 'd_model', label: 'Model Dim', type: 'number', default: 512, min: 1 },
        { name: 'nhead', label: 'Num Heads', type: 'number', default: 8, min: 1 },
        { name: 'num_layers', label: 'Num Layers', type: 'number', default: 6, min: 1 },
        { name: 'dropout', label: 'Dropout', type: 'number', default: 0.1, min: 0, max: 1, step: 0.1 },
    ],
    inputs: [
        { name: 'input', label: 'Input', type: 'tensor' },
        { name: 'memory', label: 'Memory', type: 'tensor' },
    ],
    outputs: [{ name: 'output', label: 'Output', type: 'tensor' }],
    pythonTemplate: (params: Record<string, any>) => `decoder_layer = nn.TransformerDecoderLayer(d_model=${params.d_model}, nhead=${params.nhead}, dropout=${params.dropout})
self.transformer_decoder = nn.TransformerDecoder(decoder_layer, num_layers=${params.num_layers})`,
};

export const PositionalEncodingNode: NodeDefinition = {
    id: 'positional_encoding',
    label: 'Positional Encoding',
    category: 'Transformer',
    description: 'Add positional encoding to embeddings',
    color: '#8b5cf6',
    params: [
        { name: 'd_model', label: 'Model Dim', type: 'number', default: 512, min: 1 },
        { name: 'max_len', label: 'Max Length', type: 'number', default: 5000, min: 1 },
    ],
    inputs: [{ name: 'input', label: 'Input', type: 'tensor' }],
    outputs: [{ name: 'output', label: 'Output', type: 'tensor' }],
    pythonTemplate: (params: Record<string, any>) => `class PositionalEncoding(nn.Module):
    def __init__(self, d_model, max_len=${params.max_len}):
        super().__init__()
        pe = torch.zeros(max_len, d_model)
        position = torch.arange(0, max_len, dtype=torch.float).unsqueeze(1)
        div_term = torch.exp(torch.arange(0, d_model, 2).float() * (-math.log(10000.0) / d_model))
        pe[:, 0::2] = torch.sin(position * div_term)
        pe[:, 1::2] = torch.cos(position * div_term)
        self.register_buffer('pe', pe.unsqueeze(0))
    
    def forward(self, x):
        return x + self.pe[:, :x.size(1)]

self.pos_encoder = PositionalEncoding(d_model=${params.d_model})`,
};

export const LayerNormNode: NodeDefinition = {
    id: 'layernorm',
    label: 'Layer Normalization',
    category: 'Transformer',
    description: 'Layer normalization',
    color: '#8b5cf6',
    params: [
        { name: 'normalized_shape', label: 'Normalized Shape', type: 'number', default: 512, min: 1 },
        { name: 'eps', label: 'Epsilon', type: 'number', default: 1e-5, min: 0, step: 0.00001 },
    ],
    inputs: [{ name: 'input', label: 'Input', type: 'tensor' }],
    outputs: [{ name: 'output', label: 'Output', type: 'tensor' }],
    pythonTemplate: (params: Record<string, any>) => `self.layernorm = nn.LayerNorm(${params.normalized_shape}, eps=${params.eps})`,
};

// ==================== Loss Functions ====================

export const CrossEntropyLossNode: NodeDefinition = {
    id: 'cross_entropy_loss',
    label: 'CrossEntropyLoss',
    category: 'Loss Functions',
    description: 'Cross entropy loss for classification',
    color: '#ef4444',
    params: [
        { name: 'reduction', label: 'Reduction', type: 'select', default: 'mean', options: ['none', 'mean', 'sum'] },
    ],
    inputs: [
        { name: 'predictions', label: 'Predictions', type: 'tensor' },
        { name: 'targets', label: 'Targets', type: 'tensor' },
    ],
    outputs: [{ name: 'loss', label: 'Loss', type: 'tensor' }],
    pythonTemplate: (params: Record<string, any>) => `criterion = nn.CrossEntropyLoss(reduction='${params.reduction}')
loss = criterion(predictions, targets)`,
};

export const MSELossNode: NodeDefinition = {
    id: 'mse_loss',
    label: 'MSELoss',
    category: 'Loss Functions',
    description: 'Mean squared error loss for regression',
    color: '#ef4444',
    params: [
        { name: 'reduction', label: 'Reduction', type: 'select', default: 'mean', options: ['none', 'mean', 'sum'] },
    ],
    inputs: [
        { name: 'predictions', label: 'Predictions', type: 'tensor' },
        { name: 'targets', label: 'Targets', type: 'tensor' },
    ],
    outputs: [{ name: 'loss', label: 'Loss', type: 'tensor' }],
    pythonTemplate: (params: Record<string, any>) => `criterion = nn.MSELoss(reduction='${params.reduction}')
loss = criterion(predictions, targets)`,
};

export const BCELossNode: NodeDefinition = {
    id: 'bce_loss',
    label: 'BCELoss',
    category: 'Loss Functions',
    description: 'Binary cross entropy loss',
    color: '#ef4444',
    params: [
        { name: 'reduction', label: 'Reduction', type: 'select', default: 'mean', options: ['none', 'mean', 'sum'] },
    ],
    inputs: [
        { name: 'predictions', label: 'Predictions', type: 'tensor' },
        { name: 'targets', label: 'Targets', type: 'tensor' },
    ],
    outputs: [{ name: 'loss', label: 'Loss', type: 'tensor' }],
    pythonTemplate: (params: Record<string, any>) => `criterion = nn.BCELoss(reduction='${params.reduction}')
loss = criterion(predictions, targets)`,
};

export const L1LossNode: NodeDefinition = {
    id: 'l1_loss',
    label: 'L1Loss',
    category: 'Loss Functions',
    description: 'L1 loss (mean absolute error)',
    color: '#ef4444',
    params: [
        { name: 'reduction', label: 'Reduction', type: 'select', default: 'mean', options: ['none', 'mean', 'sum'] },
    ],
    inputs: [
        { name: 'predictions', label: 'Predictions', type: 'tensor' },
        { name: 'targets', label: 'Targets', type: 'tensor' },
    ],
    outputs: [{ name: 'loss', label: 'Loss', type: 'tensor' }],
    pythonTemplate: (params: Record<string, any>) => `criterion = nn.L1Loss(reduction='${params.reduction}')
loss = criterion(predictions, targets)`,
};

export const SmoothL1LossNode: NodeDefinition = {
    id: 'smoothl1_loss',
    label: 'SmoothL1Loss',
    category: 'Loss Functions',
    description: 'Smooth L1 loss (Huber loss)',
    color: '#ef4444',
    params: [
        { name: 'reduction', label: 'Reduction', type: 'select', default: 'mean', options: ['none', 'mean', 'sum'] },
        { name: 'beta', label: 'Beta', type: 'number', default: 1.0, min: 0, step: 0.1 },
    ],
    inputs: [
        { name: 'predictions', label: 'Predictions', type: 'tensor' },
        { name: 'targets', label: 'Targets', type: 'tensor' },
    ],
    outputs: [{ name: 'loss', label: 'Loss', type: 'tensor' }],
    pythonTemplate: (params: Record<string, any>) => `criterion = nn.SmoothL1Loss(reduction='${params.reduction}', beta=${params.beta})
loss = criterion(predictions, targets)`,
};

// ==================== Optimizers ====================

export const AdamNode: NodeDefinition = {
    id: 'adam_optimizer',
    label: 'Adam',
    category: 'Optimizers',
    description: 'Adam optimizer',
    color: '#f59e0b',
    params: [
        { name: 'lr', label: 'Learning Rate', type: 'number', default: 0.001, min: 0, step: 0.0001 },
        { name: 'beta1', label: 'Beta1', type: 'number', default: 0.9, min: 0, max: 1, step: 0.01 },
        { name: 'beta2', label: 'Beta2', type: 'number', default: 0.999, min: 0, max: 1, step: 0.001 },
        { name: 'weight_decay', label: 'Weight Decay', type: 'number', default: 0, min: 0, step: 0.0001 },
    ],
    inputs: [],
    outputs: [],
    pythonTemplate: (params: Record<string, any>) => `optimizer = torch.optim.Adam(
    model.parameters(),
    lr=${params.lr},
    betas=(${params.beta1}, ${params.beta2}),
    weight_decay=${params.weight_decay}
)`,
};

export const SGDNode: NodeDefinition = {
    id: 'sgd_optimizer',
    label: 'SGD',
    category: 'Optimizers',
    description: 'Stochastic gradient descent optimizer',
    color: '#f59e0b',
    params: [
        { name: 'lr', label: 'Learning Rate', type: 'number', default: 0.01, min: 0, step: 0.001 },
        { name: 'momentum', label: 'Momentum', type: 'number', default: 0.9, min: 0, max: 1, step: 0.1 },
        { name: 'weight_decay', label: 'Weight Decay', type: 'number', default: 0, min: 0, step: 0.0001 },
    ],
    inputs: [],
    outputs: [],
    pythonTemplate: (params: Record<string, any>) => `optimizer = torch.optim.SGD(
    model.parameters(),
    lr=${params.lr},
    momentum=${params.momentum},
    weight_decay=${params.weight_decay}
)`,
};

export const AdamWNode: NodeDefinition = {
    id: 'adamw_optimizer',
    label: 'AdamW',
    category: 'Optimizers',
    description: 'AdamW optimizer with decoupled weight decay',
    color: '#f59e0b',
    params: [
        { name: 'lr', label: 'Learning Rate', type: 'number', default: 0.001, min: 0, step: 0.0001 },
        { name: 'beta1', label: 'Beta1', type: 'number', default: 0.9, min: 0, max: 1, step: 0.01 },
        { name: 'beta2', label: 'Beta2', type: 'number', default: 0.999, min: 0, max: 1, step: 0.001 },
        { name: 'weight_decay', label: 'Weight Decay', type: 'number', default: 0.01, min: 0, step: 0.001 },
    ],
    inputs: [],
    outputs: [],
    pythonTemplate: (params: Record<string, any>) => `optimizer = torch.optim.AdamW(
    model.parameters(),
    lr=${params.lr},
    betas=(${params.beta1}, ${params.beta2}),
    weight_decay=${params.weight_decay}
)`,
};

export const RMSpropNode: NodeDefinition = {
    id: 'rmsprop_optimizer',
    label: 'RMSprop',
    category: 'Optimizers',
    description: 'RMSprop optimizer',
    color: '#f59e0b',
    params: [
        { name: 'lr', label: 'Learning Rate', type: 'number', default: 0.01, min: 0, step: 0.001 },
        { name: 'alpha', label: 'Alpha', type: 'number', default: 0.99, min: 0, max: 1, step: 0.01 },
        { name: 'momentum', label: 'Momentum', type: 'number', default: 0, min: 0, max: 1, step: 0.1 },
    ],
    inputs: [],
    outputs: [],
    pythonTemplate: (params: Record<string, any>) => `optimizer = torch.optim.RMSprop(
    model.parameters(),
    lr=${params.lr},
    alpha=${params.alpha},
    momentum=${params.momentum}
)`,
};

export const LRSchedulerNode: NodeDefinition = {
    id: 'lr_scheduler',
    label: 'LR Scheduler',
    category: 'Optimizers',
    description: 'Learning rate scheduler',
    color: '#f59e0b',
    params: [
        { name: 'scheduler_type', label: 'Type', type: 'select', default: 'StepLR', options: ['StepLR', 'CosineAnnealingLR', 'ReduceLROnPlateau'] },
        { name: 'step_size', label: 'Step Size', type: 'number', default: 30, min: 1 },
        { name: 'gamma', label: 'Gamma', type: 'number', default: 0.1, min: 0, max: 1, step: 0.1 },
    ],
    inputs: [],
    outputs: [],
    pythonTemplate: (params: Record<string, any>) => `scheduler = torch.optim.lr_scheduler.${params.scheduler_type}(
    optimizer,
    step_size=${params.step_size},
    gamma=${params.gamma}
)`,
};

// ==================== Advanced Architecture Blocks ====================

export const UNetBlockNode: NodeDefinition = {
    id: 'unet_block',
    label: 'U-Net Block',
    category: 'Model Architecture - Blocks',
    description: 'U-Net encoder-decoder block',
    color: '#7c3aed',
    params: [
        { name: 'in_channels', label: 'In Channels', type: 'number', default: 64, min: 1 },
        { name: 'out_channels', label: 'Out Channels', type: 'number', default: 128, min: 1 },
    ],
    inputs: [{ name: 'input', label: 'Input', type: 'tensor' }],
    outputs: [{ name: 'output', label: 'Output', type: 'tensor' }],
    pythonTemplate: (params: Record<string, any>) => `class UNetBlock(nn.Module):
    def __init__(self, in_channels, out_channels):
        super().__init__()
        self.conv1 = nn.Conv2d(in_channels, out_channels, kernel_size=3, padding=1)
        self.bn1 = nn.BatchNorm2d(out_channels)
        self.conv2 = nn.Conv2d(out_channels, out_channels, kernel_size=3, padding=1)
        self.bn2 = nn.BatchNorm2d(out_channels)
        self.relu = nn.ReLU(inplace=True)
    
    def forward(self, x):
        x = self.relu(self.bn1(self.conv1(x)))
        x = self.relu(self.bn2(self.conv2(x)))
        return x

self.unet_block = UNetBlock(in_channels=${params.in_channels}, out_channels=${params.out_channels})`,
};

export const InceptionModuleNode: NodeDefinition = {
    id: 'inception_module',
    label: 'Inception Module',
    category: 'Model Architecture - Blocks',
    description: 'Inception module with parallel convolutions',
    color: '#7c3aed',
    params: [
        { name: 'in_channels', label: 'In Channels', type: 'number', default: 256, min: 1 },
        { name: 'ch1x1', label: '1x1 Channels', type: 'number', default: 64, min: 1 },
        { name: 'ch3x3', label: '3x3 Channels', type: 'number', default: 128, min: 1 },
        { name: 'ch5x5', label: '5x5 Channels', type: 'number', default: 32, min: 1 },
    ],
    inputs: [{ name: 'input', label: 'Input', type: 'tensor' }],
    outputs: [{ name: 'output', label: 'Output', type: 'tensor' }],
    pythonTemplate: (params: Record<string, any>) => `class InceptionModule(nn.Module):
    def __init__(self, in_channels, ch1x1, ch3x3, ch5x5):
        super().__init__()
        self.branch1 = nn.Conv2d(in_channels, ch1x1, kernel_size=1)
        self.branch3 = nn.Conv2d(in_channels, ch3x3, kernel_size=3, padding=1)
        self.branch5 = nn.Conv2d(in_channels, ch5x5, kernel_size=5, padding=2)
        self.branch_pool = nn.Sequential(
            nn.MaxPool2d(kernel_size=3, stride=1, padding=1),
            nn.Conv2d(in_channels, 32, kernel_size=1)
        )
    
    def forward(self, x):
        return torch.cat([self.branch1(x), self.branch3(x), self.branch5(x), self.branch_pool(x)], 1)

self.inception = InceptionModule(in_channels=${params.in_channels}, ch1x1=${params.ch1x1}, ch3x3=${params.ch3x3}, ch5x5=${params.ch5x5})`,
};

export const DenseNetBlockNode: NodeDefinition = {
    id: 'densenet_block',
    label: 'DenseNet Block',
    category: 'Model Architecture - Blocks',
    description: 'Dense block with concatenation',
    color: '#7c3aed',
    params: [
        { name: 'in_channels', label: 'In Channels', type: 'number', default: 64, min: 1 },
        { name: 'growth_rate', label: 'Growth Rate', type: 'number', default: 32, min: 1 },
        { name: 'num_layers', label: 'Num Layers', type: 'number', default: 4, min: 1 },
    ],
    inputs: [{ name: 'input', label: 'Input', type: 'tensor' }],
    outputs: [{ name: 'output', label: 'Output', type: 'tensor' }],
    pythonTemplate: (params: Record<string, any>) => `class DenseLayer(nn.Module):
    def __init__(self, in_channels, growth_rate):
        super().__init__()
        self.bn1 = nn.BatchNorm2d(in_channels)
        self.conv1 = nn.Conv2d(in_channels, 4 * growth_rate, kernel_size=1)
        self.bn2 = nn.BatchNorm2d(4 * growth_rate)
        self.conv2 = nn.Conv2d(4 * growth_rate, growth_rate, kernel_size=3, padding=1)
    
    def forward(self, x):
        out = self.conv1(F.relu(self.bn1(x)))
        out = self.conv2(F.relu(self.bn2(out)))
        return torch.cat([x, out], 1)

class DenseBlock(nn.Module):
    def __init__(self, in_channels, growth_rate, num_layers):
        super().__init__()
        self.layers = nn.ModuleList()
        for i in range(num_layers):
            self.layers.append(DenseLayer(in_channels + i * growth_rate, growth_rate))
    
    def forward(self, x):
        for layer in self.layers:
            x = layer(x)
        return x

self.dense_block = DenseBlock(in_channels=${params.in_channels}, growth_rate=${params.growth_rate}, num_layers=${params.num_layers})`,
};

export const MobileNetBlockNode: NodeDefinition = {
    id: 'mobilenet_block',
    label: 'MobileNet Block',
    category: 'Model Architecture - Blocks',
    description: 'MobileNet depthwise separable convolution',
    color: '#7c3aed',
    params: [
        { name: 'in_channels', label: 'In Channels', type: 'number', default: 32, min: 1 },
        { name: 'out_channels', label: 'Out Channels', type: 'number', default: 64, min: 1 },
        { name: 'stride', label: 'Stride', type: 'number', default: 1, min: 1 },
    ],
    inputs: [{ name: 'input', label: 'Input', type: 'tensor' }],
    outputs: [{ name: 'output', label: 'Output', type: 'tensor' }],
    pythonTemplate: (params: Record<string, any>) => `class DepthwiseSeparableConv(nn.Module):
    def __init__(self, in_channels, out_channels, stride):
        super().__init__()
        self.depthwise = nn.Conv2d(in_channels, in_channels, kernel_size=3, stride=stride, padding=1, groups=in_channels)
        self.pointwise = nn.Conv2d(in_channels, out_channels, kernel_size=1)
        self.bn1 = nn.BatchNorm2d(in_channels)
        self.bn2 = nn.BatchNorm2d(out_channels)
        self.relu = nn.ReLU(inplace=True)
    
    def forward(self, x):
        x = self.relu(self.bn1(self.depthwise(x)))
        x = self.relu(self.bn2(self.pointwise(x)))
        return x

self.mobilenet_block = DepthwiseSeparableConv(in_channels=${params.in_channels}, out_channels=${params.out_channels}, stride=${params.stride})`,
};

export const AttentionBlockNode: NodeDefinition = {
    id: 'attention_block',
    label: 'Attention Block',
    category: 'Model Architecture - Blocks',
    description: 'Self-attention block for CNNs',
    color: '#7c3aed',
    params: [
        { name: 'in_channels', label: 'In Channels', type: 'number', default: 512, min: 1 },
        { name: 'reduction', label: 'Reduction Ratio', type: 'number', default: 16, min: 1 },
    ],
    inputs: [{ name: 'input', label: 'Input', type: 'tensor' }],
    outputs: [{ name: 'output', label: 'Output', type: 'tensor' }],
    pythonTemplate: (params: Record<string, any>) => `class SEBlock(nn.Module):
    def __init__(self, in_channels, reduction=16):
        super().__init__()
        self.avg_pool = nn.AdaptiveAvgPool2d(1)
        self.fc = nn.Sequential(
            nn.Linear(in_channels, in_channels // reduction, bias=False),
            nn.ReLU(inplace=True),
            nn.Linear(in_channels // reduction, in_channels, bias=False),
            nn.Sigmoid()
        )
    
    def forward(self, x):
        b, c, _, _ = x.size()
        y = self.avg_pool(x).view(b, c)
        y = self.fc(y).view(b, c, 1, 1)
        return x * y.expand_as(x)

self.attention = SEBlock(in_channels=${params.in_channels}, reduction=${params.reduction})`,
};

