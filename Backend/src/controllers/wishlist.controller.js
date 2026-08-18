import wishlistModel from "../models/wishlist.model.js";
import productModel from "../models/product.model.js";

// GET user wishlist
export const getWishlist = async (req, res) => {
    try {
        const userId = req.user._id;

        let wishlist = await wishlistModel.findOne({ user: userId }).populate({
            path: "products",
            populate: {
                path: "seller",
                select: "userName email avatar collageName department phone semester",
            },
        });

        if (!wishlist) {
            wishlist = await wishlistModel.create({ user: userId, products: [] });
        }

        return res.status(200).json({
            success: true,
            wishlist,
        });
    } catch (error) {
        console.error("Error in getWishlist:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve wishlist",
            error: error.message,
        });
    }
};

// TOGGLE product in wishlist
export const toggleWishlist = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.body;

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

        let wishlist = await wishlistModel.findOne({ user: userId });

        if (!wishlist) {
            wishlist = new wishlistModel({
                user: userId,
                products: [productId],
            });
            await wishlist.save();

            const updatedWishlist = await wishlistModel.findById(wishlist._id).populate({
                path: "products",
                populate: {
                    path: "seller",
                    select: "userName email avatar collageName department phone semester",
                },
            });

            return res.status(200).json({
                success: true,
                message: "Added to wishlist",
                isWishlisted: true,
                wishlist: updatedWishlist,
            });
        }

        const existsIndex = wishlist.products.findIndex(
            (id) => id.toString() === productId.toString()
        );

        let isWishlisted = false;
        if (existsIndex > -1) {
            wishlist.products.splice(existsIndex, 1);
            isWishlisted = false;
        } else {
            wishlist.products.push(productId);
            isWishlisted = true;
        }

        await wishlist.save();

        const updatedWishlist = await wishlistModel.findById(wishlist._id).populate({
            path: "products",
            populate: {
                path: "seller",
                select: "userName email avatar collageName department phone semester",
            },
        });

        return res.status(200).json({
            success: true,
            message: isWishlisted ? "Added to wishlist" : "Removed from wishlist",
            isWishlisted,
            wishlist: updatedWishlist,
        });
    } catch (error) {
        console.error("Error in toggleWishlist:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to toggle wishlist item",
            error: error.message,
        });
    }
};

// ADD to wishlist
export const addToWishlist = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required",
            });
        }

        let wishlist = await wishlistModel.findOne({ user: userId });
        if (!wishlist) {
            wishlist = new wishlistModel({ user: userId, products: [] });
        }

        if (!wishlist.products.includes(productId)) {
            wishlist.products.push(productId);
            await wishlist.save();
        }

        const updatedWishlist = await wishlistModel.findById(wishlist._id).populate({
            path: "products",
            populate: {
                path: "seller",
                select: "userName email avatar collageName department phone semester",
            },
        });

        return res.status(200).json({
            success: true,
            message: "Added to wishlist",
            wishlist: updatedWishlist,
        });
    } catch (error) {
        console.error("Error in addToWishlist:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to add to wishlist",
            error: error.message,
        });
    }
};

// REMOVE from wishlist
export const removeFromWishlist = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.params;

        let wishlist = await wishlistModel.findOne({ user: userId });
        if (wishlist) {
            wishlist.products = wishlist.products.filter(
                (id) => id.toString() !== productId.toString()
            );
            await wishlist.save();
        }

        const updatedWishlist = await wishlistModel.findById(wishlist ? wishlist._id : null).populate({
            path: "products",
            populate: {
                path: "seller",
                select: "userName email avatar collageName department phone semester",
            },
        });

        return res.status(200).json({
            success: true,
            message: "Removed from wishlist",
            wishlist: updatedWishlist || { user: userId, products: [] },
        });
    } catch (error) {
        console.error("Error in removeFromWishlist:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to remove from wishlist",
            error: error.message,
        });
    }
};
