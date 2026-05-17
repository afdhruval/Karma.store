import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../../auth/hook/useAuth'
import { useProduct } from '../../products/hooks/useProduct'
import SearchOverlay from './SearchOverlay'

const Nav = () => {
    const navigate = useNavigate()
    const user = useSelector(state => state.auth.user)
    const cartItems = useSelector(state => state.cart?.items)
    const [menuOpen, setMenuOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const { handleLogout } = useAuth()

    const { handleGetAllProducts } = useProduct()
    const products = useSelector(state => state.product.products) || []
    const [mobileQuery, setMobileQuery] = useState('')
    const [mobileResults, setMobileResults] = useState([])

    // Load products for search inside mobile menu
    useEffect(() => {
        if (menuOpen && products.length === 0) {
            handleGetAllProducts()
        }
    }, [menuOpen, products.length])

    // Dynamically filter search results in mobile hamburger
    useEffect(() => {
        if (mobileQuery.trim() === '') {
            setMobileResults([])
            return
        }
        const normalized = mobileQuery.toLowerCase()
        const matches = products.filter(p => {
            const titleMatch = p.title?.toLowerCase().includes(normalized)
            const categoryMatch = p.category?.toLowerCase().includes(normalized)
            return titleMatch || categoryMatch
        })
        setMobileResults(matches)
    }, [mobileQuery, products])

    return (
        <>
            <link
                href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />

            {/* ── Announcement Bar ── */}
            <div
                className="w-full text-center py-2 text-[11px] font-semibold tracking-[0.18em] uppercase"
                style={{ backgroundColor: '#0a0a0a', color: '#ffffff', fontFamily: "'Montserrat', sans-serif" }}
            >
                10% OFF on first order above ₹1400 &nbsp;•&nbsp; Code: <span style={{ color: '#f0c040' }}>NEW10</span>
            </div>

            {/* ── Main Navbar ── */}
            <nav
                className="sticky top-0 z-50 bg-white border-b"
                style={{ borderColor: '#e8e8e8', fontFamily: "'Montserrat', sans-serif" }}
            >
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between h-16">

                        {/* ── LEFT: Hamburger + Category Links ── */}
                        <div className="flex items-center gap-4">
                            <button
                                id="nav-menu-toggle"
                                onClick={() => setMenuOpen(o => !o)}
                                className="flex flex-col gap-[5px] p-1 group cursor-pointer"
                                aria-label="Menu"
                            >
                                <span className={`block w-5 h-[1.5px] bg-black transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
                                <span className={`block w-5 h-[1.5px] bg-black transition-all duration-300 ${menuOpen ? 'opacity-0 scale-0' : ''}`} />
                                <span className={`block w-5 h-[1.5px] bg-black transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
                            </button>

                            {/* Desktop Slide-out Categories */}
                            <div className={`hidden md:flex items-center gap-5 transition-all duration-300 ease-out overflow-hidden ${menuOpen ? 'max-w-[200px] opacity-100 translate-x-2' : 'max-w-0 opacity-0 -translate-x-3 pointer-events-none'}`}>
                                <Link
                                    to="/?category=men"
                                    id="nav-men-link"
                                    className="text-[11px] font-bold uppercase tracking-[0.18em] transition-colors duration-200 hover:text-black text-gray-500"
                                >
                                    Men
                                </Link>
                                <Link
                                    to="/?category=women"
                                    id="nav-women-link"
                                    className="text-[11px] font-bold uppercase tracking-[0.18em] transition-colors duration-200 hover:text-black text-gray-500"
                                >
                                    Women
                                </Link>
                            </div>
                        </div>

                        <Link
                            to="/"
                            id="nav-logo"
                            className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 hover:opacity-80 transition-opacity"
                        >
                            {/* K icon */}
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <text x="2" y="18" fontSize="16" fontWeight="900" fontFamily="Montserrat, sans-serif">K</text>
                            </svg>
                            <span
                                className="text-[1.35rem] font-black tracking-[0.12em] uppercase"
                                style={{ fontFamily: "'Montserrat', sans-serif", color: '#0a0a0a' }}
                            >
                                KARMA
                            </span>
                        </Link>

                        {/* ── RIGHT: Icons ── */}
                        <div className="flex items-center gap-4">
                            {/* Search */}
                            <div className="relative hidden md:block">
                                <button
                                    id="nav-search"
                                    onClick={() => setSearchOpen(o => !o)}
                                    className="p-1 hover:opacity-60 transition-opacity cursor-pointer block"
                                    aria-label="Search"
                                >
                                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                        <circle cx="11" cy="11" r="7" />
                                        <path d="M21 21l-4-4" strokeLinecap="round" />
                                    </svg>
                                </button>
                                <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
                            </div>

                            {/* User / Login / Logout */}
                            {user ? (
                                <div className="flex items-center gap-3">
                                    <Link to={user.role === 'seller' ? '/seller/dashboard' : '/'} id="nav-user" className="p-1 hover:opacity-60 transition-opacity" aria-label="Account">
                                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                            <circle cx="12" cy="8" r="4" />
                                            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" />
                                        </svg>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        id="nav-logout"
                                        className="p-1 hover:opacity-60 text-red-500 hover:text-red-600 transition-opacity cursor-pointer"
                                        aria-label="Logout"
                                        title="Logout"
                                    >
                                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" />
                                            <polyline points="16 17 21 12 16 7" strokeLinecap="round" />
                                            <line x1="21" y1="12" x2="9" y2="12" strokeLinecap="round" />
                                        </svg>
                                    </button>
                                </div>
                            ) : (
                                <Link to="/login" id="nav-login" className="p-1 hover:opacity-60 transition-opacity" aria-label="Sign In">
                                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                        <circle cx="12" cy="8" r="4" />
                                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" />
                                    </svg>
                                </Link>
                            )}

                            {/* Cart */}
                            <Link to="/cart" id="nav-cart" className="relative p-1 hover:opacity-60 transition-opacity" aria-label="Cart">
                                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                    <line x1="3" y1="6" x2="21" y2="6" />
                                    <path d="M16 10a4 4 0 0 1-8 0" />
                                </svg>
                                {cartItems?.length > 0 && (
                                    <span
                                        className="absolute -top-1 -right-1 flex items-center justify-center rounded-full text-white text-[9px] font-bold"
                                        style={{ backgroundColor: '#0a0a0a', width: '16px', height: '16px', fontFamily: "'Montserrat', sans-serif" }}
                                    >
                                        {cartItems.length > 9 ? '9+' : cartItems.length}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ── Mobile Dropdown Menu ── */}
                {menuOpen && (
                    <div
                        className="md:hidden border-t py-4 px-6 flex flex-col gap-4"
                        style={{ borderColor: '#e8e8e8', backgroundColor: '#ffffff' }}
                    >
                        {/* Mobile Integrated Search Input */}
                        <div className="relative mb-1">
                            <input
                                type="text"
                                value={mobileQuery}
                                onChange={(e) => setMobileQuery(e.target.value)}
                                placeholder="SEARCH PRODUCTS..."
                                className="w-full border border-black/15 bg-zinc-50 px-3.5 py-2.5 text-[10px] font-bold uppercase tracking-wider focus:outline-none focus:border-black rounded-none placeholder-gray-400 text-black transition-colors"
                            />
                            {mobileQuery && (
                                <button
                                    onClick={() => setMobileQuery('')}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black text-[9px] font-black uppercase tracking-wider"
                                >
                                    Clear
                                </button>
                            )}
                        </div>

                        {/* Mobile Live Results panel */}
                        {mobileQuery.trim() !== '' && (
                            <div className="border border-black/10 max-h-48 overflow-y-auto bg-white mb-1 divide-y divide-black/5">
                                {mobileResults.length > 0 ? (
                                    mobileResults.map(p => {
                                        const img = p.images?.[0]?.url || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&q=80';
                                        return (
                                            <div
                                                key={p._id}
                                                onClick={() => {
                                                    setMobileQuery('');
                                                    setMenuOpen(false);
                                                    navigate(`/product/${p._id}`);
                                                }}
                                                className="flex items-center gap-3 p-2 hover:bg-zinc-50 cursor-pointer"
                                            >
                                                <img src={img} alt={p.title} className="w-8 h-10 object-cover object-top flex-shrink-0" />
                                                <div className="min-w-0 flex-1">
                                                    <h4 className="text-[10px] font-black uppercase tracking-tight text-black line-clamp-1">{p.title}</h4>
                                                    <p className="text-[9px] font-bold text-black/50 mt-0.5">₹{Number(p.price?.amount || 0).toLocaleString('en-IN')}</p>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="p-3 text-center text-[9px] font-black text-black/45 uppercase tracking-wider">// NO MATCHES FOUND</div>
                                )}
                            </div>
                        )}

                        <Link
                            to="/?category=men"
                            onClick={() => setMenuOpen(false)}
                            className="text-[12px] font-bold uppercase tracking-[0.18em]"
                            style={{ color: '#0a0a0a' }}
                        >
                            Men
                        </Link>
                        <Link
                            to="/?category=women"
                            onClick={() => setMenuOpen(false)}
                            className="text-[12px] font-bold uppercase tracking-[0.18em]"
                            style={{ color: '#0a0a0a' }}
                        >
                            Women
                        </Link>
                        {!user && (
                            <>
                                <Link to="/login" onClick={() => setMenuOpen(false)} className="text-[12px] uppercase tracking-[0.18em] text-gray-500">Sign In</Link>
                                <Link to="/register" onClick={() => setMenuOpen(false)} className="text-[12px] uppercase tracking-[0.18em] text-gray-500">Sign Up</Link>
                            </>
                        )}
                        {user && user.role === 'seller' && (
                            <Link to="/seller/dashboard" onClick={() => setMenuOpen(false)} className="text-[12px] uppercase tracking-[0.18em] text-gray-500">Seller Dashboard</Link>
                        )}
                        {user && (
                            <button
                                onClick={() => { handleLogout(); setMenuOpen(false); }}
                                className="text-[12px] uppercase tracking-[0.18em] text-red-500 hover:text-red-600 text-left font-bold cursor-pointer"
                            >
                                Logout
                            </button>
                        )}
                    </div>
                )}
            </nav>
        </>
    )
}

export default Nav