
import React, { useState } from 'react';
import type { SystemStatus, SystemDomain, TemporalEcho, LogEntry } from '../types';
import { SystemStatusEnum, EchoType, SystemDomain as DomainEnum, GuardianCommand } from '../types';

interface PrecognitiveModulatorProps {
    systemStatus: SystemStatus;
    attunedDomain: SystemDomain | null;
    echos: TemporalEcho[];
    onCommand: (command: string, args: Record<string, any>) => void;
}

const typeConfig = {
    [EchoType.THREAT]: { icon: 'fa-triangle-exclamation', color: 'text-sov-red', ring: 'ring-sov-red/50', border: 'border-sov-red/50' },
    [EchoType.OPPORTUNITY]: { icon: 'fa-lightbulb', color: 'text-sov-green', ring: 'ring-sov-green/50', border: 'border-sov-green/50' },
    [EchoType.NEUTRAL]: { icon: 'fa-circle-nodes', color: 'text-sov-blue', ring: 'ring-sov-blue/50', border: 'border-sov-blue/50' },
};

const EchoItem: React.FC<{ echo: TemporalEcho; onEngage: (echoId: string, interventionId: string) => void; }> = ({ echo, onEngage }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const config = typeConfig[echo.type];

    return (
        <div className={`bg-sov-panel/50 border-l-4 ${config.border} p-3 rounded-r-md`}>
            <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex items-center gap-3">
                    <i className={`fa-solid ${config.icon} ${config.color} text-lg`}></i>
                    <span className="font-bold text-white">{echo.title}</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className={`font-mono text-sm ${config.color}`}>{echo.probability}%</span>
                    <i className={`fa-solid fa-chevron-down text-sov-text-secondary transition-transform ${isExpanded ? 'rotate-180' : ''}`}></i>
                </div>
            </div>
            {isExpanded && (
                <div className="mt-3 pl-6 space-y-3 animate-fade-in">
                    <div className="text-sm text-sov-text-secondary font-mono border-b border-sov-border/30 pb-2">
                        ETA: {echo.timeToEvent}
                    </div>
                    {echo.interventions.map(intervention => (
                        <div key={intervention.id} className="flex justify-between items-start gap-2">
                            <div>
                                <h4 className="font-bold text-sov-cyan">{intervention.name}</h4>
                                <p className="text-sm text-sov-text-secondary">{intervention.description}</p>
                            </div>
                            <button
                                onClick={() => onEngage(echo.id, intervention.id)}
                                disabled={intervention.engaged}
                                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                                    intervention.engaged
                                        ? 'bg-sov-green/50 text-white cursor-default'
                                        : 'bg-sov-blue hover:bg-opacity-80 text-white'
                                }`}
                            >
                               {intervention.engaged ? 'ENGAGED' : 'ENGAGE'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


export const PrecognitiveModulator: React.FC<PrecognitiveModulatorProps> = ({ systemStatus, attunedDomain, echos, onCommand }) => {

    const handleEngageIntervention = (echoId: string, interventionId: string) => {
        onCommand(GuardianCommand.ENGAGE_INTERVENTION, { echoId, interventionId });
    };

    const renderContent = () => {
        if (systemStatus !== SystemStatusEnum.ACTIVE) {
            return (
                <div className="flex items-center justify-center h-full text-sov-text-secondary font-mono text-sm p-4 text-center">
                    PRECOGNITIVE FEED INACTIVE. SYSTEM IS OFFLINE.
                </div>
            );
        }

        if (echos.length === 0) {
            return (
                 <div className="flex items-center justify-center h-full text-sov-text-secondary font-mono text-sm p-4 text-center">
                    NO TEMPORAL ECHOS DETECTED. ALL TIMELINES STABLE.
                </div>
            )
        }
        
        return (
            <div className="space-y-3 h-full overflow-y-auto pr-2">
                {echos.map(echo => (
                    <EchoItem key={echo.id} echo={echo} onEngage={handleEngageIntervention} />
                ))}
            </div>
        )
    }

    return (
        <div className={attunedDomain === DomainEnum.PRECOGNITION ? 'ring-2 ring-sov-cyan shadow-lg shadow-sov-cyan/20 rounded-lg h-full' : 'h-full'}>
            {renderContent()}
        </div>
    );
};
