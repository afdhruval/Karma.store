import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router';
import { motion } from 'framer-motion';

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1] } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
};

const OrderSuccess = () => {
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const orderId = queryParams.get("order_id") || "SN-00000";

    const items = location.state?.items || [];
    const subtotal = location.state?.subtotal || 0;

    return (
        <>
            <link
                href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />
            <div
                className="min-h-screen bg-white text-black selection:bg-black selection:text-white"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
                {/* ── Navbar spacing ── */}
                <div className="h-16 md:h-24 bg-white border-b border-gray-200"></div>

                <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-12 lg:py-20 relative z-10">
                    
                    <motion.div 
                        initial="hidden" 
                        animate="visible" 
                        variants={staggerContainer}
                        className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start"
                    >
                        
                        {/* ── Left Column: Order Confirmation ── */}
                        <div className="w-full lg:w-[60%] space-y-12">
                            
                            <motion.section variants={staggerContainer} className="space-y-6">
                                <motion.div variants={fadeUp} className="inline-block bg-black text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                                    Order Confirmed
                                </motion.div>
                                
                                <motion.h1 
                                    variants={fadeUp}
                                    className="text-4xl md:text-5xl lg:text-6xl font-black uppercase leading-none tracking-tight"
                                    style={{ letterSpacing: '-0.02em' }}
                                    data-scroll data-scroll-speed="0.05"
                                >
                                    Thank you for <br />
                                    your order.
                                </motion.h1>
                                
                                <motion.div variants={fadeUp} className="pt-4 flex flex-col md:flex-row md:items-center gap-4 md:gap-12">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 mb-1">
                                            Order Number
                                        </p>
                                        <p className="text-xl font-bold uppercase">
                                            {orderId}
                                        </p>
                                    </div>
                                    <div className="h-10 w-px bg-gray-200 hidden md:block"></div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 mb-1">
                                            Date
                                        </p>
                                        <p className="text-sm font-semibold uppercase">
                                            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </p>
                                    </div>
                                </motion.div>
                            </motion.section>
                            
                            <motion.section variants={fadeUp} className="pt-8 border-t border-gray-200">
                                <h3 className="text-lg font-black uppercase tracking-wide mb-6">
                                    Items in your order
                                </h3>
                                
                                <div className="space-y-6">
                                    {items.length > 0 ? items.map((item, idx) => {
                                        const product = item.product;
                                        const variant = product?.variants;
                                        const imageUrl = variant?.images?.[0]?.url || product?.images?.[0]?.url || "";
                                        const attributes = variant?.attributes
                                            ? (variant.attributes instanceof Map ? Object.fromEntries(variant.attributes) : variant.attributes)
                                            : null;
                                        const itemPrice = item.price?.amount || 0;
                                        const currency = item.price?.currency || 'INR';

                                        return (
                                            <div 
                                                key={idx} 
                                                id={`order-item-${product._id}-${item.variant}`} 
                                                className="flex gap-4 sm:gap-6 items-start"
                                            >
                                                <div className="w-24 sm:w-28 aspect-[3/4] flex-shrink-0 bg-gray-100 overflow-hidden relative">
                                                    {imageUrl ? (
                                                        <img 
                                                            className="w-full h-full object-cover object-top" 
                                                            alt={product?.title || "Product"} 
                                                            src={imageUrl}
                                                            onError={(e) => {
                                                                const el = document.getElementById(`order-item-${product._id}-${item.variant}`);
                                                                if (el) el.style.display = 'none';
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <span className="text-[9px] uppercase text-gray-400 font-bold">No Image</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-grow pt-1">
                                                    <h4 className="text-sm sm:text-base font-bold uppercase tracking-wide mb-1 line-clamp-2">
                                                        {product?.title || "Product"}
                                                    </h4>
                                                    
                                                    {attributes && Object.keys(attributes).length > 0 && (
                                                        <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                                            {Object.entries(attributes).map(([k, v]) => `${k}: ${v}`).join(' | ')}
                                                        </p>
                                                    )}
                                                    
                                                    <div className="flex items-center justify-between mt-4">
                                                        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Qty: {item.quantity || 1}</p>
                                                        <p className="text-sm font-black">{currency} {Number(itemPrice).toLocaleString('en-IN')}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }) : (
                                        <div className="py-12 bg-gray-50 border border-dashed border-gray-300 text-center">
                                            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500">No items found</p>
                                        </div>
                                    )}
                                </div>
                            </motion.section>
                        </div>

                        {/* ── Right Column: Summary & Actions ── */}
                        <div className="w-full lg:w-[40%] relative">
                            <motion.div 
                                variants={fadeUp}
                                className="lg:sticky lg:top-32 p-6 md:p-8 bg-gray-50 border border-gray-200"
                                data-scroll data-scroll-speed="0.1"
                            >
                                <h3 className="text-lg font-black uppercase tracking-wide mb-6">
                                    Order Summary
                                </h3>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-gray-600">
                                        <span>Subtotal</span>
                                        <span>₹{Number(subtotal).toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-gray-600">
                                        <span>Shipping</span>
                                        <span className="text-green-600">Free</span>
                                    </div>
                                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-gray-600">
                                        <span>Tax</span>
                                        <span>₹0</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-200 mb-8">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-sm font-black uppercase tracking-wide">Total</span>
                                        <span className="text-xl font-black">₹{Number(subtotal).toLocaleString('en-IN')}</span>
                                    </div>
                                    <p className="text-[9px] text-gray-500 font-semibold uppercase tracking-widest mt-1 text-right">
                                        Inclusive of all taxes
                                    </p>
                                </div>

                                <div className="space-y-6 mb-8 pt-6 border-t border-gray-200">
                                    <div>
                                        <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 mb-2">
                                            Shipping To
                                        </h4>
                                        <p className="text-[12px] font-semibold leading-relaxed">
                                            John Doe<br/>
                                            123 Fashion Street, Apt 4B<br/>
                                            Mumbai, Maharashtra 400001
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 mb-2">
                                            Estimated Delivery
                                        </h4>
                                        <p className="text-[12px] font-black">
                                            3-5 Business Days
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col gap-3">
                                    <Link 
                                        to="/orders" 
                                        className="w-full py-4 bg-black text-white text-center text-[11px] font-black uppercase tracking-[0.2em] hover:bg-gray-800 transition-colors"
                                    >
                                        Track Order
                                    </Link>
                                    <Link 
                                        to="/" 
                                        className="w-full py-4 bg-transparent border-2 border-black text-black text-center text-[11px] font-black uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-colors"
                                    >
                                        Continue Shopping
                                    </Link>
                                </div>
                                
                                <div className="mt-6 text-center">
                                    <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-400">
                                        A confirmation email has been sent to you.
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                        
                    </motion.div>
                </main>
            </div>
        </>
    );
};

export default OrderSuccess;