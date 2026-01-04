import React from 'react';
import { useProjectStore } from '../../store/projectStore';
import { formatDistanceToNow } from 'date-fns';

export const SaveIndicator: React.FC = () => {
    const { isSaving, lastSaved } = useProjectStore();

    if (!isSaving && !lastSaved) return null;

    return (
        <div className="text-xs text-muted-foreground flex items-center gap-2">
            {isSaving ? (
                <>
                    <svg className="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Saving...</span>
                </>
            ) : lastSaved ? (
                <>
                    <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Saved {formatDistanceToNow(lastSaved, { addSuffix: true })}</span>
                </>
            ) : null}
        </div>
    );
};
