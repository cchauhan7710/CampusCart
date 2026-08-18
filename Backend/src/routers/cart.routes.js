import express from "express";
import {
    getCart,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
} from "../controllers/cart.controller.js";
import authUser from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authUser); // All cart routes require authentication

router.get("/", getCart);
router.post("/add", addToCart);
router.put("/update", updateCartItemQuantity);
router.delete("/remove/:productId", removeFromCart);
router.delete("/clear", clearCart);

export default router;
