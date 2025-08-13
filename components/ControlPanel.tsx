
import React from 'react';
import type { SystemStatus, TestDefinition, TestResult } from '../types';
import { SystemStatusEnum, TestName, GuardianCommand } from '../types';
import { Panel } from './common/Panel';

interface ControlPanelProps {
    systemStatus: SystemStatus;
    tests: TestDefinition[];
    testResults: Partial<Record<TestName, TestResult>>;
    onCommand: (command: string, args: Record<string, any>) => void;
}

const ControlButton: React.FC<{ icon: string; label: string; onClick: () => void; active?: boolean; className?: string; }> = ({ icon, label, onClick, active, className }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center p-3 border rounded-md transition-all duration-200 ease-in-out text-white font-mono ${className} ${active ? 'bg-sov-cyan text-sov-bg shadow-lg shadow-sov-cyan/30' : 'bg-sov-panel hover:bg-sov-border border-sov-border'}`}
    >
        <i className={`fa-solid ${icon} text-2xl mb-1`}></i>
        <span className="text-xs font-bold">{label}</span>
    </button>
);


const TestButton: React.FC<{ name: TestName; status: 'PASS' | 'FAIL' | 'PENDING' | 'IDLE'; onClick: () => void; }> = ({ name, status, onClick }) => {
    const config = {
        PASS: { color: 'border-sov-green bg-sov-green/10 text-sov-green', icon: 'fa-check' },
        FAIL: { color: 'border-sov-red bg-sov-red/10 text-sov-red', icon: 'fa-times' },
        PENDING: { color: 'border-sov-yellow bg-sov-yellow/10 text-sov-yellow animate-pulse', icon: 'fa-hourglass-half' },
        IDLE: { color: 'border-sov-border bg-transparent hover:bg-sov-border/50 text-sov-text-secondary', icon: 'fa-play' },
    };
    const currentConfig = config[status];
    return (
        <button 
            onClick={onClick}
            disabled={status === 'PENDING'}
            className={`flex items-center justify-between p-2 rounded-md border text-left text-sm transition-all duration-200 ${currentConfig.color}`}
        >
            <span className="font-mono">{name}</span>
            <i className={`fa-solid ${currentConfig.icon} ml-2`}></i>
        </button>
    );
};

export const ControlPanel: React.FC<ControlPanelProps> = ({ systemStatus, tests, testResults, onCommand }) => {
    const isEmergencyActive = systemStatus === SystemStatusEnum.EMERGENCY_STOP;
    
    const handleStatusChange = (status: SystemStatus) => {
        onCommand(GuardianCommand.SET_SYSTEM_STATUS, { status });
    };

    const handleRunTest = (testName: TestName) => {
        onCommand(GuardianCommand.RUN_DIAGNOSTIC, { testName });
    };

    return (
        <Panel title="SYSTEM CONTROLS" icon="fa-sliders">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h3 className="font-mono text-sov-text-secondary mb-2 text-sm">MASTER POWER</h3>
                    <div className="grid grid-cols-2 gap-2">
                        <ControlButton
                            label="ACTIVATE"
                            icon="fa-power-off"
                            onClick={() => handleStatusChange(SystemStatusEnum.ACTIVE)}
                            active={systemStatus === SystemStatusEnum.ACTIVE}
                            className="hover:shadow-sov-green/30"
                        />
                        <ControlButton
                            label="STANDBY"
                            icon="fa-moon"
                            onClick={() => handleStatusChange(SystemStatusEnum.STANDBY)}
                            active={systemStatus === SystemStatusEnum.STANDBY}
                            className="hover:shadow-sov-yellow/30"
                        />
                        <ControlButton
                            label="MAINTENANCE"
                            icon="fa-wrench"
                            onClick={() => handleStatusChange(SystemStatusEnum.MAINTENANCE)}
                            active={systemStatus === SystemStatusEnum.MAINTENANCE}
                            className="hover:shadow-sov-cyan/30"
                        />
                         <ControlButton
                            label="EMERGENCY STOP"
                            icon="fa-ban"
                            onClick={() => {
                                if(window.confirm('Are you sure you want to initiate an Emergency Stop? This is a command to the Guardian AI.')) {
                                    handleStatusChange(SystemStatusEnum.EMERGENCY_STOP);
                                }
                            }}
                            active={isEmergencyActive}
                            className={
                                isEmergencyActive
                                ? '!bg-sov-red !border-sov-red !shadow-lg !shadow-sov-red/50 animate-pulse-fast'
                                : 'bg-red-900/50 hover:bg-red-700/80 !border-red-500/80 hover:!border-sov-red'
                            }
                        />
                    </div>
                </div>
                <div>
                    <h3 className="font-mono text-sov-text-secondary mb-2 text-sm">DIAGNOSTIC TESTS</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {tests.length > 0 ? tests.map(test => (
                            <TestButton 
                                key={test.name}
                                name={test.name}
                                status={testResults[test.name]?.status || 'IDLE'}
                                onClick={() => handleRunTest(test.name)}
                            />
                        )) : (
                            <div className="col-span-2 text-center text-sov-text-secondary font-mono text-xs py-4">
                                No diagnostics loaded by AI.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Panel>
    );
};
