import React, { useState } from 'react';
import { useProjectStore } from '../../store/projectStore';
import { formatDistanceToNow } from 'date-fns';

interface ProjectListModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectProject: (id: string) => void;
}

export const ProjectListModal: React.FC<ProjectListModalProps> = ({
    isOpen,
    onClose,
    onSelectProject,
}) => {
    const { projects, deleteProject, renameProject } = useProjectStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');

    if (!isOpen) return null;

    const filteredProjects = projects.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleRename = (id: string) => {
        if (editName.trim()) {
            renameProject(id, editName.trim());
            setEditingId(null);
        }
    };

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Delete this project? This action cannot be undone.')) {
            deleteProject(id);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={onClose}>
            <div
                className="rounded-lg w-[600px] max-h-[80vh] flex flex-col shadow-2xl"
                onClick={e => e.stopPropagation()}
                style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                    border: '1px solid',
                }}
            >
                {/* Header */}
                <div className="p-6" style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>Open Project</h2>
                </div>

                {/* Search */}
                <div className="p-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{
                            backgroundColor: 'var(--bg-secondary)',
                            borderColor: 'var(--border-color)',
                            color: 'var(--text-primary)',
                        }}
                        autoFocus
                    />
                </div>

                {/* Project List */}
                <div className="flex-1 overflow-y-auto p-4">
                    {filteredProjects.length === 0 ? (
                        <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
                            {searchQuery ? 'No projects found' : 'No projects yet. Create your first project!'}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredProjects.map(project => (
                                <div
                                    key={project.id}
                                    className="p-4 rounded-md transition cursor-pointer"
                                    style={{
                                        backgroundColor: 'var(--bg-secondary)',
                                        borderColor: 'var(--border-color)',
                                        border: '1px solid',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                                    onClick={() => {
                                        onSelectProject(project.id);
                                        onClose();
                                    }}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            {editingId === project.id ? (
                                                <input
                                                    type="text"
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
                                                    onBlur={() => handleRename(project.id)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') handleRename(project.id);
                                                        if (e.key === 'Escape') setEditingId(null);
                                                    }}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="px-2 py-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    style={{
                                                        backgroundColor: 'var(--bg-primary)',
                                                        borderColor: 'var(--border-color)',
                                                        color: 'var(--text-primary)',
                                                    }}
                                                    autoFocus
                                                />
                                            ) : (
                                                <h3
                                                    className="font-semibold cursor-pointer"
                                                    style={{ color: 'var(--text-primary)' }}
                                                    onDoubleClick={(e) => {
                                                        e.stopPropagation();
                                                        setEditingId(project.id);
                                                        setEditName(project.name);
                                                    }}
                                                >
                                                    {project.name}
                                                </h3>
                                            )}
                                            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                                                {project.nodeCount} nodes • {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => handleDelete(project.id, e)}
                                            className="ml-2 px-3 py-1 text-xs text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 flex justify-end" style={{ borderTop: '1px solid var(--border-color)' }}>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm rounded transition cursor-pointer"
                        style={{
                            backgroundColor: 'var(--bg-secondary)',
                            color: 'var(--text-primary)',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};
