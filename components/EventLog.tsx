import React from 'react';
import type { LogEntry, LogLevel } from '../types';
import { Panel } from './common/Panel';

const LogRow: React.FC<{ entry: LogEntry }> = ({ entry }) => {
    const levelConfig = {
        INFO: 'text-sov-blue',
        WARN: 'text-sov-yellow',
        CRITICAL: 'text-sov-red',
        SUCCESS: 'text-sov-green',
    };

    return (
        <tr className="border-b border-sov-border/30 hover:bg-sov-border/20">
            <td className="p-2 font-mono text-xs text-sov-text-secondary whitespace-nowrap">
                {entry.timestamp.toLocaleTimeString()}
            </td>
            <td className={`p-2 font-mono text-xs font-bold whitespace-nowrap ${levelConfig[entry.level]}`}>
                [{entry.level}]
            </td>
            <td className="p-2 font-mono text-sm text-sov-text w-full">
                {entry.message}
            </td>
        </tr>
    );
};

export const EventLog: React.FC<{ entries: LogEntry[] }> = ({ entries }) => {
    return (
        <Panel title="EVENT LOG" icon="fa-file-lines">
            <div className="h-96 overflow-y-auto pr-2">
                <table className="w-full border-collapse">
                    <tbody>
                        {entries.map(entry => <LogRow key={entry.id} entry={entry} />)}
                    </tbody>
                </table>
            </div>
        </Panel>
    );
};