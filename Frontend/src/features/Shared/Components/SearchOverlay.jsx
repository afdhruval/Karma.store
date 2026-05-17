import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { useProduct } from '../../products/hooks/useProduct';

const SearchOverlay = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const { handleGetAllProducts } = useProduct();
    const products = useSelector((state) => state.product.products) || [];
    
    const [query, setQuery] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const containerRef = useRef(null);
    const inputRef = useRef(null);

    // Fetch products if catalog is empty in store
    useEffect(() => {
        if (isOpen && products.length === 0) {
            handleGetAllProducts();
        }
    }, [isOpen, products.length]);

    // Focus input on mount
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => {
                inputRef.current.focus();
            }, 50);
        }
    }, [isOpen]);

    // Filter products dynamically
    useEffect(() => {
        if (query.trim() === '') {
            setFilteredProducts([]);
            return;
        }

        const normalizedQuery = query.toLowerCase();
        const matches = products.filter((product) => {
            const titleMatch = product.title?.toLowerCase().includes(normalizedQuery);
            const categoryMatch = product.category?.toLowerCase().includes(normalizedQuery);
            const descMatch = product.description?.toLowerCase().includes(normalizedQuery);
            return titleMatch || categoryMatch || descMatch;
        });

        setFilteredProducts(matches);
    }, [query, products]);

    // Handle Click Outside to close
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check if search button was clicked (has id 'nav-search' or matches container)
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                // Ensure we don't trigger onClose if click was on the nav-search icon/button itself
                const searchBtn = document.getElementById('nav-search');
                if (searchBtn && searchBtn.contains(event.target)) {
                    return;
                }
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    // Handle ESC key to close
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const handleProductClick = (productId) => {
        setQuery('');
        onClose();
        navigate(`/product/${productId}`);
    };

    const trendingTags = ['MEN', 'WOMEN', 'OVERSIZED', 'LINEN', 'CARGO'];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    ref={containerRef}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute right-0 top-full mt-3 w-80 sm:w-96 bg-white border border-[#e8e8e8] shadow-2xl p-4 z-50 flex flex-col gap-3.5"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                    {/* Search Input Box */}
                    <div className="relative">
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="SEARCH KARMA..."
                            className="w-full border border-gray-200 px-3 py-2 text-[10px] font-bold uppercase tracking-wider focus:outline-none focus:border-black rounded-none placeholder-gray-400 text-black transition-colors duration-200"
                        />
                        {query && (
                            <button
                                onClick={() => setQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black text-[9px] font-bold uppercase tracking-wider cursor-pointer"
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    {/* Results Container */}
                    <div className="flex flex-col">
                        {query.trim() === '' ? (
                            /* Trending Tag List */
                            <div className="flex flex-col py-1">
                                <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                                    Trending Searches
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                    {trendingTags.map((tag) => (
                                        <button
                                            key={tag}
                                            onClick={() => setQuery(tag)}
                                            className="px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wider border border-gray-200 hover:border-black bg-white text-gray-600 hover:text-black rounded-none cursor-pointer transition-all duration-200"
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            /* Live Results Scroll Panel */
                            <div className="flex flex-col">
                                <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-2">
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                                        Matches ({filteredProducts.length})
                                    </span>
                                </div>

                                {filteredProducts.length > 0 ? (
                                    <div className="max-h-60 overflow-y-auto flex flex-col gap-2 [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-thumb]:bg-gray-300">
                                        {filteredProducts.map((product) => {
                                            const imageUrl = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&q=80';
                                            return (
                                                <div
                                                    key={product._id}
                                                    onClick={() => handleProductClick(product._id)}
                                                    className="flex items-center gap-3 p-1.5 hover:bg-gray-50 cursor-pointer group transition-colors duration-200"
                                                >
                                                    {/* Thumbnail */}
                                                    <img
                                                        src={imageUrl}
                                                        alt={product.title}
                                                        className="w-10 h-12 object-cover object-top bg-gray-100 flex-shrink-0"
                                                    />
                                                    
                                                    {/* Details */}
                                                    <div className="flex flex-col flex-1 justify-center min-w-0">
                                                        <h4 className="text-[10px] font-bold uppercase tracking-tight text-black group-hover:underline line-clamp-1">
                                                            {product.title}
                                                        </h4>
                                                        <span className="text-[10px] text-gray-500 font-semibold mt-0.5">
                                                            ₹{Number(product.price?.amount || 0).toLocaleString('en-IN')}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    /* No matches text */
                                    <div className="py-6 text-center">
                                        <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                                            No products found
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SearchOverlay;
