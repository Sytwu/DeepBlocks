import { NodeDefinition } from '../types/nodes';
import { InputNode, Conv2dNode } from './nodes';

class NodeRegistry {
    private nodes: Map<string, NodeDefinition> = new Map();

    constructor() {
        this.registerNode(InputNode);
        this.registerNode(Conv2dNode);
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
