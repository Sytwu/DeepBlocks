import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { NodeData } from '../../types/nodes';

export const CustomNode = memo(({ data, selected }: NodeProps<NodeData>) => {
    return (
        <div
            className={`px-4 py-3 rounded-lg border-2 bg-white shadow-md min-w-[160px] transition-all ${selected ? 'ring-2 ring-blue-400 ring-offset-2' : ''
                }`}
            style={{ borderColor: data.color }}
        >
            {/* Input Handle */}
            {data.type !== 'input' && (
                <Handle
                    type="target"
                    position={Position.Left}
                    className="w-3 h-3 !bg-gray-400 border-2 border-white"
                />
            )}

            {/* Node Header */}
            <div className="flex items-center gap-2 mb-2">
                <div
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: data.color }}
                />
                <div className="font-semibold text-sm">{data.label}</div>
            </div>

            {/* Node Parameters */}
            <div className="text-xs text-gray-600 space-y-1">
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
                className="w-3 h-3 !bg-gray-400 border-2 border-white"
            />
        </div>
    );
});

CustomNode.displayName = 'CustomNode';
