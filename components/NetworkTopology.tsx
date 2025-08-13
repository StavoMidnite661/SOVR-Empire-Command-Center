
import React from 'react';
import type { ServiceStatus, SystemDomain, ServiceStatusName, ServiceName } from '../types';
import { Panel } from './common/Panel';
import { SystemDomain as DomainEnum } from '../types';

const statusConfig: Record<ServiceStatusName, { base: string; pulse: string; text: string }> = {
    ONLINE: { base: 'bg-sov-green', pulse: 'shadow-sov-green/50', text: 'text-sov-green' },
    OFFLINE: { base: 'bg-sov-red', pulse: 'shadow-sov-red/50', text: 'text-sov-red' },
    MAINTENANCE: { base: 'bg-sov-cyan', pulse: 'shadow-sov-cyan/50', text: 'text-sov-cyan' },
    DEGRADED: { base: 'bg-sov-yellow', pulse: 'shadow-sov-yellow/50', text: 'text-sov-yellow' },
};

const ServiceNode: React.FC<{ service: ServiceStatus; index: number; total: number; isSelected: boolean; onSelect: () => void; }> = ({ service, index, total, isSelected, onSelect }) => {
    const angle = (index / total) * 360;
    const status = service.status;

    return (
        <div
            className="absolute top-1/2 left-1/2 w-40 h-1 origin-left transition-transform duration-500"
            style={{ transform: `rotate(${angle}deg)` }}
        >
            <div className={`absolute top-0 left-0 h-full w-full ${statusConfig[status].base}/50`}>
                 {status === 'MAINTENANCE' && <div className="absolute top-0 left-0 h-full w-full bg-sov-cyan/50 animate-scanline-fast"></div>}
            </div>
            
            {status === 'ONLINE' && Array.from({ length: 2 }).map((_, i) => (
                <div
                    key={i}
                    className={`absolute top-1/2 -mt-0.5 w-1 h-1 rounded-full ${statusConfig[status].base} shadow-lg ${statusConfig[status].pulse} animate-data-flow`}
                    style={{ animationDelay: `${i * 1}s` }}
                ></div>
            ))}
            
            <div 
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 group cursor-pointer"
                onClick={(e) => { e.stopPropagation(); onSelect(); }}
            >
                 <div
                    className={`relative flex items-center justify-center w-16 h-16 rounded-full border-2 ${statusConfig[status].base}/50 bg-sov-panel transition-all duration-300 group-hover:scale-110 ${isSelected ? 'ring-4 ring-sov-blue shadow-lg shadow-sov-blue/50' : ''}`}
                    style={{ transform: `rotate(${-angle}deg)` }}
                >
                    <div className={`absolute w-full h-full rounded-full ${statusConfig[status].base} ${status !== 'OFFLINE' ? 'animate-pulse' : ''} opacity-40`}></div>
                    <span className={`font-mono text-xs font-bold text-center ${statusConfig[status].text}`}>{service.name.split(' ').join('\n')}</span>
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-1 bg-sov-bg border border-sov-border rounded-md text-xs font-mono text-sov-text-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap" style={{ transform: `rotate(${-angle}deg)` }}>
                    {service.url}
                </div>
            </div>
        </div>
    );
};


export const NetworkTopology: React.FC<{ services: ServiceStatus[]; attunedDomain: SystemDomain | null; onSelectService: (name: ServiceName | null) => void; selectedService: ServiceName | null; }> = ({ services, attunedDomain, onSelectService, selectedService }) => {
    const isAttuned = attunedDomain === DomainEnum.NETWORK;
    return (
        <Panel title="LIVE NETWORK TOPOLOGY" icon="fa-diagram-project">
            <style>{`
                @keyframes data-flow {
                    0% { transform: translateX(0); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { transform: translateX(160px); opacity: 0; }
                }
                @keyframes scanline-fast {
                    0% { transform: scaleX(0); transform-origin: left; }
                    50% { transform: scaleX(1); transform-origin: left; }
                    51% { transform-origin: right; }
                    100% { transform: scaleX(0); transform-origin: right; }
                }
            `}</style>
            <div 
                className={`relative w-full h-72 flex items-center justify-center transition-all duration-300 cursor-pointer ${isAttuned ? 'ring-2 ring-sov-cyan rounded-full shadow-lg shadow-sov-cyan/20' : ''}`}
                onClick={() => onSelectService(null)}
            >
                 <div className="absolute w-full h-full bg-sov-bg/10 rounded-full" style={{
                    backgroundImage: 'radial-gradient(circle, transparent 20%, #0a0f1e 70%), linear-gradient(rgba(44,58,94,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(44,58,94,0.2) 1px, transparent 1px)',
                    backgroundSize: '100% 100%, 20px 20px, 20px 20px',
                 }}></div>

                <div className="relative z-10 w-24 h-24 flex items-center justify-center rounded-full bg-sov-panel border-2 border-sov-cyan shadow-lg shadow-sov-cyan/20">
                    <div className="absolute w-full h-full bg-sov-cyan rounded-full animate-pulse opacity-50"></div>
                    <div className="text-center font-mono text-sov-cyan font-bold text-sm">SOVR<br/>CORE</div>
                </div>

                {services.map((service, index) => (
                    <ServiceNode 
                        key={service.name} 
                        service={service} 
                        index={index} 
                        total={services.length}
                        isSelected={selectedService === service.name}
                        onSelect={() => onSelectService(service.name)}
                    />
                ))}
            </div>
        </Panel>
    );
};