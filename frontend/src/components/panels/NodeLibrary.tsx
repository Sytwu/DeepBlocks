import React, { useState } from 'react';
import { nodeRegistry } from '../../registry/NodeRegistry';

export const NodeLibrary: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const categories = nodeRegistry.getCategories();
    const allNodes = nodeRegistry.getAllNodes();

    // Filter nodes based on search query
    const filteredNodes = allNodes.filter(node => {
        if (!searchQuery.trim()) return true;

        const query = searchQuery.toLowerCase();
        return (
            node.label.toLowerCase().includes(query) ||
            node.id.toLowerCase().includes(query) ||
            node.category.toLowerCase().includes(query)
        );
    });

    const onDragStart = (event: React.DragEvent, nodeId: string) => {
        event.dataTransfer.setData('application/reactflow', nodeId);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div className="w-[280px] border-r border-border bg-card flex flex-col h-full">
            <div className="p-4 border-b border-border">
                <h2 className="text-sm font-semibold text-foreground">Node Library</h2>
            </div>

            {/* Search Box */}
            <div className="p-3 border-b border-border">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search nodes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-8 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
                    />
                    {/* Search Icon */}
                    <svg
                        className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground pointer-events-none"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                    {/* Clear Button */}
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-2 top-2 p-1 hover:bg-accent rounded transition"
                            title="Clear search"
                        >
                            <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {filteredNodes.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground text-sm">
                        <p>No nodes found for "{searchQuery}"</p>
                        <button
                            onClick={() => setSearchQuery('')}
                            className="mt-2 text-xs text-primary hover:underline"
                        >
                            Clear search
                        </button>
                    </div>
                ) : (
                    categories.map((category) => {
                        const nodesInCategory = filteredNodes.filter(
                            (node) => node.category === category
                        );

                        if (nodesInCategory.length === 0) return null;

                        return (
                            <div key={category} className="mb-6">
                                <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-3">
                                    {category}
                                </h3>
                                <div className="space-y-2">
                                    {nodesInCategory.map((node) => (
                                        <div
                                            key={node.id}
                                            draggable
                                            onDragStart={(e) => onDragStart(e, node.id)}
                                            className="p-3 bg-secondary rounded-md cursor-move hover:bg-secondary/80 transition flex items-center gap-2"
                                            title={node.description}
                                        >
                                            <div
                                                className="w-3 h-3 rounded-sm"
                                                style={{ backgroundColor: node.color }}
                                            />
                                            <span className="text-sm text-foreground">{node.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};
