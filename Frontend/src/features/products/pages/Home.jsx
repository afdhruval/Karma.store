import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useProduct } from '../hooks/useProduct';
import { useNavigate, useSearchParams, Link } from 'react-router';

const Home = () => {
    const products = useSelector(state => state.product.products);
    const { handleGetAllProducts } = useProduct();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeFilter, setActiveFilter] = useState('all'); // all | men | women | new

    // Pick up ?category from URL (from nav links)
    useEffect(() => {
        const cat = searchParams.get('category');
        if (cat === 'men' || cat === 'women') {
            setActiveFilter(cat);
        }
    }, [searchParams]);

    useEffect(() => {
        handleGetAllProducts();
    }, []);

    // Client-side filter
    const filtered = products ? products.filter(p => {
        if (!p.images?.[0]?.url) return false;
        if (activeFilter === 'all' || activeFilter === 'new') return true;
        return p.category === activeFilter;
    }) : [];

    const handleTab = (tab) => {
        setActiveFilter(tab);
        if (tab === 'men' || tab === 'women') {
            setSearchParams({ category: tab });
        } else {
            setSearchParams({});
        }
    };

    return (
        <div className="min-h-screen bg-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            <link
                href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />

            {/* ── Hero Banner ── */}
            <div className="relative w-full overflow-hidden" style={{ backgroundColor: '#0a0a0a', minHeight: '520px' }}>
                <img
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=85"
                    alt="KARMA New Arrivals Campaign"
                    className="absolute inset-0 w-full h-full object-cover object-center opacity-50"
                    style={{ minHeight: '520px' }}
                />
                <div className="relative z-10 flex flex-col items-center justify-center text-center px-6" style={{ minHeight: '520px' }}>
                    <p className="text-[11px] uppercase tracking-[0.3em] text-white/60 mb-4 font-medium">
                        Summer 2025 Drop
                    </p>
                    <h1
                        className="text-5xl md:text-7xl lg:text-8xl font-black uppercase text-white leading-none mb-6"
                        style={{ letterSpacing: '-0.02em' }}
                    >
                        New<br />Arrivals
                    </h1>
                    <p className="text-sm text-white/60 mb-10 max-w-xs font-medium tracking-wide">
                        Fresh drops in aesthetic men's & women's fashion. Own your style.
                    </p>
                    <div className="flex gap-4">
                        <button
                            id="hero-shop-men"
                            onClick={() => handleTab('men')}
                            className="px-8 py-3 text-[11px] font-bold uppercase tracking-[0.2em] bg-white text-black hover:bg-gray-100 transition-colors duration-200"
                        >
                            Shop Men
                        </button>
                        <button
                            id="hero-shop-women"
                            onClick={() => handleTab('women')}
                            className="px-8 py-3 text-[11px] font-bold uppercase tracking-[0.2em] border border-white text-white hover:bg-white hover:text-black transition-colors duration-200"
                        >
                            Shop Women
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Promo Bar ── */}
            <div className="bg-black text-white py-3 flex justify-center gap-8 md:gap-16 px-4 overflow-x-auto">
                {['Free Delivery above ₹999', '10% Off: NEW10', 'Easy 14-Day Returns', '100% Authentic'].map((item, i) => (
                    <span key={i} className="text-[10px] font-semibold tracking-[0.2em] uppercase whitespace-nowrap">
                        {item}
                    </span>
                ))}
            </div>

            {/* ── Category Filter Tabs ── */}
            <div className="border-b" style={{ borderColor: '#e8e8e8' }}>
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 flex items-center gap-0 overflow-x-auto">
                    {[
                        { label: 'All', value: 'all' },
                        { label: 'Men', value: 'men' },
                        { label: 'Women', value: 'women' },
                        { label: 'New', value: 'new' },
                    ].map(tab => (
                        <button
                            key={tab.value}
                            id={`filter-${tab.value}`}
                            onClick={() => handleTab(tab.value)}
                            className="px-5 py-4 text-[11px] font-bold uppercase tracking-[0.16em] whitespace-nowrap transition-all duration-200 border-b-2"
                            style={{
                                borderBottomColor: activeFilter === tab.value ? '#0a0a0a' : 'transparent',
                                color: activeFilter === tab.value ? '#0a0a0a' : '#9a9a9a',
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                    <div className="flex-1" />
                    <span className="text-[10px] text-gray-400 font-medium pr-2 whitespace-nowrap hidden md:block">
                        {filtered.length} products
                    </span>
                </div>
            </div>

            {/* ── Product Grid ── */}
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-10">
                {filtered.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
                        {filtered.map(product => {
                            const imageUrl = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80';

                            // Get unique colors from variants
                            const colors = [];
                            const seen = new Set();
                            (product.variants || []).forEach(v => {
                                const c = v.attributes?.color || v.attributes?.get?.('color');
                                if (c && !seen.has(c)) { seen.add(c); colors.push(c); }
                            });

                            const colorMap = {
                                'Black': '#1a1a1a', 'White': '#f5f5f5', 'Olive': '#6b7c4f', 'Maroon': '#6b2737',
                                'Navy': '#1a2744', 'Beige': '#c8b89a', 'Charcoal': '#3d3d3d', 'Indigo': '#3d4d8c',
                                'Cream': '#f5f0e8', 'Sand': '#c2a97a', 'Sage': '#8a9e7a', 'Sage Green': '#8a9e7a',
                                'Dusty Pink': '#d4a5a5', 'Nude': '#d4b8a5', 'Ivory': '#f8f4ec', 'Rust': '#a05030',
                                'Terracotta': '#c46040', 'Lavender': '#b8a0cc', 'Champagne': '#d4c08a',
                                'Mocha': '#8a6a58', 'Ecru': '#ece5d4', 'Khaki': '#b0a078', 'Faded Grey': '#9a9a9a',
                                'Light Wash': '#a8b8d8', 'Washed Black': '#2a2a2a', 'Washed White': '#e8e4dc',
                                'Sky Blue': '#7ab0d0', 'Blue Print': '#3a5080', 'Black Print': '#1a1a1a',
                                'Rust Print': '#a05030', 'Blue Floral': '#5078a8', 'Pink Floral': '#d48090',
                                'White Floral': '#f0ece4', 'Washed Black': '#2a2a2a', 'Indigo': '#3d4d8c',
                            };

                            return (
                                <div
                                    key={product._id}
                                    id={`product-card-${product._id}`}
                                    onClick={() => navigate(`/product/${product._id}`)}
                                    className="group cursor-pointer"
                                >
                                    {/* Image */}
                                    <div className="relative aspect-[3/4] overflow-hidden bg-[#f4f4f4] mb-3">
                                        <img
                                            src={imageUrl}
                                            alt={product.title}
                                            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                            loading="lazy"
                                            onError={(e) => {
                                                const el = document.getElementById(`product-card-${product._id}`);
                                                if (el) el.style.display = 'none';
                                            }}
                                        />

                                        {/* Badge */}
                                        {product.category && (
                                            <div
                                                className="absolute top-2 left-2 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white"
                                                style={{ backgroundColor: '#0a0a0a' }}
                                            >
                                                {product.category}
                                            </div>
                                        )}

                                        {/* Wishlist */}
                                        <button
                                            onClick={e => e.stopPropagation()}
                                            className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:text-red-500"
                                            aria-label="Add to wishlist"
                                        >
                                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                            </svg>
                                        </button>

                                        {/* Quick Shop hover overlay */}
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/90 text-white text-[10px] font-bold uppercase tracking-[0.2em] text-center py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                            Quick View
                                        </div>
                                    </div>

                                    {/* Product Info */}
                                    <div>
                                        <h3
                                            className="text-[12px] font-bold uppercase tracking-tight leading-snug mb-1 line-clamp-1 group-hover:underline"
                                            style={{ color: '#0a0a0a' }}
                                        >
                                            {product.title}
                                        </h3>

                                        {/* Price */}
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-[13px] font-bold" style={{ color: '#0a0a0a' }}>
                                                ₹{Number(product.price?.amount || 0).toLocaleString('en-IN')}
                                            </span>
                                        </div>

                                        {/* Color Swatches */}
                                        {colors.length > 0 && (
                                            <div className="flex items-center gap-1.5">
                                                {colors.slice(0, 5).map(c => (
                                                    <div
                                                        key={c}
                                                        title={c}
                                                        className="w-3.5 h-3.5 rounded-full border border-gray-300 flex-shrink-0"
                                                        style={{ backgroundColor: colorMap[c] || '#ccc' }}
                                                    />
                                                ))}
                                                {colors.length > 5 && (
                                                    <span className="text-[10px] text-gray-400 font-medium">+{colors.length - 5}</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32">
                        <p className="text-[11px] uppercase tracking-[0.25em] text-gray-400 mb-3 font-semibold">
                            No products found
                        </p>
                        <p className="text-sm text-gray-400 text-center max-w-xs">
                            {products && products.length === 0
                                ? 'The store is being stocked. Check back soon.'
                                : 'No products match this filter.'}
                        </p>
                    </div>
                )}
            </div>

            {/* ── Footer ── */}
            <footer className="border-t mt-16" style={{ borderColor: '#e8e8e8', backgroundColor: '#0a0a0a' }}>
                <div className="max-w-screen-xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <p className="text-lg font-black uppercase tracking-[0.15em] text-white mb-3" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                            # KARMA
                        </p>
                        <p className="text-[11px] text-gray-400 leading-relaxed">
                            Aesthetic clothing for men and women. Own your style.
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-4">Quick Links</p>
                        <div className="flex flex-col gap-2">
                            <Link to="/?category=men" className="text-[11px] text-gray-400 hover:text-white transition-colors">Men</Link>
                            <Link to="/?category=women" className="text-[11px] text-gray-400 hover:text-white transition-colors">Women</Link>
                            <Link to="/" className="text-[11px] text-gray-400 hover:text-white transition-colors">New Arrivals</Link>
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-4">Support</p>
                        <div className="flex flex-col gap-2">
                            <Link to="/shipping-policy" className="text-[11px] text-gray-400 hover:text-white transition-colors">Shipping Policy</Link>
                            <Link to="/returns" className="text-[11px] text-gray-400 hover:text-white transition-colors">Returns</Link>
                            <Link to="/size-guide" className="text-[11px] text-gray-400 hover:text-white transition-colors">Size Guide</Link>
                            <Link to="/contact" className="text-[11px] text-gray-400 hover:text-white transition-colors">Contact Us</Link>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-800 text-center py-4">
                    <span className="text-[10px] text-gray-600 font-medium uppercase tracking-[0.2em]">
                        KARMA © {new Date().getFullYear()} — All Rights Reserved
                    </span>
                </div>
            </footer>
        </div>
    );
};

export default Home;