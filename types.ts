

export enum SystemStatusEnum {
    ACTIVE = "ACTIVE",
    STANDBY = "STANDBY",
    MAINTENANCE = "MAINTENANCE",
    EMERGENCY_STOP = "EMERGENCY_STOP",
}

export type SystemStatus = SystemStatusEnum;

export type ServiceStatusName = 'ONLINE' | 'OFFLINE' | 'DEGRADED' | 'MAINTENANCE';

export enum ServiceName {
    API_GATEWAY = "API Gateway",
    BLOCKCHAIN_NODE = "Blockchain Node",
    MONITORING = "Monitoring Service",
    SOVR_PAY_GATEWAY = "SOVR Pay Gateway",
    SOVR_PAY_PROCESSOR = "SOVR Pay Processor",
    SOVR_SETTLEMENT_ENGINE = "SOVR Settlement Engine",
    KYC_SERVICE = "KYC Service",
    COMPLIANCE_ENGINE = "Compliance Engine",
    FRONTEND = "C&C Frontend",
    SOVR_MERCHANT_PORTAL = "Merchant Portal",
    ADMIN_PORTAL = "Admin Portal",
}


export interface ServiceStatus {
    name: ServiceName;
    url: string;
    status: ServiceStatusName;
}

export type LogLevel = 'INFO' | 'WARN' | 'CRITICAL' | 'SUCCESS';

export interface LogEntry {
    id: number;
    timestamp: Date;
    level: LogLevel;
    message: string;
}

export enum ChatAuthor {
    USER = "USER",
    GUARDIAN = "GUARDIAN",
    SYSTEM_ACTION = "SYSTEM_ACTION"
}

export interface ChatMessage {
    id: number;
    author: ChatAuthor;
    text: string;
    timestamp: Date;
}

export type TestStatus = 'PASS' | 'FAIL' | 'PENDING' | 'IDLE';

export interface TestResult {
    status: TestStatus;
}

export enum TestName {
    GATEWAY_HEALTH = "/health/pay-gateway",
    PROCESSOR_HEALTH = "/health/pay-processor",
    SETTLEMENT_HEALTH = "/health/settlement-engine",
    KYC_HEALTH = "/health/kyc-service",
    COMPLIANCE_HEALTH = "/health/compliance-engine",
    NODE_HEALTH = "/health/blockchain-node",
    API_GATEWAY_HEALTH = "/health/api-gateway",
}

export interface TestDefinition {
    name: TestName;
    purpose: string;
}

// Types for Precognitive Event Modulator
export enum EchoType {
    THREAT = 'THREAT',
    OPPORTUNITY = 'OPPORTUNITY',
    NEUTRAL = 'NEUTRAL',
}

export interface Intervention {
    id: string;
    name: string;
    description: string;
    engaged: boolean;
}

export interface TemporalEcho {
    id: string;
    title: string;
    type: EchoType;
    probability: number;
    timeToEvent: string;
    interventions: Intervention[];
}

// Types for Symbiotic Core
export enum SystemDomain {
    NETWORK = "NETWORK",
    SECURITY = "SECURITY",
    THROUGHPUT = "THROUGHPUT",
    PRECOGNITION = "PRECOGNITION",
    COMPLIANCE = "COMPLIANCE",
}

// Types for Automated Defense System (ADS)
export enum ThreatProtocolName {
    DDOS = "DDoS Attack",
    API_ANOMALY = "Anomalous API Usage",
    CONTRACT_EXPLOIT = "Smart Contract Exploit",
    NETWORK_FIREWALL = "Network Firewall",
}

export type ProtocolMode = 'DISABLED' | 'MANUAL' | 'AUTONOMOUS';

export interface DefenseProtocol {
    name: ThreatProtocolName;
    description: string;
    mode: ProtocolMode;
}

// Types for Cognitive Process Visualizer
export type CognitiveNodeStatus = 'IDLE' | 'ACTIVE' | 'COMPLETE' | 'ERROR';

export interface CognitiveNode {
    id: string;
    label: string;
    status: CognitiveNodeStatus;
    position: { x: number; y: number };
}

export interface CognitiveEdge {
    from: string;
    to: string;
    active: boolean;
}

export interface CognitiveProcess {
    nodes: CognitiveNode[];
    edges: CognitiveEdge[];
}

export enum CognitiveStep {
    START = "START",
    VALIDATION = "VALIDATION",
    SECURITY_CHECK = "SECURITY_CHECK",
    DEPENDENCY_RESOLUTION = "DEPENDENCY_RESOLUTION",
    EXECUTION = "EXECUTION",
    STATE_UPDATE = "STATE_UPDATE",
    COMPLETE = "COMPLETE",
    ERROR = "ERROR",
}

// Types for System Architecture Visualizer
export interface ArchitectureNode {
    id: string;
    label: string;
    type: 'client' | 'service' | 'database' | 'engine';
    description: string;
    position: { x: number; y: number };
}

export interface ArchitectureEdge {
    from: string;
    to: string;
    label: string;
    direction?: 'uni' | 'bi';
}

export interface ArchitectureData {
    nodes: ArchitectureNode[];
    edges: ArchitectureEdge[];
}

// Metric type for dashboard
export interface MetricDataPoint {
    time: string;
    rps: number;
    latency: number;
    errorRate: number;
    cpu: number;
    memory: number;
}

// Types for Compliance Monitor
export type ComplianceStatus = 'PASS' | 'FAIL' | 'PENDING';

export interface ComplianceCheck {
    id: string;
    name: string;
    description: string;
    status: ComplianceStatus;
}


// Command types sent TO the Guardian AI
export enum GuardianCommand {
    SEND_MESSAGE = 'SEND_MESSAGE',
    SET_SYSTEM_STATUS = 'SET_SYSTEM_STATUS',
    RUN_DIAGNOSTIC = 'RUN_DIAGNOSTIC',
    SET_PROTOCOL_MODE = 'SET_PROTOCOL_MODE',
    ENGAGE_INTERVENTION = 'ENGAGE_INTERVENTION',
    SET_AUTONOMOUS_MODE = 'SET_AUTONOMOUS_MODE',
    QUERY_SERVICE_METRICS = 'QUERY_SERVICE_METRICS',
}

// Event types received FROM the Guardian AI stream
export type GuardianEvent =
    | { type: 'full_state_sync'; payload: FullSystemState }
    | { type: 'state_update'; payload: Partial<FullSystemState> }
    | { type: 'metric_update'; payload: { serviceName: ServiceName, point: MetricDataPoint } }
    | { type: 'precog_update'; payload: TemporalEcho[] }
    | { type: 'log_entry'; payload: Omit<LogEntry, 'id' | 'timestamp'> }
    | { type: 'chat_message'; payload: ChatMessage }
    | { type: 'cognitive_step'; payload: { step: CognitiveStep; details?: any } }
    | { type: 'error', payload: { message: string } };

export interface FullSystemState {
    systemStatus: SystemStatus;
    services: ServiceStatus[];
    testDefinitions: TestDefinition[];
    testResults: Partial<Record<TestName, TestResult>>;
    defenseProtocols: DefenseProtocol[];
    serviceMetrics: Partial<Record<ServiceName, MetricDataPoint[]>>;
    precogEchos: TemporalEcho[];
    chatHistory: ChatMessage[];
    isAutonomous: boolean;
    complianceChecks: ComplianceCheck[];
}