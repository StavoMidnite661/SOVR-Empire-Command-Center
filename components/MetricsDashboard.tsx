
import React from 'react';
import { ResponsiveContainer, LineChart, AreaChart, XAxis, YAxis, Tooltip } from 'recharts';
import { Line, Area } from 'recharts';
import type { SystemStatus, SystemDomain, ServiceName } from '../types';
import { SystemStatusEnum, SystemDomain as DomainEnum } from '../types';
import { Panel } from './common/Panel';
import type { MetricDataPoint } from '../types';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-sov-panel/90 p-2 border border-sov-border rounded-md shadow-lg text-sm">
        <p className="label font-mono text-sov-text-secondary">{`${label}`}</p>
        {payload.map((pld: any) => (
             <p key={pld.dataKey} style={{ color: pld.color }}>
                {`${pld.name}: ${pld.value.toFixed(pld.dataKey === 'errorRate' || pld.dataKey === 'cpu' ? 1: 0)}${pld.unit || ''}`}
             </p>
        ))}
      </div>
    );
  }
  return null;
};

const ChartWrapper: React.FC<{title: string; isHighlighted: boolean; children: React.ReactNode;}> = ({ title, isHighlighted, children }) => (
    <div className={`p-2 rounded-lg transition-all duration-300 ${isHighlighted ? 'bg-sov-cyan/10 ring-1 ring-sov-cyan' : ''}`}>
        <h3 className="font-mono text-sov-text-secondary text-xs mb-1 ml-2">{title}</h3>
        {children}
    </div>
);

interface MetricsDashboardProps {
    systemStatus: SystemStatus;
    attunedDomain: SystemDomain | null;
    serviceMetrics: Partial<Record<ServiceName, MetricDataPoint[]>>;
    selectedService: ServiceName | null;
}

export const MetricsDashboard: React.FC<MetricsDashboardProps> = ({ systemStatus, attunedDomain, serviceMetrics, selectedService }) => {
    
    const data = selectedService ? serviceMetrics[selectedService] : [];

    const renderContent = () => {
        if (systemStatus !== SystemStatusEnum.ACTIVE) {
            return (
                <div className="flex items-center justify-center h-full text-sov-text-secondary font-mono text-sm p-4 text-center">
                    SYSTEM OFFLINE. METRICS FEED PAUSED.
                </div>
            );
        }

        if (!selectedService || !data || data.length === 0) {
            return (
                <div className="flex items-center justify-center h-full text-sov-text-secondary font-mono text-sm p-4 text-center">
                    SELECT A SERVICE FROM THE NETWORK TOPOLOGY TO VIEW LIVE METRICS.
                </div>
            );
        }
        
        return (
             <div className="grid grid-cols-2 gap-2 h-full">
                <ChartWrapper title="Throughput (RPS)" isHighlighted={attunedDomain === DomainEnum.THROUGHPUT}>
                    <ResponsiveContainer width="100%" height={120}>
                        <LineChart data={data}>
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#4a90e2', strokeWidth: 1, strokeDasharray: '3 3' }} />
                            <XAxis dataKey="time" hide />
                            <YAxis stroke="#c0d0f0" domain={['dataMin - 50', 'dataMax + 50']} hide />
                            <Line type="monotone" dataKey="rps" name="RPS" stroke="#32ff7e" strokeWidth={2} dot={false} unit=" rps" />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartWrapper>

                <ChartWrapper title="Latency (ms)" isHighlighted={attunedDomain === DomainEnum.NETWORK}>
                    <ResponsiveContainer width="100%" height={120}>
                        <LineChart data={data}>
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#4a90e2', strokeWidth: 1, strokeDasharray: '3 3' }} />
                             <XAxis dataKey="time" hide />
                             <YAxis stroke="#c0d0f0" domain={[0, 'dataMax + 50']} hide />
                            <Line type="monotone" dataKey="latency" name="Latency" stroke="#00e0e0" strokeWidth={2} dot={false} unit="ms" />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartWrapper>

                 <ChartWrapper title="CPU Usage (%)" isHighlighted={attunedDomain === DomainEnum.SECURITY}>
                    <ResponsiveContainer width="100%" height={120}>
                        <AreaChart data={data}>
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#4a90e2', strokeWidth: 1, strokeDasharray: '3 3' }} />
                            <XAxis dataKey="time" hide />
                            <YAxis stroke="#c0d0f0" domain={[0, 100]} hide/>
                            <Area type="monotone" dataKey="cpu" name="CPU" stroke="#ffc82c" fill="#ffc82c" fillOpacity={0.3} unit="%" />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartWrapper>
                
                <ChartWrapper title="Memory (MB)" isHighlighted={attunedDomain === DomainEnum.SECURITY}>
                    <ResponsiveContainer width="100%" height={120}>
                        <AreaChart data={data}>
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#4a90e2', strokeWidth: 1, strokeDasharray: '3 3' }} />
                            <XAxis dataKey="time" hide />
                            <YAxis stroke="#c0d0f0" domain={[0, 'dataMax + 128']} hide/>
                            <Area type="monotone" dataKey="memory" name="Memory" stroke="#4a90e2" fill="#4a90e2" fillOpacity={0.3} unit="MB" />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartWrapper>
             </div>
        );
    }
    
    return (
        <Panel title={selectedService ? `METRICS: ${selectedService}` : 'LIVE METRICS'} icon="fa-chart-area">
             {renderContent()}
        </Panel>
    );
};