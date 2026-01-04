import React from 'react';
import { useReactFlow } from 'reactflow';
import { CodeGenerator } from '../../generators/CodeGenerator';
import { downloadProject } from '../../utils/downloadProject';

export const Header: React.FC = () => {
  const { getNodes, getEdges } = useReactFlow();

  const handleExport = async () => {
    const nodes = getNodes();
    const edges = getEdges();

    if (nodes.length === 0) {
      alert('⚠️ Please add some nodes to the canvas first!');
      return;
    }

    try {
      const generator = new CodeGenerator(nodes, edges);
      const files = generator.generateAll();
      await downloadProject(files, 'deepblocks-project');
      alert('✅ Project exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      alert('❌ Failed to export project. Please try again.');
    }
  };

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
      <div className="ml-auto flex gap-2">
        <button
          onClick={handleExport}
          className="px-4 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition flex items-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Export Code
        </button>
        <button className="px-4 py-1.5 text-sm bg-primary text-primary-foreground rounded hover:opacity-90 transition">
          Login
        </button>
      </div>
    </header>
  );
};
