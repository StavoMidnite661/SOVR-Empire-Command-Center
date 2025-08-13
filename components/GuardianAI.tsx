

import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { ChatAuthor, GuardianCommand } from '../types';
import { Panel } from './common/Panel';

interface GuardianAIProps {
    messages: ChatMessage[];
    onCommand: (command: string, args: Record<string, any>) => void;
    isAutonomous: boolean;
}

const AutonomousToggle: React.FC<{ isAutonomous: boolean; onCommand: (command: string, args: Record<string, any>) => void }> = ({ isAutonomous, onCommand }) => {
    const handleClick = () => {
        onCommand(GuardianCommand.SET_AUTONOMOUS_MODE, { enabled: !isAutonomous });
    };

    return (
        <div className="absolute top-2 right-4 flex items-center gap-2">
            <span className={`font-mono text-xs ${isAutonomous ? 'text-sov-red animate-pulse' : 'text-sov-text-secondary'}`}>
                AUTONOMOUS MODE
            </span>
            <button
                onClick={handleClick}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${isAutonomous ? 'bg-sov-red' : 'bg-sov-bg'}`}
            >
                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isAutonomous ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
        </div>
    );
};

export const GuardianAI: React.FC<GuardianAIProps> = ({ messages, onCommand, isAutonomous }) => {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);
    
    // Listen for chat messages from Guardian to end loading state
    useEffect(() => {
        const lastMessage = messages[messages.length - 1];
        if (isLoading && lastMessage && (lastMessage.author === ChatAuthor.GUARDIAN || lastMessage.author === ChatAuthor.SYSTEM_ACTION)) {
            setIsLoading(false);
        }
    }, [messages, isLoading]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessageText = input;
        
        // Send the command. The backend handles the rest, including cognitive steps.
        onCommand(GuardianCommand.SEND_MESSAGE, { text: userMessageText });

        setInput('');
        setIsLoading(true);
    };
    
    return (
        <Panel title="GUARDIAN COMMAND CONSOLE" icon="fa-brain" className={isAutonomous ? 'ring-2 ring-sov-red' : ''}>
             <AutonomousToggle isAutonomous={isAutonomous} onCommand={onCommand} />
            <div className="flex flex-col h-[60vh] lg:h-full">
                <div className="flex-grow overflow-y-auto pr-2 space-y-4 pt-8">
                    {messages.map((msg) => {
                        if (msg.author === ChatAuthor.SYSTEM_ACTION) {
                             return (
                                <div key={msg.id} className="flex items-center gap-3 text-sm font-mono text-sov-yellow">
                                    <i className="fa-solid fa-gears animate-spin [animation-duration:3s]"></i>
                                    <span className="truncate">{msg.text}</span>
                                </div>
                             )
                        }
                        
                        return (
                            <div key={msg.id} className={`flex items-start gap-3 ${msg.author === ChatAuthor.USER ? 'justify-end' : ''}`}>
                                {msg.author === ChatAuthor.GUARDIAN && <i className="fa-solid fa-shield-halved text-sov-cyan mt-1"></i>}
                                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.author === ChatAuthor.GUARDIAN ? 'bg-sov-border/50 text-sov-text' : 'bg-sov-blue text-white'}`}>
                                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                                    <p className={`text-xs mt-1 opacity-70 ${msg.author === ChatAuthor.USER ? 'text-right' : ''}`}>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                                {msg.author === ChatAuthor.USER && <i className="fa-solid fa-user text-sov-blue mt-1"></i>}
                            </div>
                        )
                    })}
                    {isLoading && (
                        <div className="flex items-start gap-3">
                             <i className="fa-solid fa-shield-halved text-sov-cyan mt-1"></i>
                             <div className="max-w-xs lg:max-w-sm px-4 py-2 rounded-lg bg-sov-border/50 text-sov-text">
                                <p className="text-sm flex items-center gap-2">
                                    <span className="animate-spin h-4 w-4 border-2 border-b-transparent border-sov-cyan rounded-full inline-block"></span>
                                    <span>Processing Command...</span>
                                </p>
                             </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSendMessage} className="mt-4 flex items-center gap-2 border-t border-sov-border pt-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Issue command to SOVR EMPIRE..."
                        disabled={isLoading}
                        className="w-full bg-sov-bg border border-sov-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sov-cyan transition-all font-mono"
                    />
                    <button type="submit" disabled={isLoading || !input.trim()} className="bg-sov-blue hover:bg-opacity-80 disabled:bg-sov-border disabled:cursor-not-allowed text-white px-4 py-2 rounded-md transition-all">
                        <i className="fa-solid fa-arrow-right-to-bracket"></i>
                    </button>
                </form>
            </div>
        </Panel>
    );
};
