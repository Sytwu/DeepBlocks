import { Project, ProjectMetadata } from '../types/project';

const STORAGE_KEYS = {
    PROJECTS: 'deepblocks_projects',
    PROJECT: (id: string) => `deepblocks_project_${id}`,
    CURRENT: 'deepblocks_current_project_id',
};

export function saveProject(project: Project): void {
    // Save project content
    localStorage.setItem(
        STORAGE_KEYS.PROJECT(project.id),
        JSON.stringify(project)
    );

    // Update project list
    const metadata: ProjectMetadata = {
        id: project.id,
        name: project.name,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        nodeCount: project.nodes.length,
    };

    updateProjectList(metadata);

    // Set as current project
    localStorage.setItem(STORAGE_KEYS.CURRENT, project.id);
}

export function loadProject(id: string): Project | null {
    const data = localStorage.getItem(STORAGE_KEYS.PROJECT(id));
    if (!data) return null;

    try {
        return JSON.parse(data);
    } catch (error) {
        console.error('Failed to parse project:', error);
        return null;
    }
}

export function deleteProject(id: string): void {
    localStorage.removeItem(STORAGE_KEYS.PROJECT(id));
    removeFromProjectList(id);

    // Clear current if deleted
    const currentId = localStorage.getItem(STORAGE_KEYS.CURRENT);
    if (currentId === id) {
        localStorage.removeItem(STORAGE_KEYS.CURRENT);
    }
}

export function listProjects(): ProjectMetadata[] {
    const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (!data) return [];

    try {
        return JSON.parse(data);
    } catch (error) {
        console.error('Failed to parse project list:', error);
        return [];
    }
}

export function updateProjectList(metadata: ProjectMetadata): void {
    const projects = listProjects();
    const index = projects.findIndex(p => p.id === metadata.id);

    if (index >= 0) {
        projects[index] = metadata;
    } else {
        projects.push(metadata);
    }

    // Sort by updated time (newest first)
    projects.sort((a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
}

export function removeFromProjectList(id: string): void {
    const projects = listProjects();
    const filtered = projects.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(filtered));
}

export function getCurrentProjectId(): string | null {
    return localStorage.getItem(STORAGE_KEYS.CURRENT);
}
