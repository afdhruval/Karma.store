import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router';

const OrderSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [reveal, setReveal] = useState(false);

    const items = location.state?.items || [];

    useEffect(() => {
        const timer = setTimeout(() => setReveal(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // Custom CSS for marquee and animations
    const styleBlock = `
        @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
        }
        @keyframes slideUpFade {
            0% { opacity: 0; transform: translateY(40px); }
            100% { opacity: 1; transform: translateY(0); }
        }
        .anim-element {
            opacity: 0;
            animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.3s; }
        .delay-3 { animation-delay: 0.5s; }
        
        .hover-invert {
            transition: all 0.3s ease;
        }
        .hover-invert:hover {
            background-color: #000 !important;
            color: #fff !important;
        }
    `;

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", backgroundColor: '#ffffff', color: '#000000', minHeight: '100vh', overflowX: 'hidden' }}>
            <style>{styleBlock}</style>
            
            {/* Top Marquee Banner - Brutalist element */}
            <div style={{ backgroundColor: '#000', color: '#fff', padding: '12px 0', overflow: 'hidden', whiteSpace: 'nowrap', borderBottom: '2px solid #000' }}>
                <div style={{ display: 'inline-block', animation: 'marquee 15s linear infinite', fontWeight: 900, fontSize: '14px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                    &nbsp;✦ ORDER CONFIRMED ✦ PREPARING FOR DISPATCH ✦ YOUR STYLE IS ON THE WAY ✦ EXPECT DELIVERY IN 5 DAYS ✦ ORDER CONFIRMED ✦ PREPARING FOR DISPATCH ✦ YOUR STYLE IS ON THE WAY ✦ EXPECT DELIVERY IN 5 DAYS ✦
                </div>
            </div>

            <main style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px 100px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                
                {/* Main Hero Section */}
                <div className="anim-element delay-1" style={{ padding: '80px 0 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%' }}>
                    
                    {/* Abstract large checkmark */}
                    <div style={{ width: '80px', height: '80px', marginBottom: '32px', position: 'relative' }}>
                        <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                            <path 
                                d="M20 50 L40 70 L80 30" 
                                fill="none" 
                                stroke="#000" 
                                strokeWidth="8" 
                                strokeLinecap="square"
                                strokeDasharray="100"
                                strokeDashoffset={reveal ? "0" : "100"}
                                style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1) 0.5s' }}
                            />
                        </svg>
                    </div>

                    <h1 style={{ fontSize: 'clamp(48px, 8vw, 90px)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.04em', lineHeight: 0.9, margin: '0 0 24px' }}>
                        THE ORDER<br/>
                        <span style={{ color: '#fff', WebkitTextStroke: '2px #000', position: 'relative' }}>IS CONFIRMED.</span>
                    </h1>
                    <p style={{ fontSize: '16px', fontWeight: 500, color: '#555', maxWidth: '500px', lineHeight: 1.5, margin: 0 }}>
                        {/* Your transaction was successful. Below are the items we are preparing for you. */}
                    </p>
                </div>

                {/* Return Home Button */}
                <div className="anim-element delay-3" style={{ width: '100%', marginTop: '60px', display: 'flex', justifyContent: 'center' }}>
                    <button 
                        onClick={() => navigate('/')}
                        className="hover-invert"
                        style={{    
                            padding: '24px 48px', 
                            backgroundColor: '#fff', 
                            color: '#000', 
                            border: '3px solid #000', 
                            fontSize: '14px', 
                            fontWeight: 900, 
                            letterSpacing: '0.2em', 
                            textTransform: 'uppercase', 
                            cursor: 'pointer',
                            width: '100%',
                            maxWidth: '400px'
                        }}
                    >
                        RETURN TO HOME
                    </button>
                </div>
            </main>
        </div>
    );
};

export default OrderSuccess;