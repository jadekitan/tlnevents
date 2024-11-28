import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Image,
  // Radio,
  // RadioGroup,
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
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
  useDisclosure,
} from "@chakra-ui/react";
import { useParams, Link } from "react-router-dom";
import { eventsData } from "../../../server/eventsData";
import { CartContext } from "./CartProvider";
import {
  AddIcon,
  MinusIcon,
  DeleteIcon,
  CheckCircleIcon,
} from "@chakra-ui/icons";
import { FaShoppingCart } from "react-icons/fa";
import { Radio, RadioGroup } from "@headlessui/react";
import { Helmet } from "react-helmet-async";

const ProductDetails = () => {
  const { eventId } = useParams(); // Get the event ID from the URL
  const { productId } = useParams(); // Get the event ID from the URL
  const { itemId } = useParams();
  const event = eventsData[eventId]; // Lookup event from local data

  const merch = event.merch[productId];

  const product = merch[itemId];

  useEffect(() => {
    setTimeout(() => {
      document.title = `${product?.name} | The Lemonade Network`;
      // Set or update description meta tag
      let descriptionMeta = document.querySelector('meta[name="description"]');
      if (!descriptionMeta) {
        descriptionMeta = document.createElement("meta");
        descriptionMeta.name = "description";
        document.head.appendChild(descriptionMeta);
      }
      descriptionMeta.content =
        event.about?.description || "Default description";

      // Set or update Open Graph meta tags
      const ogTags = [
        { property: "og:title", content: product?.name },
        {
          property: "og:description",
          content: product?.description?.head || "Default description",
        },
        { property: "og:image", content: product?.image },
        { property: "og:url", content: `https://tlnevents.com/${event.id}` },
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

  const { cart, renderCartDrawer, addToCart, removeFromCart, getTotal } =
    useContext(CartContext);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    // Validate required selections
    if (!selectedColor) return;
    if (product.sizes && !selectedSize) return;

    // Add to cart with appropriate options
    addToCart(product, {
      color: selectedColor,
      size: product.sizes ? selectedSize : null,
      quantity,
    });

    // Reset form and open cart
    setQuantity(1);
    setSelectedColor("");
    if (product.sizes) {
      setSelectedSize("");
    }
    onOpen();
  };

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <VStack
      w="100%"
      h="100%"
      justify="center"
      align="center"
      spacing={["50px", "60px", "70px", "75px", "30px"]}
      pb="50px"
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
          <Link to={`/${event.id}/merch/cart`}>
            <Box position="relative">
              <Box>
                <FaShoppingCart className=" w-6 h-6" />
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
          </Link>
        </Flex>
        <VStack w="100%" h="100%" align="flex-start" spacing={["40px", "20px"]}>
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
              w="60%"
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
                  alt={product.name}
                />
              </Box>
            </Box>
            <VStack
              display={["flex", "none"]}
              w="100%"
              align="flex-start"
              spacing={["10px", "10px"]}
            >
              <Heading color="dark" fontSize={["24px", "32px"]}>
                {product.name}
              </Heading>
              <Text color="primary.500" fontSize={["18px", "22px"]}>
                &#8358;{product.price.toLocaleString()}
              </Text>
            </VStack>
            <Box
              display={["block", "block", "block", "none"]}
              w={["100%", "100%", "70%", "70%", "100%"]}
              h={["344px", "384px", "400px", "384px", "384px"]}
            >
              <Image
                src={product.image}
                alt={product.name}
                width="100%"
                height="100%"
                rounded="8px"
                alignSelf="stretch"
              />
            </Box>

            <VStack
              w={["100%", "100%", "100%", "65%"]}
              align="flex-start"
              spacing={["40px", "30px"]}
            >
              <VStack
                display={["none", "flex"]}
                w="100%"
                align="flex-start"
                spacing={["10px", "10px"]}
              >
                <Heading color="dark" fontSize={["28px", "32px"]}>
                  {product.name}
                </Heading>
                <Text color="primary.500" fontSize={["20px", "22px"]}>
                  &#8358;{product.price.toLocaleString()}
                </Text>
              </VStack>

              <FormControl>
                <FormLabel>Color</FormLabel>
                <fieldset aria-label="Choose a color" className="mt-4">
                  <RadioGroup
                    value={selectedColor}
                    onChange={setSelectedColor}
                    className="flex items-center space-x-3"
                  >
                    {product.colors.map((color) => (
                      <Radio
                        key={color}
                        value={color}
                        aria-label={color}
                        className={classNames(
                          color.selectedClass,
                          "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none data-[checked]:ring-2 data-[focus]:data-[checked]:ring data-[focus]:data-[checked]:ring-offset-1"
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={classNames(
                            color.class,
                            `size-8 rounded-full border border-${color} bg-${color} `
                          )}
                        />
                      </Radio>
                    ))}
                  </RadioGroup>
                </fieldset>
              </FormControl>

              {/* <FormControl>
                <FormLabel>Color</FormLabel>
                <RadioGroup value={selectedColor} onChange={setSelectedColor}>
                  <Stack direction="row" spacing={4}>
                    {product.colors.map((color) => (
                      <Radio
                        key={color}
                        value={color}
                        sx={{
                          ".css-1cqh9jq span": {
                            background: color,
                            borderColor: color,
                          },
                          "[data-checked] &": {
                            background: color,
                            borderColor: "#b2b2b2",
                            _before: {
                              background: color,
                            },
                          },
                          "[data-checked]:hover &": {
                            background: color,
                            opacity: 0.8,
                          },
                        }}
                      >
                        {color}
                      </Radio>
                    ))}
                  </Stack>
                </RadioGroup>
              </FormControl> */}

              {product.sizes && (
                <FormControl width={["100%", "50%"]}>
                  <FormLabel>Size</FormLabel>
                  <fieldset aria-label="Choose a size" className="mt-4">
                    <RadioGroup
                      value={selectedSize}
                      onChange={setSelectedSize}
                      className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4"
                    >
                      {product?.sizes?.map((size) => (
                        <Radio
                          key={size}
                          value={size}
                          className={classNames(
                            "group relative flex items-center justify-center rounded-md border px-4 py-3 text-sm font-medium uppercase focus:outline-none sm:flex-1 sm:py-2 cursor-pointer"
                          )}
                        >
                          <span>{size}</span>
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute -inset-px rounded-md border-2 border-transparent group-data-[focus]:border group-data-[checked]:border-[#BFDF37]"
                          />
                        </Radio>
                      ))}
                    </RadioGroup>
                  </fieldset>
                </FormControl>
              )}

              {/* <FormControl>
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
              </FormControl> */}

              <Stack w="100%" flexDir={["column", "row"]} align="flex-start">
                <HStack display={["none", "flex"]} w="30%">
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
                  _hover={{ bg: "primary.400" }}
                  active={{ bg: "primary.500" }}
                  focus={{ bg: "primary.500" }}
                  width={["100%", "60%"]}
                  rounded={["10px", "20px"]}
                  onClick={handleAddToCart}
                  isDisabled={
                    !selectedColor || (product.sizes && !selectedSize)
                  }
                >
                  Add to Cart
                </Button>
                <Drawer
                  isOpen={isOpen}
                  placement="right"
                  onClose={onClose}
                  size="md"
                >
                  <DrawerOverlay />
                  <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Added To Cart!</DrawerHeader>

                    <DrawerBody>
                      {cart.length > 0 ? (
                        <VStack spacing={4}>
                          {cart.map((item) => (
                            <Box
                              key={item.cartItemId}
                              p={4}
                              borderWidth={1}
                              borderRadius="lg"
                              width="full"
                            >
                              <VStack width="100%" align="start" spacing="0px">
                                <Flex
                                  w="100%"
                                  justify="space-between"
                                  align="center"
                                >
                                  <Text fontWeight="bold">{item.name}</Text>
                                  <IconButton
                                    bg="transparent"
                                    icon={<DeleteIcon w="15px" />}
                                    onClick={() =>
                                      removeFromCart(item.cartItemId)
                                    }
                                  />
                                </Flex>
                                <HStack align="flex-start">
                                  <Box w="50px" h="50px">
                                    <Image w="100%" h="100%" src={item.image} />
                                  </Box>
                                  <VStack align="flex-start">
                                    <Text color="gray.600">
                                      Color: {item.color}, Size: {item.size},
                                      Qty: {item.quantity}
                                    </Text>
                                    {/*<Text color="neutral.500">
                                      Quantity: {item.quantity}
                                    </Text> */}
                                    <Text>
                                      ₦{" "}
                                      {(
                                        item.price * item.quantity
                                      ).toLocaleString()}
                                    </Text>
                                  </VStack>
                                </HStack>
                              </VStack>
                            </Box>
                          ))}
                        </VStack>
                      ) : (
                        <VStack
                          width="100%"
                          h="70vh"
                          justify="center"
                          align="center"
                        >
                          <CheckCircleIcon
                            w="50px"
                            h="50px"
                            color="primary.500"
                          />
                          <Text color="gray.500">Item removed from Cart</Text>
                        </VStack>
                      )}
                    </DrawerBody>
                    <DrawerFooter>
                      {cart.length > 0 ? (
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
                          <Heading
                            color="dark"
                            fontSize="24px"
                            lineHeight="32px"
                          >
                            {` ₦ ${getTotal().toLocaleString()}`}
                          </Heading>
                          <Link to={`${event.id}/merch/cart`}>
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
                                View Cart
                              </Text>
                            </Button>
                          </Link>
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
                          <Heading
                            color="dark"
                            fontSize="24px"
                            lineHeight="32px"
                          >
                            ₦ 0
                          </Heading>
                          <Link to={`${event.id}/merch/cart`}>
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
                                View Cart
                              </Text>
                            </Button>
                          </Link>
                        </Flex>
                      )}
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
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
                                color={["primary.500"]}
                                fontSize="16px"
                              />
                            ) : (
                              <AddIcon
                                color={["primary.500"]}
                                fontSize="16px"
                              />
                            )}
                          </AccordionButton>
                        </h2>
                        {product.description.head && (
                          <AccordionPanel
                            textAlign="left"
                            fontSize={["12px", "14px", "17px"]}
                            pb={4}
                          >
                            {product.description.head}
                          </AccordionPanel>
                        )}

                        <AccordionPanel p="0">
                          <UnorderedList styleType="'&bull;'">
                            {product.description.color && (
                              <ListItem>
                                <Text
                                  textAlign="left"
                                  fontSize={["12px", "14px", "17px"]}
                                  pb={4}
                                  pl={4}
                                >
                                  <Text as="span" fontWeight="600">
                                    Color:{"  "}
                                  </Text>
                                  {product.description.color}
                                </Text>
                              </ListItem>
                            )}
                            {product.description.size && (
                              <ListItem>
                                <Text
                                  textAlign="left"
                                  fontSize={["12px", "14px", "17px"]}
                                  pb={4}
                                  pl={4}
                                >
                                  <Text as="span" fontWeight="600">
                                    Size:{"  "}
                                  </Text>
                                  {product.description.size}
                                </Text>
                              </ListItem>
                            )}
                          </UnorderedList>
                        </AccordionPanel>

                        {product.description.footer && (
                          <AccordionPanel
                            textAlign="left"
                            fontSize={["12px", "14px", "17px"]}
                            pb={4}
                          >
                            {product.description.footer}
                          </AccordionPanel>
                        )}
                      </>
                    )}
                  </AccordionItem>
                </VStack>
              </Accordion>
            </VStack>
          </Stack>
          {/* <Box
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
          </Box> */}
        </VStack>
      </VStack>
      {renderCartDrawer()}
    </VStack>
  );
};

export default ProductDetails;
