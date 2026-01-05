import { useEffect, useRef } from 'react';
import { useReactFlow } from 'reactflow';
import { useProjectStore } from '../store/projectStore';

export function useAutoSave(intervalMs: number = 30000) {
    const { getNodes, getEdges } = useReactFlow();
    const { saveCurrentProject } = useProjectStore();
    const lastSavedRef = useRef<string>('');

    useEffect(() => {
        const interval = setInterval(() => {
            const nodes = getNodes();
            const edges = getEdges();

            // Generate hash to check if changed
            const currentHash = JSON.stringify({ nodes, edges });

            // Only save if there are changes and nodes exist
            if (currentHash !== lastSavedRef.current && nodes.length > 0) {
                saveCurrentProject(nodes, edges);
                lastSavedRef.current = currentHash;
            }
        }, intervalMs);

        return () => clearInterval(interval);
    }, [getNodes, getEdges, saveCurrentProject, intervalMs]);
}
