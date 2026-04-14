import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, quantity = 1) => {
        setCartItems((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                toast.success(`Updated quantity for ${product.name}`);
                return prev.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            toast.success(`Added ${product.name} to cart`);
            return [...prev, { ...product, quantity }];
        });
    };

    const removeFromCart = (id) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
        toast.success('Item removed from cart');
    };

    const updateQuantity = (id, quantity) => {
        if (quantity < 1) return;
        setCartItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, quantity } : item))
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const placeOrder = async (orderDetails) => {
        try {
            const { data } = await api.post('/orders', {
                orderItems: cartItems,
                addressLine1: orderDetails.addressLine1,
                addressLine2: orderDetails.addressLine2,
                city: orderDetails.city,
                zipCode: orderDetails.zipCode,
                phone: orderDetails.phone,
                totalPrice: cartTotal,
            });

            // Keep localStorage logic for backup/offline or just remove it? 
            // Better to rely on backend source of truth now, but we can update local state if needed.
            // For now, let's just clear cart.

            clearCart();
            toast.success('Order placed successfully!');
            return data;
        } catch (error) {
            console.error('Order placement failed:', error);
            toast.error(error.response?.data?.message || 'Failed to place order');
            throw error;
        }
    };

    const cartTotal = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                placeOrder,
                cartTotal,
                cartCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
