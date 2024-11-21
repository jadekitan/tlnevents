import React, { useState, useCallback, useRef } from "react";
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
  ButtonGroup,
} from "@chakra-ui/react";
import { AddIcon, MinusIcon, DeleteIcon } from "@chakra-ui/icons";
import CheckoutForm from "./CheckoutForm";
import { useParams } from "react-router-dom";
import { eventsData } from "../../../server/eventsData";
import { debounce } from "lodash";

export const CartContext = React.createContext();

const CartProvider = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { eventId } = useParams(); // Get the event ID from the URL
  const event = eventsData[eventId]; // Lookup event from local data

  const products = useState(event ? event.merch : []);

  const [cart, setCart] = useState([]);
  const [checkoutStep, setCheckoutStep] = useState("cart");

  const addToCart = (product, options) => {
    const { size = null, color, quantity = 1 } = options;

    const cartItemId = size
      ? `${product.id}-${size}-${color}`
      : `${product.id}-${color}`;

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

  const total = getTotal();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDisable, setIsDisable] = useState(false);

  const toast = useToast();

  const handlePaystackPayment = (
    firstName,
    lastName,
    email,
    countryCode,
    phone,
    total
  ) => {
    const handler = window.PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
      name: `${firstName} ${lastName}`,
      email: email,
      phone: `${countryCode}${phone}`,
      amount: total * 100, // Paystack uses Kobo (1 Naira = 100 Kobo)
      currency: "NGN",
      ref: `${new Date().getTime()}`, // Unique reference
      onClose: () => {
        toast({
          position: "top",
          title: "Payment cancelled.",
          description: "You have exited the payment process.",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
        setIsDisable(false);
        setIsSubmitting(false);
      },
      callback: (response) => {
        // Redirect on successful payment verification
        window.location.href = `/${event.id}/checkout/payment-success?reference=${response.reference}&email=${email}`;
        setIsDisable(false);
        setIsSubmitting(false);
      },
    });

    handler.openIframe();
  };

  const handleNextStep = () => {
    handlePaystackPayment(
      contactData.firstName,
      contactData.lastName,
      contactData.email,
      contactData.countryCode,
      contactData.phone,
      total
    );
  };

  const formRef = useRef(null);

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
          {cart.length > 0 ? (
            checkoutStep === "cart" ? (
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
                          Color: {item.color}{" "}
                          {item.size && `, Size: ${item.size}`}
                        </Text>

                        <Text>
                          ₦ {(item.price * item.quantity).toLocaleString()}
                        </Text>
                      </VStack>
                      <VStack width={["30%", "60%"]} align="flex-end">
                        <HStack width="100%">
                          <IconButton
                            height={["30px", "50px"]}
                            minW={["30px", "50px"]}
                            icon={<MinusIcon width={["10px", "20px"]} />}
                            onClick={() =>
                              updateQuantity(item.cartItemId, item.quantity - 1)
                            }
                          />
                          <Text width="40px" textAlign="center">
                            {item.quantity}
                          </Text>
                          <IconButton
                            height={["30px", "50px"]}
                            minW={["30px", "50px"]}
                            icon={<AddIcon width={["10px", "20px"]} />}
                            onClick={() =>
                              updateQuantity(item.cartItemId, item.quantity + 1)
                            }
                          />
                        </HStack>
                        <IconButton
                          icon={<DeleteIcon />}
                          onClick={removeFromCart}
                        />
                      </VStack>
                    </HStack>
                  </Box>
                ))}
              </VStack>
            ) : (
              <CheckoutForm handleNextStep={handleNextStep} formRef={formRef} />
            )
          ) : (
            <VStack width="100%">
              <Text color="gray.500">Your cart is empty</Text>
            </VStack>
          )}
        </DrawerBody>
        <DrawerFooter>
          {cart.length > 0 ? (
            checkoutStep === "cart" ? (
              <Flex
                width="100%"
                h="100%"
                py="14px"
                px="20px"
                rounded="8px"
                bg="primary.500"
                justify="space-between"
                align="center"
              >
                <Heading color="dark" fontSize="24px" lineHeight="32px">
                  {` ₦ ${getTotal().toLocaleString()}`}
                </Heading>
                <Button
                  w="122px"
                  rounded="8px"
                  bg="secondary.500"
                  _hover={{ bg: "primary.400" }}
                  _active={{ bg: "secondary.500" }}
                  _focus={{ bg: "secondary.500" }}
                  onClick={() => setCheckoutStep("checkout")}
                >
                  <Text
                    color="dark"
                    fontSize="14px"
                    fontWeight="600"
                    lineHeight="20px"
                  >
                    Continue
                  </Text>
                </Button>
              </Flex>
            ) : (
              <Flex
                width="100%"
                h="100%"
                py="14px"
                px="20px"
                rounded="8px"
                bg="primary.500"
                justify="space-between"
                align="center"
              >
                <Heading color="dark" fontSize="24px" lineHeight="32px">
                  {` ₦ ${getTotal().toLocaleString()}`}
                </Heading>

                <Button
                  type="submit"
                  w="122px"
                  rounded="8px"
                  bg="secondary.500"
                  _hover={{ bg: "primary.400" }}
                  _active={{ bg: "secondary.500" }}
                  _focus={{ bg: "secondary.500" }}
                  isDisabled={isDisable}
                  isLoading={isSubmitting}
                  onClick={() => {
                    if (formRef.current) {
                      formRef.current.handleSubmit(); // Trigger form submission
                    }
                  }}
                  loadingText="Checkout"
                  spinnerPlacement="end"
                >
                  <Text
                    color="dark"
                    fontSize="14px"
                    fontWeight="600"
                    lineHeight="20px"
                  >
                    Checkout
                  </Text>
                </Button>
              </Flex>
            )
          ) : null}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
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
        contactData,
        setContactData,
        handleContactDataChange,
        handleBlur,
        isSubmitting,
        setIsSubmitting,
        isDisable,
        setIsDisable,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
