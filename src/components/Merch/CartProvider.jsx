import React, { useState, createContext, useContext } from "react";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Container,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Image,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useDisclosure,
  VStack,
  HStack,
  Badge,
  IconButton,
  useToast,
  Flex,
} from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { useParams } from "react-router-dom";
import { eventsData } from "../../../server/eventsData";

export const CartContext = React.createContext();

const CartProvider = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { eventId } = useParams(); // Get the event ID from the URL
  const event = eventsData[eventId]; // Lookup event from local data

  const products = useState(event ? event.merch : []);

  const [cart, setCart] = useState([]);
  const [checkoutStep, setCheckoutStep] = useState("cart");

  const addToCart = (product, size, color, quantity) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) =>
          item.id === product.id && item.size === size && item.color === color
      );

      if (existingItem) {
        return prevCart.map((item) =>
          item === existingItem
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [
        ...prevCart,
        {
          ...product,
          size,
          color,
          quantity,
          cartItemId: `${product.id}-${size}-${color}`,
        },
      ];
    });
  };

  const updateQuantity = (cartItemId, newQuantity) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: Math.max(0, newQuantity) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  // New function to render the Cart Drawer
  const renderCartDrawer = () => (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>
          {checkoutStep === "cart" ? "Shopping Cart" : "Checkout"}
        </DrawerHeader>

        <DrawerBody>
          {checkoutStep === "cart" ? (
            <VStack spacing={4}>
              {cart.map((item) => (
                <Box
                  key={item.cartItemId}
                  p={4}
                  borderWidth={1}
                  borderRadius="lg"
                  width="full"
                >
                  <HStack justify="space-between">
                    <VStack align="start">
                      <Text fontWeight="bold">{item.name}</Text>
                      <Text color="gray.600">
                        Size: {item.size}, Color: {item.color}
                      </Text>
                      <Text>${(item.price * item.quantity).toFixed(2)}</Text>
                    </VStack>
                    <HStack>
                      <IconButton
                        icon={<MinusIcon />}
                        onClick={() =>
                          updateQuantity(item.cartItemId, item.quantity - 1)
                        }
                      />
                      <Text width="40px" textAlign="center">
                        {item.quantity}
                      </Text>
                      <IconButton
                        icon={<AddIcon />}
                        onClick={() =>
                          updateQuantity(item.cartItemId, item.quantity + 1)
                        }
                      />
                    </HStack>
                  </HStack>
                </Box>
              ))}
            </VStack>
          ) : (
            <CheckoutForm />
          )}
        </DrawerBody>

        <DrawerFooter>
          {checkoutStep === "cart" ? (
            cart.length > 0 ? (
              <VStack width="full" spacing={4}>
                <Text fontSize="xl" fontWeight="bold">
                  Total: ${getTotal().toFixed(2)}
                </Text>
                <Button
                  colorScheme="blue"
                  width="full"
                  onClick={() => setCheckoutStep("checkout")}
                >
                  Proceed to Checkout
                </Button>
              </VStack>
            ) : (
              <Text color="gray.500">Your cart is empty</Text>
            )
          ) : (
            <Button
              variant="outline"
              mr={3}
              onClick={() => setCheckoutStep("cart")}
            >
              Back to Cart
            </Button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        getTotal,
        checkoutStep,
        setCheckoutStep,
        onOpen,
        renderCartDrawer,
        isOpen,
        onClose,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
