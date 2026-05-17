import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import productModel from './src/models/product.model.js';

async function seed() {
    await mongoose.connect(process.env.MONGO_URI);
    
    const db = mongoose.connection.db;
    const seller = await db.collection('users').findOne({ role: 'seller' });
    
    if (!seller) {
        console.log("No seller found. Can't seed.");
        process.exit(1);
    }
    
    const products = [
        {
            title: "OVERSIZED DROP SHOULDER T-SHIRT",
            description: "A staple streetwear piece featuring a relaxed oversized fit, dropped shoulders, and premium heavyweight cotton. Designed for maximum comfort and an effortless aesthetic.",
            seller: seller._id,
            price: { amount: 1299, currency: 'INR' },
            images: [
                { url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800" },
                { url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800" }
            ],
            variants: [
                {
                    stock: 10,
                    price: { amount: 1299, currency: 'INR' },
                    attributes: new Map([['Size', 'M'], ['Color', 'Black']]),
                    images: [{ url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800" }]
                },
                {
                    stock: 5,
                    price: { amount: 1299, currency: 'INR' },
                    attributes: new Map([['Size', 'L'], ['Color', 'Black']]),
                    images: [{ url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800" }]
                }
            ]
        },
        {
            title: "CARGO PARACHUTE PANTS",
            description: "Technical parachute pants with adjustable toggles, multiple utility pockets, and a baggy silhouette. The ultimate Y2K-inspired streetwear bottom.",
            seller: seller._id,
            price: { amount: 2499, currency: 'INR' },
            images: [
                { url: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=800" }
            ],
            variants: [
                {
                    stock: 15,
                    price: { amount: 2499, currency: 'INR' },
                    attributes: new Map([['Size', '32'], ['Color', 'Olive']]),
                    images: [{ url: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=800" }]
                }
            ]
        }
    ];

    await productModel.insertMany(products);
    console.log("Seeded Snitch products successfully!");
    process.exit(0);
}
seed();
