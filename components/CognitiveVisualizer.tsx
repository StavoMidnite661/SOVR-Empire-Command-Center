import React from 'react';
import type { CognitiveProcess, CognitiveNode, CognitiveEdge } from '../types';
import { Panel } from './common/Panel';

const Node: React.FC<{ node: CognitiveNode }> = ({ node }) => {
    const statusClasses: Record<CognitiveNode['status'], string> = {
        IDLE: 'bg-sov-panel border-sov-border text-sov-text-secondary',
        ACTIVE: 'bg-sov-cyan/20 border-sov-cyan text-sov-cyan animate-pulse-fast shadow-lg shadow-sov-cyan/20',
        COMPLETE: 'bg-sov-green/20 border-sov-green text-sov-green',
        ERROR: 'bg-sov-red/20 border-sov-red text-sov-red',
    };

    return (
        <div
            className={`absolute w-32 h-12 flex items-center justify-center rounded-md border text-center text-xs font-mono transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 ${statusClasses[node.status]}`}
            style={{ left: `${node.position.x}%`, top: `${node.position.y}%` }}
        >
            <span className="p-1">{node.label}</span>
        </div>
    );
};

const Edge: React.FC<{ edge: CognitiveEdge; nodes: CognitiveNode[] }> = ({ edge, nodes }) => {
    const fromNode = nodes.find(n => n.id === edge.from);
    const toNode = nodes.find(n => n.id === edge.to);

    if (!fromNode || !toNode) return null;
    
    const fromX = fromNode.position.x;
    const fromY = fromNode.position.y;
    const toX = toNode.position.x;
    const toY = toNode.position.y;

    const pathData = `M ${fromX}% ${fromY}% L ${toX}% ${toY}%`;
    const uniqueId = `${edge.from}-${edge.to}`;

    return (
        <svg className="absolute top-0 left-0 w-full h-full overflow-visible pointer-events-none">
            <defs>
                <marker id={`arrowhead-${uniqueId}`} markerWidth="5" markerHeight="3.5" refX="5" refY="1.75" orient="auto">
                    <polygon points="0 0, 5 1.75, 0 3.5" className="fill-current text-sov-cyan" />
                </marker>
                <filter id={`glow-${uniqueId}`}>
                    <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            <path
                d={pathData}
                className={`transition-all duration-500 ${edge.active ? 'stroke-sov-cyan' : 'stroke-sov-border/50'}`}
                strokeWidth="1.5"
                fill="none"
                markerEnd={edge.active ? `url(#arrowhead-${uniqueId})` : ""}
            />
            {edge.active && (
                 <circle r="4" className="fill-current text-sov-cyan" style={{ filter: `url(#glow-${uniqueId})` }}>
                    <animateMotion
                        dur="1.5s"
                        repeatCount="indefinite"
                        path={pathData}
                    />
                </circle>
            )}
        </svg>
    );
};

export const CognitiveVisualizer: React.FC<{ process: CognitiveProcess | null }> = ({ process }) => {
    return (
        <Panel title="COGNITIVE PROCESS VISUALIZER" icon="fa-sitemap">
             <div className="relative w-full h-[60vh] lg:h-full">
                {!process ? (
                    <div className="flex items-center justify-center h-full text-sov-text-secondary font-mono text-sm">
                        AWAITING COGNITIVE INPUT...
                    </div>
                ) : (
                    <div className="relative w-full h-full">
                         {process.edges.map(edge => (
                            <Edge key={`${edge.from}-${edge.to}`} edge={edge} nodes={process.nodes} />
                        ))}
                        {process.nodes.map(node => (
                            <Node key={node.id} node={node} />
                        ))}
                    </div>
                )}
            </div>
        </Panel>
    );
};