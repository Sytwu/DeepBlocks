import React, { useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    BackgroundVariant,
    NodeTypes,
    OnSelectionChangeParams,
    useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { CustomNode } from '../nodes/CustomNode';
import { nodeRegistry } from '../../registry/NodeRegistry';
import { useFlowStore } from '../../store/flowStore';
import { useAutoSave } from '../../hooks/useAutoSave';
import { useToast } from '../../contexts/ToastContext';

const nodeTypes: NodeTypes = {
    custom: CustomNode,
};

let id = 0;
const getId = () => `node_${id++}`;

export const FlowCanvas: React.FC = () => {
    useAutoSave();
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const { project, getZoom } = useReactFlow();

    const setSelectedNodeId = useFlowStore((state) => state.setSelectedNodeId);
    const setStoreNodes = useFlowStore((state) => state.setNodes);
    const setStoreEdges = useFlowStore((state) => state.setEdges);
    const saveHistory = useFlowStore((state) => state.saveHistory);
    const undo = useFlowStore((state) => state.undo);
    const redo = useFlowStore((state) => state.redo);

    // 修復：直接選擇值而非調用函數
    const canUndo = useFlowStore((state) => state.historyIndex > 0);
    const canRedo = useFlowStore((state) => state.historyIndex < state.history.length - 1);
    const toast = useToast();


    // Sync nodes and edges to store (NO automatic history save)
    useEffect(() => {
        setStoreNodes(nodes);
        setStoreEdges(edges);
    }, [nodes, edges, setStoreNodes, setStoreEdges]);

    // Undo/Redo handlers with state sync
    const handleUndo = useCallback(() => {
        if (canUndo) {
            undo();
            // 關鍵修復：同步 store 狀態到 ReactFlow
            const state = useFlowStore.getState();
            setNodes(state.nodes);
            setEdges(state.edges);
            toast.success('Undo');
        }
    }, [canUndo, undo, setNodes, setEdges, toast]);

    const handleRedo = useCallback(() => {
        if (canRedo) {
            redo();
            // 關鍵修復：同步 store 狀態到 ReactFlow
            const state = useFlowStore.getState();
            setNodes(state.nodes);
            setEdges(state.edges);
            toast.success('Redo');
        }
    }, [canRedo, redo, setNodes, setEdges, toast]);

    // Event: Connection created - save history after edge added
    const onConnect = useCallback(
        (params: Connection) => {
            setEdges((eds) => addEdge(params, eds));
            // Use setTimeout to ensure state update completes
            setTimeout(() => saveHistory(), 0);
        },
        [setEdges, saveHistory]
    );

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const nodeId = event.dataTransfer.getData('application/reactflow');
            if (!nodeId) return;

            const nodeDef = nodeRegistry.getNode(nodeId);
            if (!nodeDef) return;

            const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
            if (!reactFlowBounds) return;

            // Get current zoom level
            const zoom = getZoom();

            // Node dimensions (approximate)
            const nodeWidth = 160;
            const nodeHeight = 80;

            // Calculate offset in screen space (affected by zoom)
            const offsetX = (nodeWidth / 2) * zoom;
            const offsetY = (nodeHeight / 2) * zoom;

            // Convert screen coordinates to canvas coordinates
            // Apply offset in screen space before projection
            const position = project({
                x: event.clientX - reactFlowBounds.left - offsetX,
                y: event.clientY - reactFlowBounds.top - offsetY,
            });

            // Create default params from node definition
            const params: Record<string, any> = {};
            nodeDef.params.forEach(param => {
                params[param.name] = param.default;
            });

            const newNode = {
                id: getId(),
                type: 'custom',
                position,
                data: {
                    type: nodeDef.id,
                    label: nodeDef.label,
                    params,
                    color: nodeDef.color,
                },
            };

            setNodes((nds) => nds.concat(newNode));
            // Event: Node added - save history
            setTimeout(() => saveHistory(), 0);
        },
        [setNodes, saveHistory, project, getZoom]
    );

    // Event: Node drag stopped - save final position
    const onNodeDragStop = useCallback(() => {
        setTimeout(() => saveHistory(), 0);
    }, [saveHistory]);

    // Event: Nodes deleted (via ReactFlow)
    const onNodesDelete = useCallback(() => {
        setTimeout(() => saveHistory(), 0);
    }, [saveHistory]);

    // Event: Edges deleted
    const onEdgesDelete = useCallback(() => {
        setTimeout(() => saveHistory(), 0);
    }, [saveHistory]);

    // Duplicate selected nodes (Ctrl+D)
    const handleDuplicate = useCallback(() => {
        const selectedNodes = nodes.filter(n => n.selected);
        if (selectedNodes.length === 0) {
            toast.warning('No nodes selected');
            return;
        }

        // Create ID mapping for edges
        const idMap = new Map<string, string>();
        const duplicatedNodes = selectedNodes.map(node => {
            const newId = getId();
            idMap.set(node.id, newId);
            return {
                ...node,
                id: newId,
                position: {
                    x: node.position.x + 50,
                    y: node.position.y + 50,
                },
                selected: true,
            };
        });

        // Duplicate internal edges (only between selected nodes)
        const selectedNodeIds = new Set(selectedNodes.map(n => n.id));
        const duplicatedEdges = edges
            .filter(edge =>
                selectedNodeIds.has(edge.source) &&
                selectedNodeIds.has(edge.target)
            )
            .map(edge => ({
                ...edge,
                id: `${idMap.get(edge.source)}-${idMap.get(edge.target)}`,
                source: idMap.get(edge.source)!,
                target: idMap.get(edge.target)!,
            }));

        // Deselect original nodes
        const updatedNodes = nodes.map(n => ({ ...n, selected: false }));

        // Update state
        setNodes([...updatedNodes, ...duplicatedNodes]);
        setEdges([...edges, ...duplicatedEdges]);

        // Single history snapshot for batch operation
        setTimeout(() => saveHistory(), 0);

        toast.success(`Duplicated ${selectedNodes.length} node(s)`);
    }, [nodes, edges, setNodes, setEdges, saveHistory, toast]);

    // Select all nodes (Ctrl+A)
    const handleSelectAll = useCallback(() => {
        if (nodes.length === 0) {
            toast.warning('No nodes to select');
            return;
        }
        setNodes(nodes.map(n => ({ ...n, selected: true })));
        toast.success('Selected all nodes');
    }, [nodes, setNodes, toast]);

    const onSelectionChange = useCallback(
        ({ nodes: selectedNodes }: OnSelectionChangeParams) => {
            if (selectedNodes.length === 1) {
                setSelectedNodeId(selectedNodes[0].id);
            } else {
                setSelectedNodeId(null);
            }
        },
        [setSelectedNodeId]
    );

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Prevent if typing in input
            const target = event.target as HTMLElement;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
                return;
            }

            // Ctrl+Z: Undo
            if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
                event.preventDefault();
                handleUndo();
            }
            // Ctrl+Y or Ctrl+Shift+Z: Redo
            else if ((event.ctrlKey || event.metaKey) && (event.key === 'y' || (event.key === 'z' && event.shiftKey))) {
                event.preventDefault();
                handleRedo();
            }
            // Delete selected nodes (manual keyboard delete)
            else if (event.key === 'Delete' || event.key === 'Backspace') {
                setNodes((nds) => nds.filter((node) => !node.selected));
                setEdges((eds) => eds.filter((edge) => {
                    const sourceNode = nodes.find((n) => n.id === edge.source);
                    const targetNode = nodes.find((n) => n.id === edge.target);
                    return sourceNode && !sourceNode.selected && targetNode && !targetNode.selected;
                }));
                setSelectedNodeId(null);
                // Event: Manual delete - save history
                setTimeout(() => saveHistory(), 0);
            }
            // Ctrl+D: Duplicate selected nodes
            else if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
                event.preventDefault();
                handleDuplicate();
            }
            // Ctrl+A: Select all nodes
            else if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
                event.preventDefault();
                handleSelectAll();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [setNodes, setEdges, nodes, setSelectedNodeId, handleUndo, handleRedo, saveHistory, handleDuplicate, handleSelectAll]);

    return (
        <div className="flex-1 relative bg-background" ref={reactFlowWrapper}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onSelectionChange={onSelectionChange}
                onNodeDragStop={onNodeDragStop}
                onNodesDelete={onNodesDelete}
                onEdgesDelete={onEdgesDelete}
                nodeTypes={nodeTypes}
                fitView
                className="bg-background"
            >
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} color="var(--border-color)" />
                <Controls />
                <MiniMap
                    style={{
                        backgroundColor: 'var(--bg-secondary)',
                    }}
                    nodeColor={(node) => node.data.color || '#3b82f6'}
                    maskColor="rgba(0, 0, 0, 0.1)"
                />
            </ReactFlow>

            {nodes.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center text-muted-foreground">
                        <h2 className="text-2xl font-semibold mb-2">👈 Drag nodes here to start</h2>
                        <p className="text-sm">Drag nodes from the left panel to design your architecture</p>
                    </div>
                </div>
            )}
        </div>
    );
};
