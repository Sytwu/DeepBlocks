import { Node, Edge } from 'reactflow';

export interface ExampleProject {
    id: string;
    name: string;
    description: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    nodes: Node[];
    edges: Edge[];
    tags: string[];
}
