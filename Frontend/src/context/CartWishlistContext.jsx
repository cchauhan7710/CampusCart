import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const CartWishlistContext = createContext(null);

const API_BASE_URL = 'http://localhost:5000/api';

export const CartWishlistProvider = ({ children }) => {
    const { token, isAuthenticated } = useAuth();
    const [cart, setCart] = useState({ items: [] });
    const [wishlist, setWishlist] = useState({ products: [] });
    const [loadingCart, setLoadingCart] = useState(false);
    const [loadingWishlist, setLoadingWishlist] = useState(false);

    const getAuthHeaders = useCallback(() => {
        const authToken = token || localStorage.getItem('token');
        return authToken ? { Authorization: `Bearer ${authToken}` } : {};
    }, [token]);

    // Fetch user cart from API
    const fetchCart = useCallback(async () => {
        if (!isAuthenticated) {
            setCart({ items: [] });
            return;
        }
        try {
            setLoadingCart(true);
            const res = await axios.get(`${API_BASE_URL}/cart`, {
                headers: getAuthHeaders(),
                withCredentials: true,
            });
            if (res.data?.cart) {
                setCart(res.data.cart);
            }
        } catch (err) {
            console.error('Failed to fetch cart:', err);
        } finally {
            setLoadingCart(false);
        }
    }, [isAuthenticated, getAuthHeaders]);

    // Fetch user wishlist from API
    const fetchWishlist = useCallback(async () => {
        if (!isAuthenticated) {
            setWishlist({ products: [] });
            return;
        }
        try {
            setLoadingWishlist(true);
            const res = await axios.get(`${API_BASE_URL}/wishlist`, {
                headers: getAuthHeaders(),
                withCredentials: true,
            });
            if (res.data?.wishlist) {
                setWishlist(res.data.wishlist);
            }
        } catch (err) {
            console.error('Failed to fetch wishlist:', err);
        } finally {
            setLoadingWishlist(false);
        }
    }, [isAuthenticated, getAuthHeaders]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
            fetchWishlist();
        } else {
            setCart({ items: [] });
            setWishlist({ products: [] });
        }
    }, [isAuthenticated, fetchCart, fetchWishlist]);

    // ADD to Cart
    const addToCart = async (product, quantity = 1) => {
        if (!isAuthenticated) {
            toast.error('Please log in to add items to your cart');
            return false;
        }
        const productId = product?._id || product?.id;
        if (!productId) return false;

        try {
            const res = await axios.post(
                `${API_BASE_URL}/cart/add`,
                { productId, quantity },
                {
                    headers: getAuthHeaders(),
                    withCredentials: true,
                }
            );
            if (res.data?.cart) {
                setCart(res.data.cart);
                toast.success(`Added "${product.title || 'Item'}" to Cart`);
                return true;
            }
        } catch (err) {
            console.error('Error adding to cart:', err);
            const msg = err.response?.data?.message || 'Failed to add item to cart';
            toast.error(msg);
            return false;
        }
    };

    // UPDATE Cart Item Quantity
    const updateCartQty = async (productId, quantity) => {
        if (!isAuthenticated) return;
        try {
            const res = await axios.put(
                `${API_BASE_URL}/cart/update`,
                { productId, quantity },
                {
                    headers: getAuthHeaders(),
                    withCredentials: true,
                }
            );
            if (res.data?.cart) {
                setCart(res.data.cart);
                if (quantity <= 0) {
                    toast.success('Item removed from cart');
                }
            }
        } catch (err) {
            console.error('Error updating cart quantity:', err);
            toast.error(err.response?.data?.message || 'Failed to update item quantity');
        }
    };

    // REMOVE from Cart
    const removeFromCart = async (productId) => {
        if (!isAuthenticated) return;
        try {
            const res = await axios.delete(`${API_BASE_URL}/cart/remove/${productId}`, {
                headers: getAuthHeaders(),
                withCredentials: true,
            });
            if (res.data?.cart) {
                setCart(res.data.cart);
                toast.success('Item removed from cart');
            }
        } catch (err) {
            console.error('Error removing from cart:', err);
            toast.error(err.response?.data?.message || 'Failed to remove item');
        }
    };

    // CLEAR Cart
    const clearCart = async () => {
        if (!isAuthenticated) return;
        try {
            const res = await axios.delete(`${API_BASE_URL}/cart/clear`, {
                headers: getAuthHeaders(),
                withCredentials: true,
            });
            if (res.data?.cart) {
                setCart(res.data.cart);
                toast.success('Cart cleared');
            }
        } catch (err) {
            console.error('Error clearing cart:', err);
            toast.error(err.response?.data?.message || 'Failed to clear cart');
        }
    };

    // TOGGLE Wishlist
    const toggleWishlist = async (product) => {
        if (!isAuthenticated) {
            toast.error('Please log in to save items to your wishlist');
            return false;
        }
        const productId = product?._id || product?.id;
        if (!productId) return false;

        try {
            const res = await axios.post(
                `${API_BASE_URL}/wishlist/toggle`,
                { productId },
                {
                    headers: getAuthHeaders(),
                    withCredentials: true,
                }
            );
            if (res.data?.wishlist) {
                setWishlist(res.data.wishlist);
                if (res.data.isWishlisted) {
                    toast.success(`Saved "${product.title || 'Item'}" to Wishlist ❤️`);
                } else {
                    toast.success(`Removed from Wishlist`);
                }
                return res.data.isWishlisted;
            }
        } catch (err) {
            console.error('Error toggling wishlist:', err);
            toast.error(err.response?.data?.message || 'Failed to update wishlist');
            return false;
        }
    };

    // REMOVE from Wishlist
    const removeFromWishlist = async (productId) => {
        if (!isAuthenticated) return;
        try {
            const res = await axios.delete(`${API_BASE_URL}/wishlist/remove/${productId}`, {
                headers: getAuthHeaders(),
                withCredentials: true,
            });
            if (res.data?.wishlist) {
                setWishlist(res.data.wishlist);
                toast.success('Removed from Wishlist');
            }
        } catch (err) {
            console.error('Error removing from wishlist:', err);
            toast.error(err.response?.data?.message || 'Failed to remove item');
        }
    };

    // Helper checks
    const isInWishlist = (productId) => {
        if (!productId || !wishlist?.products) return false;
        return wishlist.products.some((item) => {
            const id = typeof item === 'object' ? item._id : item;
            return id?.toString() === productId?.toString();
        });
    };

    const isInCart = (productId) => {
        if (!productId || !cart?.items) return false;
        return cart.items.some((item) => {
            const id = typeof item.product === 'object' ? item.product._id : item.product;
            return id?.toString() === productId?.toString();
        });
    };

    // Calculate totals
    const cartCount = cart?.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;

    const cartTotal = cart?.items?.reduce((sum, item) => {
        const itemPrice = item.price || item.product?.price || 0;
        return sum + itemPrice * (item.quantity || 1);
    }, 0) || 0;

    const wishlistCount = wishlist?.products?.length || 0;

    const [selectedProduct, setSelectedProduct] = useState(null);

    const openProductDetails = (product) => {
        if (product) {
            setSelectedProduct(product);
        }
    };

    const closeProductDetails = () => {
        setSelectedProduct(null);
    };

    return (
        <CartWishlistContext.Provider
            value={{
                cart,
                wishlist,
                cartCount,
                cartTotal,
                wishlistCount,
                loadingCart,
                loadingWishlist,
                selectedProduct,
                openProductDetails,
                closeProductDetails,
                fetchCart,
                fetchWishlist,
                addToCart,
                updateCartQty,
                removeFromCart,
                clearCart,
                toggleWishlist,
                removeFromWishlist,
                isInWishlist,
                isInCart,
            }}
        >
            {children}
        </CartWishlistContext.Provider>
    );
};

export const useCartWishlist = () => {
    const context = useContext(CartWishlistContext);
    if (!context) {
        throw new Error('useCartWishlist must be used within a CartWishlistProvider');
    }
    return context;
};
