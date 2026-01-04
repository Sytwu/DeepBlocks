import React, { useState, useEffect } from 'react';
import { useReactFlow } from 'reactflow';
import { CodeGenerator } from '../../generators/CodeGenerator';
import { downloadProject } from '../../utils/downloadProject';
import { useProjectStore } from '../../store/projectStore';
import { ProjectListModal } from '../modals/ProjectListModal';
import { examples } from '../../examples';
import { SaveIndicator } from '../ui/SaveIndicator';

export const Header: React.FC = () => {
  const { getNodes, getEdges, setNodes, setEdges } = useReactFlow();
  const { currentProject, saveCurrentProject, loadProject, createProject } = useProjectStore();
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
      alert(`✅ Created project "${name}"`);
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
        alert(`✅ Project "${name}" saved!`);
      }
    } else {
      saveCurrentProject(nodes, edges);
      alert(`✅ Project "${currentProject.name}" saved!`);
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
      alert(`✅ Loaded project "${project.name}"`);
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
      alert(`✅ Loaded example "${example.name}"`);
    }
  };

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
      await downloadProject(files, currentProject?.name || 'deepblocks-project');
      alert('✅ Project exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      alert('❌ Failed to export project. Please try again.');
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
              className="px-3 py-1 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded transition"
            >
              File
            </button>
            {showFileMenu && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <button
                  onClick={handleNew}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between rounded-t-md"
                >
                  New Project
                  <span className="text-xs text-gray-500">Ctrl+N</span>
                </button>
                <button
                  onClick={handleSave}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between"
                >
                  Save
                  <span className="text-xs text-gray-500">Ctrl+S</span>
                </button>
                <button
                  onClick={handleOpen}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between"
                >
                  Open...
                  <span className="text-xs text-gray-500">Ctrl+O</span>
                </button>
                <div className="border-t border-gray-200 my-1"></div>
                <button
                  onClick={() => { handleExport(); setShowFileMenu(false); }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-b-md"
                >
                  Export Code
                </button>
              </div>
            )}
          </div>

          <button className="px-3 py-1 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded transition">
            Edit
          </button>
          <button className="px-3 py-1 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded transition">
            View
          </button>

          {/* Examples Menu */}
          <div className="relative">
            <button
              onClick={() => setShowExamplesMenu(!showExamplesMenu)}
              className="px-3 py-1 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded transition"
            >
              Examples
            </button>
            {showExamplesMenu && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <div className="p-2 border-b border-gray-200">
                  <h3 className="text-xs font-semibold text-gray-600 uppercase">Example Projects</h3>
                </div>
                {examples.map(example => (
                  <button
                    key={example.id}
                    onClick={() => handleLoadExample(example.id)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 text-sm">{example.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{example.description}</div>
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

          <button
            onClick={handleExport}
            className="px-4 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition flex items-center gap-2"
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
