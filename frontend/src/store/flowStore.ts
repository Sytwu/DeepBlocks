import { create } from 'zustand';
import { Node as ReactFlowNode } from 'reactflow';

interface FlowState {
    selectedNodeId: string | null;
    nodes: ReactFlowNode[];
    setSelectedNodeId: (id: string | null) => void;
    updateNodeParams: (nodeId: string, params: Record<string, any>) => void;
    setNodes: (nodes: ReactFlowNode[]) => void;
}

export const useFlowStore = create<FlowState>((set) => ({
    selectedNodeId: null,
    nodes: [],
    setSelectedNodeId: (id) => set({ selectedNodeId: id }),
    setNodes: (nodes) => set({ nodes }),
    updateNodeParams: (nodeId, params) =>
        set((state) => ({
            nodes: state.nodes.map((node) =>
                node.id === nodeId
                    ? {
                        ...node,
                        data: {
                            ...node.data,
                            params: { ...node.data.params, ...params },
                        },
                    }
                    : node
            ),
        })),
}));
