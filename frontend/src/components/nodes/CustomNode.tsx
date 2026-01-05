import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { NodeData } from '../../types/nodes';

export const CustomNode = memo(({ data, selected }: NodeProps<NodeData>) => {
    return (
        <div
            className={`px-4 py-3 rounded-lg border-2 shadow-md min-w-[160px] transition-all ${selected ? 'ring-2 ring-blue-400 ring-offset-2' : ''
                }`}
            style={{
                backgroundColor: 'var(--node-bg)',
                borderColor: data.color,
                color: 'var(--text-primary)',
            }}
        >
            {/* Input Handle */}
            {data.type !== 'input' && (
                <Handle
                    type="target"
                    position={Position.Left}
                    className="w-3 h-3 border-2"
                    style={{
                        backgroundColor: 'var(--border-hover)',
                        borderColor: 'var(--node-bg)',
                    }}
                />
            )}

            {/* Node Header */}
            <div className="flex items-center gap-2 mb-2">
                <div
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: data.color }}
                />
                <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                    {data.label}
                </div>
            </div>

            {/* Node Parameters */}
            <div className="text-xs space-y-1" style={{ color: 'var(--text-secondary)' }}>
                {Object.entries(data.params).slice(0, 3).map(([key, value]) => (
                    <div key={key}>
                        <span className="font-medium">{key}:</span>{' '}
                        <span className="font-mono">{String(value)}</span>
                    </div>
                ))}
            </div>

            {/* Output Handle */}
            <Handle
                type="source"
                position={Position.Right}
                className="w-3 h-3 border-2"
                style={{
                    backgroundColor: 'var(--border-hover)',
                    borderColor: 'var(--node-bg)',
                }}
            />
        </div>
    );
});

CustomNode.displayName = 'CustomNode';
