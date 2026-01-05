import { ExampleProject } from '../types/example';

export const mnistExample: ExampleProject = {
    id: 'mnist-classifier',
    name: 'MNIST Classifier',
    description: 'Classic handwritten digit recognition model',
    difficulty: 'Beginner',
    tags: ['vision', 'classification', 'beginner'],
    nodes: [
        {
            id: 'input-1',
            type: 'custom',
            position: { x: 100, y: 80 },
            data: {
                type: 'input',
                label: 'Input',
                params: { shape: '[1, 1, 28, 28]', dtype: 'float32' },
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
                params: { in_channels: 1, out_channels: 32, kernel_size: 3, stride: 1, padding: 1 },
                color: '#2563eb',
            },
        },
        {
            id: 'relu1',
            type: 'custom',
            position: { x: 100, y: 280 },
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
            position: { x: 100, y: 380 },
            data: {
                type: 'maxpool2d',
                label: 'MaxPool2d',
                params: { kernel_size: 2, stride: 2, padding: 0 },
                color: '#f59e0b',
            },
        },
        {
            id: 'conv2',
            type: 'custom',
            position: { x: 350, y: 80 },
            data: {
                type: 'conv2d',
                label: 'Conv2d',
                params: { in_channels: 32, out_channels: 64, kernel_size: 3, stride: 1, padding: 1 },
                color: '#2563eb',
            },
        },
        {
            id: 'relu2',
            type: 'custom',
            position: { x: 350, y: 180 },
            data: {
                type: 'relu',
                label: 'ReLU',
                params: { inplace: false },
                color: '#10b981',
            },
        },
        {
            id: 'pool2',
            type: 'custom',
            position: { x: 350, y: 280 },
            data: {
                type: 'maxpool2d',
                label: 'MaxPool2d',
                params: { kernel_size: 2, stride: 2, padding: 0 },
                color: '#f59e0b',
            },
        },
        {
            id: 'flatten',
            type: 'custom',
            position: { x: 350, y: 380 },
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
            position: { x: 600, y: 80 },
            data: {
                type: 'linear',
                label: 'Linear',
                params: { in_features: 3136, out_features: 128, bias: true },
                color: '#2563eb',
            },
        },
        {
            id: 'relu3',
            type: 'custom',
            position: { x: 600, y: 180 },
            data: {
                type: 'relu',
                label: 'ReLU',
                params: { inplace: false },
                color: '#10b981',
            },
        },
        {
            id: 'fc2',
            type: 'custom',
            position: { x: 600, y: 280 },
            data: {
                type: 'linear',
                label: 'Linear',
                params: { in_features: 128, out_features: 10, bias: true },
                color: '#2563eb',
            },
        },
    ],
    edges: [
        { id: 'e1', source: 'input-1', target: 'conv1', sourceHandle: null, targetHandle: null },
        { id: 'e2', source: 'conv1', target: 'relu1', sourceHandle: null, targetHandle: null },
        { id: 'e3', source: 'relu1', target: 'pool1', sourceHandle: null, targetHandle: null },
        { id: 'e4', source: 'pool1', target: 'conv2', sourceHandle: null, targetHandle: null },
        { id: 'e5', source: 'conv2', target: 'relu2', sourceHandle: null, targetHandle: null },
        { id: 'e6', source: 'relu2', target: 'pool2', sourceHandle: null, targetHandle: null },
        { id: 'e7', source: 'pool2', target: 'flatten', sourceHandle: null, targetHandle: null },
        { id: 'e8', source: 'flatten', target: 'fc1', sourceHandle: null, targetHandle: null },
        { id: 'e9', source: 'fc1', target: 'relu3', sourceHandle: null, targetHandle: null },
        { id: 'e10', source: 'relu3', target: 'fc2', sourceHandle: null, targetHandle: null },
    ],
};
