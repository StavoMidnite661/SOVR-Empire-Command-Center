

import React, { useState } from 'react';
import type { ArchitectureData, ArchitectureNode, ArchitectureEdge } from '../types';

const architectureData: ArchitectureData = {
    nodes: [
        // Clients & Gateways
        { id: 'cc_frontend', label: 'C&C Frontend', type: 'client', position: { x: 25, y: 10 }, description: 'The Command & Control interface for system operators.' },
        { id: 'merchant_portal', label: 'Merchant Portal', type: 'client', position: { x: 50, y: 10 }, description: 'Web interface for SOVR merchants to manage their accounts and view transactions.' },
        { id: 'admin_portal', label: 'Admin Portal', type: 'client', position: { x: 75, y: 10 }, description: 'Internal portal for SOVR administrators to manage the platform.' },
        { id: 'api_gateway', label: 'API Gateway', type: 'service', position: { x: 50, y: 25 }, description: 'Main entry point for all API requests. Manages routing, rate limiting, and initial authentication.' },
        
        // Payment Processing Flow
        { id: 'pay_gateway', label: 'SOVR Pay Gateway', type: 'engine', position: { x: 25, y: 45 }, description: 'Main payment entry point, orchestrating the transaction flow.' },
        { id: 'pay_processor', label: 'SOVR Pay Processor', type: 'engine', position: { x: 25, y: 65 }, description: 'Core transaction processing engine. Handles the business logic of payments.' },
        { id: 'settlement_engine', label: 'Settlement Engine', type: 'engine', position: { x: 25, y: 85 }, description: 'Handles financial settlements and reconciliation with external financial institutions.' },
        
        // Security & Compliance
        { id: 'kyc_service', label: 'KYC Service', type: 'service', position: { x: 75, y: 45 }, description: 'Know Your Customer (KYC) verification service. Validates user identity.' },
        { id: 'compliance_engine', label: 'Compliance Engine', type: 'service', position: { x: 75, y: 65 }, description: 'Performs real-time regulatory compliance checks on transactions and users.' },
        
        // Core Infrastructure
        { id: 'blockchain_node', label: 'Blockchain Node', type: 'database', position: { x: 50, y: 85 }, description: 'Provides connectivity to the underlying blockchain for ledger operations.' },
        { id: 'monitoring', label: 'Monitoring Service', type: 'service', position: { x: 90, y: 85 }, description: 'Centralized system for collecting and analyzing metrics, logs, and traces from all services.' },
    ],
    edges: [
        { from: 'cc_frontend', to: 'api_gateway', label: 'HTTPS/WSS' },
        { from: 'merchant_portal', to: 'api_gateway', label: 'HTTPS Request' },
        { from: 'admin_portal', to: 'api_gateway', label: 'HTTPS Request' },
        { from: 'api_gateway', to: 'pay_gateway', label: 'API Call' },
        { from: 'api_gateway', to: 'kyc_service', label: 'Verification Req' },
        { from: 'pay_gateway', to: 'pay_processor', label: 'Process Tx' },
        { from: 'pay_processor', to: 'settlement_engine', label: 'Settle Tx' },
        { from: 'pay_processor', to: 'compliance_engine', label: 'Compliance Check' },
        { from: 'settlement_engine', to: 'blockchain_node', label: 'Ledger Write' },
        
        // Monitoring connections
        { from: 'api_gateway', to: 'monitoring', label: 'Logs/Metrics' },
        { from: 'pay_gateway', to: 'monitoring', label: 'Logs/Metrics' },
        { from: 'pay_processor', to: 'monitoring', label: 'Logs/Metrics' },
        { from: 'settlement_engine', to: 'monitoring', label: 'Logs/Metrics' },
        { from: 'kyc_service', to: 'monitoring', label: 'Logs/Metrics' },
        { from: 'compliance_engine', to: 'monitoring', label: 'Logs/Metrics' },
        { from: 'blockchain_node', to: 'monitoring', label: 'Logs/Metrics' },
    ],
};

const Node: React.FC<{ node: ArchitectureNode; onHover: (node: ArchitectureNode | null) => void }> = ({ node, onHover }) => {
    const typeClasses: Record<ArchitectureNode['type'], string> = {
        client: 'bg-sov-yellow/20 border-sov-yellow text-sov-yellow',
        service: 'bg-sov-blue/20 border-sov-blue text-sov-blue',
        engine: 'bg-sov-cyan/20 border-sov-cyan text-sov-cyan',
        database: 'bg-sov-green/20 border-sov-green text-sov-green',
    };
    return (
        <div
            className={`absolute px-4 py-2 rounded-md border text-center text-xs font-mono transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 hover:z-10 ${typeClasses[node.type]}`}
            style={{ left: `${node.position.x}%`, top: `${node.position.y}%` }}
            onMouseEnter={() => onHover(node)}
            onMouseLeave={() => onHover(null)}
        >
            {node.label}
        </div>
    );
};

const Edge: React.FC<{ edge: ArchitectureEdge; nodes: ArchitectureNode[] }> = ({ edge, nodes }) => {
    const fromNode = nodes.find(n => n.id === edge.from);
    const toNode = nodes.find(n => n.id === edge.to);
    if (!fromNode || !toNode) return null;

    return (
        <line
            x1={`${fromNode.position.x}%`}
            y1={`${fromNode.position.y}%`}
            x2={`${toNode.position.x}%`}
            y2={`${toNode.position.y}%`}
            className="stroke-sov-border/50"
            strokeWidth="1.5"
        />
    );
};


export const SystemArchitecture: React.FC = () => {
    const [hoveredNode, setHoveredNode] = useState<ArchitectureNode | null>(null);

    return (
        <div className="relative w-full h-full min-h-[30rem] flex flex-col">
            <div className="relative flex-grow w-full bg-sov-panel/50 rounded-lg border border-sov-border/50 p-4">
                <svg className="absolute top-0 left-0 w-full h-full overflow-visible">
                    {architectureData.edges.map(edge => (
                        <Edge key={`${edge.from}-${edge.to}`} edge={edge} nodes={architectureData.nodes} />
                    ))}
                </svg>
                {architectureData.nodes.map(node => (
                    <Node key={node.id} node={node} onHover={setHoveredNode} />
                ))}
            </div>
            <div className="p-3 mt-4 bg-sov-bg border border-sov-border rounded-lg h-24 text-sm font-mono text-sov-text-secondary transition-opacity duration-300">
                {hoveredNode ? (
                    <div>
                        <h4 className={`font-bold ${
                             {client: 'text-sov-yellow', service: 'text-sov-blue', engine: 'text-sov-cyan', database: 'text-sov-green'}[hoveredNode.type]
                        }`}>{hoveredNode.label}</h4>
                        <p>{hoveredNode.description}</p>
                    </div>
                ) : (
                    <p>Hover over a node to see its description.</p>
                )}
            </div>
        </div>
    );
};