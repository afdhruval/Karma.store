import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// ── Inline models (avoid import-chain issues) ─────────────────────────────
const priceSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' }
}, { _id: false });

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, enum: ['men', 'women', 'unisex'], default: 'unisex' },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    price: { type: priceSchema, required: true },
    images: [{ url: { type: String, required: true } }],
    variants: [{
        images: [{ url: { type: String, required: true } }],
        stock: { type: Number, default: 0 },
        attributes: { type: Map, of: String },
        price: { type: priceSchema }
    }]
}, { timestamps: true });

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    contact: { type: String },
    password: { type: String },
    fullname: { type: String, required: true },
    role: { type: String, enum: ['buyer', 'seller'], default: 'buyer' },
    googleId: { type: String }
});
userSchema.pre('save', async function () {
    if (!this.isModified('password') || !this.password) return;
    this.password = await bcrypt.hash(this.password, 10);
});

const User = mongoose.models.user || mongoose.model('user', userSchema);
const Product = mongoose.models.product || mongoose.model('product', productSchema);

// ── Fetch Snitch Products (Men) ──────────────────────────────────────────────────
async function fetchSnitchProducts() {
    console.log('Fetching Men products from snitch.co.in...');
    const response = await fetch('https://www.snitch.co.in/products.json?limit=50');
    const data = await response.json();
    return data.products;
}

// ── Fetch Women's Products ──────────────────────────────────────────────────
async function fetchWomensProducts() {
    console.log('Fetching Women products from princesspolly.com...');
    try {
        const response = await fetch('https://us.princesspolly.com/products.json?limit=50');
        const data = await response.json();
        return data.products;
    } catch (e) {
        console.error("Failed to fetch women's products", e);
        return [];
    }
}

// ── Static Aesthetic Women's Products ──────────────────────────────────────
const womensImgs = {
    crop: [
        'https://m.media-amazon.com/images/I/71fC7b-zEaL._AC_UY1100_.jpg',
        'https://m.media-amazon.com/images/I/61MvUvE6v6L._AC_UY1100_.jpg',
    ],
    coord: [
        'https://m.media-amazon.com/images/I/61b-9-zEaL._AC_UY1100_.jpg',
        'https://assets.myntassets.com/w_412,q_60,dpr_2,fl_progressive/assets/images/25091776/2023/9/21/2a93883a-4416-433b-8519-537449231f241695279402534-SNITCH-Women-Dresses-9721695279402096-1.jpg',
    ],
    mini: [
        'https://assets.myntassets.com/w_412,q_60,dpr_2,fl_progressive/assets/images/25091772/2023/9/21/d8b23c2a-9e7b-4b1a-8e8e-8e8e8e8e8e8e_1695279400000.jpg',
        'https://m.media-amazon.com/images/I/71fC7b-zEaL._AC_UY1100_.jpg',
    ],
    maxi: [
        'https://assets.myntassets.com/w_412,q_60,dpr_2,fl_progressive/assets/images/25091776/2023/9/21/2a93883a-4416-433b-8519-537449231f241695279402534-SNITCH-Women-Dresses-9721695279402096-1.jpg',
        'https://m.media-amazon.com/images/I/61b-9-zEaL._AC_UY1100_.jpg',
    ],
    boxy: [
        'https://assets.myntassets.com/w_412,q_60,dpr_2,fl_progressive/assets/images/25091772/2023/9/21/d8b23c2a-9e7b-4b1a-8e8e-8e8e8e8e8e8e_1695279400000.jpg',
        'https://m.media-amazon.com/images/I/61MvUvE6v6L._AC_UY1100_.jpg',
    ],
};

function toImgArr(urls) { return urls.map(url => ({ url })); }

function sizes(sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'], colors = ['Black', 'White'], imgs, basePrice) {
    const variants = [];
    for (const color of colors) {
        for (const size of sizes) {
            variants.push({
                images: toImgArr(imgs),
                stock: Math.floor(Math.random() * 40) + 10,
                attributes: new Map([['color', color], ['size', size]]),
                price: { amount: basePrice, currency: 'INR' }
            });
        }
    }
    return variants;
}

function getWomensProducts(sellerId) {
    return [
        {
            title: 'Crop Bralette Top — Ribbed',
            description: 'Form-fitted ribbed bralette with adjustable straps. Perfect as a standalone top or under a sheer layer.',
            category: 'women', seller: sellerId,
            price: { amount: 699, currency: 'INR' },
            images: toImgArr(womensImgs.crop),
            variants: sizes(['XS', 'S', 'M', 'L'], ['Black', 'White', 'Nude', 'Dusty Pink'], womensImgs.crop, 699)
        },
        {
            title: 'Aesthetic Co-ord Set — Satin',
            description: 'Two-piece satin co-ord with a cropped top and wide-leg trousers. Effortless elevated dressing.',
            category: 'women', seller: sellerId,
            price: { amount: 2199, currency: 'INR' },
            images: toImgArr(womensImgs.coord),
            variants: sizes(['XS', 'S', 'M', 'L', 'XL'], ['Ivory', 'Black', 'Sage'], womensImgs.coord, 2199)
        },
        {
            title: 'Mini Skirt — Denim Cargo',
            description: 'Y2K-inspired denim cargo mini with utility pockets and a distressed raw hem. Style with a crop top.',
            category: 'women', seller: sellerId,
            price: { amount: 1099, currency: 'INR' },
            images: toImgArr(womensImgs.mini),
            variants: sizes(['XS', 'S', 'M', 'L'], ['Light Wash', 'Washed Black', 'Indigo'], womensImgs.mini, 1099)
        },
        {
            title: 'Maxi Slip Dress — Silky',
            description: 'Floor-length silky slip dress with adjustable spaghetti straps and a subtle bias cut. Understated luxury.',
            category: 'women', seller: sellerId,
            price: { amount: 1799, currency: 'INR' },
            images: toImgArr(womensImgs.maxi),
            variants: sizes(['XS', 'S', 'M', 'L', 'XL'], ['Champagne', 'Black', 'Mocha'], womensImgs.maxi, 1799)
        },
        {
            title: 'Boxy Oversized Hoodie',
            description: 'Gender-neutral oversized hoodie with drop shoulders and a vintage-washed finish. Soft French-terry inside.',
            category: 'women', seller: sellerId,
            price: { amount: 1499, currency: 'INR' },
            images: toImgArr(womensImgs.boxy),
            variants: sizes(['XS', 'S', 'M', 'L', 'XL'], ['Cream', 'Dusty Pink', 'Lavender', 'Black'], womensImgs.boxy, 1499)
        },
        {
            title: 'Halter Neck Crop Top',
            description: 'Minimalist halter-neck with a clean cut and clasp back. Pairs perfectly with high-waisted jeans or skirts.',
            category: 'women', seller: sellerId,
            price: { amount: 799, currency: 'INR' },
            images: toImgArr(womensImgs.crop),
            variants: sizes(['XS', 'S', 'M', 'L'], ['Black', 'White', 'Rust', 'Sage Green'], womensImgs.crop, 799)
        },
        {
            title: 'Wide-Leg Linen Trousers',
            description: 'High-waisted wide-leg trousers in breezy linen. An elevated everyday essential for warm months.',
            category: 'women', seller: sellerId,
            price: { amount: 1599, currency: 'INR' },
            images: toImgArr(womensImgs.coord),
            variants: sizes(['XS', 'S', 'M', 'L', 'XL'], ['Ecru', 'Black', 'Terracotta'], womensImgs.coord, 1599)
        },
        {
            title: 'Mesh Layering Top',
            description: 'Sheer mesh long-sleeve top designed for layering. Adds a dreamy, editorial touch to any look.',
            category: 'women', seller: sellerId,
            price: { amount: 599, currency: 'INR' },
            images: toImgArr(womensImgs.boxy),
            variants: sizes(['XS', 'S', 'M', 'L'], ['Black', 'White', 'Mocha'], womensImgs.boxy, 599)
        },
        {
            title: 'Cargo Jogger Pants',
            description: 'Street-meet-athleisure cargo joggers with elastic waistband, side pockets and tapered ankle.',
            category: 'women', seller: sellerId,
            price: { amount: 1399, currency: 'INR' },
            images: toImgArr(womensImgs.mini),
            variants: sizes(['XS', 'S', 'M', 'L', 'XL'], ['Khaki', 'Black', 'Olive'], womensImgs.mini, 1399)
        },
        {
            title: 'Floral Printed Mini Dress',
            description: 'Flirty floral-print mini dress with puff sleeves and a smocked bodice. Garden-party ready.',
            category: 'women', seller: sellerId,
            price: { amount: 1299, currency: 'INR' },
            images: toImgArr(womensImgs.maxi),
            variants: sizes(['XS', 'S', 'M', 'L'], ['Blue Floral', 'Pink Floral', 'White Floral'], womensImgs.maxi, 1299)
        },
    ];
}

// ── Main ───────────────────────────────────────────────────────────────────
async function seed() {
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) { console.error('❌  MONGO_URI not found in .env'); process.exit(1); }

    await mongoose.connect(MONGO_URI);
    console.log('✅  MongoDB connected');

    // 1. Find or create a seller account
    const SELLER_EMAIL = 'store@karmastore.in';
    let seller = await User.findOne({ email: SELLER_EMAIL });
    if (!seller) {
        seller = new User({
            email: SELLER_EMAIL,
            fullname: 'KARMA Store',
            contact: '9999999999',
            password: 'Karma@123',
            role: 'seller'
        });
        await seller.save();
        console.log(`✅  Seller created — email: ${SELLER_EMAIL}  password: Karma@123`);
    } else {
        if (seller.role !== 'seller') { seller.role = 'seller'; await seller.save(); }
        console.log(`✅  Using existing seller: ${SELLER_EMAIL}`);
    }

    // 2. Remove existing seeded products
    const deleted = await Product.deleteMany({});
    console.log(`🗑   Cleared ${deleted.deletedCount} existing products from ALL sellers to avoid disgusting old data`);

    // 3. Fetch and insert new products
    const shopifyProducts = await fetchSnitchProducts();
    const womensShopifyProducts = await fetchWomensProducts();
    const allProducts = [];

    // Size converter helper for women's numerical US sizes to Indian letter sizes
    const convertSizeToIndian = (usSize) => {
        const sizeStr = usSize.toString().toUpperCase().trim();
        if (['XS', 'S', 'M', 'L', 'XL', 'XXL'].includes(sizeStr)) return sizeStr;
        if (sizeStr === 'US 0' || sizeStr === 'US 2' || sizeStr === '0' || sizeStr === '2') return 'XS';
        if (sizeStr === 'US 4' || sizeStr === 'US 6' || sizeStr === '4' || sizeStr === '6') return 'S';
        if (sizeStr === 'US 8' || sizeStr === 'US 10' || sizeStr === '8' || sizeStr === '10') return 'M';
        if (sizeStr === 'US 12' || sizeStr === 'US 14' || sizeStr === '12' || sizeStr === '14') return 'L';
        if (sizeStr === 'US 16' || sizeStr === '16') return 'XL';
        if (sizeStr.includes('XS')) return 'XS';
        if (sizeStr.includes('S')) return 'S';
        if (sizeStr.includes('M')) return 'M';
        if (sizeStr.includes('L')) return 'L';
        if (sizeStr.includes('XL')) return 'XL';
        return sizeStr;
    };

    // Helper to map shopify products
    const mapProduct = (sp, forceCategory) => {
        let description = sp.body_html.replace(/<[^>]+>/g, '').trim();
        if (!description) description = sp.title;

        let basePrice = sp.variants[0]?.price ? parseFloat(sp.variants[0].price) : 999;
        if (forceCategory === 'women') {
            basePrice = Math.round(basePrice * 83); // Convert Princess Polly's USD to INR
        }
        const images = sp.images.map(img => ({ url: img.src }));

        const variants = sp.variants.map(v => {
            const attributes = {};
            const setAttr = (optIndex, optVal) => {
                if (sp.options && sp.options[optIndex] && optVal) {
                    const name = sp.options[optIndex].name.toLowerCase();
                    let val = optVal;
                    if (name === 'size' && forceCategory === 'women') {
                        val = convertSizeToIndian(val);
                    }
                    attributes[name] = val;
                }
            };
            setAttr(0, v.option1);
            setAttr(1, v.option2);
            setAttr(2, v.option3);

            let vPrice = v.price ? parseFloat(v.price) : basePrice;
            if (forceCategory === 'women') {
                if (v.price) {
                    vPrice = Math.round(vPrice * 83); // Convert Princess Polly's USD to INR
                }
            }

            return {
                images: images,
                stock: Math.floor(Math.random() * 40) + 10,
                attributes: attributes,
                price: { amount: vPrice, currency: 'INR' }
            };
        });

        let category = forceCategory;
        if (!category) {
            category = 'men';
            const tagsStr = (sp.tags || []).join(' ').toLowerCase();
            if (tagsStr.includes('women')) category = 'women';
            else if (tagsStr.includes('unisex')) category = 'unisex';
        }

        return {
            title: sp.title,
            description,
            category,
            seller: seller._id,
            price: { amount: basePrice, currency: 'INR' },
            images,
            variants
        };
    };

    // Add fetched Snitch products (Men)
    for (const sp of shopifyProducts) {
        allProducts.push(mapProduct(sp, 'men'));
    }

    // Add fetched Princess Polly products (Women)
    for (const sp of womensShopifyProducts) {
        allProducts.push(mapProduct(sp, 'women'));
    }

    // Add static women's products
    const staticWomensProducts = getWomensProducts(seller._id);
    allProducts.push(...staticWomensProducts);

    await Product.insertMany(allProducts);
    console.log(`🎉  Seeded ${allProducts.length} REAL aesthetic clothing products (${shopifyProducts.length} Men, ${womensShopifyProducts.length} Women API, ${staticWomensProducts.length} Static Women)`);

    await mongoose.disconnect();
    console.log('👋  Done — database disconnected');
}

seed().catch(err => { console.error(err); process.exit(1); });
