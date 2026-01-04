import React, { useState, useEffect } from 'react';
import { useReactFlow } from 'reactflow';
import { CodeGenerator } from '../../generators/CodeGenerator';
import { downloadProject } from '../../utils/downloadProject';
import { useProjectStore } from '../../store/projectStore';
import { useFlowStore } from '../../store/flowStore';
import { ProjectListModal } from '../modals/ProjectListModal';
import { examples } from '../../examples';
import { SaveIndicator } from '../ui/SaveIndicator';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useToast } from '../../contexts/ToastContext';

export const Header: React.FC = () => {
  const { getNodes, getEdges, setNodes, setEdges } = useReactFlow();
  const { currentProject, saveCurrentProject, loadProject, createProject } = useProjectStore();
  const { clearHistory, saveHistory } = useFlowStore();
  const toast = useToast();
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [showExamplesMenu, setShowExamplesMenu] = useState(false);
  const [showProjectList, setShowProjectList] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 's':
            e.preventDefault();
            handleSave();
            break;
          case 'n':
            e.preventDefault();
            handleNew();
            break;
          case 'o':
            e.preventDefault();
            setShowProjectList(true);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNew = () => {
    const name = prompt('Enter project name:', 'New Project');
    if (name) {
      createProject(name.trim());
      setNodes([]);
      setEdges([]);
      // Clear history when creating new project
      clearHistory();
      toast.success(`Created project "${name}"`);
    }
    setShowFileMenu(false);
  };

  const handleSave = () => {
    const nodes = getNodes();
    const edges = getEdges();

    if (!currentProject) {
      const name = prompt('Enter project name:', 'My Project');
      if (name) {
        createProject(name.trim(), nodes, edges);
        toast.success(`Project "${name}" saved!`);
      }
    } else {
      saveCurrentProject(nodes, edges);
      toast.success(`Project "${currentProject.name}" saved!`);
    }
    setShowFileMenu(false);
  };

  const handleOpen = () => {
    setShowProjectList(true);
    setShowFileMenu(false);
  };

  const handleLoadProject = (id: string) => {
    const project = loadProject(id);
    if (project) {
      setNodes(project.nodes);
      setEdges(project.edges);
      // Clear history and save initial state after loading project
      clearHistory();
      setTimeout(() => saveHistory(), 0);
      toast.success(`Loaded project "${project.name}"`);
    }
  };

  const handleLoadExample = (exampleId: string) => {
    if (getNodes().length > 0) {
      if (!confirm('Loading an example will replace your current work. Continue?')) {
        return;
      }
    }

    const example = examples.find(ex => ex.id === exampleId);
    if (example) {
      setNodes(example.nodes);
      setEdges(example.edges);
      setShowExamplesMenu(false);
      // Clear history and save initial state after loading example
      clearHistory();
      setTimeout(() => saveHistory(), 0);
      toast.success(`Loaded example "${example.name}"`);
    }
  };

  const handleExport = async () => {
    const nodes = getNodes();
    const edges = getEdges();

    if (nodes.length === 0) {
      toast.warning('Please add some nodes to the canvas first!');
      return;
    }

    try {
      const generator = new CodeGenerator(nodes, edges);
      const files = generator.generateAll();

      if (Object.keys(files).length === 0) {
        toast.warning('No nodes to export!');
        return;
      }
      await downloadProject(files, currentProject?.name || 'deepblocks-project');
      toast.success('Project exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export project. Please try again.');
    }
  };

  return (
    <>
      <header className="h-14 border-b border-border flex items-center px-4 bg-card">
        <h1 className="text-xl font-bold text-primary">DeepBlocks</h1>

        <nav className="ml-6 flex gap-2">
          {/* File Menu */}
          <div className="relative">
            <button
              onClick={() => setShowFileMenu(!showFileMenu)}
              onBlur={() => setTimeout(() => setShowFileMenu(false), 150)}
              className="px-3 py-1.5 text-sm hover:bg-accent rounded transition cursor-pointer"
              style={{ color: 'var(--text-primary)' }}
            >
              File
            </button>
            {showFileMenu && (
              <div className="absolute top-full left-0 mt-1 w-48 rounded-md shadow-lg z-50" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
                <button
                  onClick={handleNew}
                  className="w-full px-4 py-2 text-left text-sm flex items-center justify-between rounded-t-md cursor-pointer"
                  style={{ color: 'var(--text-primary)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  New Project
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Ctrl+N</span>
                </button>
                <button
                  onClick={handleSave}
                  className="w-full px-4 py-2 text-left text-sm flex items-center justify-between cursor-pointer"
                  style={{ color: 'var(--text-primary)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  Save
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Ctrl+S</span>
                </button>
                <button
                  onClick={handleOpen}
                  className="w-full px-4 py-2 text-left text-sm flex items-center justify-between cursor-pointer"
                  style={{ color: 'var(--text-primary)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  Open...
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Ctrl+O</span>
                </button>
                <div className="my-1" style={{ borderTop: '1px solid var(--border-color)' }}></div>
                <button
                  onClick={() => { handleExport(); setShowFileMenu(false); }}
                  className="w-full px-4 py-2 text-left text-sm rounded-b-md cursor-pointer"
                  style={{ color: 'var(--text-primary)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  Export Code
                </button>
              </div>
            )}
          </div>

          <button className="px-3 py-1 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded transition cursor-pointer">
            Edit
          </button>
          <button className="px-3 py-1 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded transition cursor-pointer">
            View
          </button>

          {/* Examples Menu */}
          <div className="relative">
            <button
              onClick={() => setShowExamplesMenu(!showExamplesMenu)}
              className="px-3 py-1 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded transition cursor-pointer"
            >
              Examples
            </button>
            {showExamplesMenu && (
              <div className="absolute top-full left-0 mt-1 w-64 rounded-md shadow-lg z-50" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
                <div className="p-2" style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <h3 className="text-xs font-semibold uppercase" style={{ color: 'var(--text-muted)' }}>Example Projects</h3>
                </div>
                {examples.map(example => (
                  <button
                    key={example.id}
                    onClick={() => handleLoadExample(example.id)}
                    className="w-full px-4 py-3 text-left last:border-b-0 cursor-pointer"
                    style={{ borderBottom: '1px solid var(--border-color)' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{example.name}</div>
                        <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{example.description}</div>
                      </div>
                      <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${example.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                        example.difficulty === 'Intermediate' ? 'bg-blue-100 text-blue-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                        {example.difficulty}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Project Name */}
        {currentProject && (
          <div className="ml-4 text-sm text-muted-foreground">
            {currentProject.name}
          </div>
        )}

        <div className="ml-auto flex gap-4 items-center">
          {/* Save Indicator */}
          <SaveIndicator />

          {/* Theme Toggle */}
          <ThemeToggle />

          <button
            onClick={handleExport}
            className="px-4 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition flex items-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Code
          </button>
          <button className="px-4 py-1.5 text-sm bg-primary text-primary-foreground rounded hover:opacity-90 transition">
            Login
          </button>
        </div>
      </header>

      {/* Close menu when clicking outside */}
      {showFileMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setShowFileMenu(false)} />
      )}
      {showExamplesMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setShowExamplesMenu(false)} />
      )}

      {/* Project List Modal */}
      <ProjectListModal
        isOpen={showProjectList}
        onClose={() => setShowProjectList(false)}
        onSelectProject={handleLoadProject}
      />
    </>
  );
};
