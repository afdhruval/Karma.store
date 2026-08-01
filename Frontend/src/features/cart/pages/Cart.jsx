import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useCart } from '../hook/useCart'
import { Link, useNavigate } from 'react-router'
import { useRazorpay } from "react-razorpay";
import { useState } from 'react';

const Cart = () => {
    const cart = useSelector(state => state.cart)
    const { handleGetCart, handleIncrementCartItem, handleDecrementCartItem, handleRemoveCartItem, handleCreateCartOrder , verifyOrder } = useCart()
    const navigate = useNavigate()
    const user = useSelector(state => state.user)

    const { error, isLoading, Razorpay } = useRazorpay();

    useEffect(() => {
        handleGetCart()
    }, [])

    const items = (cart?.items || []).filter(item => {
        const product = item.product
        const variant = product?.variants
        const imageUrl = variant?.images?.[0]?.url || product?.images?.[0]?.url || null
        return !!imageUrl
    })

    const subtotal = items.reduce((acc, item) => {
        const price = item.product?.variants?.price?.amount || item.price?.amount || 0
        return acc + price * (item.quantity || 1)
    }, 0)

    // const handleCheckout = () => {
    //     navigate(`/order-success?order_id=SN-${Math.floor(Math.random() * 100000)}`, { state: { items, subtotal } })
    // }

    async function handleCheckOut() {
        const order = await handleCreateCartOrder();
        
        if (!order) {
            alert("Failed to create order. Please try again.");
            return;
        }

        const options = {
            key: order.key || "rzp_test_SsolAMqyWnHY5f",
            amount: order.amount, // Amount in paise
            currency: order.currency,
            name: "KARMA",
            description: "Test Transaction",
            order_id: order.id, // Generate order_id on server
            handler: async (response) => {
                const isValid = await verifyOrder({
                    razorpayOrderId: response.razorpay_order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpaySignature: response.razorpay_signature,
                });
                if (isValid) {
                    navigate(`/order-success?order_id=${response.razorpay_order_id}`, { state: { items, subtotal } });
                } else {
                    alert("Payment verification failed. Please contact support.");
                }
            },
            prefill: {
                name: user?.fullname,
                email: user?.email,
                contact: user?.contact,
            },
            theme: {
                color: "#F37254",
            },
        };

        const razorpayInstance = new Razorpay(options);
        razorpayInstance.open();
    }

    /* ── Empty State ── */
    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center" style={{ fontFamily: "'Inter', sans-serif" }}>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
                <p className="text-xs text-black/40 uppercase tracking-[0.25em] mb-3">Your Cart</p>
                <h2 className="text-2xl font-bold text-black mb-2">Your bag is empty</h2>
                <p className="text-sm text-black/50 mb-8">Looks like you haven't added anything yet.</p>
                <Link
                    to="/"
                    className="bg-black text-white text-xs font-semibold uppercase tracking-[0.15em] px-8 py-3 hover:bg-[#e63946] transition-colors"
                >
                    Continue Shopping
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

            <main className="max-w-screen-xl mx-auto px-4 md:px-6 py-8 md:py-12">
                {/* ── Page Header ── */}
                <div className="mb-8 border-b border-black/10 pb-4">
                    <span className="text-[9px] font-bold text-black/45 tracking-[0.25em] block mb-1 uppercase">// CART COMPILATION</span>
                    <h1 className="text-xl font-bold uppercase tracking-wider text-black flex items-baseline gap-2">
                        My Bag
                        <span className="text-xs text-black/40 font-semibold uppercase tracking-wider">({items.length} {items.length > 1 ? 'items' : 'item'})</span>
                    </h1>
                </div>

                <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">

                    {/* ── Left: Items ── */}
                    <div className="flex-1 w-full">
                        <div className="divide-y divide-black/8">
                            {items.map((item, idx) => {
                                const product = item.product
                                const variant = product?.variants

                                // Pull image: prefer variant image, then product image
                                const imageUrl = variant?.images?.[0]?.url
                                    || product?.images?.[0]?.url
                                    || null

                                // Pull attributes from variant
                                const attributes = variant?.attributes
                                    ? (variant.attributes instanceof Map
                                        ? Object.fromEntries(variant.attributes)
                                        : variant.attributes)
                                    : null

                                const itemPrice = item.price?.amount || 0
                                const currency = item.price?.currency || 'INR'

                                return (
                                    <div key={idx} id={`cart-item-${product._id}-${item.variant}`} className="py-6 flex gap-4 sm:gap-6">
                                        {/* Image */}
                                        <div className="w-20 sm:w-28 aspect-[3/4] bg-[#f4f4f4] flex-shrink-0 overflow-hidden border border-black/5">
                                            {imageUrl ? (
                                                <img
                                                    src={imageUrl}
                                                    alt={product?.title || 'Product'}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        const el = document.getElementById(`cart-item-${product._id}-${item.variant}`);
                                                        if (el) el.style.display = 'none';
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <span className="text-[9px] text-black/30 uppercase">No Image</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 flex flex-col justify-between min-w-0">
                                            <div>
                                                <h3 className="text-xs sm:text-sm font-bold text-black uppercase tracking-tight leading-snug mb-1 line-clamp-2">
                                                    {product?.title || 'Product'}
                                                </h3>

                                                {/* Variant Attributes */}
                                                {attributes && Object.keys(attributes).length > 0 && (
                                                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                                                        {Object.entries(attributes).map(([key, val]) => (
                                                            <span
                                                                key={key}
                                                                className="text-[9px] uppercase tracking-wider text-black/50 bg-[#f4f4f4] px-2 py-0.5 font-bold"
                                                            >
                                                                {key}: {val}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}

                                                <p className="text-[11px] font-semibold text-black/50 mt-2">
                                                    Unit Price: {currency} {Number(itemPrice).toLocaleString('en-IN')}
                                                </p>
                                            </div>

                                            {/* Responsive Controls and Subtotal */}
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-3 border-t border-black/5">
                                                {/* Controls */}
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center border border-black/15 bg-[#fafafa]">
                                                        <button
                                                            onClick={() => handleDecrementCartItem({ productId: product._id, variantId: item.variant })}
                                                            className="w-7 h-7 flex items-center justify-center text-black/60 hover:text-black hover:bg-black/5 transition-colors text-xs font-bold cursor-pointer"
                                                            aria-label="Decrease quantity"
                                                        >
                                                            −
                                                        </button>
                                                        <span className="w-8 text-center text-xs font-bold text-black">
                                                            {item.quantity || 1}
                                                        </span>
                                                        <button
                                                            onClick={() => handleIncrementCartItem({ productId: product._id, variantId: item.variant })}
                                                            className="w-7 h-7 flex items-center justify-center text-black/60 hover:text-black hover:bg-black/5 transition-colors text-xs font-bold cursor-pointer"
                                                            aria-label="Increase quantity"
                                                        >
                                                            +
                                                        </button>
                                                    </div>

                                                    <button
                                                        onClick={() => handleRemoveCartItem({ productId: product._id, variantId: item.variant })}
                                                        className="text-[10px] text-black/40 hover:text-red-600 font-bold uppercase tracking-widest transition-colors cursor-pointer"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>

                                                {/* Line Total */}
                                                <div className="text-left sm:text-right">
                                                    <span className="text-[8px] font-bold text-black/30 uppercase tracking-widest block sm:hidden mb-0.5">Item Total</span>
                                                    <p className="text-sm font-bold text-black">
                                                        {currency} {Number(itemPrice * (item.quantity || 1)).toLocaleString('en-IN')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* ── Right: Summary ── */}
                    <div className="w-full lg:w-80 lg:sticky lg:top-24">
                        <div className="bg-[#f9f9f9] p-6">
                            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-black mb-5">
                                Order Summary
                            </h2>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-black/60">
                                    <span>Subtotal ({items.length} item{items.length > 1 ? 's' : ''})</span>
                                    <span>₹{Number(subtotal).toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-black/60">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-medium">FREE</span>
                                </div>
                                <div className="border-t border-black/10 pt-3 flex justify-between font-bold text-black text-base">
                                    <span>Total</span>
                                    <span>₹{Number(subtotal).toLocaleString('en-IN')}</span>
                                </div>
                            </div>

                            <button
                                id="checkout-btn"
                                onClick={handleCheckOut}
                                className="mt-6 w-full bg-black text-white text-xs font-bold uppercase tracking-[0.2em] py-4 hover:bg-[#e63946] transition-colors duration-200"
                            >
                                Place Order
                            </button>

                            <Link
                                to="/"
                                className="block mt-3 text-center text-xs text-black/40 hover:text-black underline underline-offset-2 transition-colors"
                            >
                                Continue Shopping
                            </Link>
                        </div>

                        {/* Trust badges */}
                        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                            {[
                                { icon: '🔒', label: 'Secure' },
                                { icon: '🔄', label: '14-day Returns' },
                                { icon: '🚚', label: 'Free Shipping' },
                            ].map(({ icon, label }) => (
                                <div key={label} className="flex flex-col items-center gap-1 py-3 border border-black/8">
                                    <span className="text-lg">{icon}</span>
                                    <span className="text-[9px] font-semibold uppercase tracking-wider text-black/50">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    )
}

export default Cart