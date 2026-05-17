import React, { useState } from 'react';
import { useAuth } from "../hook/useAuth";
import { useNavigate } from 'react-router';
import ContinueWithGoogle from '../components/ContinueWithGoogle';
import { motion } from 'framer-motion';

const Register = () => {
    const { handleRegister } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: '',
        contactNumber: '',
        email: '',
        password: '',
        isSeller: false
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setError('');
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Frontend validation
        if (formData.fullName.trim().length < 3) {
            setError('Full name must be at least 3 characters long.');
            return;
        }
        if (!/^\d{10}$/.test(formData.contactNumber)) {
            setError('Contact must be a 10-digit number (no spaces or country code).');
            return;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        try {
            setLoading(true);
            await handleRegister({
                email: formData.email,
                contact: formData.contactNumber,
                password: formData.password,
                isSeller: formData.isSeller,
                fullname: formData.fullName
            });
            navigate("/");
        } catch (err) {
            const serverErrors = err?.response?.data?.errors;
            if (serverErrors && serverErrors.length > 0) {
                setError(serverErrors.map(e => e.msg).join(' • '));
            } else {
                setError(err?.response?.data?.message || 'Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Google Fonts */}
            <link
                href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,700;0,900;1,900&family=Outfit:wght@300;400;600;900&display=swap"
                rel="stylesheet"
            />

            <div
                className="min-h-screen flex flex-col lg:flex-row selection:bg-black selection:text-white"
                style={{ backgroundColor: '#ffffff', fontFamily: "'Outfit', sans-serif" }}
            >
                {/* ── LEFT PANEL: THE CANVASES OF STREETWEAR ── */}
                <div className="hidden lg:flex lg:w-1/2 relative bg-[#0a0a0a] overflow-hidden flex-col justify-between p-12">
                    {/* Industrial background grids */}
                    <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
                        backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
                        backgroundSize: '24px 24px'
                    }} />

                    {/* Drifting Vertical Typography */}
                    <motion.div 
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 0.03 }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                        className="absolute left-6 top-1/2 -translate-y-1/2 select-none pointer-events-none text-[6vw] font-black uppercase tracking-[0.25em] text-white writing-mode-vertical"
                        style={{ transformOrigin: 'left center', writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                    >
                        KARMA
                    </motion.div>

                    {/* Top metadata */}
                    <div className="z-10 flex items-center justify-between">
                        <span className="text-[9px] font-bold tracking-[0.3em] text-white/50 uppercase">KARMA STORE</span>
                        <span className="text-[9px] font-bold tracking-[0.2em] text-white/30 uppercase">EST. 2026</span>
                    </div>

                    {/* Central High-Contrast Poster Panel (Sized down for 67% layout look) */}
                    <motion.div 
                        initial={{ scale: 0.96, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="relative w-full max-w-[290px] mx-auto aspect-[3/4] border border-white/20 p-2.5 self-center z-10"
                    >
                        <div className="w-full h-full relative overflow-hidden bg-zinc-900 border border-white/5">
                            <img
                                src="/snitch_editorial_warm.png"
                                alt="Karma Streetwear Visual"
                                className="w-full h-full object-cover object-top filter contrast-[1.05] grayscale brightness-[0.85]"
                            />
                            {/* Dark gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                            
                            {/* Poster text */}
                            <div className="absolute bottom-5 left-5 right-5">
                                <span className="text-[9px] font-bold text-white/50 tracking-widest block uppercase mb-1">
                                    // AESTHETIC WEAR
                                </span>
                                <h2 className="text-xl font-black text-white uppercase tracking-tight leading-none mb-2">
                                    UNORTHODOX<br/>COLLECTION
                                </h2>
                                <p className="text-[9px] text-white/40 tracking-wider uppercase max-w-[200px] leading-relaxed">
                                    Discover the next generation of raw streetwear styling.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Bottom elements */}
                    <div className="z-10 flex justify-between items-end">
                        <span className="text-[9px] font-bold tracking-[0.15em] text-white/30 uppercase">// SECURE CHNL</span>
                        <span className="text-[8px] font-bold tracking-widest text-white/20 uppercase">SSL ENCRYPTED</span>
                    </div>
                </div>

                {/* ── RIGHT PANEL: THE INDUSTRIAL ENTRY DIVISION (Sized down for 67% layout look) ── */}
                <div className="w-full lg:w-1/2 flex items-center justify-center min-h-screen px-6 sm:px-12 py-12 bg-white relative">
                    {/* Technical grid backdrop */}
                    <div className="absolute inset-0 opacity-3 pointer-events-none" style={{
                        backgroundImage: 'radial-gradient(circle, #000000 1px, transparent 1px)',
                        backgroundSize: '24px 24px'
                    }} />

                    {/* Return to Shop Button (Mobile and Desktop) */}
                    <button
                        onClick={() => navigate("/")}
                        className="absolute top-6 left-6 z-20 flex items-center gap-1.5 group px-2.5 py-1.5 border border-black/10 hover:border-black transition-all duration-300 cursor-pointer bg-white/80 backdrop-blur-sm"
                        style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                        <svg className="w-3 h-3 transition-transform duration-200 group-hover:-translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-black">Back to Shop</span>
                    </button>

                    {/* Compact Form Container */}
                    <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="w-full max-w-[340px] border border-black/15 p-6 sm:p-8 relative bg-white my-6"
                    >
                        {/* Title Header */}
                        <div className="mb-5 border-b border-black/10 pb-3.5">
                            <h1 className="text-xl font-black uppercase tracking-wider text-black leading-none mb-1.5" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                Create Account
                            </h1>
                            <p className="text-[10px] font-semibold tracking-wide text-black/50 uppercase">
                                Create your account with KARMA.
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            
                            {/* Error Warning Banner */}
                            {error && (
                                <motion.div 
                                    initial={{ scale: 0.97, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="border border-red-500 bg-red-50 text-red-600 p-3 text-[9px] tracking-wide font-bold uppercase"
                                >
                                    ⚠️ [ ERROR ]
                                    <p className="mt-1 normal-case font-medium text-[11px] text-red-700">{error}</p>
                                </motion.div>
                            )}

                            {/* Full Name */}
                            <div className="flex flex-col gap-1">
                                <label 
                                    htmlFor="reg-fullName"
                                    className="text-[9px] font-bold uppercase tracking-[0.15em] text-black"
                                >
                                    Full Name
                                </label>
                                <input 
                                    id="reg-fullName"
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                    placeholder="Your Name"
                                    className="w-full bg-transparent border border-black/15 px-3 py-2 text-xs font-semibold text-black outline-none transition-all duration-300 focus:border-black focus:ring-1 focus:ring-black"
                                    style={{ fontFamily: "'Outfit', sans-serif" }}
                                />
                            </div>

                            {/* Contact Number */}
                            <div className="flex flex-col gap-1">
                                <label 
                                    htmlFor="reg-contact"
                                    className="text-[9px] font-bold uppercase tracking-[0.15em] text-black"
                                >
                                    Contact Number
                                </label>
                                <input 
                                    id="reg-contact"
                                    type="tel"
                                    name="contactNumber"
                                    value={formData.contactNumber}
                                    onChange={handleChange}
                                    required
                                    placeholder="10-Digit Contact"
                                    className="w-full bg-transparent border border-black/15 px-3 py-2 text-xs font-semibold text-black outline-none transition-all duration-300 focus:border-black focus:ring-1 focus:ring-black"
                                />
                            </div>

                            {/* Email Address */}
                            <div className="flex flex-col gap-1">
                                <label 
                                    htmlFor="reg-email"
                                    className="text-[9px] font-bold uppercase tracking-[0.15em] text-black"
                                >
                                    Email Address
                                </label>
                                <input 
                                    id="reg-email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="yourname@email.com"
                                    className="w-full bg-transparent border border-black/15 px-3 py-2 text-xs font-semibold text-black outline-none transition-all duration-300 focus:border-black focus:ring-1 focus:ring-black"
                                />
                            </div>

                            {/* Password */}
                            <div className="flex flex-col gap-1">
                                <label 
                                    htmlFor="reg-password"
                                    className="text-[9px] font-bold uppercase tracking-[0.15em] text-black"
                                >
                                    Password
                                </label>
                                <input 
                                    id="reg-password"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="••••••••"
                                    className="w-full bg-transparent border border-black/15 px-3 py-2 text-xs font-semibold text-black outline-none transition-all duration-300 focus:border-black focus:ring-1 focus:ring-black"
                                />
                            </div>

                            {/* Custom styled checkbox */}
                            <label
                                htmlFor="reg-isSeller"
                                className="flex items-center gap-2.5 cursor-pointer group mt-0.5"
                            >
                                <div className="relative flex-shrink-0">
                                    <input
                                        id="reg-isSeller"
                                        type="checkbox"
                                        name="isSeller"
                                        checked={formData.isSeller}
                                        onChange={handleChange}
                                        className="peer sr-only"
                                    />
                                    {/* Custom checkbox */}
                                    <div
                                        className="w-4 h-4 border border-black flex items-center justify-center peer-checked:bg-black transition-all duration-200"
                                    >
                                        {formData.isSeller && (
                                            <svg className="w-2.5 h-2.5" viewBox="0 0 12 12" fill="none">
                                                <path d="M2 6l3 3 5-5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                                <span className="text-[9px] font-bold uppercase tracking-wider text-black/70 group-hover:text-black transition-colors duration-200">
                                    Register as Seller
                                </span>
                            </label>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full border border-black bg-black hover:bg-white text-white hover:text-black font-black uppercase tracking-[0.25em] text-[10px] py-3.5 mt-2 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:bg-zinc-800 disabled:border-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed"
                                style={{ fontFamily: "'Outfit', sans-serif" }}
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-3 w-3 text-current" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Creating Account...
                                    </>
                                ) : (
                                    <span>Sign Up ➔</span>
                                )}
                            </button>

                            {/* Divider */}
                            <div className="flex items-center gap-3 my-0.5">
                                <div className="flex-1 h-[1px] bg-black/10" />
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-black/30">OR</span>
                                <div className="flex-1 h-[1px] bg-black/10" />
                            </div>

                            {/* Google SSO */}
                            <ContinueWithGoogle />

                            {/* Navigation Footer */}
                            <p className="text-center text-[9px] font-bold uppercase tracking-wider text-black/45 mt-2">
                                Already have an account?{' '}
                                <a 
                                    href="/login"
                                    className="text-black hover:underline underline-offset-4 font-black tracking-widest uppercase transition-all duration-200"
                                >
                                    Sign In ➔
                                </a>
                            </p>
                        </form>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default Register;