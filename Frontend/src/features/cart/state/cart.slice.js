import { createSlice } from "@reduxjs/toolkit";


const cartSlice = createSlice({
    name: "cart",
    initialState: {
        totalPrice: null,
        currency: null,
        items: [],
    },
    reducers: {
        setCart: (state, action) => {
            if (!action.payload) return;
            state.items = action.payload.items || [];
            state.totalPrice = action.payload.totalPrice || 0;
            state.currency = action.payload.currency || "INR";
        },
        addItem: (state, action) => {
            state.items.push(action.payload)
        },
        incrementCartItem: (state, action) => {
            const { productId, variantId } = action.payload

            state.items = state.items.map(item => {
                if (item.product._id === productId && item.variant === variantId) {
                    return { ...item, quantity: item.quantity + 1 }
                } else {
                    return item
                }
            })
        },
        decrementCartItem: (state, action) => {
            const { productId, variantId } = action.payload

            const existingItem = state.items.find(item => item.product._id === productId && item.variant === variantId)
            
            if (existingItem) {
                if (existingItem.quantity > 1) {
                    state.items = state.items.map(item => {
                        if (item.product._id === productId && item.variant === variantId) {
                            return { ...item, quantity: item.quantity - 1 }
                        }
                        return item
                    })
                } else {
                    state.items = state.items.filter(item => !(item.product._id === productId && item.variant === variantId))
                }
            }
        },
        removeCartItem: (state, action) => {
            const { productId, variantId } = action.payload
            state.items = state.items.filter(item => !(item.product._id === productId && item.variant === variantId))
        }
    }
})

export const { setCart, addItem, incrementCartItem, decrementCartItem, removeCartItem } = cartSlice.actions
export default cartSlice.reducer