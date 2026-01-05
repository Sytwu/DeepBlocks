import { Node, Edge } from 'reactflow';
import { ExampleProject } from '../types/example';

// ResNet Block Example
const resnetBlockNodes: Node[] = [
    {
        id: 'input_1',
        type: 'custom',
        position: { x: 100, y: 100 },
        data: {
            type: 'Input',
            label: 'Input',
            params: {
                channels: 64,
                height: 56,
                width: 56,
            },
            color: '#10b981',
        },
    },
    // First Conv Path
    {
        id: 'conv1',
        type: 'custom',
        position: { x: 100, y: 200 },
        data: {
            type: 'Conv2d',
            label: 'Conv2d',
            params: {
                in_channels: 64,
                out_channels: 64,
                kernel_size: 3,
                stride: 1,
                padding: 1,
            },
            color: '#3b82f6',
        },
    },
    {
        id: 'bn1',
        type: 'custom',
        position: { x: 100, y: 300 },
        data: {
            type: 'BatchNorm2d',
            label: 'BatchNorm2d',
            params: {
                num_features: 64,
            },
            color: '#3b82f6',
        },
    },
    {
        id: 'relu1',
        type: 'custom',
        position: { x: 100, y: 400 },
        data: {
            type: 'ReLU',
            label: 'ReLU',
            params: {},
            color: '#f59e0b',
        },
    },
    {
        id: 'conv2',
        type: 'custom',
        position: { x: 100, y: 500 },
        data: {
            type: 'Conv2d',
            label: 'Conv2d',
            params: {
                in_channels: 64,
                out_channels: 64,
                kernel_size: 3,
                stride: 1,
                padding: 1,
            },
            color: '#3b82f6',
        },
    },
    {
        id: 'bn2',
        type: 'custom',
        position: { x: 100, y: 600 },
        data: {
            type: 'BatchNorm2d',
            label: 'BatchNorm2d',
            params: {
                num_features: 64,
            },
            color: '#3b82f6',
        },
    },
    // Add for residual connection
    {
        id: 'add_1',
        type: 'custom',
        position: { x: 200, y: 650 },
        data: {
            type: 'Add',
            label: 'Add (Residual)',
            params: {},
            color: '#8b5cf6',
        },
    },
    {
        id: 'relu2',
        type: 'custom',
        position: { x: 200, y: 750 },
        data: {
            type: 'ReLU',
            label: 'ReLU',
            params: {},
            color: '#f59e0b',
        },
    },
    {
        id: 'output_1',
        type: 'custom',
        position: { x: 200, y: 850 },
        data: {
            type: 'Output',
            label: 'Output',
            params: {},
            color: '#ef4444',
        },
    },
];

const resnetBlockEdges: Edge[] = [
    { id: 'e1', source: 'input_1', target: 'conv1' },
    { id: 'e2', source: 'conv1', target: 'bn1' },
    { id: 'e3', source: 'bn1', target: 'relu1' },
    { id: 'e4', source: 'relu1', target: 'conv2' },
    { id: 'e5', source: 'conv2', target: 'bn2' },
    { id: 'e6', source: 'bn2', target: 'add_1' },
    { id: 'e7', source: 'input_1', target: 'add_1' }, // Skip connection
    { id: 'e8', source: 'add_1', target: 'relu2' },
    { id: 'e9', source: 'relu2', target: 'output_1' },
];

export const resnetBlock: ExampleProject = {
    id: 'resnet-block',
    name: 'ResNet Block',
    description: 'Residual Block with skip connection (3x3 conv, BatchNorm, ReLU)',
    difficulty: 'Intermediate',
    tags: ['vision', 'resnet', 'residual'],
    nodes: resnetBlockNodes,
    edges: resnetBlockEdges,
};
