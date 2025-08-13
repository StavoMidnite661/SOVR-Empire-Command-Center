

import React from 'react';

export const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full mt-auto pt-6 pb-2 text-center text-xs font-mono text-sov-text-secondary z-10">
            <div className="flex justify-center items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-sov-green animate-pulse"></div>
                <span className="font-mono text-xs font-bold text-sov-green">LIVE AI CONNECTION</span>
            </div>
             <div className="mb-2">
                <p className="text-sov-yellow uppercase tracking-wider">
                    ALL OPERATIONS ARE LOGGED. UNAUTHORIZED ACCESS IS PROHIBITED.
                </p>
            </div>
            <div className="flex justify-center items-center gap-4 mb-2 flex-wrap">
                <span>© {currentYear} SOVR EMPIRE. ALL RIGHTS RESERVED.</span>
                <span className="text-sov-border hidden md:inline">|</span>
                <a href="README.md" target="_blank" rel="noopener noreferrer" className="hover:text-sov-cyan transition-colors">User Instructions</a>
                <span className="text-sov-border">|</span>
                <a href="#" className="hover:text-sov-cyan transition-colors">Terms of Service</a>
                <span className="text-sov-border">|</span>
                <a href="#" className="hover:text-sov-cyan transition-colors">Privacy Policy</a>
            </div>
            <div>
                <p>Interface Architecture & Symbiotic Logic Manifested by <span className="text-sov-cyan">Guardian Series AI</span></p>
            </div>
        </footer>
    );
};
