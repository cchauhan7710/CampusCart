import express from "express";
import {
    getWishlist,
    toggleWishlist,
    addToWishlist,
    removeFromWishlist,
} from "../controllers/wishlist.controller.js";
import authUser from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authUser); // All wishlist routes require authentication

router.get("/", getWishlist);
router.post("/toggle", toggleWishlist);
router.post("/add", addToWishlist);
router.delete("/remove/:productId", removeFromWishlist);

export default router;
