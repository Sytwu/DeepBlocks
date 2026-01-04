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
    description: 'Conv2d layer',
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
