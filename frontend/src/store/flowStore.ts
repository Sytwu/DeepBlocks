import { create } from 'zustand';
import { Node as ReactFlowNode, Edge } from 'reactflow';

interface FlowState {
    nodes: ReactFlowNode[];
    edges: Edge[];
    selectedNodeId: string | null;

    // History for undo/redo
    history: { nodes: ReactFlowNode[]; edges: Edge[] }[];
    historyIndex: number;

    setNodes: (nodes: ReactFlowNode[]) => void;
    setEdges: (edges: Edge[]) => void;
    setSelectedNodeId: (id: string | null) => void;
    updateNodeParams: (nodeId: string, params: Record<string, any>) => void;

    // History methods
    saveHistory: () => void;
    clearHistory: () => void;
    undo: () => void;
    redo: () => void;
    canUndo: () => boolean;
    canRedo: () => boolean;
}

export const useFlowStore = create<FlowState>((set, get) => ({
    nodes: [],
    edges: [],
    selectedNodeId: null,

    // Initialize history
    history: [],
    historyIndex: -1,

    setNodes: (nodes) => set({ nodes }),
    setEdges: (edges) => set({ edges }),
    setSelectedNodeId: (id) => set({ selectedNodeId: id }),

    updateNodeParams: (nodeId, params) => {
        set((state) => ({
            nodes: state.nodes.map((node) =>
                node.id === nodeId
                    ? { ...node, data: { ...node.data, params: { ...node.data.params, ...params } } }
                    : node
            ),
        }));
    },

    // History management
    saveHistory: () => {
        const state = get();
        const snapshot = {
            nodes: JSON.parse(JSON.stringify(state.nodes)),
            edges: JSON.parse(JSON.stringify(state.edges)),
        };

        // Prevent duplicate saves by comparing with last snapshot
        if (state.history.length > 0 && state.historyIndex >= 0) {
            const lastSnapshot = state.history[state.historyIndex];
            const lastHash = JSON.stringify(lastSnapshot);
            const currentHash = JSON.stringify(snapshot);
            if (lastHash === currentHash) {
                return; // Skip saving if identical
            }
        }

        // Remove any history after current index (when making new changes after undo)
        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push(snapshot);

        // Keep only last 20 snapshots
        const limitedHistory = newHistory.slice(-20);

        set({
            history: limitedHistory,
            historyIndex: limitedHistory.length - 1,
        });
    },

    clearHistory: () => {
        set({
            history: [],
            historyIndex: -1,
        });
    },

    undo: () => {
        const state = get();
        if (state.historyIndex > 0) {
            const newIndex = state.historyIndex - 1;
            const snapshot = state.history[newIndex];
            set({
                nodes: snapshot.nodes,
                edges: snapshot.edges,
                historyIndex: newIndex,
            });
        }
    },

    redo: () => {
        const state = get();
        if (state.historyIndex < state.history.length - 1) {
            const newIndex = state.historyIndex + 1;
            const snapshot = state.history[newIndex];
            set({
                nodes: snapshot.nodes,
                edges: snapshot.edges,
                historyIndex: newIndex,
            });
        }
    },

    canUndo: () => {
        const state = get();
        return state.historyIndex > 0;
    },

    canRedo: () => {
        const state = get();
        return state.historyIndex < state.history.length - 1;
    },
}));
