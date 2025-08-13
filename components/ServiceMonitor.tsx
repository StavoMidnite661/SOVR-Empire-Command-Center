
import React from 'react';
import type { ServiceStatus, ServiceStatusName } from '../types';
import { Panel } from './common/Panel';

const StatusIndicator: React.FC<{ status: ServiceStatusName }> = ({ status }) => {
    const config = {
        ONLINE: 'bg-sov-green',
        OFFLINE: 'bg-sov-red',
        DEGRADED: 'bg-sov-yellow',
        MAINTENANCE: 'bg-sov-cyan',
    };
    return <span className={`w-3 h-3 rounded-full ${config[status]} animate-pulse-fast`}></span>;
};

export const ServiceMonitor: React.FC<{ services: ServiceStatus[] }> = ({ services }) => {
    return (
        <Panel title="NETWORK STATUS" icon="fa-network-wired">
            {services.length > 0 ? (
                <ul className="space-y-3">
                    {services.map(service => (
                        <li key={service.name} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-3">
                                <StatusIndicator status={service.status} />
                                <span className="text-sov-text">{service.name}</span>
                            </div>
                            <span className="font-mono text-sov-text-secondary">{service.status}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="flex items-center justify-center h-full text-sov-text-secondary font-mono text-sm">
                    No services monitored.
                </div>
            )}
        </Panel>
    );
};
