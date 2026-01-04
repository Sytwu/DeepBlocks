import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Node, Edge } from 'reactflow';
import { Project, ProjectMetadata } from '../types/project';
import * as storage from '../utils/localStorage';

interface ProjectState {
    currentProject: Project | null;
    projects: ProjectMetadata[];
    isProjectListOpen: boolean;

    // Actions
    createProject: (name: string, nodes?: Node[], edges?: Edge[]) => void;
    saveCurrentProject: (nodes: Node[], edges: Edge[]) => void;
    loadProject: (id: string) => Project | null;
    deleteProject: (id: string) => void;
    renameProject: (id: string, name: string) => void;
    refreshProjects: () => void;
    setProjectListOpen: (open: boolean) => void;
    updateCurrentProject: (nodes: Node[], edges: Edge[]) => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
    currentProject: null,
    projects: storage.listProjects(),
    isProjectListOpen: false,

    createProject: (name, nodes = [], edges = []) => {
        const project: Project = {
            id: uuidv4(),
            name,
            nodes,
            edges,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        storage.saveProject(project);
        set({ currentProject: project });
        get().refreshProjects();
    },

    saveCurrentProject: (nodes, edges) => {
        const { currentProject } = get();

        if (!currentProject) {
            // Create new project if none exists
            get().createProject('Untitled Project', nodes, edges);
            return;
        }

        const updated: Project = {
            ...currentProject,
            nodes,
            edges,
            updatedAt: new Date().toISOString(),
        };

        storage.saveProject(updated);
        set({ currentProject: updated });
        get().refreshProjects();
    },

    loadProject: (id) => {
        const project = storage.loadProject(id);
        if (project) {
            set({ currentProject: project });
            return project;
        }
        return null;
    },

    deleteProject: (id) => {
        storage.deleteProject(id);
        const { currentProject } = get();

        if (currentProject?.id === id) {
            set({ currentProject: null });
        }

        get().refreshProjects();
    },

    renameProject: (id, name) => {
        const project = storage.loadProject(id);
        if (project) {
            const updated = { ...project, name, updatedAt: new Date().toISOString() };
            storage.saveProject(updated);

            const { currentProject } = get();
            if (currentProject?.id === id) {
                set({ currentProject: updated });
            }

            get().refreshProjects();
        }
    },

    refreshProjects: () => {
        set({ projects: storage.listProjects() });
    },

    setProjectListOpen: (open) => {
        set({ isProjectListOpen: open });
    },

    updateCurrentProject: (nodes, edges) => {
        const { currentProject } = get();
        if (currentProject) {
            set({
                currentProject: {
                    ...currentProject,
                    nodes,
                    edges,
                },
            });
        }
    },
}));
