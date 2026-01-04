import React, { useState } from 'react';

export const PropertyPanel: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'properties' | 'code'>('properties');

    return (
        <div className="w-[350px] border-l border-border flex flex-col bg-card">
            {/* Tabs */}
            <div className="flex border-b border-border">
                <button
                    onClick={() => setActiveTab('properties')}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition border-b-2 ${activeTab === 'properties'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                >
                    Properties
                </button>
                <button
                    onClick={() => setActiveTab('code')}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition border-b-2 ${activeTab === 'code'
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
                    <div className="text-center text-sm text-muted-foreground mt-8">
                        Select a node to edit properties
                    </div>
                ) : (
                    <pre className="text-xs bg-background p-4 rounded-md overflow-x-auto">
                        <code className="text-foreground">{`# Generated PyTorch Code

import torch
import torch.nn as nn

class CustomModel(nn.Module):
    def __init__(self):
        super().__init__()
        # Your layers will appear here
        pass
    
    def forward(self, x):
        # Forward pass
        return x`}</code>
                    </pre>
                )}
            </div>
        </div>
    );
};
