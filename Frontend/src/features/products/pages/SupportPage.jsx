import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useToast } from '../../Shared/Components/ToastContext';
import { motion } from 'framer-motion';

const TABS = [
    { id: 'shipping-policy', label: 'Shipping Policy', path: '/shipping-policy' },
    { id: 'returns', label: 'Returns Compiler', path: '/returns' },
    { id: 'size-guide', label: 'Size Guide Specs', path: '/size-guide' },
    { id: 'contact', label: 'Contact Studio', path: '/contact' }
];

const SupportPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { showToast } = useToast();
    
    // Determine active tab based on path
    const activeTab = TABS.find(t => t.path === location.pathname)?.id || 'shipping-policy';

    // Mock Contact Form State
    const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
    const [isSending, setIsSending] = useState(false);

    const handleContactSubmit = (e) => {
        e.preventDefault();
        setIsSending(true);
        setTimeout(() => {
            showToast('MESSAGE RECEIVED. WE WILL REACH OUT SHORTLY // KARMA', 'success');
            setContactForm({ name: '', email: '', message: '' });
            setIsSending(false);
        }, 1200);
    };

    return (
        <div className="min-h-screen bg-white pb-24" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <link
                href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,700;0,900;1,900&family=Outfit:wght@300;400;600;700;900&display=swap"
                rel="stylesheet"
            />

            <div className="max-w-screen-xl mx-auto px-6 sm:px-8 pt-12">
                {/* Header Back Button */}
                <button
                    onClick={() => navigate('/')}
                    className="text-xs font-bold uppercase tracking-widest text-black/50 hover:text-black transition-colors duration-200 flex items-center gap-1.5 mb-8"
                >
                    ← Back to Home
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    
                    {/* LEFT COLUMN: Sticky Menu Sidebar */}
                    <div className="lg:col-span-4 sticky top-24 flex flex-col gap-3">
                        <span className="text-[9px] font-black tracking-[0.25em] text-black/45 block mb-1">
                            // STRAW PANEL
                        </span>
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => navigate(tab.path)}
                                className={`text-left text-xs font-black uppercase tracking-[0.2em] px-5 py-4 border transition-all duration-300 cursor-pointer flex items-center justify-between ${
                                    activeTab === tab.id
                                        ? 'bg-black text-white border-black'
                                        : 'bg-white text-black/50 border-black/10 hover:border-black hover:text-black'
                                }`}
                            >
                                <span>{tab.label}</span>
                                {activeTab === tab.id && <span>➔</span>}
                            </button>
                        ))}
                    </div>

                    {/* RIGHT COLUMN: Tab Content Display */}
                    <div className="lg:col-span-8 border border-black/10 p-8 sm:p-10 bg-white relative min-h-[480px]">
                        <div className="absolute -top-3 left-6 bg-black text-white text-[8px] font-black tracking-[0.2em] px-2 py-1 uppercase">
                            [ {TABS.find(t => t.id === activeTab)?.label} // DATA COMPILATION ]
                        </div>

                        {/* SHIPPING POLICY TAB */}
                        {activeTab === 'shipping-policy' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col gap-6"
                            >
                                <h1 className="text-3xl font-black uppercase tracking-tight text-black" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                    Shipping Policy
                                </h1>
                                <p className="text-sm text-black/60 leading-relaxed font-semibold">
                                    All orders are processed dynamically inside our creative studio in India and shipped via express air priority carriers.
                                </p>
                                
                                <div className="border border-black/10 mt-2">
                                    <div className="grid grid-cols-3 bg-zinc-50 border-b border-black/10 p-3 text-[10px] font-black uppercase tracking-wider text-black">
                                        <div>Service</div>
                                        <div>Timeframe</div>
                                        <div>Cost</div>
                                    </div>
                                    <div className="grid grid-cols-3 border-b border-black/10 p-4 text-xs font-semibold text-black/70">
                                        <div>Standard priority</div>
                                        <div>3 - 5 business days</div>
                                        <div>Free (above ₹999)</div>
                                    </div>
                                    <div className="grid grid-cols-3 border-b border-black/10 p-4 text-xs font-semibold text-black/70">
                                        <div>Express drop</div>
                                        <div>1 - 2 business days</div>
                                        <div>₹150</div>
                                    </div>
                                    <div className="grid grid-cols-3 p-4 text-xs font-semibold text-black/70">
                                        <div>International air</div>
                                        <div>7 - 10 business days</div>
                                        <div>₹1,500</div>
                                    </div>
                                </div>
                                <p className="text-[10px] uppercase tracking-wider text-black/40 mt-4 leading-relaxed font-bold">
                                    * Real-time tracking links will be issued to your registered contact channel as soon as the dispatch compiles.
                                </p>
                            </motion.div>
                        )}

                        {/* RETURNS TAB */}
                        {activeTab === 'returns' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col gap-6"
                            >
                                <h1 className="text-3xl font-black uppercase tracking-tight text-black" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                    Returns Compiler
                                </h1>
                                <p className="text-sm text-black/60 leading-relaxed font-semibold">
                                    We offer a hassle-free, **14-day return and exchange policy** on all unworn items featuring original tags intact.
                                </p>

                                <div className="flex flex-col gap-4 mt-2">
                                    <div className="flex items-start gap-4 p-4 border border-black/5 bg-zinc-50">
                                        <div className="w-8 h-8 rounded-full border border-black/10 bg-white flex items-center justify-center font-black text-xs text-black">1</div>
                                        <div className="flex-1">
                                            <h3 className="text-xs font-black uppercase tracking-wider text-black">Log compilation request</h3>
                                            <p className="text-xs text-black/60 leading-relaxed mt-1 font-semibold">Initiate return request via dashboard or contacting our studio team.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 p-4 border border-black/5 bg-zinc-50">
                                        <div className="w-8 h-8 rounded-full border border-black/10 bg-white flex items-center justify-center font-black text-xs text-black">2</div>
                                        <div className="flex-1">
                                            <h3 className="text-xs font-black uppercase tracking-wider text-black">Asset compilation pickup</h3>
                                            <p className="text-xs text-black/60 leading-relaxed mt-1 font-semibold">Our priority courier compiles collection right from your doorstep.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 p-4 border border-black/5 bg-zinc-50">
                                        <div className="w-8 h-8 rounded-full border border-black/10 bg-white flex items-center justify-center font-black text-xs text-black">3</div>
                                        <div className="flex-1">
                                            <h3 className="text-xs font-black uppercase tracking-wider text-black">Instant refund drop</h3>
                                            <p className="text-xs text-black/60 leading-relaxed mt-1 font-semibold">Once assets check out successfully, refunds compile to your original channel within 48 hours.</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* SIZE GUIDE TAB */}
                        {activeTab === 'size-guide' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col gap-6"
                            >
                                <h1 className="text-3xl font-black uppercase tracking-tight text-black" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                    Size Guide Specs
                                </h1>
                                <p className="text-sm text-black/60 leading-relaxed font-semibold">
                                    Our collection sizes match standard **Indian & Global sizing benchmarks**. Consult the metrics to locate your perfect fit.
                                </p>

                                <div className="border border-black/10 mt-2 overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-zinc-50 border-b border-black/10 text-[9px] font-black uppercase tracking-widest text-black">
                                                <th className="p-3">Size Tag</th>
                                                <th className="p-3">Chest (in)</th>
                                                <th className="p-3">Waist (in)</th>
                                                <th className="p-3">Hips (in)</th>
                                                <th className="p-3">Indian standard</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-xs font-semibold text-black/70">
                                            <tr className="border-b border-black/10 hover:bg-zinc-50/50">
                                                <td className="p-3 font-black text-black">S</td>
                                                <td className="p-3">36" - 38"</td>
                                                <td className="p-3">30" - 32"</td>
                                                <td className="p-3">37" - 39"</td>
                                                <td className="p-3">38 (S)</td>
                                            </tr>
                                            <tr className="border-b border-black/10 hover:bg-zinc-50/50">
                                                <td className="p-3 font-black text-black">M</td>
                                                <td className="p-3">38" - 40"</td>
                                                <td className="p-3">32" - 34"</td>
                                                <td className="p-3">39" - 41"</td>
                                                <td className="p-3">40 (M)</td>
                                            </tr>
                                            <tr className="border-b border-black/10 hover:bg-zinc-50/50">
                                                <td className="p-3 font-black text-black">L</td>
                                                <td className="p-3">40" - 42"</td>
                                                <td className="p-3">34" - 36"</td>
                                                <td className="p-3">41" - 43"</td>
                                                <td className="p-3">42 (L)</td>
                                            </tr>
                                            <tr className="border-b border-black/10 hover:bg-zinc-50/50">
                                                <td className="p-3 font-black text-black">XL</td>
                                                <td className="p-3">42" - 44"</td>
                                                <td className="p-3">36" - 38"</td>
                                                <td className="p-3">43" - 45"</td>
                                                <td className="p-3">44 (XL)</td>
                                            </tr>
                                            <tr className="hover:bg-zinc-50/50">
                                                <td className="p-3 font-black text-black">XXL</td>
                                                <td className="p-3">44" - 46"</td>
                                                <td className="p-3">38" - 40"</td>
                                                <td className="p-3">45" - 47"</td>
                                                <td className="p-3">46 (XXL)</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        )}

                        {/* CONTACT US TAB */}
                        {activeTab === 'contact' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col gap-6"
                            >
                                <h1 className="text-3xl font-black uppercase tracking-tight text-black" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                    Contact Studio
                                </h1>
                                <p className="text-sm text-black/60 leading-relaxed font-semibold">
                                    Reach our creative team for bulk requests, custom collaborations, or support.
                                </p>

                                <form onSubmit={handleContactSubmit} className="flex flex-col gap-4 mt-2">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[9px] font-bold uppercase tracking-wider text-black">Your Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={contactForm.name}
                                                onChange={e => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                                                placeholder="John Doe"
                                                className="w-full bg-transparent border border-black/15 px-3.5 py-2.5 text-xs font-semibold text-black outline-none transition-all duration-300 focus:border-black focus:ring-1 focus:ring-black"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[9px] font-bold uppercase tracking-wider text-black">Your Email</label>
                                            <input
                                                type="email"
                                                required
                                                value={contactForm.email}
                                                onChange={e => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                                                placeholder="john@example.com"
                                                className="w-full bg-transparent border border-black/15 px-3.5 py-2.5 text-xs font-semibold text-black outline-none transition-all duration-300 focus:border-black focus:ring-1 focus:ring-black"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[9px] font-bold uppercase tracking-wider text-black">Your Message</label>
                                        <textarea
                                            required
                                            rows={4}
                                            value={contactForm.message}
                                            onChange={e => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                                            placeholder="Write message details..."
                                            className="w-full bg-transparent border border-black/15 px-3.5 py-2.5 text-xs font-semibold text-black outline-none transition-all duration-300 resize-none leading-relaxed focus:border-black focus:ring-1 focus:ring-black"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSending}
                                        className="w-full border border-black bg-black hover:bg-white text-white hover:text-black font-black uppercase tracking-[0.25em] text-[10px] py-4 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:bg-zinc-800 disabled:border-zinc-800 disabled:text-zinc-500"
                                    >
                                        {isSending ? 'COMPILING MESSAGE...' : 'SEND MESSAGE ➔'}
                                    </button>
                                </form>

                                <div className="border-t border-black/10 pt-6 mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-black/60">
                                    <div>
                                        <span className="text-[8px] font-black uppercase tracking-wider text-black/45 block mb-1">STUDIO ADRESS</span>
                                        KARMA Creative Labs,<br />
                                        Bengaluru, Karnataka, India
                                    </div>
                                    <div>
                                        <span className="text-[8px] font-black uppercase tracking-wider text-black/45 block mb-1">EMAIL CHANNELS</span>
                                        studio@karma.io<br />
                                        support@karma.io
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupportPage;
