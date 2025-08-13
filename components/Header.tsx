
import React from 'react';
import type { SystemStatus } from '../types';
import { SystemStatusEnum } from '../types';

interface HeaderProps {
    systemStatus: SystemStatus;
}

const StatusDisplay: React.FC<{ status: SystemStatus }> = ({ status }) => {
    const statusConfig = {
        [SystemStatusEnum.ACTIVE]: { text: 'SYSTEM ACTIVE', color: 'text-sov-green', icon: 'fa-shield-halved', pulse: true },
        [SystemStatusEnum.STANDBY]: { text: 'SYSTEM STANDBY', color: 'text-sov-yellow', icon: 'fa-power-off', pulse: false },
        [SystemStatusEnum.MAINTENANCE]: { text: 'MAINTENANCE MODE', color: 'text-sov-cyan', icon: 'fa-person-digging', pulse: true },
        [SystemStatusEnum.EMERGENCY_STOP]: { text: 'EMERGENCY STOP', color: 'text-sov-red', icon: 'fa-triangle-exclamation', pulse: true },
    };

    const config = statusConfig[status];

    return (
        <div className={`flex items-center gap-3 px-4 py-2 bg-sov-panel/50 border border-sov-border rounded-md`}>
            <i className={`fa-solid ${config.icon} ${config.color} ${config.pulse ? 'animate-pulse-fast' : ''}`}></i>
            <span className={`font-mono font-bold text-lg ${config.color}`}>{config.text}</span>
        </div>
    );
};


export const Header: React.FC<HeaderProps> = ({ systemStatus }) => {
    return (
        <header className="flex flex-col md:flex-row justify-between items-center p-4 bg-sov-panel/30 backdrop-blur-sm border border-sov-border rounded-lg z-20">
            <div className="flex items-center gap-4">
                <i className="fas fa-satellite-dish text-4xl text-sov-cyan"></i>
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-wider">
                        SOVR EMPIRE <span className="text-sov-cyan">COMMAND & CONTROL</span>
                    </h1>
                    <p className="text-sm font-mono text-sov-text-secondary">Middleware Event Monitoring System</p>
                </div>
            </div>
            <div className="mt-4 md:mt-0">
                <StatusDisplay status={systemStatus} />
            </div>
        </header>
    );
};
