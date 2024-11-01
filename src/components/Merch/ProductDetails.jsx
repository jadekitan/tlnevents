import React, { useState, createContext, useContext } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Radio,
  RadioGroup,
  Text,
  VStack,
  HStack,
  IconButton,
  useToast,
  Flex,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Stack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
} from "@chakra-ui/react";
import { useParams, Link } from "react-router-dom";
import { eventsData } from "../../../server/eventsData";
import { CartContext } from "./CartProvider";
import { AddIcon, MinusIcon, DeleteIcon } from "@chakra-ui/icons";
import { FaShoppingCart } from "react-icons/fa";
import { create } from "lodash";

const ProductDetails = () => {
  const { eventId } = useParams(); // Get the event ID from the URL
  const { productId } = useParams(); // Get the event ID from the URL
  const event = eventsData[eventId]; // Lookup event from local data

  const product = event.merch[productId];

  const { cart, onOpen, renderCartDrawer, addToCart } = useContext(CartContext);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  const toast = useToast();

  const handleAddToCart = () => {
    if (selectedSize && selectedColor) {
      addToCart(product, selectedSize, selectedColor, quantity);
      setQuantity(1);
      setSelectedSize("");
      setSelectedColor("");
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack
      w="100%"
      h="100%"
      justify="center"
      align="center"
      spacing={["50px", "60px", "70px", "75px", "30px"]}
    >
      <VStack
        w="100%"
        h="100%"
        justify="center"
        align="center"
        spacing={["25px", "60px", "70px", "75px", "30px"]}
        px={["20px", "50px", "75px", "100px"]}
      >
        <Flex w="100%" justify="space-between" align="center" py="20px">
          <Link to="/">
            <Image
              w={["120px", "150px"]}
              src="/logo.webp"
              alt="The Lemonade Logo"
            ></Image>
          </Link>
          <Box as="button" onClick={onOpen} position="relative">
            <Box>
              <FaShoppingCart className=" w-8 h-8" />
            </Box>
            {cart.length > 0 && (
              <Box
                position="absolute"
                top="-2"
                right="-2"
                bg="primary.500"
                color="white"
                borderRadius="full"
                w={4}
                h={4}
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="xs"
              >
                <Text>{cart.length}</Text>
              </Box>
            )}
          </Box>
        </Flex>
        <VStack w="100%" h="100%" align="flex-start" spacing="20px">
          <Breadcrumb fontWeight="500" color="Dark">
            <BreadcrumbItem>
              <BreadcrumbLink href={`/${event.id}/merch`}>
                <Text color="neutral.500" fontSize={["14px", "16px"]}>
                  Merch
                </Text>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink href="/discover">
                <Text color="dark" fontSize={["14px", "16px"]}>
                  {product.name}
                </Text>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          <Stack
            w="100%"
            h="100%"
            position="relative"
            flexDir={["column", "column", "column", "row"]}
            justify="flex-start"
            align="flex-start"
            spacing="40px"
          >
            <Box
              display={["none", "none", "none", "flex"]}
              position="sticky"
              top="20px"
              w="35%"
              justify="center"
              align="center"
              spacing="20px"
            >
              <Box w="100%" h={["70vh", "70vh", "70vh", "30vh", "70vh"]}>
                <Image
                  w="100%"
                  h="100%"
                  rounded="8px"
                  src={product.image}
                  alt="Event banner"
                />
              </Box>
            </Box>
            <Box
              display={["block", "block", "block", "none"]}
              w={["100%", "100%", "70%", "70%", "100%"]}
              h={["384px", "384px", "400px", "384px", "384px"]}
            >
              <Image
                src={product.image}
                alt={product.id}
                width="100%"
                height="100%"
                rounded="8px"
                alignSelf="stretch"
              />
            </Box>

            <VStack
              w={["100%", "100%", "100%", "65%"]}
              align="flex-start"
              spacing={["10px", "30px"]}
            >
              <VStack w="100%" align="flex-start" spacing={["10px", "10px"]}>
                <Heading color="dark" fontSize={["28px", "32px"]}>
                  {product.name}
                </Heading>
                <Text color="primary.500" fontSize={["14px", "16px"]}>
                  &#8358;{product.price.toLocaleString()}
                </Text>
              </VStack>

              <FormControl>
                <FormLabel>Color</FormLabel>
                <RadioGroup value={selectedColor} onChange={setSelectedColor}>
                  <Stack direction="row" spacing={4}>
                    {product.colors.map((color) => (
                      <Radio
                        key={color}
                        value={color}
                        sx={{
                          "& .chakra-radio__control": {
                            backgroundColor: color, // Background for unselected state
                            borderColor: color, // Border color for circle
                          },
                          "& .chakra-radio__control[data-checked]": {
                            backgroundColor: "dark", // Background color when checked
                            borderColor: color, // Border color when checked
                          },
                          "& .chakra-radio__control:hover": {
                            opacity: 0.8, // Slightly dim when hovered
                          },
                        }}
                      >
                        {color}
                      </Radio>
                    ))}
                  </Stack>
                </RadioGroup>
              </FormControl>

              <FormControl>
                <FormLabel>Size</FormLabel>
                <RadioGroup value={selectedSize} onChange={setSelectedSize}>
                  <Stack direction="row" spacing={4}>
                    {product.sizes.map((size) => (
                      <Radio key={size} value={size}>
                        {size}
                      </Radio>
                    ))}
                  </Stack>
                </RadioGroup>
              </FormControl>

              <Stack w="100%" flexDir={["row"]} align="flex-start">
                <HStack w="30%">
                  <IconButton
                    icon={<MinusIcon />}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  />
                  <Text width="40px" textAlign="center">
                    {quantity}
                  </Text>
                  <IconButton
                    icon={<AddIcon />}
                    onClick={() => setQuantity((q) => q + 1)}
                  />
                </HStack>
                <Button
                  bg="primary.500"
                  width="60%"
                  rounded={["10px", "20px"]}
                  onClick={handleAddToCart}
                  isDisabled={!selectedSize || !selectedColor}
                >
                  Add to Cart
                </Button>
              </Stack>
              <Accordion allowToggle w="100%">
                <VStack w="100%" align="center" columnGap="49px">
                  <AccordionItem w="100%">
                    {({ isExpanded }) => (
                      <>
                        <h2>
                          <AccordionButton
                            w="100%"
                            mt={["10px", "15px", "20px"]}
                          >
                            <Box as="span" flex="1" textAlign="left">
                              <Heading
                                color="neutral.500"
                                fontSize={["24px", "28px"]}
                              >
                                Description
                              </Heading>
                            </Box>
                            {isExpanded ? (
                              <MinusIcon
                                color={["#F48020", "primary.500"]}
                                fontSize="16px"
                              />
                            ) : (
                              <AddIcon
                                color={["#F48020", "primary.500"]}
                                fontSize="16px"
                              />
                            )}
                          </AccordionButton>
                        </h2>
                        <AccordionPanel
                          textAlign="left"
                          fontSize={["12px", "14px", "17px"]}
                          pb={4}
                        >
                          {product.description}
                        </AccordionPanel>
                      </>
                    )}
                  </AccordionItem>
                </VStack>
              </Accordion>
            </VStack>
          </Stack>
          <Box
            display={["block", "block", "block", "none"]}
            position="fixed"
            bottom="0px"
            left="0"
            w="100%"
            h="75px"
            bg="primary.500"
            borderTopRadius="8px"
            p="20px"
          >
            <VStack w="100%" justify="center" align="center">
              <Link to={`/${event.id}/checkout`}>
                <Button size="lg" bg="secondary.500" color="dark">
                  Get Ticket
                </Button>
              </Link>
            </VStack>
          </Box>
        </VStack>
      </VStack>
      {renderCartDrawer()}
    </VStack>
  );
};

export default ProductDetails;
