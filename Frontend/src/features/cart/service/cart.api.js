import axios from "axios"


const cartApiInstance = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api/cart`,
    withCredentials: true
})


export const addItem = async ({ productId, variantId }) => {
    const response = await cartApiInstance.post(`/add/${productId}/${variantId}`, {
        quantity: 1
    })

    return response.data
}

export const getCart = async () => {
    const response = await cartApiInstance.get("/")
    return response.data
}

export const incrementCartItemApi = async ({ productId, variantId }) => {
    const response = await cartApiInstance.patch(`/quantity/increment/${productId}/${variantId}`)
    return response.data
}

export const decrementCartItemApi = async ({ productId, variantId }) => {
    const response = await cartApiInstance.patch(`/quantity/decrement/${productId}/${variantId}`)
    return response.data
}

export const removeCartItemApi = async ({ productId, variantId }) => {
    const response = await cartApiInstance.delete(`/remove/${productId}/${variantId}`)
    return response.data
}

export const createOrder = async () => {
    const response = await cartApiInstance.post("/payment/create/order")
    return response.data
}

export const verifyCartOrdre = async ({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) => {
    const response = await cartApiInstance.post("/payment/verify/order", {
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature
    })

    return response.data
}