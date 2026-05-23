import express from 'express';
import { authenticateUser } from '../middlewares/auth.middleware.js';
import { validateAddToCart, validateIncrementCartItemQuantity } from '../validator/cart.validator.js';
import { addToCart, getCart, incrementCartItemQuantity, decrementCartItemQuantity, removeFromCart, createOrder, verifyOrder } from '../controllers/cart.controller.js';


const router = express.Router();


/**
 * @route POST /api/cart/add/:productId/:variantId
 * @desc Add item to cart
 * @access Private
 * @argument productId - ID of the product to add
 * @argument variantId - ID of the variant to add
 * @argument quantity - Quantity of the item to add (optional, default: 1)
 */
router.post("/add/:productId/:variantId", authenticateUser, validateAddToCart, addToCart)



/**
 * @route GET /api/cart
 * @desc Get user's cart
 * @access Private
 */
router.get('/', authenticateUser, getCart)


/**
 * @route PATCH /api/cart/quantity/increment/:productId/:variantId
 * @desc Increment item quantity in cart by one
 * @access Private
 * @argument productId - ID of the product to update
 * @argument variantId - ID of the variant to update
 */
router.patch("/quantity/increment/:productId/:variantId", authenticateUser, validateIncrementCartItemQuantity, incrementCartItemQuantity)

/**
 * @route PATCH /api/cart/quantity/decrement/:productId/:variantId
 * @desc Decrement item quantity in cart by one
 * @access Private
 */
router.patch("/quantity/decrement/:productId/:variantId", authenticateUser, validateIncrementCartItemQuantity, decrementCartItemQuantity)

/**
 * @route DELETE /api/cart/remove/:productId/:variantId
 * @desc Remove an item from the cart completely
 * @access Privatenpm run dev -- --host   
 */
router.delete("/remove/:productId/:variantId", authenticateUser, validateIncrementCartItemQuantity, removeFromCart)


router.post("/payment/create/order", authenticateUser,createOrder)

router.post("/payment/verify/order", authenticateUser,verifyOrder)


export default router;