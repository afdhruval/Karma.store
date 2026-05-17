import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useProduct } from '../hooks/useProduct';
import { motion } from 'framer-motion';

const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP'];
const MAX_IMAGES = 7;

const CreateProduct = () => {
    const { handleCreateProduct } = useProduct();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priceAmount: '',
        priceCurrency: 'INR',
    });
    const [images, setImages] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const addFiles = (files) => {
        const remaining = MAX_IMAGES - images.length;
        if (remaining <= 0) return;
        const toAdd = Array.from(files).slice(0, remaining);
        const newImages = toAdd.map(file => ({ file, preview: URL.createObjectURL(file) }));
        setImages(prev => [...prev, ...newImages]);
    };

    const handleFileChange = (e) => {
        addFiles(e.target.files);
        e.target.value = '';
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
    }, [images]);

    const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = () => setIsDragging(false);

    const removeImage = (index) => {
        setImages(prev => {
            const updated = [...prev];
            URL.revokeObjectURL(updated[index].preview);
            updated.splice(index, 1);
            return updated;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('priceAmount', formData.priceAmount);
            data.append('priceCurrency', formData.priceCurrency);
            images.forEach(img => data.append('images', img.file));
            await handleCreateProduct(data);
            navigate('/seller/dashboard');
        } catch (err) {
            console.error('Failed to create product', err);
        } finally {
            setIsSubmitting(false);
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
                className="min-h-screen selection:bg-black selection:text-white pb-24"
                style={{ backgroundColor: '#ffffff', fontFamily: "'Outfit', sans-serif" }}
            >
                {/* Background grids */}
                <div className="absolute inset-0 opacity-3 pointer-events-none" style={{
                    backgroundImage: 'radial-gradient(circle, #000000 1px, transparent 1px)',
                    backgroundSize: '24px 24px'
                }} />

                <div className="max-w-4xl mx-auto px-6 sm:px-8 relative z-10">

                    {/* ── Top Bar ── */}
                    <div className="pt-10 pb-0 flex items-center justify-between border-b border-black/10 pb-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="text-xs font-bold uppercase tracking-widest text-black/50 hover:text-black transition-colors duration-200 flex items-center gap-1.5"
                        >
                            ← Back
                        </button>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66] animate-pulse" />
                            <span
                                className="text-[10px] font-black tracking-[0.25em] uppercase text-black"
                                style={{ fontFamily: "'Montserrat', sans-serif" }}
                            >
                                KARMA STUDIO
                            </span>
                        </div>
                    </div>

                    {/* ── Page Header ── */}
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="pt-10 pb-0"
                    >
                        <span className="text-[9px] font-black uppercase tracking-[0.25em] text-black/40 block mb-1">
                            // COMPILER DIVISION
                        </span>
                        <h1
                            className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black leading-none"
                            style={{ fontFamily: "'Montserrat', sans-serif" }}
                        >
                            New Listing
                        </h1>
                    </motion.div>

                    {/* ── Form Wrap inside a premium border frame ── */}
                    <form onSubmit={handleSubmit} className="pt-10">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                            {/* ── LEFT COLUMN: Text Fields (8 Columns) ── */}
                            <div className="lg:col-span-7 flex flex-col gap-6 border border-black/15 p-6 sm:p-8 bg-white relative">
                                <div className="absolute -top-3 left-4 bg-black text-white text-[8px] font-black tracking-[0.2em] px-2 py-1 uppercase">
                                    [ PRODUCT INFO ]
                                </div>

                                {/* Product Title */}
                                <div className="flex flex-col gap-1.5 mt-2">
                                    <label
                                        htmlFor="cp-title"
                                        className="text-[9px] font-bold uppercase tracking-[0.15em] text-black"
                                    >
                                        Product Title
                                    </label>
                                    <input
                                        id="cp-title"
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g. Oversized Linen Shirt"
                                        className="w-full bg-transparent border border-black/15 px-3.5 py-2.5 text-xs font-semibold text-black outline-none transition-all duration-300 focus:border-black focus:ring-1 focus:ring-black"
                                    />
                                </div>

                                {/* Description */}
                                <div className="flex flex-col gap-1.5">
                                    <label
                                        htmlFor="cp-description"
                                        className="text-[9px] font-bold uppercase tracking-[0.15em] text-black"
                                    >
                                        Description
                                    </label>
                                    <textarea
                                        id="cp-description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                        rows={4}
                                        placeholder="Describe the product — material, fit, details..."
                                        className="w-full bg-transparent border border-black/15 px-3.5 py-2.5 text-xs font-semibold text-black outline-none transition-all duration-300 resize-none leading-relaxed focus:border-black focus:ring-1 focus:ring-black"
                                    />
                                </div>

                                {/* Price Grid */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[9px] font-bold uppercase tracking-[0.15em] text-black">
                                        Pricing
                                    </label>
                                    <div className="flex gap-4">
                                        {/* Amount */}
                                        <div className="flex-[3] flex flex-col gap-1">
                                            <span className="text-[8px] font-bold uppercase tracking-wider text-black/45">Amount (INR)</span>
                                            <input
                                                id="cp-priceAmount"
                                                type="number"
                                                name="priceAmount"
                                                value={formData.priceAmount}
                                                onChange={handleChange}
                                                required
                                                min="0"
                                                step="0.01"
                                                placeholder="0.00"
                                                className="w-full bg-transparent border border-black/15 px-3.5 py-2.5 text-xs font-semibold text-black outline-none transition-all duration-300 focus:border-black focus:ring-1 focus:ring-black"
                                            />
                                        </div>
                                        {/* Currency */}
                                        <div className="flex-[1.5] flex flex-col gap-1">
                                            <span className="text-[8px] font-bold uppercase tracking-wider text-black/45">Currency</span>
                                            <select
                                                id="cp-priceCurrency"
                                                name="priceCurrency"
                                                value={formData.priceCurrency}
                                                onChange={handleChange}
                                                className="w-full bg-transparent border border-black/15 px-3.5 py-2.5 text-xs font-semibold text-black outline-none cursor-pointer appearance-none transition-all duration-300 focus:border-black"
                                            >
                                                {CURRENCIES.map(c => (
                                                    <option key={c} value={c} style={{ backgroundColor: '#ffffff', color: '#000000' }}>{c}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── RIGHT COLUMN: Images (5 Columns) ── */}
                            <div className="lg:col-span-5 flex flex-col gap-6 border border-black/15 p-6 bg-white relative">
                                <div className="absolute -top-3 left-4 bg-black text-white text-[8px] font-black tracking-[0.2em] px-2 py-1 uppercase">
                                    [ IMAGES DROP ]
                                </div>

                                <div className="flex items-center justify-between mt-2">
                                    <label className="text-[9px] font-bold uppercase tracking-[0.15em] text-black">
                                        Drop Assets
                                    </label>
                                    <span className="text-[9px] font-bold text-black/40">
                                        {images.length}/{MAX_IMAGES}
                                    </span>
                                </div>

                                {/* Drop Zone */}
                                {images.length < MAX_IMAGES && (
                                    <div
                                        onDrop={handleDrop}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border border-dashed border-black/15 px-4 py-10 flex flex-col items-center gap-3.5 cursor-pointer transition-all duration-300 hover:border-black"
                                        style={{
                                            backgroundColor: isDragging ? 'rgba(0,0,0,0.02)' : 'transparent'
                                        }}
                                    >
                                        {/* Upload icon */}
                                        <div
                                            className="w-8 h-8 flex items-center justify-center border border-black/15 text-black/45"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                            </svg>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[11px] leading-relaxed text-black/60 font-semibold">
                                                Drop files or{' '}
                                                <span className="text-black underline underline-offset-2 font-bold">
                                                    tap to browse
                                                </span>
                                            </p>
                                            <p className="text-[8px] uppercase tracking-wider text-black/30 mt-1">
                                                Maximum {MAX_IMAGES} images
                                            </p>
                                        </div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                    </div>
                                )}

                                {/* Image Previews Grid */}
                                {images.length > 0 && (
                                    <div className="grid grid-cols-3 gap-2 mt-1">
                                        {images.map((img, index) => (
                                            <div
                                                key={index}
                                                className="relative aspect-square overflow-hidden group border border-black/10"
                                            >
                                                <img
                                                    src={img.preview}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                {/* Remove overlay */}
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[8px] font-black tracking-widest uppercase cursor-pointer"
                                                    style={{ backgroundColor: 'rgba(0,0,0,0.7)', color: '#ffffff' }}
                                                    aria-label={`Remove image ${index + 1}`}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ── Submit Button ── */}
                        <div className="mt-8">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full border border-black bg-black hover:bg-white text-white hover:text-black font-black uppercase tracking-[0.25em] text-[10px] py-4 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:bg-zinc-800 disabled:border-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed"
                                style={{ fontFamily: "'Outfit', sans-serif" }}
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin h-3.5 w-3.5 text-current" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        PUBLISHING DROPS...
                                    </>
                                ) : (
                                    <span>PUBLISH PRODUCT LISTING ➔</span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CreateProduct;