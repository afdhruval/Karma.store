import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { useProduct } from '../hooks/useProduct';
import { useCart } from '../../cart/hook/useCart';
import { useToast } from '../../Shared/Components/ToastContext';

const colorMap = {
    'Black': '#1a1a1a', 'White': '#f5f5f5', 'Olive': '#6b7c4f', 'Maroon': '#6b2737',
    'Navy': '#1a2744', 'Beige': '#c8b89a', 'Charcoal': '#3d3d3d', 'Indigo': '#3d4d8c',
    'Cream': '#f5f0e8', 'Sand': '#c2a97a', 'Sage': '#8a9e7a', 'Sage Green': '#8a9e7a',
    'Dusty Pink': '#d4a5a5', 'Nude': '#d4b8a5', 'Ivory': '#f8f4ec', 'Rust': '#a05030',
    'Terracotta': '#c46040', 'Lavender': '#b8a0cc', 'Champagne': '#d4c08a',
    'Mocha': '#8a6a58', 'Ecru': '#ece5d4', 'Khaki': '#b0a078', 'Faded Grey': '#9a9a9a',
    'Light Wash': '#a8b8d8', 'Washed Black': '#2a2a2a', 'Washed White': '#e8e4dc',
    'Green': '#228B22', 'Red': '#e63946', 'Off White': '#fdfcf0', 'Grey': '#808080', 
    'Blue': '#4169e1', 'Brown': '#8B4513', 'Tan': '#D2B48C', 'Yellow': '#FFD700',
    'Pink': '#FFC0CB', 'Orange': '#FFA500', 'Purple': '#800080', 'Teal': '#008080',
    'Burgundy': '#800020', 'Mustard': '#FFDB58', 'Peach': '#FFE5B4',
};

const ProductDetail = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedAttributes, setSelectedAttributes] = useState({});
    const [addedToCart, setAddedToCart] = useState(false);
    const [openAccordion, setOpenAccordion] = useState('details');
    const navigate = useNavigate();
    const { handleGetProductById } = useProduct();
    const { handleAddItem } = useCart();
    const { showToast } = useToast();

    async function fetchProductDetails() {
        try {
            const data = await handleGetProductById(productId);
            setProduct(data?.product || data);
        } catch (error) {
            console.error("Failed to fetch product details", error);
        }
    }

    useEffect(() => {
        fetchProductDetails();
    }, [productId]);

    useEffect(() => {
        if (product?.variants?.length > 0) {
            setSelectedAttributes(product.variants[0].attributes || {});
        }
    }, [product]);

    const activeVariant = useMemo(() => {
        if (!product?.variants || product.variants.length === 0) return null;
        return product.variants.find(v => {
            if (!v.attributes) return false;
            const vKeys = Object.keys(v.attributes);
            const sKeys = Object.keys(selectedAttributes);
            const isMatch = vKeys.every(k => v.attributes[k] === selectedAttributes[k]);
            return vKeys.length === sKeys.length && isMatch;
        });
    }, [product, selectedAttributes]);

    const availableAttributes = useMemo(() => {
        if (!product?.variants) return {};
        const attrs = {};
        product.variants.forEach(variant => {
            if (variant.attributes) {
                Object.entries(variant.attributes).forEach(([key, value]) => {
                    if (!attrs[key]) attrs[key] = new Set();
                    attrs[key].add(value);
                });
            }
        });
        Object.keys(attrs).forEach(key => { attrs[key] = Array.from(attrs[key]); });
        return attrs;
    }, [product]);

    useEffect(() => { setSelectedImage(0); }, [activeVariant]);

    const handleAttributeChange = (attrName, value) => {
        const newAttrs = { ...selectedAttributes, [attrName]: value };
        const exactMatch = product.variants.find(v => {
            const vAttrs = v.attributes || {};
            return Object.keys(newAttrs).every(k => newAttrs[k] === vAttrs[k]) &&
                Object.keys(vAttrs).every(k => newAttrs[k] === vAttrs[k]);
        });
        if (exactMatch) {
            setSelectedAttributes(exactMatch.attributes);
        } else {
            const fallback = product.variants.find(v => v.attributes && v.attributes[attrName] === value);
            setSelectedAttributes(fallback ? fallback.attributes : newAttrs);
        }
    };

    const handleAddToCart = () => {
        let variantToAdd = activeVariant;
        if (!variantToAdd && product?.variants?.length > 0) {
            variantToAdd = product.variants[0];
        }
        handleAddItem({ productId: product._id, variantId: variantToAdd?._id });
        setAddedToCart(true);
        showToast("I stored your product in the bag!", "cart");
        setTimeout(() => setAddedToCart(false), 2000);
    };

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-gray-400"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}>Loading...</p>
                </div>
            </div>
        );
    }

    const displayImages = (activeVariant?.images?.length > 0)
        ? activeVariant.images
        : (product.images?.length > 0 ? product.images : [{ url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80' }]);

    const displayPrice = activeVariant?.price?.amount ? activeVariant.price : product.price;

    const accordionItems = [
        {
            id: 'details',
            label: 'Product Details',
            content: product.description
        },
        {
            id: 'sizing',
            label: 'Size Guide',
            content: 'XS: Chest 34" / S: Chest 36" / M: Chest 38" / L: Chest 40" / XL: Chest 42" / XXL: Chest 44". Measurements are in inches. For the best fit, measure across your chest at the widest point.'
        },
        {
            id: 'returns',
            label: 'Shipping & Returns',
            content: 'Free delivery on orders above ₹999. Estimated delivery: 3–7 business days. Easy returns within 14 days of delivery. Item must be unworn and in original packaging.'
        },
    ];

    return (
        <div className="min-h-screen bg-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            <link
                href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />

            {/* Breadcrumb */}
            <div className="border-b" style={{ borderColor: '#e8e8e8' }}>
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">
                    <Link to="/" className="hover:text-black transition-colors">Home</Link>
                    <span>/</span>
                    <span className="text-black">{product.title}</span>
                </div>
            </div>

            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8 lg:py-14">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">

                    {/* ── LEFT: Image Gallery ── */}
                    <div className="w-full lg:w-[58%] flex flex-col-reverse md:flex-row gap-3">

                        {/* Thumbnail Strip */}
                        {displayImages.length > 1 && (
                            <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[600px] flex-shrink-0 md:w-[72px] pb-1 md:pb-0 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                {displayImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className="flex-shrink-0 overflow-hidden transition-all duration-200"
                                        style={{
                                            width: '64px', aspectRatio: '3/4',
                                            border: selectedImage === idx ? '2px solid #0a0a0a' : '2px solid transparent',
                                            opacity: selectedImage === idx ? 1 : 0.5,
                                            backgroundColor: '#f4f4f4'
                                        }}
                                    >
                                        <img src={img.url} alt={`View ${idx + 1}`} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Main Image */}
                        <div className="relative flex-1 overflow-hidden group bg-[#f4f4f4]" style={{ aspectRatio: '3/4' }}>
                            <img
                                src={displayImages[selectedImage]?.url || displayImages[0]?.url}
                                alt={product.title}
                                className="w-full h-full object-cover object-top transition-all duration-500"
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                            {/* Category badge */}
                            {product.category && (
                                <div className="absolute top-3 left-3 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white bg-black">
                                    {product.category}
                                </div>
                            )}
                            {/* Arrow nav */}
                            {displayImages.length > 1 && (
                                <>
                                    <button
                                        onClick={() => setSelectedImage(p => p === 0 ? displayImages.length - 1 : p - 1)}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-gray-200 hover:bg-gray-50"
                                    >
                                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" d="M15 19l-7-7 7-7" /></svg>
                                    </button>
                                    <button
                                        onClick={() => setSelectedImage(p => p === displayImages.length - 1 ? 0 : p + 1)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-gray-200 hover:bg-gray-50"
                                    >
                                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" d="M9 5l7 7-7 7" /></svg>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* ── RIGHT: Product Details ── */}
                    <div className="w-full lg:w-[42%] lg:sticky lg:top-24 flex flex-col">

                        {/* Title */}
                        <h1 className="text-2xl md:text-3xl font-black uppercase leading-tight mb-3" style={{ color: '#0a0a0a', letterSpacing: '-0.01em' }}>
                            {product.title}
                        </h1>

                        {/* Price */}
                        <div className="flex items-baseline gap-3 mb-5">
                            <span className="text-xl font-bold" style={{ color: '#0a0a0a' }}>
                                ₹{Number(displayPrice?.amount || 0).toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400">
                                Incl. of all taxes
                            </span>
                        </div>

                        {/* Coupon hint */}
                        <div className="flex items-center gap-2 mb-5 px-3 py-2.5 bg-gray-50 border border-dashed border-gray-300">
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>
                            <span className="text-[10px] font-semibold text-gray-600 tracking-wide">Use <strong>NEW10</strong> for 10% off on your first order</span>
                        </div>

                        <div className="h-px bg-gray-200 mb-5" />

                        {/* Variant Selectors */}
                        {Object.entries(availableAttributes).map(([attrName, values]) => {
                            const isColor = attrName.toLowerCase() === 'color';
                            return (
                                <div key={attrName} className="mb-5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: '#0a0a0a' }}>
                                            {attrName}
                                        </h3>
                                        {isColor && (
                                            <span className="text-[10px] text-gray-400 font-medium">
                                                — {selectedAttributes[attrName] || ''}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {values.map(val => {
                                            const isSelected = selectedAttributes[attrName] === val;
                                            if (isColor) {
                                                return (
                                                    <button
                                                        key={val}
                                                        title={val}
                                                        onClick={() => handleAttributeChange(attrName, val)}
                                                        className="w-8 h-8 rounded-full transition-all duration-200 flex-shrink-0"
                                                        style={{
                                                            backgroundColor: colorMap[val] || '#ccc',
                                                            border: isSelected ? '3px solid #0a0a0a' : '2px solid #e8e8e8',
                                                            boxShadow: isSelected ? '0 0 0 2px white, 0 0 0 4px #0a0a0a' : 'none',
                                                            transform: isSelected ? 'scale(1.1)' : 'scale(1)'
                                                        }}
                                                    />
                                                );
                                            }
                                            return (
                                                <button
                                                    key={val}
                                                    onClick={() => handleAttributeChange(attrName, val)}
                                                    className="px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] transition-all duration-200 border"
                                                    style={{
                                                        backgroundColor: isSelected ? '#0a0a0a' : 'white',
                                                        color: isSelected ? 'white' : '#0a0a0a',
                                                        borderColor: isSelected ? '#0a0a0a' : '#d8d8d8',
                                                        minWidth: '44px',
                                                    }}
                                                >
                                                    {val}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Stock */}
                        {activeVariant && (
                            <div className="mb-5">
                                <span className={`text-[10px] font-bold uppercase tracking-[0.15em] ${activeVariant.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                    {activeVariant.stock > 5 ? `In Stock` : activeVariant.stock > 0 ? `Only ${activeVariant.stock} left!` : 'Out of Stock'}
                                </span>
                            </div>
                        )}

                        {/* CTA Buttons */}
                        <div className="flex flex-col gap-3 mb-8">
                            <button
                                id="add-to-cart-btn"
                                onClick={handleAddToCart}
                                disabled={activeVariant && activeVariant.stock === 0}
                                className="w-full py-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2"
                                style={{
                                    backgroundColor: addedToCart ? '#16a34a' : '#0a0a0a',
                                    color: 'white',
                                    cursor: (activeVariant && activeVariant.stock === 0) ? 'not-allowed' : 'pointer',
                                    opacity: (activeVariant && activeVariant.stock === 0) ? 0.5 : 1,
                                }}
                            >
                                {addedToCart ? (
                                    <>
                                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                        Added to Bag!
                                    </>
                                ) : 'Add to Bag'}
                            </button>
                            <button
                                id="buy-now-btn"
                                onClick={() => alert("Buy Now — coming soon!")}
                                className="w-full py-4 text-[11px] font-black uppercase tracking-[0.2em] border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-colors duration-300"
                            >
                                Buy Now
                            </button>
                        </div>

                        {/* Accordion */}
                        <div className="border-t" style={{ borderColor: '#e8e8e8' }}>
                            {accordionItems.map(item => (
                                <div key={item.id} className="border-b" style={{ borderColor: '#e8e8e8' }}>
                                    <button
                                        className="w-full flex items-center justify-between py-4 text-left"
                                        onClick={() => setOpenAccordion(openAccordion === item.id ? null : item.id)}
                                    >
                                        <span className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: '#0a0a0a' }}>
                                            {item.label}
                                        </span>
                                        <svg
                                            width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                                            className="flex-shrink-0 transition-transform duration-200"
                                            style={{ transform: openAccordion === item.id ? 'rotate(180deg)' : 'rotate(0deg)' }}
                                        >
                                            <path strokeLinecap="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    {openAccordion === item.id && (
                                        <p className="pb-4 text-[12px] leading-relaxed text-gray-500 font-medium">
                                            {item.content}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Trust Badges */}
                        <div className="mt-6 grid grid-cols-3 gap-3">
                            {[
                                { icon: '🚚', label: 'Free Delivery', sub: 'Above ₹999' },
                                { icon: '↩', label: 'Easy Returns', sub: 'Within 14 days' },
                                { icon: '✓', label: '100% Authentic', sub: 'Guaranteed' },
                            ].map(b => (
                                <div key={b.label} className="flex flex-col items-center text-center gap-1 py-3 bg-gray-50">
                                    <span className="text-lg">{b.icon}</span>
                                    <span className="text-[9px] font-bold uppercase tracking-wide" style={{ color: '#0a0a0a' }}>{b.label}</span>
                                    <span className="text-[9px] text-gray-400 font-medium">{b.sub}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;