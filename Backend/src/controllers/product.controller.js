import productModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";


export async function createProduct(req, res) {
    try {
        const { title, description, priceAmount, priceCurrency, category } = req.body;
        const seller = req.user;

        let images = [];
        if (req.files && req.files.length > 0) {
            images = await Promise.all(req.files.map(async (file) => {
                return await uploadFile({
                    buffer: file.buffer,
                    fileName: file.originalname
                })
            }))
        }


        const product = await productModel.create({
            title,
            description,
            category,
            price: {
                amount: Number(priceAmount) || 0,
                currency: priceCurrency || "INR"
            },
            images,
            seller: seller._id
        })


        res.status(201).json({
            message: "Product created successfully",
            success: true,
            product
        })
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({
            message: "Internal server error while creating product",
            success: false,
            error: error.message
        })
    }
}

export async function getSellerProducts(req, res) {
    const seller = req.user;

    const products = await productModel.find({ seller: seller._id });


    res.status(200).json({
        message: "Products fetched successfully",
        success: true,
        products
    })
}

export async function getAllProducts(req, res) {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const products = await productModel.find(filter)

    return res.status(200).json({
        message: "Products fetched successfully",
        success: true,
        products
    })
}

export async function getProductDetails(req, res) {
    const { id } = req.params;

    const product = await productModel.findById(id)

    if (!product) {
        return res.status(404).json({
            message: "Product not found",
            success: false
        })
    }

    return res.status(200).json({
        message: "Product details fetched successfully",
        success: true,
        product
    })
}


export async function addProductVariant(req, res) {
    try {
        const productId = req.params.productId;

        const product = await productModel.findOne({
            _id: productId,
            seller: req.user._id
        });

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                success: false
            })
        }

        const files = req.files;
        const images = [];
        if (files && files.length > 0) {
            const uploadedImages = await Promise.all(files.map(async (file) => {
                return await uploadFile({
                    buffer: file.buffer,
                    fileName: file.originalname
                })
            }));
            uploadedImages.forEach(image => images.push(image));
        }

        const price = req.body.priceAmount
        const stock = req.body.stock
        const attributes = JSON.parse(req.body.attributes || "{}")

        product.variants.push({
            images,
            price: {
                amount: Number(price) || product.price.amount,
                currency: req.body.priceCurrency || product.price.currency
            },
            stock: Number(stock) || 0,
            attributes
        })

        await product.save();

        return res.status(200).json({
            message: "Product variant added successfully",
            success: true,
            product
        })
    } catch (error) {
        console.error("Error adding product variant:", error);
        return res.status(500).json({
            message: "Internal server error while adding variant",
            success: false,
            error: error.message
        })
    }
}