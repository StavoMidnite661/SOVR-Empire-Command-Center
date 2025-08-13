
import React from 'react';
import type { SystemStatus, SystemDomain, LogEntry } from '../types';
import { SystemStatusEnum, SystemDomain as DomainEnum } from '../types';
import { Panel } from './common/Panel';


interface SymbioticCoreProps {
    systemStatus: SystemStatus;
    focusLevel: number;
    setFocusLevel: React.Dispatch<React.SetStateAction<number>>;
    attunedDomain: SystemDomain | null;
    setAttunedDomain: React.Dispatch<React.SetStateAction<SystemDomain | null>>;
    addLogEntry: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void;
}

const DomainButton: React.FC<{
    domain: SystemDomain;
    icon: string;
    isAttuned: boolean;
    onClick: () => void;
}> = ({ domain, icon, isAttuned, onClick }) => {
    return (
        <button 
            onClick={onClick}
            className={`flex flex-col items-center justify-center p-3 border rounded-md transition-all duration-200 ease-in-out text-white font-mono bg-sov-panel hover:bg-sov-border border-sov-border ${isAttuned ? 'animate-focus-pulse border-sov-cyan shadow-lg shadow-sov-cyan/20' : ''}`}
        >
            <i className={`fa-solid ${icon} text-2xl mb-1 ${isAttuned ? 'text-sov-cyan' : 'text-sov-text-secondary'}`}></i>
            <span className={`text-xs font-bold ${isAttuned ? 'text-white' : 'text-sov-text-secondary'}`}>{domain}</span>
        </button>
    );
}

export const SymbioticCore: React.FC<SymbioticCoreProps> = ({ 
    systemStatus, 
    focusLevel, 
    setFocusLevel, 
    attunedDomain, 
    setAttunedDomain,
    addLogEntry
}) => {
    
    const handleDomainClick = (domain: SystemDomain) => {
        if (systemStatus !== SystemStatusEnum.ACTIVE) {
            addLogEntry({ level: 'WARN', message: 'System must be ACTIVE to attune Symbiotic Core.' });
            return;
        }
        if (focusLevel < 20) {
             addLogEntry({ level: 'WARN', message: 'Focus level critical. Unable to channel.' });
             return;
        }

        const newDomain = attunedDomain === domain ? null : domain;
        setAttunedDomain(newDomain);
        if (newDomain) {
            addLogEntry({ level: 'INFO', message: `Operator focus channeled to ${domain}.` });
        } else {
            addLogEntry({ level: 'INFO', message: `Operator focus withdrawn from ${domain}.` });
        }
    }

    const handleRefocus = () => {
        if (systemStatus !== SystemStatusEnum.ACTIVE) return;
        setFocusLevel(100);
        addLogEntry({ level: 'SUCCESS', message: 'Operator focus restored to maximum.' });
    }
    
    const focusColor = focusLevel > 60 ? 'bg-sov-green' : focusLevel > 30 ? 'bg-sov-yellow' : 'bg-sov-red';

    return (
        <Panel title="SYMBIOTIC CORE" icon="fa-atom">
            <div className="flex flex-col items-center justify-around h-full space-y-4">
                <div className="text-center">
                    <p className="font-mono text-sm text-sov-text-secondary">OPERATOR FOCUS</p>
                    <p className={`font-mono text-3xl font-bold ${focusColor.replace('bg-','text-')}`}>{focusLevel.toFixed(0)}%</p>
                    <div className="w-48 h-2 bg-sov-bg mt-2 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${focusColor} transition-all duration-500`} style={{ width: `${focusLevel}%`}}></div>
                    </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3 w-full">
                    <DomainButton domain={DomainEnum.NETWORK} icon="fa-network-wired" isAttuned={attunedDomain === DomainEnum.NETWORK} onClick={() => handleDomainClick(DomainEnum.NETWORK)} />
                    <DomainButton domain={DomainEnum.SECURITY} icon="fa-shield-halved" isAttuned={attunedDomain === DomainEnum.SECURITY} onClick={() => handleDomainClick(DomainEnum.SECURITY)} />
                    <DomainButton domain={DomainEnum.THROUGHPUT} icon="fa-rocket" isAttuned={attunedDomain === DomainEnum.THROUGHPUT} onClick={() => handleDomainClick(DomainEnum.THROUGHPUT)} />
                    <DomainButton domain={DomainEnum.COMPLIANCE} icon="fa-balance-scale" isAttuned={attunedDomain === DomainEnum.COMPLIANCE} onClick={() => handleDomainClick(DomainEnum.COMPLIANCE)} />
                    <DomainButton domain={DomainEnum.PRECOGNITION} icon="fa-brain" isAttuned={attunedDomain === DomainEnum.PRECOGNITION} onClick={() => handleDomainClick(DomainEnum.PRECOGNITION)} />
                     <button 
                        onClick={handleRefocus}
                        disabled={systemStatus !== SystemStatusEnum.ACTIVE || focusLevel > 99}
                        className="flex flex-col items-center justify-center p-3 border rounded-md transition-all duration-200 ease-in-out text-white font-mono bg-sov-blue hover:bg-opacity-80 disabled:bg-sov-border disabled:cursor-not-allowed border-sov-border"
                    >
                         <i className="fa-solid fa-sync-alt text-2xl mb-1"></i>
                         <span className="text-xs font-bold">REFOCUS</span>
                    </button>
                </div>
            </div>
        </Panel>
    )
};
