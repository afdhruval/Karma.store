import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import axios from 'axios';

const NotFound = () => {
    const navigate = useNavigate();
    const [checkingServer, setCheckingServer] = useState(false);
    const [serverStatus, setServerStatus] = useState(null); // 'online', 'offline', or null

    // Check backend health
    const verifyConnection = async () => {
        setCheckingServer(true);
        setServerStatus(null);
        try {
            // Fetch root endpoint which is proxied to the backend
            const response = await axios.get('/api', { timeout: 3000 });
            if (response.status === 200) {
                setServerStatus('online');
                // Automatically redirect to homepage after 1.5s if server is up
                setTimeout(() => {
                    navigate('/');
                }, 1500);
            } else {
                setServerStatus('offline');
            }
        } catch (error) {
            setServerStatus('offline');
        } finally {
            setCheckingServer(false);
        }
    };

    return (
        <>
            {/* Google Fonts */}
            <link
                href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,700;0,900;1,900&family=Outfit:wght@300;400;600;900&family=Share+Tech+Mono&display=swap"
                rel="stylesheet"
            />

            <div
                className="min-h-screen bg-[#070707] text-white flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden select-none selection:bg-red-500 selection:text-white"
                style={{ fontFamily: "'Outfit', sans-serif" }}
            >
                {/* Technical grid backdrop */}
                <div 
                    className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                    style={{
                        backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
                        backgroundSize: '24px 24px'
                    }} 
                />

                {/* Animated scanline */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-white/[0.01] to-transparent h-[200%] animate-[scanline_10s_infinite_linear]" />

                {/* Header Metadata */}
                <header className="z-10 flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black tracking-[0.3em] text-red-500 uppercase flex items-center gap-1.5 animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
                            OUT OF BOUNDS
                        </span>
                    </div>
                    <span className="text-[9px] font-bold tracking-[0.2em] text-white/30 uppercase font-mono">
                        ERR_SYS_404_503
                    </span>
                </header>

                {/* Central High-Contrast Diagnostics */}
                <main className="z-10 flex-1 flex flex-col justify-center items-center max-w-xl mx-auto text-center py-12">
                    
                    {/* Big Bold Outlined 404 */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="relative select-none pointer-events-none mb-6"
                    >
                        <h1 
                            className="text-[20vw] sm:text-[10rem] font-black leading-none text-transparent tracking-tighter"
                            style={{ 
                                WebkitTextStroke: '1px rgba(255, 255, 255, 0.15)',
                                fontFamily: "'Montserrat', sans-serif" 
                            }}
                        >
                            404
                        </h1>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-red-500/80 text-[6vw] sm:text-[3rem] font-black uppercase tracking-[0.4em] blur-[1px] animate-pulse">
                                OFFLINE
                            </span>
                        </div>
                    </motion.div>

                    {/* Industrial Diagnostic Content */}
                    <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="space-y-6"
                    >
                        <div className="inline-block border border-red-500/30 bg-red-950/20 px-3 py-1 text-[8px] font-bold uppercase tracking-[0.25em] text-red-400 font-mono">
                            ⚠️ [ CRITICAL: PIPELINE_UNREACHABLE ]
                        </div>

                        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white">
                            Our Service is Temporarily Down or Route is Missing.
                        </h2>
                        
                        <p className="text-xs text-white/50 tracking-wide leading-relaxed max-w-md mx-auto">
                            The request could not resolve. This occurs if the path is invalid or the store engines are undergoing scheduled tuning. 
                            <span className="block mt-2 font-bold text-red-500/80">Please check back in an hour.</span>
                        </p>

                        {/* Interactive Diagnostic Output Box */}
                        <div className="border border-white/10 bg-[#0e0e0e] p-4 text-left font-mono text-[9px] tracking-wider text-white/45 max-w-sm mx-auto select-text relative">
                            <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-2">
                                <span className="text-white/30 uppercase">// SYSTEM TERMINAL</span>
                                <span className="text-[8px] px-1.5 py-0.5 bg-white/5 rounded text-white/60">ACTIVE</span>
                            </div>
                            <p className="text-green-500/80 font-bold">$ ping karma-api-gateway</p>
                            <p className="mt-1">Request timed out. Destination host unreachable.</p>
                            
                            {serverStatus === 'online' && (
                                <p className="mt-2 text-green-400 font-bold">➔ CONNECTION RE-ESTABLISHED! REDIRECTING...</p>
                            )}
                            {serverStatus === 'offline' && (
                                <p className="mt-2 text-red-400 font-bold">➔ ERROR: BACKEND REMAINING OFFLINE. RETRY IN 1 HOUR.</p>
                            )}
                            {checkingServer && (
                                <p className="mt-2 text-yellow-400 animate-pulse font-bold">➔ DIAGNOSING TUNNELS... PINGING HOST...</p>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4">
                            <button
                                onClick={verifyConnection}
                                disabled={checkingServer}
                                className="w-full sm:w-auto min-w-[160px] border border-red-500 bg-red-600 hover:bg-transparent text-white hover:text-red-500 font-bold uppercase tracking-[0.2em] text-[9px] py-3.5 px-6 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:bg-zinc-800 disabled:border-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed"
                            >
                                {checkingServer ? 'Diagnosing...' : 'Retry Connection'}
                            </button>
                            
                            <button
                                onClick={() => navigate('/')}
                                className="w-full sm:w-auto min-w-[160px] border border-white/10 bg-transparent hover:bg-white hover:text-black text-white/70 font-bold uppercase tracking-[0.2em] text-[9px] py-3.5 px-6 transition-all duration-300 cursor-pointer"
                            >
                                Return to Shop
                            </button>
                        </div>
                    </motion.div>
                </main>

                {/* Footer Metadata */}
                <footer className="z-10 flex flex-col sm:flex-row justify-between items-center border-t border-white/10 pt-4 text-[9px] font-bold tracking-widest text-white/30 gap-2 font-mono">
                    <span>// LOC: GLOBAL GATEWAY</span>
                    <span>COHORT-2.0 // EST. 2026</span>
                </footer>
            </div>

            {/* Custom Scanline Keyframes */}
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes scanline {
                    0% { transform: translateY(-50%); }
                    100% { transform: translateY(0%); }
                }
            `}} />
        </>
    );
};

export default NotFound;
