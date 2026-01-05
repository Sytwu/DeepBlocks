import React from 'react';
import { Header } from './Header';
import { NodeLibrary } from '../panels/NodeLibrary';
import { PropertyPanel } from '../panels/PropertyPanel';
import { FlowCanvas } from '../flow/FlowCanvas';

export const AppLayout: React.FC = () => {
    return (
        <div className="h-screen flex flex-col">
            <Header />
            <div className="flex-1 flex overflow-hidden">
                <NodeLibrary />
                <FlowCanvas />
                <PropertyPanel />
            </div>
        </div>
    );
};
