import jwt from "jsonwebtoken";
import productModel from "../models/product.model.js";
import userModel from "../models/user.model.js";
import uploadOnCloudinary from "../services/cloudinary.services.js";
import config from "../config/config.js";

export async function createProduct(req, res) {
  try {
    const { title, description, price, category, condition, isSold } = req.body;

    if (!title || !description || !price || !category || !condition) {
      return res.status(400).json({ message: "All required fields must be provided." });
    }

    const files = req.files || [];
    let imageURL = [];

    if (files.length > 0) {
      const uploadedImages = await Promise.all(
        files.map(function (file) {
          return uploadOnCloudinary(file.path);
        })
      );
      imageURL = uploadedImages.map(function (image) {
        return image.secure_url;
      });
    }

    // Support additional image URLs passed via body
    if (req.body.images) {
      let bodyImages = req.body.images;
      if (typeof bodyImages === "string") {
        try {
          bodyImages = JSON.parse(bodyImages);
        } catch (e) {
          bodyImages = [bodyImages];
        }
      }
      if (Array.isArray(bodyImages)) {
        imageURL = [...imageURL, ...bodyImages.filter((img) => typeof img === "string" && img.trim())];
      }
    }

    if (imageURL.length === 0) {
      return res.status(400).json({
        message: "Product Images are required. Please upload at least one image.",
      });
    }

    const product = await productModel.create({
      title: title.trim(),
      description: description.trim(),
      price: Number(price),
      category,
      images: imageURL,
      seller: req.user._id,
      condition,
      isSold: isSold === true || isSold === "true",
    });

    return res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Error creating product:", error.message, error);
    return res.status(500).json({
      message: error.message || "Error while creating product post",
    });
  }
}

export async function getAllProduct(req, res) {
  try {
    const products = await productModel
      .find()
      .populate("seller", "userName email avatar collageName department phone semester")
      .sort({ createdAt: -1 });
    return res.status(200).json({
      message: "All products are featched successfully",
      count: products.length,
      allProducts: { products },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "error while featching products",
    });
  }
}

export async function getProductsByCategory(req, res) {
  try {
    const { category } = req.params;

    const products = await productModel
      .find({ category })
      .populate("seller", "userName email avatar collageName department phone semester")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export const updateSoldStatus = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("With destructure", id);

    const ids = req.params.id;
    console.log("Without destructure", ids);

    const { isSold } = req.body;

    const product = await productModel.findByIdAndUpdate(
      id,
      { isSold },
      { new: true },
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

