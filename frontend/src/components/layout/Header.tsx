import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="h-14 border-b border-border flex items-center px-4 bg-card">
            <h1 className="text-xl font-bold text-primary">DeepBlocks</h1>
            <nav className="ml-6 flex gap-2">
                <button className="px-3 py-1 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded transition">
                    File
                </button>
                <button className="px-3 py-1 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded transition">
                    Edit
                </button>
                <button className="px-3 py-1 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded transition">
                    View
                </button>
            </nav>
            <div className="ml-auto">
                <button className="px-4 py-1.5 text-sm bg-primary text-primary-foreground rounded hover:opacity-90 transition">
                    Login
                </button>
            </div>
        </header>
    );
};
