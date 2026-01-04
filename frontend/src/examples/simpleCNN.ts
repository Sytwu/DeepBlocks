import { ExampleProject } from '../types/example';

export const simpleCNNExample: ExampleProject = {
    id: 'simple-cnn',
    name: 'Simple CNN',
    description: 'Standard CNN with BatchNorm layers',
    difficulty: 'Intermediate',
    tags: ['vision', 'cnn', 'batchnorm'],
    nodes: [
        {
            id: 'input-1',
            type: 'custom',
            position: { x: 100, y: 80 },
            data: {
                type: 'input',
                label: 'Input',
                params: { shape: '[1, 3, 224, 224]', dtype: 'float32' },
                color: '#3b82f6',
            },
        },
        {
            id: 'conv1',
            type: 'custom',
            position: { x: 100, y: 180 },
            data: {
                type: 'conv2d',
                label: 'Conv2d',
                params: { in_channels: 3, out_channels: 64, kernel_size: 3, stride: 1, padding: 1 },
                color: '#2563eb',
            },
        },
        {
            id: 'bn1',
            type: 'custom',
            position: { x: 100, y: 280 },
            data: {
                type: 'batchnorm2d',
                label: 'BatchNorm2d',
                params: { num_features: 64, eps: 0.00001, momentum: 0.1 },
                color: '#8b5cf6',
            },
        },
        {
            id: 'relu1',
            type: 'custom',
            position: { x: 100, y: 380 },
            data: {
                type: 'relu',
                label: 'ReLU',
                params: { inplace: false },
                color: '#10b981',
            },
        },
        {
            id: 'conv2',
            type: 'custom',
            position: { x: 350, y: 80 },
            data: {
                type: 'conv2d',
                label: 'Conv2d',
                params: { in_channels: 64, out_channels: 128, kernel_size: 3, stride: 1, padding: 1 },
                color: '#2563eb',
            },
        },
        {
            id: 'bn2',
            type: 'custom',
            position: { x: 350, y: 180 },
            data: {
                type: 'batchnorm2d',
                label: 'BatchNorm2d',
                params: { num_features: 128, eps: 0.00001, momentum: 0.1 },
                color: '#8b5cf6',
            },
        },
        {
            id: 'relu2',
            type: 'custom',
            position: { x: 350, y: 280 },
            data: {
                type: 'relu',
                label: 'ReLU',
                params: { inplace: false },
                color: '#10b981',
            },
        },
        {
            id: 'pool1',
            type: 'custom',
            position: { x: 350, y: 380 },
            data: {
                type: 'maxpool2d',
                label: 'MaxPool2d',
                params: { kernel_size: 2, stride: 2, padding: 0 },
                color: '#f59e0b',
            },
        },
        {
            id: 'avgpool',
            type: 'custom',
            position: { x: 600, y: 80 },
            data: {
                type: 'avgpool2d',
                label: 'AvgPool2d',
                params: { kernel_size: 7, stride: 1, padding: 0 },
                color: '#f59e0b',
            },
        },
        {
            id: 'flatten',
            type: 'custom',
            position: { x: 600, y: 180 },
            data: {
                type: 'flatten',
                label: 'Flatten',
                params: { start_dim: 1 },
                color: '#8b5cf6',
            },
        },
        {
            id: 'fc1',
            type: 'custom',
            position: { x: 600, y: 280 },
            data: {
                type: 'linear',
                label: 'Linear',
                params: { in_features: 128, out_features: 1000, bias: true },
                color: '#2563eb',
            },
        },
    ],
    edges: [
        { id: 'e1', source: 'input-1', target: 'conv1', sourceHandle: null, targetHandle: null },
        { id: 'e2', source: 'conv1', target: 'bn1', sourceHandle: null, targetHandle: null },
        { id: 'e3', source: 'bn1', target: 'relu1', sourceHandle: null, targetHandle: null },
        { id: 'e4', source: 'relu1', target: 'conv2', sourceHandle: null, targetHandle: null },
        { id: 'e5', source: 'conv2', target: 'bn2', sourceHandle: null, targetHandle: null },
        { id: 'e6', source: 'bn2', target: 'relu2', sourceHandle: null, targetHandle: null },
        { id: 'e7', source: 'relu2', target: 'pool1', sourceHandle: null, targetHandle: null },
        { id: 'e8', source: 'pool1', target: 'avgpool', sourceHandle: null, targetHandle: null },
        { id: 'e9', source: 'avgpool', target: 'flatten', sourceHandle: null, targetHandle: null },
        { id: 'e10', source: 'flatten', target: 'fc1', sourceHandle: null, targetHandle: null },
    ],
};
