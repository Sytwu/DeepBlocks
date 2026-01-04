import { NodeDefinition } from '../../types/nodes';

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
    outputs: [
        {
            name: 'output',
            label: 'Output',
            type: 'tensor',
        },
    ],
    pythonTemplate: (params: Record<string, any>) => `# Input Node
x = torch.randn(${params.shape}, dtype=torch.${params.dtype})`,
};

export const Conv2dNode: NodeDefinition = {
    id: 'conv2d',
    label: 'Conv2d',
    category: 'Model Architecture',
    description: '2D Convolution layer',
    color: '#2563eb',
    params: [
        {
            name: 'in_channels',
            label: 'In Channels',
            type: 'number',
            default: 3,
            min: 1,
        },
        {
            name: 'out_channels',
            label: 'Out Channels',
            type: 'number',
            default: 64,
            min: 1,
        },
        {
            name: 'kernel_size',
            label: 'Kernel Size',
            type: 'number',
            default: 3,
            min: 1,
        },
        {
            name: 'stride',
            label: 'Stride',
            type: 'number',
            default: 1,
            min: 1,
        },
        {
            name: 'padding',
            label: 'Padding',
            type: 'number',
            default: 1,
            min: 0,
        },
    ],
    inputs: [
        {
            name: 'input',
            label: 'Input',
            type: 'tensor',
        },
    ],
    outputs: [
        {
            name: 'output',
            label: 'Output',
            type: 'tensor',
        },
    ],
    pythonTemplate: (params: Record<string, any>) => `self.conv = nn.Conv2d(
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
        {
            name: 'in_features',
            label: 'In Features',
            type: 'number',
            default: 512,
            min: 1,
        },
        {
            name: 'out_features',
            label: 'Out Features',
            type: 'number',
            default: 10,
            min: 1,
        },
        {
            name: 'bias',
            label: 'Use Bias',
            type: 'boolean',
            default: true,
        },
    ],
    inputs: [
        {
            name: 'input',
            label: 'Input',
            type: 'tensor',
        },
    ],
    outputs: [
        {
            name: 'output',
            label: 'Output',
            type: 'tensor',
        },
    ],
    pythonTemplate: (params: Record<string, any>) => `self.fc = nn.Linear(
    in_features=${params.in_features},
    out_features=${params.out_features},
    bias=${params.bias}
)`,
};

export const ReLUNode: NodeDefinition = {
    id: 'relu',
    label: 'ReLU',
    category: 'Model Architecture',
    description: 'ReLU activation function',
    color: '#10b981',
    params: [
        {
            name: 'inplace',
            label: 'Inplace',
            type: 'boolean',
            default: false,
        },
    ],
    inputs: [
        {
            name: 'input',
            label: 'Input',
            type: 'tensor',
        },
    ],
    outputs: [
        {
            name: 'output',
            label: 'Output',
            type: 'tensor',
        },
    ],
    pythonTemplate: (params: Record<string, any>) => `self.relu = nn.ReLU(inplace=${params.inplace})`,
};

export const BatchNorm2dNode: NodeDefinition = {
    id: 'batchnorm2d',
    label: 'BatchNorm2d',
    category: 'Model Architecture',
    description: 'Batch Normalization 2D',
    color: '#8b5cf6',
    params: [
        {
            name: 'num_features',
            label: 'Num Features',
            type: 'number',
            default: 64,
            min: 1,
        },
        {
            name: 'eps',
            label: 'Epsilon',
            type: 'number',
            default: 0.00001,
            min: 0,
            step: 0.00001,
        },
        {
            name: 'momentum',
            label: 'Momentum',
            type: 'number',
            default: 0.1,
            min: 0,
            max: 1,
            step: 0.01,
        },
    ],
    inputs: [
        {
            name: 'input',
            label: 'Input',
            type: 'tensor',
        },
    ],
    outputs: [
        {
            name: 'output',
            label: 'Output',
            type: 'tensor',
        },
    ],
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
        {
            name: 'kernel_size',
            label: 'Kernel Size',
            type: 'number',
            default: 2,
            min: 1,
        },
        {
            name: 'stride',
            label: 'Stride',
            type: 'number',
            default: 2,
            min: 1,
        },
        {
            name: 'padding',
            label: 'Padding',
            type: 'number',
            default: 0,
            min: 0,
        },
    ],
    inputs: [
        {
            name: 'input',
            label: 'Input',
            type: 'tensor',
        },
    ],
    outputs: [
        {
            name: 'output',
            label: 'Output',
            type: 'tensor',
        },
    ],
    pythonTemplate: (params: Record<string, any>) => `self.pool = nn.MaxPool2d(
    kernel_size=${params.kernel_size},
    stride=${params.stride},
    padding=${params.padding}
)`,
};
