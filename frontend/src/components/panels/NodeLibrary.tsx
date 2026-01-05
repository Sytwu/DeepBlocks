import React, { useState } from 'react';
import { nodeRegistry } from '../../registry/NodeRegistry';

export const NodeLibrary: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
        new Set(nodeRegistry.getCategories()) // All categories expanded by default
    );

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

    const toggleCategory = (category: string) => {
        setExpandedCategories(prev => {
            const next = new Set(prev);
            if (next.has(category)) {
                next.delete(category);
            } else {
                next.add(category);
            }
            return next;
        });
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

                        const isExpanded = expandedCategories.has(category);

                        return (
                            <div key={category} className="mb-2">
                                {/* Collapsible Category Header - Fully Clickable */}
                                <button
                                    onClick={() => toggleCategory(category)}
                                    className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-accent/50 rounded-md transition-colors text-left cursor-pointer group"
                                    title={isExpanded ? `Collapse ${category}` : `Expand ${category}`}
                                >
                                    <h3 className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-2">
                                        {/* Chevron Icon with smooth rotation */}
                                        <svg
                                            className={`w-3.5 h-3.5 transition-transform duration-200 ease-in-out ${isExpanded ? 'rotate-90' : 'rotate-0'}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                        </svg>
                                        <span className="group-hover:text-foreground transition-colors">{category}</span>
                                    </h3>
                                    <span className="text-xs text-muted-foreground/60 font-medium">
                                        ({nodesInCategory.length})
                                    </span>
                                </button>

                                {/* Collapsible Content with CSS Grid animation */}
                                <div
                                    className="grid transition-[grid-template-rows] duration-300 ease-in-out"
                                    style={{
                                        gridTemplateRows: isExpanded ? '1fr' : '0fr',
                                    }}
                                >
                                    <div className="overflow-hidden">
                                        <div className="space-y-1.5 mt-1 ml-6 pr-1">
                                            {nodesInCategory.map((node) => (
                                                <div
                                                    key={node.id}
                                                    draggable
                                                    onDragStart={(e) => onDragStart(e, node.id)}
                                                    className="p-2.5 bg-secondary rounded-md cursor-move hover:bg-secondary/80 transition-colors flex items-center gap-2.5 shadow-sm"
                                                    title={node.description}
                                                    style={{ cursor: 'grab' }}
                                                    onMouseDown={(e) => e.currentTarget.style.cursor = 'grabbing'}
                                                    onMouseUp={(e) => e.currentTarget.style.cursor = 'grab'}
                                                >
                                                    <div
                                                        className="w-3 h-3 rounded-sm flex-shrink-0"
                                                        style={{ backgroundColor: node.color }}
                                                    />
                                                    <span className="text-sm text-foreground font-medium">{node.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};
