import express from "express";
import {
  createProduct,
  getAllProduct,
  getProductsByCategory,
  updateSoldStatus,
} from "../controllers/product.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import authUser from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
  "/create-product",
  authUser,
  upload.array("images", 10),
  createProduct,
);
router.get("/allProducts", getAllProduct);

router.get("/category/:category", authUser, getProductsByCategory);

router.patch("/isSold/:id", authUser, updateSoldStatus);
export default router;
