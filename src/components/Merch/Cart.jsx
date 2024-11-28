import React, { useEffect, useContext, useState, useRef } from "react";
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  HStack,
  IconButton,
  Flex,
  Image,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useToast,
} from "@chakra-ui/react";
import {
  AddIcon,
  MinusIcon,
  DeleteIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import CheckoutForm from "./CheckoutForm";
import { CartContext } from "./CartProvider";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { eventsData } from "../../../server/eventsData";
import { Helmet } from "react-helmet-async";

const Cart = () => {
  useEffect(() => {
    document.title = "Shopping Cart | The Lemonade Network";
  }, []);
  const {
    cart,
    checkoutStep,
    setCheckoutStep,
    getTotal,
    contactData,
    removeFromCart,
  } = useContext(CartContext);

  const { eventId } = useParams(); // Get the event ID from the URL
  const event = eventsData[eventId]; // Lookup event from local data

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDisable, setIsDisable] = useState(false);

  const toast = useToast();

  const total = getTotal();

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
  return (
    <>
      <Helmet>
        <title>Shopping Cart | The Lemonade Network</title>
        <meta
          property="og:title"
          content="Shopping Cart | The Lemonade Network"
        />
      </Helmet>
      <VStack
        w="100%"
        h="100%"
        justify="center"
        align="center"
        spacing={["25px", "60px", "70px", "75px", "30px"]}
      >
        <Flex
          width="100%"
          h="80px"
          boxShadow="sm"
          justify="space-between"
          align="center"
          px={["20px", "50px", "75px", "100px"]}
        >
          <Link to="/">
            <Image
              w={["100px", "120px"]}
              src="/logo.webp"
              alt="The Lemonade Logo"
            />
          </Link>

          <Breadcrumb
            spacing="8px"
            separator={<ChevronRightIcon color="gray.500" />}
          >
            <BreadcrumbItem>
              <BreadcrumbLink href={`/${event.id}/merch`}>
                <Text color="neutral.500" fontSize={["14px", "16px"]}>
                  Merch
                </Text>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink href="#">
                <Text color="dark" fontSize={["16px", "18px"]}>
                  {checkoutStep === "cart" ? "Cart" : "Checkout"}
                </Text>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </Flex>

        <Box py="20px" px={["20px", "50px", "75px", "100px"]}>
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
            <VStack width="100%" height="70vh" justify="center" spacing="20px">
              <Text color="gray.500" fontSize={["18px", "24px"]}>
                There are no items in your cart
              </Text>
              <Link to={`/${event.id}/merch`}>
                <Button bg="primary.500">
                  <Text fontSize={["14px", "16px"]}>Continue Shopping</Text>
                </Button>
              </Link>
            </VStack>
          )}
        </Box>
        <Box>
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
        </Box>
      </VStack>
    </>
  );
};

export default Cart;
