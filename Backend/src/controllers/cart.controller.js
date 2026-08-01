import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import paymentModel from "../models/payment.model.js";
import { stockOfVariant } from "../dao/product.dao.js";
import { getCartDetails } from "../dao/cart.dao.js";
import { createOrder as createRazorpayOrder } from "../services/payment.service.js";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js";
import { config } from "../config/config.js";


export const addToCart = async (req, res) => {
    try {
        const { productId, variantId } = req.params
        const { quantity = 1 } = req.body

        // Find product WITH the specific variant embedded
        const product = await productModel.findOne({
            _id: productId,
            "variants._id": variantId
        })

        if (!product) {
            return res.status(404).json({
                message: "Product or variant not found",
                success: false
            })
        }

        // Get the actual variant subdocument
        const variant = product.variants.id(variantId)

        const stock = variant?.stock ?? 0

        // Find or create the cart
        const cart = (await cartModel.findOne({ user: req.user._id })) ||
            (await cartModel.create({ user: req.user._id, items: [] }))

        const existingItem = cart.items.find(
            item => item.product.toString() === productId && item.variant?.toString() === variantId
        )

        if (existingItem) {
            if (existingItem.quantity + Number(quantity) > stock) {
                return res.status(400).json({
                    message: `Only ${stock} items in stock. You already have ${existingItem.quantity} in your cart.`,
                    success: false
                })
            }
            existingItem.quantity += Number(quantity)
        } else {
            if (Number(quantity) > stock) {
                return res.status(400).json({
                    message: `Only ${stock} items in stock`,
                    success: false
                })
            }

            // Use variant price if set, otherwise fall back to product base price
            const itemPrice = (variant?.price?.amount)
                ? { amount: variant.price.amount, currency: variant.price.currency }
                : { amount: product.price.amount, currency: product.price.currency }

            cart.items.push({
                product: productId,
                variant: variantId,
                quantity: Number(quantity),
                price: itemPrice
            })
        }

        await cart.save()

        return res.status(200).json({
            message: "Product added to cart successfully",
            success: true
        })
    } catch (error) {
        console.error("addToCart error:", error)
        return res.status(500).json({
            message: error.message || "Failed to add item to cart",
            success: false
        })
    }
}

export const getCart = async (req, res) => {
    try {
        const user = req.user
        let cart = await getCartDetails(user._id)

        if (!cart) {
            // Empty cart — ensure the cart document exists
            await cartModel.findOneAndUpdate(
                { user: user._id },
                { $setOnInsert: { user: user._id, items: [] } },
                { upsert: true, new: true }
            )
            cart = { items: [], totalPrice: 0, currency: "INR" }
        }

        return res.status(200).json({
            message: "Cart fetched successfully",
            success: true,
            cart
        })
    } catch (error) {
        console.error("getCart error:", error)
        return res.status(500).json({
            message: error.message || "Failed to fetch cart",
            success: false
        })
    }
}

export const incrementCartItemQuantity = async (req, res) => {
    try {
        const { productId, variantId } = req.params

        const product = await productModel.findOne({
            _id: productId,
            "variants._id": variantId
        })

        if (!product) {
            return res.status(404).json({
                message: "Product or variant not found",
                success: false
            })
        }

        const cart = await cartModel.findOne({ user: req.user._id })

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found",
                success: false
            })
        }

        const stock = await stockOfVariant(productId, variantId)
        const itemQuantityInCart = cart.items.find(
            item => item.product.toString() === productId && item.variant?.toString() === variantId
        )?.quantity || 0

        if (itemQuantityInCart + 1 > stock) {
            return res.status(400).json({
                message: `Only ${stock} items in stock. You already have ${itemQuantityInCart} in your cart.`,
                success: false
            })
        }

        await cartModel.findOneAndUpdate(
            { user: req.user._id, "items.product": productId, "items.variant": variantId },
            { $inc: { "items.$.quantity": 1 } },
            { new: true }
        )

        return res.status(200).json({
            message: "Cart item quantity updated",
            success: true
        })
    } catch (error) {
        console.error("incrementCartItemQuantity error:", error)
        return res.status(500).json({
            message: error.message || "Failed to update quantity",
            success: false
        })
    }
}

export const decrementCartItemQuantity = async (req, res) => {
    try {
        const { productId, variantId } = req.params;

        const cart = await cartModel.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found", success: false });
        }

        const item = cart.items.find(
            item => item.product.toString() === productId && item.variant?.toString() === variantId
        );

        if (!item) {
            return res.status(404).json({ message: "Item not in cart", success: false });
        }

        if (item.quantity > 1) {
            await cartModel.findOneAndUpdate(
                { user: req.user._id, "items.product": productId, "items.variant": variantId },
                { $inc: { "items.$.quantity": -1 } },
                { new: true }
            );
        } else {
            // If quantity is 1, maybe just remove it, but user might want to explicitly remove.
            // Let's remove it if it reaches 0
            await cartModel.findOneAndUpdate(
                { user: req.user._id },
                { $pull: { items: { product: productId, variant: variantId } } },
                { new: true }
            );
        }

        return res.status(200).json({ message: "Cart item quantity decreased", success: true });
    } catch (error) {
        console.error("decrementCartItemQuantity error:", error);
        return res.status(500).json({ message: "Failed to decrease quantity", success: false });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const { productId, variantId } = req.params;

        await cartModel.findOneAndUpdate(
            { user: req.user._id },
            { $pull: { items: { product: productId, variant: variantId } } },
            { new: true }
        );

        return res.status(200).json({ message: "Item removed from cart", success: true });
    } catch (error) {
        console.error("removeFromCart error:", error);
        return res.status(500).json({ message: "Failed to remove item", success: false });
    }
};


export const createOrder = async (req, res) => {
    try {

        const cart = await getCartDetails(req.user._id)

        if (!cart) {
            return res.status(400).json({ message: "Cart is empty", success: false });
        }
        const order = await createRazorpayOrder({ amount: cart.totalPrice, currency: cart.currency })

        const payment = await paymentModel.create({
            user: req.user._id,
            razorpay: {
                orderId: order.id,
            },
            price: {
                amount: cart.totalPrice,
                currency: cart.currency
            },
            orderItems: cart.items.map((item) => {
                return {
                    title: item.product.title,
                    productId: item.product._id,
                    variantId: item.variant,
                    quantity: item.quantity,
                    images: item.product.variants.images || item.product.images,
                    description: item.product.description,
                    price: {
                        amount: item.product.variants.price.amount,
                        currency: item.product.variants.price.currency,
                    }
                }
            })

        })

        return res.status(200).json({
            message: "order created successfully",
            order: {
                ...order,
                key: config.RAZORPAY_KEY_ID
            },
            success: true
        });
    } catch (error) {
        console.error("createOrder error:", error);
        return res.status(500).json({ message: "Failed to create order", success: false, error: error.message });
    }
}


export const verifyOrder = async (req, res) => {
    try {
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

        const payment = await paymentModel.findOne({
            "razorpay.orderId": razorpayOrderId,
            status: "pending"
        });

        if (!payment) {
            return res.status(404).json({ message: "Payment not found", success: false });
        }

        const isPaymentValid = validatePaymentVerification(
            {
                order_id: razorpayOrderId,
                payment_id: razorpayPaymentId,
            },
            razorpaySignature,
            config.RAZORPAY_KEY_SECRET
        );

        if (!isPaymentValid) {
            payment.status = "failed";
            await payment.save();
            return res.status(400).json({ message: "Payment verification failed", success: false });
        }

        payment.status = "paid";
        payment.razorpay.paymentId = razorpayPaymentId;
        payment.razorpay.signature = razorpaySignature;
        await payment.save();

        // Clear the user's cart after successful payment
        await cartModel.findOneAndUpdate(
            { user: req.user._id },
            { $set: { items: [] } }
        );

        return res.status(200).json({ message: "Payment verified successfully", success: true });

    } catch (error) {
        console.error("verifyOrder error:", error);
        return res.status(500).json({ message: "Failed to verify payment", success: false, error: error.message });
    }
}