import React, { useState, useMemo } from 'react';
import { nodeRegistry } from '../../registry/NodeRegistry';

export const NodeLibrary: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const onDragStart = (event: React.DragEvent, nodeId: string) => {
        event.dataTransfer.setData('application/reactflow', nodeId);
        event.dataTransfer.effectAllowed = 'move';
    };

    const categories = useMemo(() => {
        const cats = nodeRegistry.getCategories();
        return cats.map(category => ({
            title: category,
            nodes: nodeRegistry.getNodesByCategory(category),
        }));
    }, []);

    const filteredCategories = useMemo(() => {
        return categories.map(category => ({
            ...category,
            nodes: category.nodes.filter(node =>
                node.label.toLowerCase().includes(searchQuery.toLowerCase())
            ),
        })).filter(category => category.nodes.length > 0);
    }, [categories, searchQuery]);

    return (
        <div className="w-[280px] border-r border-border flex flex-col bg-card">
            <div className="p-4">
                <input
                    type="text"
                    placeholder="Search nodes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-4">
                {filteredCategories.map((category) => (
                    <div key={category.title} className="mb-6">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                            {category.title}
                        </h3>
                        <div className="space-y-2">
                            {category.nodes.map((node) => (
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
                ))}
            </div>
        </div>
    );
};
