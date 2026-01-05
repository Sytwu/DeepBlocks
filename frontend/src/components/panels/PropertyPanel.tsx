import React, { useState, useRef, useCallback } from 'react';
import { useFlowStore } from '../../store/flowStore';
import { nodeRegistry } from '../../registry/NodeRegistry';
import { ParamConfig } from '../../types/nodes';

export const PropertyPanel: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'properties' | 'code'>('properties');
    const selectedNodeId = useFlowStore((state) => state.selectedNodeId);
    const nodes = useFlowStore((state) => state.nodes);
    const updateNodeParams = useFlowStore((state) => state.updateNodeParams);
    const saveHistory = useFlowStore((state) => state.saveHistory);

    // Debounce timer for text input
    const textInputTimerRef = useRef<NodeJS.Timeout | null>(null);

    const selectedNode = nodes.find((n) => n.id === selectedNodeId);
    const nodeDef = selectedNode ? nodeRegistry.getNode(selectedNode.data.type) : null;

    const handleParamChange = useCallback((paramName: string, value: any, paramType: string) => {
        if (selectedNodeId) {
            updateNodeParams(selectedNodeId, { [paramName]: value });

            // Event: Parameter changed - save history
            if (paramType === 'string') {
                // Debounce text input to avoid excessive history entries during typing
                if (textInputTimerRef.current) {
                    clearTimeout(textInputTimerRef.current);
                }
                textInputTimerRef.current = setTimeout(() => {
                    saveHistory();
                }, 300);
            } else {
                // Immediate save for number, boolean, select
                setTimeout(() => saveHistory(), 0);
            }
        }
    }, [selectedNodeId, updateNodeParams, saveHistory]);

    const renderParam = (param: ParamConfig, currentValue: any) => {
        switch (param.type) {
            case 'number':
                return (
                    <input
                        type="number"
                        value={currentValue ?? param.default}
                        onChange={(e) => handleParamChange(param.name, Number(e.target.value), 'number')}
                        min={param.min}
                        max={param.max}
                        step={param.step}
                        className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm"
                    />
                );
            case 'string':
                return (
                    <input
                        type="text"
                        value={currentValue ?? param.default}
                        onChange={(e) => handleParamChange(param.name, e.target.value, 'string')}
                        className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm"
                    />
                );
            case 'boolean':
                return (
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={currentValue ?? param.default}
                            onChange={(e) => handleParamChange(param.name, e.target.checked, 'boolean')}
                            className="w-4 h-4"
                        />
                        <span className="text-sm">Enabled</span>
                    </label>
                );
            case 'select':
                return (
                    <select
                        value={currentValue ?? param.default}
                        onChange={(e) => handleParamChange(param.name, e.target.value, 'select')}
                        className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                        style={{
                            colorScheme: 'dark'
                        }}
                    >
                        {param.options?.map((option) => (
                            <option key={option} value={option} className="bg-background text-foreground">
                                {option}
                            </option>
                        ))}
                    </select>
                );
            default:
                return null;
        }
    };

    const generateCode = () => {
        if (!selectedNode || !nodeDef) {
            return '# Select a node to see generated code';
        }
        return nodeDef.pythonTemplate(selectedNode.data.params);
    };

    return (
        <div className="w-[350px] border-l border-border flex flex-col bg-card">
            {/* Tabs */}
            <div className="flex border-b border-border">
                <button
                    onClick={() => setActiveTab('properties')}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition border-b-2 cursor-pointer ${activeTab === 'properties'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                >
                    Properties
                </button>
                <button
                    onClick={() => setActiveTab('code')}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition border-b-2 cursor-pointer ${activeTab === 'code'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                >
                    Code
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
                {activeTab === 'properties' ? (
                    selectedNode && nodeDef ? (
                        <div>
                            <h3 className="text-lg font-semibold mb-1">{nodeDef.label}</h3>
                            <p className="text-xs text-muted-foreground mb-4">{nodeDef.description}</p>

                            <div className="space-y-4">
                                {nodeDef.params.map((param) => (
                                    <div key={param.name}>
                                        <label className="block text-sm font-medium mb-1.5">
                                            {param.label}
                                        </label>
                                        {renderParam(param, selectedNode.data.params[param.name])}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-sm text-muted-foreground mt-8">
                            Select a node to edit properties
                        </div>
                    )
                ) : (
                    <pre className="text-xs bg-background p-4 rounded-md overflow-x-auto">
                        <code className="text-foreground">{generateCode()}</code>
                    </pre>
                )}
            </div>
        </div>
    );
};
