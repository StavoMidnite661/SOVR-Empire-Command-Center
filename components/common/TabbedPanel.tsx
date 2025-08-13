
import React, { useState } from 'react';
import { Panel } from './Panel';

interface Tab {
    name: string;
    icon: string;
    content: React.ReactNode;
}

interface TabbedPanelProps {
    tabs: Tab[];
}

export const TabbedPanel: React.FC<TabbedPanelProps> = ({ tabs }) => {
    const [activeTab, setActiveTab] = useState(0);
    const activeTabData = tabs[activeTab];

    return (
        <Panel title={activeTabData.name.toUpperCase()} icon={activeTabData.icon}>
            <div className="flex flex-col h-full">
                <div className="flex items-center border-b border-sov-border mb-4">
                    {tabs.map((tab, index) => (
                        <button
                            key={tab.name}
                            onClick={() => setActiveTab(index)}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-mono transition-colors duration-200 border-b-2 ${
                                activeTab === index
                                    ? 'border-sov-cyan text-sov-cyan'
                                    : 'border-transparent text-sov-text-secondary hover:text-white'
                            }`}
                        >
                            <i className={`fa-solid ${tab.icon}`}></i>
                            <span>{tab.name}</span>
                        </button>
                    ))}
                </div>
                <div className="flex-grow">
                    {activeTabData.content}
                </div>
            </div>
        </Panel>
    );
};
