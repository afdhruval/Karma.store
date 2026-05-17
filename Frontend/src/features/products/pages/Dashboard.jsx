import React, { useEffect } from 'react';
import { useProduct } from '../hooks/useProduct';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

const Dashboard = () => {
    const { handleGetSellerProduct } = useProduct();
    const sellerProducts = useSelector(state => state.product.sellerProducts);
    const navigate = useNavigate();

    useEffect(() => {
        handleGetSellerProduct();
    }, []);

    return (
        <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

            {/* ── Top Header ── */}
            <header className="sticky top-0 z-20 bg-white border-b border-black/10">
                <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => navigate('/')}
                            className="text-sm text-black/40 hover:text-black transition-colors"
                            aria-label="Go to home"
                        >
                            ← Back
                        </button>
                        <span className="text-base font-bold tracking-[0.12em] uppercase text-black">
                            KARMA
                        </span>
                        <span className="text-sm text-black/30 font-medium tracking-wider uppercase">
                            / Seller Studio
                        </span>
                    </div>
                    <button
                        id="create-product-btn"
                        onClick={() => navigate('/seller/create-product')}
                        className="bg-black text-white text-xs font-semibold uppercase tracking-[0.15em] px-5 py-2.5 hover:bg-[#e63946] transition-colors duration-200"
                    >
                        + Add Product
                    </button>
                </div>
            </header>

            <main className="max-w-screen-xl mx-auto px-6 py-10">
                {/* Page Title */}
                <div className="mb-10">
                    <p className="text-xs text-black/40 uppercase tracking-[0.2em] mb-2">Your Inventory</p>
                    <h1 className="text-3xl font-bold text-black tracking-tight">
                        All Products
                        {sellerProducts?.length > 0 && (
                            <span className="ml-3 text-base font-normal text-black/40">
                                ({sellerProducts.length})
                            </span>
                        )}
                    </h1>
                </div>

                {sellerProducts && sellerProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {sellerProducts.filter(p => !!p.images?.[0]?.url).map(product => {
                            const imageUrl = product.images?.[0]?.url || null;
                            const variantCount = product.variants?.length || 0;
                            const totalStock = product.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0;

                            return (
                                <div
                                    key={product._id}
                                    id={`dashboard-product-${product._id}`}
                                    onClick={() => navigate(`/seller/product/${product._id}`)}
                                    className="group cursor-pointer"
                                >
                                    {/* Image */}
                                    <div className="relative aspect-[3/4] bg-[#f4f4f4] overflow-hidden mb-3">
                                        {imageUrl ? (
                                            <img
                                                src={imageUrl}
                                                alt={product.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                onError={(e) => {
                                                    const el = document.getElementById(`dashboard-product-${product._id}`);
                                                    if (el) el.style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="text-xs text-black/30 uppercase tracking-wider">No Image</span>
                                            </div>
                                        )}

                                        {/* Variant badge */}
                                        <div className="absolute top-2 left-2 bg-black text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5">
                                            {variantCount} {variantCount === 1 ? 'variant' : 'variants'}
                                        </div>

                                        {/* Hover overlay */}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
                                            <span className="bg-white text-black text-[10px] font-semibold uppercase tracking-[0.15em] px-4 py-2">
                                                Manage →
                                            </span>
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div>
                                        <h3 className="text-sm font-semibold text-black uppercase tracking-tight leading-snug line-clamp-1 group-hover:text-[#e63946] transition-colors">
                                            {product.title}
                                        </h3>
                                        <div className="flex items-center justify-between mt-1">
                                            <span className="text-sm font-bold text-black">
                                                ₹{Number(product.price?.amount || 0).toLocaleString('en-IN')}
                                            </span>
                                            <span className={`text-[10px] font-semibold uppercase ${totalStock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                                {totalStock > 0 ? `${totalStock} in stock` : 'Out of stock'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-black/10">
                        <div className="text-6xl mb-6">📦</div>
                        <p className="text-xs uppercase tracking-[0.25em] text-black/40 mb-2">No Products Yet</p>
                        <p className="text-base text-black/60 mb-6">Start by adding your first product to your store.</p>
                        <button
                            onClick={() => navigate('/seller/create-product')}
                            className="bg-black text-white text-xs font-semibold uppercase tracking-[0.15em] px-6 py-3 hover:bg-[#e63946] transition-colors"
                        >
                            + Add Your First Product
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;