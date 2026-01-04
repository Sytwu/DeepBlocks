import { NodeDefinition } from '../types/nodes';
import {
    InputNode,
    Conv2dNode,
    LinearNode,
    ReLUNode,
    BatchNorm2dNode,
    MaxPool2dNode
} from './nodes';

class NodeRegistry {
    private nodes: Map<string, NodeDefinition> = new Map();

    constructor() {
        this.registerNode(InputNode);
        this.registerNode(Conv2dNode);
        this.registerNode(LinearNode);
        this.registerNode(ReLUNode);
        this.registerNode(BatchNorm2dNode);
        this.registerNode(MaxPool2dNode);
    }

    registerNode(node: NodeDefinition) {
        this.nodes.set(node.id, node);
    }

    getNode(id: string): NodeDefinition | undefined {
        return this.nodes.get(id);
    }

    getAllNodes(): NodeDefinition[] {
        return Array.from(this.nodes.values());
    }

    getNodesByCategory(category: string): NodeDefinition[] {
        return this.getAllNodes().filter((node) => node.category === category);
    }

    getCategories(): string[] {
        const categories = new Set(
            this.getAllNodes().map((node) => node.category)
        );
        return Array.from(categories);
    }
}

export const nodeRegistry = new NodeRegistry();
