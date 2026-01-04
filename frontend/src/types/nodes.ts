// Node Definition Types
export interface ParamConfig {
    name: string;
    label: string;
    type: 'number' | 'string' | 'boolean' | 'select';
    default: any;
    options?: string[]; // For select type
    min?: number;      // For number type
    max?: number;
    step?: number;
}

export interface IOConfig {
    name: string;
    label: string;
    type: 'tensor' | 'number' | 'string';
}

export interface NodeDefinition {
    id: string;
    label: string;
    category: string;
    description?: string;
    color: string;
    params: ParamConfig[];
    inputs: IOConfig[];
    outputs: IOConfig[];
    pythonTemplate: (params: Record<string, any>) => string;
}

// Node Instance (what appears on canvas)
export interface NodeData {
    type: string;
    label: string;
    params: Record<string, any>;
    color: string;
}
