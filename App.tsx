

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Header } from './components/Header';
import { NetworkTopology } from './components/NetworkTopology';
import { MetricsDashboard } from './components/MetricsDashboard';
import { EventLog } from './components/EventLog';
import { ControlPanel } from './components/ControlPanel';
import { GuardianAI } from './components/GuardianAI';
import { PrecognitiveModulator } from './components/PrecognitiveModulator';
import { SymbioticCore } from './components/SymbioticCore';
import { AutomatedDefenseSystem } from './components/AutomatedDefenseSystem';
import { CognitiveVisualizer } from './components/CognitiveVisualizer';
import { SystemArchitecture } from './components/SystemArchitecture';
import { ComplianceMonitor } from './components/ComplianceMonitor';
import { Footer } from './components/Footer';
import { TabbedPanel } from './components/common/TabbedPanel';
import type { LogEntry, SystemStatus, ServiceStatus, ChatMessage, TestResult, SystemDomain, TestDefinition, DefenseProtocol, CognitiveProcess, MetricDataPoint, TemporalEcho, ServiceName, ComplianceCheck } from './types';
import { SystemStatusEnum, TestName, CognitiveStep, ChatAuthor } from './types';
import * as api from './services/apiService';
import { produce } from 'https://esm.sh/immer@10.1.1';
import { streamGuardianResponse } from './services/geminiService';

const App: React.FC = () => {
    // Core State - Initialized empty, to be populated by the backend
    const [systemStatus, setSystemStatus] = useState<SystemStatus>(SystemStatusEnum.STANDBY);
    const [services, setServices] = useState<ServiceStatus[]>([]);
    const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [testDefinitions, setTestDefinitions] = useState<TestDefinition[]>([]);
    const [testResults, setTestResults] = useState<Partial<Record<TestName, TestResult>>>({});
    const [defenseProtocols, setDefenseProtocols] = useState<DefenseProtocol[]>([]);
    const [serviceMetrics, setServiceMetrics] = useState<Partial<Record<ServiceName, MetricDataPoint[]>>>({});
    const [precogEchos, setPrecogEchos] = useState<TemporalEcho[]>([]);
    const [complianceChecks, setComplianceChecks] = useState<ComplianceCheck[]>([]);

    // UI & Interaction State
    const [selectedService, setSelectedService] = useState<ServiceName | null>(null);

    // Guardian & Symbiotic Core State
    const [isAutonomousMode, setIsAutonomousMode] = useState(false);
    const [focusLevel, setFocusLevel] = useState(100);
    const [attunedDomain, setAttunedDomain] = useState<SystemDomain | null>(null);
    const [cognitiveProcess, setCognitiveProcess] = useState<CognitiveProcess | null>(null);
    const [isGuardianProcessing, setIsGuardianProcessing] = useState(false);
    
    const guardianStream = useRef<(() => void) | null>(null);

    const addLogEntry = useCallback((entry: Omit<LogEntry, 'id' | 'timestamp'>) => {
        setLogEntries(prev => [{ ...entry, id: Date.now() + Math.random(), timestamp: new Date() }, ...prev.slice(0, 199)]);
    }, []);

    const handleCognitiveStep = useCallback((step: CognitiveStep) => {
        setCognitiveProcess(produce((draft: CognitiveProcess | null) => {
            if (!draft || step === CognitiveStep.START) {
                const initialProcess: CognitiveProcess = {
                    nodes: [
                        { id: 'start', label: 'Input', status: 'IDLE', position: { x: 10, y: 50 } },
                        { id: 'validation', label: 'Validation', status: 'IDLE', position: { x: 25, y: 50 } },
                        { id: 'security', label: 'Security Check', status: 'IDLE', position: { x: 40, y: 50 } },
                        { id: 'dependency', label: 'Dependency', status: 'IDLE', position: { x: 55, y: 50 } },
                        { id: 'execution', label: 'Execution', status: 'IDLE', position: { x: 70, y: 50 } },
                        { id: 'state-update', label: 'State Update', status: 'IDLE', position: { x: 85, y: 50 } },
                        { id: 'complete', label: 'Complete', status: 'IDLE', position: { x: 98, y: 50 } },
                    ],
                    edges: [
                        { from: 'start', to: 'validation', active: false },
                        { from: 'validation', to: 'security', active: false },
                        { from: 'security', to: 'dependency', active: false },
                        { from: 'dependency', to: 'execution', active: false },
                        { from: 'execution', to: 'state-update', active: false },
                        { from: 'state-update', to: 'complete', active: false },
                    ]
                };
                draft = initialProcess;
            }

            const findNode = (id: string) => draft.nodes.find(n => n.id === id);
            const findEdge = (from: string, to: string) => draft.edges.find(e => e.from === from && e.to === to);
            const activate = (nodeId: string, nextNodeId?: string) => { const node = findNode(nodeId); if (node) node.status = 'ACTIVE'; if(nextNodeId) { const edge = findEdge(nodeId, nextNodeId); if(edge) edge.active = true; } };
            const complete = (nodeId: string) => { const node = findNode(nodeId); if(node) node.status = 'COMPLETE'; };

            switch (step) {
                case CognitiveStep.START:
                    activate('start', 'validation');
                    break;
                case CognitiveStep.VALIDATION:
                    complete('start');
                    activate('validation', 'security');
                    break;
                case CognitiveStep.SECURITY_CHECK:
                    complete('validation');
                    activate('security', 'dependency');
                    break;
                case CognitiveStep.DEPENDENCY_RESOLUTION:
                    complete('security');
                    activate('dependency', 'execution');
                    break;
                case CognitiveStep.EXECUTION:
                    complete('dependency');
                    activate('execution', 'state-update');
                    break;
                case CognitiveStep.STATE_UPDATE:
                    complete('execution');
                    activate('state-update', 'complete');
                    break;
                case CognitiveStep.COMPLETE:
                    complete('state-update');
                    activate('complete');
                     setTimeout(() => {
                        setCognitiveProcess(produce((d: CognitiveProcess | null) => {
                            if (!d) return;
                            const node = d.nodes.find(n => n.id === 'complete');
                            if (node) node.status = 'COMPLETE';
                        }));
                    }, 500);
                    break;
                case CognitiveStep.ERROR:
                    if(draft) {
                        draft.nodes.forEach(n => { if (n.status === 'ACTIVE') n.status = 'ERROR'; });
                        const errorNode = findNode('complete');
                        if(errorNode) { errorNode.label = 'ERROR'; errorNode.status = 'ERROR'; }
                    }
                    break;
            }
            return draft;
        }));
    }, []);

    const sendGuardianCommand = useCallback(async (command: string, args: Record<string, any> = {}) => {
        if (command === 'SEND_MESSAGE') {
             const userMessageText = args.text;

            // 1. Add user message to chat locally
            setChatMessages(produce(draft => {
                draft.push({
                    id: Date.now(),
                    author: ChatAuthor.USER,
                    text: userMessageText,
                    timestamp: new Date()
                });
            }));
            
            // 2. Set loading state & start cognitive process
            setIsGuardianProcessing(true);
            handleCognitiveStep(CognitiveStep.START);

            // 3. Add a placeholder for the Guardian's streaming response
            const guardianMessageId = Date.now() + 1; // Unique ID for the response
            setChatMessages(produce(draft => {
                draft.push({
                    id: guardianMessageId,
                    author: ChatAuthor.GUARDIAN,
                    text: '',
                    timestamp: new Date()
                });
            }));
            
            // 4. Call Gemini streaming service
            streamGuardianResponse({
                message: userMessageText,
                onChunk: (chunk: string) => {
                    handleCognitiveStep(CognitiveStep.EXECUTION);
                    setChatMessages(produce(draft => {
                        const guardianMessage = draft.find(m => m.id === guardianMessageId);
                        if (guardianMessage) {
                            guardianMessage.text += chunk;
                        }
                    }));
                },
                onComplete: () => {
                    setIsGuardianProcessing(false);
                    handleCognitiveStep(CognitiveStep.COMPLETE);
                    addLogEntry({ level: 'INFO', message: 'Guardian AI response stream complete.' });
                },
                onError: (error: Error) => {
                    setIsGuardianProcessing(false);
                    handleCognitiveStep(CognitiveStep.ERROR);
                    addLogEntry({ level: 'CRITICAL', message: `Guardian AI Error: ${error.message}` });
                     setChatMessages(produce(draft => {
                        const guardianMessage = draft.find(m => m.id === guardianMessageId);
                        if (guardianMessage) {
                             guardianMessage.author = ChatAuthor.SYSTEM_ACTION;
                             guardianMessage.text = `Critical error processing command. See Event Log for details.`;
                        }
                    }));
                }
            });

        } else {
            // Handle other, non-chat commands via the mock API
            await api.sendGuardianCommand(command, args);
        }
    }, [addLogEntry, handleCognitiveStep]);
    
    // Centralized event handler for all incoming backend events
    const handleGuardianEvent = useCallback((event: any) => {
        const { type, payload } = event;
        switch (type) {
            case 'full_state_sync':
                setSystemStatus(payload.systemStatus);
                setServices(payload.services);
                setTestDefinitions(payload.testDefinitions);
                setTestResults(payload.testResults);
                setDefenseProtocols(payload.defenseProtocols);
                setServiceMetrics(payload.serviceMetrics || {});
                setPrecogEchos(payload.precogEchos);
                setComplianceChecks(payload.complianceChecks || []);
                setChatMessages(payload.chatHistory || []);
                setIsAutonomousMode(payload.isAutonomous);
                addLogEntry({ level: 'SUCCESS', message: "Guardian AI full state sync complete. Console is live." });
                break;
            case 'state_update':
                if (payload.systemStatus) setSystemStatus(payload.systemStatus);
                if (payload.services) setServices(payload.services);
                if (payload.testResults) setTestResults(prev => ({ ...prev, ...payload.testResults }));
                if (payload.defenseProtocols) setDefenseProtocols(payload.defenseProtocols);
                if (payload.complianceChecks) setComplianceChecks(payload.complianceChecks);
                if (payload.isAutonomous !== undefined) setIsAutonomousMode(payload.isAutonomous);
                if (payload.precogEchos) setPrecogEchos(payload.precogEchos);
                break;
            case 'metric_update':
                const { serviceName, point } = payload;
                setServiceMetrics(produce(draft => {
                    if (!draft[serviceName]) {
                        draft[serviceName] = [];
                    }
                    const serviceData = draft[serviceName]!;
                    serviceData.push({ ...point, time: new Date(point.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) });
                    if (serviceData.length > 30) {
                        serviceData.shift();
                    }
                }));
                break;
            case 'log_entry':
                addLogEntry(payload);
                break;
            case 'chat_message':
                setChatMessages(prev => {
                    // Prevent duplicates from local echo vs. backend stream
                    if (prev.find(m => m.id === payload.id)) return prev; 
                    if (payload.author === ChatAuthor.USER && prev.some(p => p.author === ChatAuthor.USER && p.text === payload.text && (new Date().getTime() - new Date(p.timestamp).getTime() < 2000))) return prev;
                    return [...prev, payload];
                });
                break;
            case 'cognitive_step':
                handleCognitiveStep(payload.step);
                break;
        }
    }, [addLogEntry, handleCognitiveStep]);
    
    // Establish connection to backend on mount
    useEffect(() => {
        addLogEntry({ level: 'INFO', message: 'Initializing Command & Control Console...' });
        addLogEntry({ level: 'INFO', message: 'Connecting to SOVR EMPIRE backend...' });

        const stream = api.streamGuardianEvents(handleGuardianEvent);
        guardianStream.current = stream.close;
        
        return () => {
            if (guardianStream.current) {
                guardianStream.current();
            }
        };
    }, [handleGuardianEvent]);

    // Focus decay effect
    useEffect(() => {
        const decayInterval = setInterval(() => {
            if (systemStatus === SystemStatusEnum.ACTIVE) {
                 setFocusLevel(prev => Math.max(0, prev - 0.5));
            }
        }, 1000);
        return () => clearInterval(decayInterval);
    }, [systemStatus]);

    const tabs = useMemo(() => [
        { name: "Defense", icon: "fa-shield-halved", content: <AutomatedDefenseSystem protocols={defenseProtocols} onCommand={sendGuardianCommand} systemStatus={systemStatus}/> },
        { name: "Compliance", icon: "fa-balance-scale", content: <ComplianceMonitor checks={complianceChecks} systemStatus={systemStatus} /> },
        { name: "Precognition", icon: "fa-brain", content: <PrecognitiveModulator echos={precogEchos} onCommand={sendGuardianCommand} systemStatus={systemStatus} attunedDomain={attunedDomain} /> },
        { name: "Architecture", icon: "fa-cubes", content: <SystemArchitecture /> },
    ], [defenseProtocols, complianceChecks, sendGuardianCommand, systemStatus, attunedDomain, precogEchos]);

    return (
        <div className="min-h-screen p-4 lg:p-6 space-y-6 relative overflow-hidden flex flex-col">
            <div className="absolute inset-0 bg-grid-slate-700/10 [mask-image:linear-gradient(0deg,#000000,rgba(0,0,0,0.6))]"></div>
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-sov-blue/20 to-transparent z-0"></div>
            <div className="absolute top-0 left-0 h-full w-px bg-sov-cyan/20 animate-scanline z-10"></div>
            
            <Header systemStatus={systemStatus} />

            <main className="grid grid-cols-1 lg:grid-cols-4 gap-6 z-10 flex-grow">
                {/* Left Column */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <ControlPanel 
                        onCommand={sendGuardianCommand}
                        systemStatus={systemStatus}
                        tests={testDefinitions}
                        testResults={testResults}
                        services={services}
                    />
                    <SymbioticCore 
                        systemStatus={systemStatus}
                        focusLevel={focusLevel}
                        setFocusLevel={setFocusLevel}
                        attunedDomain={attunedDomain}
                        setAttunedDomain={setAttunedDomain}
                        addLogEntry={addLogEntry}
                    />
                    <NetworkTopology 
                        services={services} 
                        attunedDomain={attunedDomain}
                        onSelectService={setSelectedService}
                        selectedService={selectedService}
                    />
                </div>
                
                {/* Center Column */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <GuardianAI 
                        messages={chatMessages}
                        onCommand={sendGuardianCommand}
                        isAutonomous={isAutonomousMode}
                        isProcessing={isGuardianProcessing}
                    />
                    <CognitiveVisualizer process={cognitiveProcess} />
                </div>

                {/* Right Column */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                   <TabbedPanel tabs={tabs} />
                   <MetricsDashboard 
                        systemStatus={systemStatus} 
                        attunedDomain={attunedDomain} 
                        serviceMetrics={serviceMetrics}
                        selectedService={selectedService}
                    />
                </div>

                {/* Full-width bottom row */}
                <div className="lg:col-span-4">
                    <EventLog entries={logEntries} />
                </div>
            </main>
            
            <Footer />
        </div>
    );
};

export default App;