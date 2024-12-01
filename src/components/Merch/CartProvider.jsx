import React, { useState, useCallback, useEffect, useRef } from "react";
import { debounce } from "lodash";

export const CartContext = React.createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    // Initialize cart from localStorage if available
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const clearCart = () => {
    // Clear cart state
    setCart([]);
    // Remove cart from localStorage
    localStorage.removeItem("cart");
  };

  const addToCart = (product, options) => {
    const { size = null, color, quantity = 1, view = "front" } = options;

    const cartItemId = size
      ? `${product.id}-${size}-${color}-${view}`
      : `${product.id}-${color}-${view}`;

    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.cartItemId === cartItemId
      );

      if (existingItem) {
        // Update quantity if item exists
        return prevCart.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      const newItem = {
        ...product,
        cartItemId,
        color,
        quantity,
        view, // Store selected view
        ...(size && { size }),
      };

      return [...prevCart, newItem];
    });
  };


  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.cartItemId === cartItemId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromCart = (cartItemId) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.cartItemId !== cartItemId)
    );
  };

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const [contactData, setContactData] = useState(() => {
    const storedContactData = localStorage.getItem("contactData");
    return storedContactData
      ? JSON.parse(storedContactData)
      : {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        countryCode: "+234",
      };
  });

  // Debounced localStorage save
  const saveToLocalStorage = useCallback(
    debounce((data) => {
      localStorage.setItem("contactData", JSON.stringify(data));
    }, 300),
    []
  );

  // General contact data change handler
  const handleContactDataChange = useCallback(
    (newData) => {
      setContactData((prevData) => {
        const updatedData = { ...prevData, ...newData };
        requestAnimationFrame(() => {
          saveToLocalStorage(updatedData);
        });
        return updatedData;
      });
    },
    [saveToLocalStorage]
  );

  // Call save on form blur
  const handleBlur = useCallback(() => {
    saveToLocalStorage(contactData);
  }, [contactData, saveToLocalStorage]);

  const clearContactData = () => {
    setContactData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      countryCode: "+234",
    });
    localStorage.removeItem("contactData");
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDisable, setIsDisable] = useState(false);

  return (
    <CartContext.Provider
      value={{
        cart,
        clearCart,
        addToCart,
        updateQuantity,
        getTotal,
        contactData,
        setContactData,
        handleContactDataChange,
        handleBlur,
        isSubmitting,
        setIsSubmitting,
        isDisable,
        setIsDisable,
        removeFromCart,
        clearContactData,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
