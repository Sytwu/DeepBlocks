import { NodeDefinition } from '../types/nodes';
import {
    InputNode,
    DataLoaderNode,
    OutputNode,
    Conv2dNode,
    Conv3dNode,
    LinearNode,
    BatchNorm2dNode,
    MaxPool2dNode,
    AvgPool2dNode,
    DropoutNode,
    FlattenNode,
    ReLUNode,
    LeakyReLUNode,
    SigmoidNode,
    SoftmaxNode,
    TanhNode,
    ConcatNode,
    AddNode,
    ReshapeNode,
} from './nodes';

class NodeRegistry {
    private nodes: Map<string, NodeDefinition> = new Map();

    constructor() {
        // Data Processing
        this.registerNode(InputNode);
        this.registerNode(DataLoaderNode);
        this.registerNode(OutputNode);

        // Layers
        this.registerNode(Conv2dNode);
        this.registerNode(Conv3dNode);
        this.registerNode(LinearNode);
        this.registerNode(BatchNorm2dNode);
        this.registerNode(MaxPool2dNode);
        this.registerNode(AvgPool2dNode);
        this.registerNode(DropoutNode);
        this.registerNode(FlattenNode);

        // Activations
        this.registerNode(ReLUNode);
        this.registerNode(LeakyReLUNode);
        this.registerNode(SigmoidNode);
        this.registerNode(SoftmaxNode);
        this.registerNode(TanhNode);

        // Operations
        this.registerNode(ConcatNode);
        this.registerNode(AddNode);
        this.registerNode(ReshapeNode);
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
