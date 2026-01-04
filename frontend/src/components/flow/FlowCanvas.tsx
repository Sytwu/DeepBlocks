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
} from 'reactflow';
import 'reactflow/dist/style.css';
import { CustomNode } from '../nodes/CustomNode';
import { nodeRegistry } from '../../registry/NodeRegistry';
import { useFlowStore } from '../../store/flowStore';
import { useAutoSave } from '../../hooks/useAutoSave';

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

    const setSelectedNodeId = useFlowStore((state) => state.setSelectedNodeId);
    const setStoreNodes = useFlowStore((state) => state.setNodes);

    // Sync nodes to store
    useEffect(() => {
        setStoreNodes(nodes);
    }, [nodes, setStoreNodes]);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
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
            const position = {
                x: event.clientX - (reactFlowBounds?.left || 0) - 80,
                y: event.clientY - (reactFlowBounds?.top || 0) - 40,
            };

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
        },
        [setNodes]
    );

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
            // Delete selected nodes
            if (event.key === 'Delete' || event.key === 'Backspace') {
                setNodes((nds) => nds.filter((node) => !node.selected));
                setEdges((eds) => eds.filter((edge) => {
                    const sourceNode = nodes.find((n) => n.id === edge.source);
                    const targetNode = nodes.find((n) => n.id === edge.target);
                    return sourceNode && !sourceNode.selected && targetNode && !targetNode.selected;
                }));
                setSelectedNodeId(null);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [setNodes, setEdges, nodes, setSelectedNodeId]);

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
