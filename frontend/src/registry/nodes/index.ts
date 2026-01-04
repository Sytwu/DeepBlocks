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
