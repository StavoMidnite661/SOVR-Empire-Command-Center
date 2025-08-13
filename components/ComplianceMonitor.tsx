
import React from 'react';
import type { SystemStatus, ComplianceCheck, ComplianceStatus } from '../types';
import { SystemStatusEnum } from '../types';

interface ComplianceMonitorProps {
    systemStatus: SystemStatus;
    checks: ComplianceCheck[];
}

const statusConfig: Record<ComplianceStatus, { color: string; icon: string; }> = {
    PASS: { color: 'text-sov-green', icon: 'fa-check-circle' },
    FAIL: { color: 'text-sov-red', icon: 'fa-times-circle' },
    PENDING: { color: 'text-sov-yellow', icon: 'fa-hourglass-half' },
};

const SecurityLayer: React.FC<{ title: string; icon: string; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-sov-panel/50 p-3 rounded-md border border-sov-border/50">
        <h4 className="font-bold text-sov-cyan mb-2 flex items-center gap-2">
            <i className={`fa-solid ${icon}`}></i>
            <span>{title}</span>
        </h4>
        <div className="space-y-2 text-sm">{children}</div>
    </div>
);

const HeaderCheck: React.FC<{ name: string; description: string }> = ({ name, description }) => (
    <div className="flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
            <i className="fa-solid fa-key text-sov-yellow"></i>
            <span className="text-sov-text">{name}</span>
        </div>
        <div className="flex items-center gap-2 text-sov-green">
            <span>VERIFIED</span>
            <i className="fa-solid fa-shield-halved animate-pulse-fast"></i>
        </div>
    </div>
);

const CheckRow: React.FC<{ check: ComplianceCheck }> = ({ check }) => {
    const config = statusConfig[check.status];
    return (
        <div className="flex items-center justify-between group">
            <div className="flex items-center gap-2">
                <i className={`fa-solid ${config.icon} ${config.color} ${check.status === 'PENDING' ? 'animate-spin' : ''}`}></i>
                <span className="text-sov-text-secondary group-hover:text-white transition-colors">{check.name}</span>
            </div>
            <span className={`font-mono text-xs font-bold ${config.color}`}>{check.status}</span>
        </div>
    );
};

export const ComplianceMonitor: React.FC<ComplianceMonitorProps> = ({ systemStatus, checks }) => {
    const renderContent = () => {
        if (systemStatus !== SystemStatusEnum.ACTIVE) {
            return (
                <div className="flex items-center justify-center h-full text-sov-text-secondary font-mono text-sm p-4 text-center">
                    COMPLIANCE FEED INACTIVE. SYSTEM IS OFFLINE.
                </div>
            );
        }

        return (
            <div className="space-y-4 overflow-y-auto pr-2 h-full">
                <SecurityLayer title="NETWORK & AUTHENTICATION" icon="fa-network-wired">
                    <HeaderCheck name="X-Guardian-Auth" description="Primary authentication token" />
                    <HeaderCheck name="X-Merchant-ID" description="Merchant verification token" />
                    <HeaderCheck name="X-Settlement-Token" description="Transaction authorization token" />
                    <HeaderCheck name="X-KYC-Token" description="Identity verification token" />
                </SecurityLayer>
                <SecurityLayer title="REGULATORY & COMPLIANCE" icon="fa-gavel">
                     {checks.length > 0 ? (
                        checks.map(check => <CheckRow key={check.id} check={check} />)
                     ) : (
                         <div className="text-center text-sov-text-secondary font-mono text-xs py-2">
                            No compliance checks loaded.
                         </div>
                     )}
                </SecurityLayer>
            </div>
        );
    };

    return <div className="h-full">{renderContent()}</div>;
};
