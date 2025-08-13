
import React from 'react';
import type { DefenseProtocol, ProtocolMode, ThreatProtocolName, SystemStatus } from '../types';
import { SystemStatusEnum, GuardianCommand } from '../types';


interface ADSProps {
    protocols: DefenseProtocol[];
    onCommand: (command: string, args: Record<string, any>) => void;
    systemStatus: SystemStatus;
}

const ProtocolRow: React.FC<{
    protocol: DefenseProtocol;
    onModeChange: (name: ThreatProtocolName, mode: ProtocolMode) => void;
    isDisabled: boolean;
}> = ({ protocol, onModeChange, isDisabled }) => {
    
    const modes: ProtocolMode[] = ['DISABLED', 'MANUAL', 'AUTONOMOUS'];
    const modeColors: Record<ProtocolMode, string> = {
        DISABLED: 'bg-sov-border text-sov-text-secondary',
        MANUAL: 'bg-sov-yellow text-sov-bg',
        AUTONOMOUS: 'bg-sov-red text-white',
    };

    return (
        <div className="bg-sov-panel/50 p-3 rounded-md border border-sov-border/50">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="mb-2 sm:mb-0">
                    <h4 className="font-bold text-white">{protocol.name}</h4>
                    <p className="text-sm text-sov-text-secondary pr-4">{protocol.description}</p>
                </div>
                <div className="flex-shrink-0 flex items-center gap-1 bg-sov-bg p-1 rounded-md">
                   {modes.map(mode => (
                       <button
                           key={mode}
                           onClick={() => onModeChange(protocol.name, mode)}
                           disabled={isDisabled}
                           className={`px-3 py-1 text-xs font-bold rounded transition-all duration-200 ${
                               protocol.mode === mode
                                   ? modeColors[mode] + ' shadow-md'
                                   : 'bg-transparent text-sov-text-secondary hover:bg-sov-border'
                           } ${isDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
                       >
                           {mode}
                       </button>
                   ))}
                </div>
            </div>
        </div>
    );
}

export const AutomatedDefenseSystem: React.FC<ADSProps> = ({ protocols, onCommand, systemStatus }) => {
    
    const handleModeChange = (name: ThreatProtocolName, mode: ProtocolMode) => {
        onCommand(GuardianCommand.SET_PROTOCOL_MODE, { protocolName: name, mode });
    };

    const isSystemOffline = systemStatus !== SystemStatusEnum.ACTIVE;

    return (
        <div className="space-y-3">
            {protocols.map(protocol => (
                <ProtocolRow 
                    key={protocol.name} 
                    protocol={protocol}
                    onModeChange={handleModeChange}
                    isDisabled={isSystemOffline}
                />
            ))}
            {isSystemOffline && (
                <div className="text-center font-mono text-xs text-sov-yellow pt-2">
                    SYSTEM OFFLINE. PROTOCOL MODIFICATION DISABLED.
                </div>
            )}
        </div>
    );
}
