import { Node, Edge } from 'reactflow';

export interface Project {
    id: string;
    name: string;
    description?: string;
    nodes: Node[];
    edges: Edge[];
    createdAt: string;
    updatedAt: string;
}

export interface ProjectMetadata {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    nodeCount: number;
}
