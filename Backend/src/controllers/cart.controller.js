import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";

// GET user cart
export const getCart = async (req, res) => {
    try {
        const userId = req.user._id;

        let cart = await cartModel.findOne({ user: userId }).populate({
            path: "items.product",
            populate: {
                path: "seller",
                select: "userName email avatar collageName department phone semester",
            },
        });

        if (!cart) {
            cart = await cartModel.create({ user: userId, items: [] });
        }

        return res.status(200).json({
            success: true,
            cart,
        });
    } catch (error) {
        console.error("Error in getCart:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve cart",
            error: error.message,
        });
    }
};

// ADD product to cart
export const addToCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, quantity = 1 } = req.body;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required",
            });
        }

        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        if (product.isSold) {
            return res.status(400).json({
                success: false,
                message: "This product is already sold",
            });
        }

        let cart = await cartModel.findOne({ user: userId });

        if (!cart) {
            cart = new cartModel({
                user: userId,
                items: [
                    {
                        product: productId,
                        quantity: Number(quantity),
                        price: product.price,
                    },
                ],
            });
        } else {
            const itemIndex = cart.items.findIndex(
                (item) => item.product.toString() === productId.toString()
            );

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += Number(quantity);
                cart.items[itemIndex].price = product.price; // update latest price
            } else {
                cart.items.push({
                    product: productId,
                    quantity: Number(quantity),
                    price: product.price,
                });
            }
        }

        await cart.save();

        const updatedCart = await cartModel.findById(cart._id).populate({
            path: "items.product",
            populate: {
                path: "seller",
                select: "userName email avatar collageName department phone semester",
            },
        });

        return res.status(200).json({
            success: true,
            message: "Product added to cart",
            cart: updatedCart,
        });
    } catch (error) {
        console.error("Error in addToCart:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to add product to cart",
            error: error.message,
        });
    }
};

// UPDATE cart item quantity
export const updateCartItemQuantity = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, quantity } = req.body;

        if (!productId || quantity === undefined) {
            return res.status(400).json({
                success: false,
                message: "Product ID and quantity are required",
            });
        }

        let cart = await cartModel.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }

        const newQty = Number(quantity);

        if (newQty <= 0) {
            cart.items = cart.items.filter(
                (item) => item.product.toString() !== productId.toString()
            );
        } else {
            const itemIndex = cart.items.findIndex(
                (item) => item.product.toString() === productId.toString()
            );

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity = newQty;
            } else {
                return res.status(404).json({
                    success: false,
                    message: "Item not found in cart",
                });
            }
        }

        await cart.save();

        const updatedCart = await cartModel.findById(cart._id).populate({
            path: "items.product",
            populate: {
                path: "seller",
                select: "userName email avatar collageName department phone semester",
            },
        });

        return res.status(200).json({
            success: true,
            message: "Cart updated",
            cart: updatedCart,
        });
    } catch (error) {
        console.error("Error in updateCartItemQuantity:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update cart item",
            error: error.message,
        });
    }
};

// REMOVE product from cart
export const removeFromCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.params;

        let cart = await cartModel.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }

        cart.items = cart.items.filter(
            (item) => item.product.toString() !== productId.toString()
        );

        await cart.save();

        const updatedCart = await cartModel.findById(cart._id).populate({
            path: "items.product",
            populate: {
                path: "seller",
                select: "userName email avatar collageName department phone semester",
            },
        });

        return res.status(200).json({
            success: true,
            message: "Item removed from cart",
            cart: updatedCart,
        });
    } catch (error) {
        console.error("Error in removeFromCart:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to remove item from cart",
            error: error.message,
        });
    }
};

// CLEAR cart
export const clearCart = async (req, res) => {
    try {
        const userId = req.user._id;

        let cart = await cartModel.findOne({ user: userId });
        if (cart) {
            cart.items = [];
            await cart.save();
        }

        return res.status(200).json({
            success: true,
            message: "Cart cleared",
            cart: cart || { user: userId, items: [] },
        });
    } catch (error) {
        console.error("Error in clearCart:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to clear cart",
            error: error.message,
        });
    }
};
