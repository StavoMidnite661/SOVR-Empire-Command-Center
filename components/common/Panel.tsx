
import React from 'react';

interface PanelProps {
    title: string;
    icon: string;
    children: React.ReactNode;
    className?: string;
}

export const Panel: React.FC<PanelProps> = ({ title, icon, children, className = '' }) => {
    return (
        <div className={`bg-sov-panel/70 backdrop-blur-sm border border-sov-border rounded-lg shadow-lg flex flex-col h-full ${className}`}>
            <div className="flex items-center gap-3 px-4 py-2 border-b border-sov-border">
                <i className={`fa-solid ${icon} text-sov-cyan`}></i>
                <h2 className="font-bold text-lg text-white font-mono tracking-wide">{title}</h2>
            </div>
            <div className="p-4 flex-grow relative">
                {children}
            </div>
        </div>
    );
};
