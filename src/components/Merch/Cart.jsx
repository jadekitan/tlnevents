import React, { useEffect, useContext } from "react";
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
  Stack,
} from "@chakra-ui/react";
import {
  AddIcon,
  MinusIcon,
  DeleteIcon,
} from "@chakra-ui/icons";
import { CartContext } from "./CartProvider";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { eventsData } from "../../../server/eventsData";
import { Helmet } from "react-helmet-async";

const Cart = () => {
  useEffect(() => {
    setTimeout(() => {
      document.title = 'Shopping Cart | The Lemonade Network Events';
      // Set or update description meta tag
      let descriptionMeta = document.querySelector('meta[name="description"]');
      if (!descriptionMeta) {
        descriptionMeta = document.createElement("meta");
        descriptionMeta.name = "description";
        document.head.appendChild(descriptionMeta);
      }
      descriptionMeta.content =
        `Your Shopping Cart for ${event.name} Merchandise.`;

      // Set or update Open Graph meta tags
      const ogTags = [
        { property: "og:title", content: 'Shopping Cart | The Lemonade Network Events' },
        {
          property: "og:description",
          content: `Your Shopping Cart for ${event.name} Merchandise.`,
        },
        { property: "og:image", content: "https://tlnevents.com/full-logo.jpg" },
        { property: "og:url", content: `https://tlnevents.com/${event.id}/merch/cart` },
      ];

      ogTags.forEach(({ property, content }) => {
        let metaTag = document.querySelector(`meta[property="${property}"]`);
        if (!metaTag) {
          metaTag = document.createElement("meta");
          metaTag.setAttribute("property", property);
          document.head.appendChild(metaTag);
        }
        metaTag.content = content;
      });
    }, 100);
  }, []);

  const {
    cart,
    updateQuantity,
    removeFromCart,
    getTotal,
    isDisable,
    isSubmitting,
  } = useContext(CartContext);

  const { eventId } = useParams(); // Get the event ID from the URL
  const event = eventsData[eventId]; // Lookup event from local data

  const total = getTotal();

  return (
    <>
      <Helmet>
        <meta charset="UTF-8" />
        <link
          rel="icon"
          type="image/svg+xml"
          href="https://tlnevents.com/favicon.png"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Shopping Cart | The Lemonade Network Events</title>
        <meta
          name="description"
          content={`Your Shopping Cart for ${event.name} Merchandise.`}
        />
        <meta
          property="og:title"
          content='Shopping Cart | The Lemonade Network Events'
        />
        <meta
          property="og:description"
          content={`Your Shopping Cart for ${event.name} Merchandise.`}
        />
        <meta
          property="og:image"
          content="https://tlnevents.com/full-logo.jpg"
        />
        <meta
          property="og:url"
          content={`https://tlnevents.com/${event?.id}/merch/cart`}
        />
        <meta property="og:type" content="website" />
      </Helmet>
      <VStack
        bg="white"
        w="100%"
        h="100%"
        align="flex-start"
        spacing={["50px", "25px", "80px"]}
        px={["20px", "25px", "50px", "75px", "100px"]}
        pt={["30px", "24px", "40px", "54px"]}
        pb={["30px", "24px", "40px", "54px"]}
      >
        {/* <Header /> */}
        <VStack w="100%" align="flex-start" spacing="40px">
          <Flex w="100%" justify="space-between" align="center">
            <Heading color="dark" fontSize={["18px", "22px"]} lineHeight="28px">
              Shopping Cart
            </Heading>
            <Text>
              {cart.length} {cart.length > 0 ? "items" : "item"}
            </Text>
          </Flex>
        </VStack>
        {cart.length > 0 ? (
          <Stack
            position="relative"
            flexDir={["column", "row"]}
            w="100%"
            justify={["flex-start", "space-between"]}
            align="flex-start"
          >
            <Box
              w={["100%", "100%", "100%", "544px"]}
              pb={["100px", "100px", "100px", 0]}
            >
              <Box w="100%">
                <VStack
                  w="100%"
                  justify="flex-start"
                  align="flex-start"
                  spacing={["20px", "40px"]}
                >
                  <Heading
                    display={["none", "none", "none", "block"]}
                    color="dark"
                    fontSize="22px"
                    lineHeight="28px"
                  >
                    Cart
                  </Heading>
                  {cart.map((item) => {
                    // Utility function to get the product image
                    const getProductImage = () => {
                      // Assumes image URLs follow a pattern like:
                      // "https://tlnevents.com/assets/merch/category/product-name(color-view).jpg"
                      const baseImage = item.image; // Use item's image property
                      const colorPart = item.color.toLowerCase(); // Use color from the item
                      const viewPart = item.view || "front";; // Handle selected view

                      // Replace the image in the original URL with the new color and view
                      return baseImage.replace(/\(.*\)/, `(${colorPart}-${viewPart})`);
                    };

                    return (
                      <Box
                        key={item.cartItemId}
                        p={4}
                        borderWidth={1}
                        borderRadius="lg"
                        borderColor="primary.500"
                        width="100%"
                      >
                        <VStack width="100%" align="start" spacing="0px">
                          <Flex w="100%" justify="space-between" align="center">
                            <Text fontWeight="bold">{item.name}</Text>
                            <IconButton
                              bg="transparent"
                              icon={<DeleteIcon w="15px" />}
                              onClick={() => removeFromCart(item.cartItemId)}
                            />
                          </Flex>
                          <HStack align="flex-start">
                            <Box w={["80px", "100px"]} h={["80px", "100px"]}>
                              <Image w="100%" h="100%" src={getProductImage()} alt={item.name} />
                            </Box>
                            <VStack align="flex-start">
                              <Text color="gray.600">Color: {item.color}</Text>
                              {item.size && <Text color="gray.600">Size: {item.size}</Text>}
                              <Flex width="100%" align="center" gap={["20px"]}>
                                <HStack width="40%">
                                  <IconButton
                                    height="30px"
                                    minW="30px"
                                    icon={<MinusIcon width="10px" />}
                                    onClick={() =>
                                      updateQuantity(item.cartItemId, item.quantity - 1)
                                    }
                                  />
                                  <Text width="40px" textAlign="center">
                                    {item.quantity}
                                  </Text>
                                  <IconButton
                                    height="30px"
                                    minW="30px"
                                    icon={<AddIcon width="10px" />}
                                    onClick={() =>
                                      updateQuantity(item.cartItemId, item.quantity + 1)
                                    }
                                  />
                                </HStack>
                                <Text>
                                  ₦ {(item.price * item.quantity).toLocaleString()}
                                </Text>
                              </Flex>
                            </VStack>
                          </HStack>
                        </VStack>
                      </Box>
                    );
                  })}

                </VStack>
              </Box>
            </Box>
            <VStack
              display={["none", "none", "none", "flex"]}
              position="sticky"
              top="20px"
              w="450px"
              align="flex-start"
              spacing="40px"
            >
              <Heading color="dark" fontSize="22px" lineHeight="28px">
                Order Summary
              </Heading>
              <Box
                w="100%"
                py="40px"
                px="40px"
                rounded="8px"
                border="1px"
                borderColor="primary.500"
              >
                <VStack align="center" spacing="50px">
                  <Heading
                    color="dark"
                    textAlign="center"
                    fontSize="20px"
                    lineHeight="28px"
                  >
                    {event.name} Merch
                  </Heading>

                  <VStack
                    width="100%"
                    justify="flex-start"
                    align="start"
                    spacing="30px"
                  >
                    <VStack
                      w="100%"
                      justify="flex-start"
                      align="start"
                      spacing="20px"
                    >
                      <Flex w="100%" justify="space-between" align="flex-start">
                        <Text color="dark" fontSize="16px" lineHeight="24px">
                          Subtotal
                        </Text>
                        <Heading color="dark" fontSize="16px" lineHeight="24px">
                          ₦ {total.toLocaleString()}
                        </Heading>
                      </Flex>

                      <Flex w="100%" justify="space-between" align="flex-start">
                        <Text color="dark" fontSize="16px" lineHeight="24px">
                          Fees
                        </Text>
                        <Heading color="dark" fontSize="16px" lineHeight="24px">
                          Free 🎉
                        </Heading>
                      </Flex>
                    </VStack>
                    <Box w="100%" h="1px" bg="primary.500"></Box>
                    <Flex w="100%" justify="space-between" align="flex-start">
                      <Text color="dark" fontSize="16px" lineHeight="24px">
                        Total
                      </Text>
                      <Heading color="dark" fontSize="16px" lineHeight="24px">
                        ₦ {total.toLocaleString()}
                      </Heading>
                    </Flex>

                    {/* Continue Button */}
                    <><Link to={`/${event.id}/merch/checkout`}>
                      <Button
                        type="submit"
                        w="100%"
                        bg="primary.500"
                        rounded="8px"
                        _hover={{ bg: "primary.400" }}
                        _active={{ bg: "secondary.500" }}
                        _focus={{ bg: "secondary.500" }}
                        isDisabled={isDisable}
                        isLoading={isSubmitting}
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
                    </Link></>
                  </VStack>
                </VStack>
              </Box>
            </VStack>
            <Box
              display={["block", "block", "block", "none"]}
              w="100%"
              h="73px"
              position="fixed"
              left="0"
              bottom="17px"
              px="20px"
              rounded="8px"
            >
              <Flex
                h="100%"
                py="14px"
                px="20px"
                rounded="8px"
                bg="primary.500"
                justify="space-between"
                align="center"
              >
                <Heading color="dark" fontSize="24px" lineHeight="32px">
                  {` ₦ ${total.toLocaleString()}`}
                </Heading>
                <Link to={`/${event.id}/merch/checkout`}>
                  <Button
                    w="122px"
                    rounded="8px"
                    bg="secondary.500"
                    _hover={{ bg: "primary.400" }}
                    _active={{ bg: "secondary.500" }}
                    _focus={{ bg: "secondary.500" }}
                    isDisabled={isDisable}
                    isLoading={isSubmitting}
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
                </Link>
              </Flex>
            </Box>
          </Stack>
        ) : (
          <VStack w="100%" h="60vh" justify="center" align="center">
            <Text color="neutral.500" fontSize={["16px", "18px", "20px"]}>
              There are no items in your cart.
            </Text>
            <Link to={`/${event.id}/merch`}>
              <Button bg="primary.500">
                <Text fontSize={["14px", "16px"]}>Continue Shopping</Text>
              </Button>
            </Link>
          </VStack>
        )}
      </VStack>
    </>
  );
};

export default Cart;
