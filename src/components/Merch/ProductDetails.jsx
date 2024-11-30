import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Text,
  VStack,
  HStack,
  IconButton,
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
  ListItem,
  UnorderedList,
  useDisclosure,
  Grid,
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

  const products = event ? event.merch : {};

  const merch = event.merch[productId];

  const product = merch[itemId];

  useEffect(() => {
    setTimeout(() => {
      document.title = `${product?.name} | The Lemonade Network Events`;
      // Set or update description meta tag
      let descriptionMeta = document.querySelector('meta[name="description"]');
      if (!descriptionMeta) {
        descriptionMeta = document.createElement("meta");
        descriptionMeta.name = "description";
        document.head.appendChild(descriptionMeta);
      }
      descriptionMeta.content =
        product?.description?.head || "Merchandise Description";

      // Set or update Open Graph meta tags
      const ogTags = [
        { property: "og:title", content: product?.name },
        {
          property: "og:description",
          content: product?.description?.head || "Merchandise Description",
        },
        { property: "og:image", content: product?.image },
        { property: "og:url", content: `https://tlnevents.com/${event.id}/merch/${merch}/${product?.id}` },
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

  const { cart, addToCart, removeFromCart, getTotal } = useContext(CartContext);

  const [selectedSize, setSelectedSize] = useState(
    product.sizes ? product.sizes[0] : null
  );
  const [selectedView, setSelectedView] = useState(
    product.hasBackView ? "back" : "front"
  );
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);

  const getProductImage = () => {
    // This assumes image URLs follow a pattern like:
    // "https://tlnevents.com/assets/merch/category/product-name(color-view).jpg"
    const baseImage = product.image;
    const colorPart = selectedColor.toLowerCase();
    const viewPart = selectedView === "front" ? "front" : "back";

    // Replace the image in the original URL with the new color and view
    return baseImage.replace(/\(.*\)/, `(${colorPart}-${viewPart})`);
  };
  const getProductFrontImage = () => {
    // This assumes image URLs follow a pattern like:
    // "https://tlnevents.com/assets/merch/category/product-name(color-view).jpg"
    const baseImage = product.image;
    const colorPart = selectedColor.toLowerCase();

    // Replace the image in the original URL with the new color and view
    return baseImage.replace(/\(.*\)/, `(${colorPart}-front)`);
  };
  const getProductBackImage = () => {
    // This assumes image URLs follow a pattern like:
    // "https://tlnevents.com/assets/merch/category/product-name(color-view).jpg"
    const baseImage = product.image;
    const colorPart = selectedColor.toLowerCase();

    // Replace the image in the original URL with the new color and view
    return baseImage.replace(/\(.*\)/, `(${colorPart}-back)`);
  };

  const getProductColorImage = (color) => {
    if (!product || !product.image || !selectedView) {
      throw new Error("Missing product data or selected view");
    }

    const viewPart = selectedView === "back" ? "back" : "front";

    // Replace the placeholder in the image URL with the selected color and view
    return product.image.replace(
      /\(.*\)/,
      `(${color.toLowerCase()}-${viewPart})`
    );
  };

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

    onOpen();
  };

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const { isOpen, onOpen, onClose } = useDisclosure();

  const getRelatedMerch = () => {
    // Get the current product's category (e.g., 'tees', 'crop-tops')
    const currentCategory = Object.keys(products).find(category =>
      Object.values(products[category]).some(p => p.id === product.id)
    );

    if (!currentCategory) return [];

    // Filter related merch
    const relatedProducts = Object.values(products[currentCategory])
      .filter(p =>
        p.id !== product.id && // Exclude current product
        (p.colors.some(color => product.colors.includes(color)) || // Similar colors
          p.sizes?.some(size => product.sizes?.includes(size))) // Similar sizes
      )
      .slice(0, 3); // Limit to 3 related products

    // If not enough similar products, fill with random products from the same category
    if (relatedProducts.length < 3) {
      const additionalProducts = Object.values(products[currentCategory])
        .filter(p => p.id !== product.id && !relatedProducts.includes(p))
        .slice(0, 3 - relatedProducts.length);

      relatedProducts.push(...additionalProducts);
    }

    return relatedProducts;
  };

  const relatedMerch = getRelatedMerch();

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
        <title>{product?.name} | The Lemonade Network Events</title>
        <meta
          name="description"
          content={product?.description?.head || "Merchandise description"}
        />
        <meta
          property="og:title"
          content={`${product?.name} | The Lemonade Network Events`}
        />
        <meta
          property="og:description"
          content={product?.description?.head || "Merchandise description"}
        />
        <meta
          property="og:image"
          content={product?.image}
        />
        <meta
          property="og:url"
          content={`https://tlnevents.com/${event.id}/merch/${merch}/${product?.id}`}
        />
        <meta property="og:type" content="website" />
      </Helmet>
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
                <VStack w="100%" justify="center" align="center">
                  <Box w="100%" h={["70vh", "70vh", "70vh", "30vh", "70vh"]}>
                    <Image
                      w="100%"
                      h="100%"
                      rounded="8px"
                      src={getProductImage()}
                      alt={`${product.name} - ${selectedColor} ${selectedView} view`}
                    />
                  </Box>
                  <FormControl>
                    <RadioGroup
                      value={selectedView}
                      onChange={setSelectedView}
                      className="flex space-x-4 justify-center"
                    >
                      {product.hasFrontView && (
                        <Radio
                          value="front"
                          className="flex items-center space-x-2"
                        >
                          <span className=" rounded-full border ">
                            <Box w="50px" h="50px">
                              <Image src={getProductFrontImage()} />
                            </Box>
                          </span>
                        </Radio>
                      )}
                      {product.hasBackView && (
                        <Radio
                          value="back"
                          className="flex items-center space-x-2"
                        >
                          <span className=" rounded-full border ">
                            <Box w="50px" h="50px">
                              <Image src={getProductBackImage()} />
                            </Box>
                          </span>
                        </Radio>
                      )}
                    </RadioGroup>
                  </FormControl>
                </VStack>
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
              <Box display={["block", "block", "block", "none"]}>
                <VStack
                  w={["100%", "100%", "70%", "70%", "100%"]}
                  justify="center"
                  align="center"
                >
                  <Box
                    w={["100%", "100%", "70%", "70%", "100%"]}
                    h={["344px", "384px", "400px", "384px", "384px"]}
                    rounded="8px"
                    boxShadow="sm"
                  >
                    <Image
                      src={getProductImage()}
                      alt={`${product.name} - ${selectedColor} ${selectedView} view`}
                      width="100%"
                      height="100%"
                      rounded="8px"
                      alignSelf="stretch"
                    />
                  </Box>
                  <FormControl>
                    <RadioGroup
                      value={selectedView}
                      onChange={setSelectedView}
                      className="flex space-x-4 justify-center"
                    >
                      {product.hasFrontView && (
                        <Radio
                          value="front"
                          className="flex items-center space-x-2"
                        >
                          <span className=" rounded-full border ">
                            <Box w="50px" h="50px">
                              <Image src={getProductFrontImage()} />
                            </Box>
                          </span>
                        </Radio>
                      )}
                      {product.hasBackView && (
                        <Radio
                          value="back"
                          className="flex items-center space-x-2"
                        >
                          <span className=" rounded-full border ">
                            <Box w="50px" h="50px">
                              <Image src={getProductBackImage()} />
                            </Box>
                          </span>
                        </Radio>
                      )}
                    </RadioGroup>
                  </FormControl>
                </VStack>
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
                  <FormLabel>Color: {product.colors.join(" / ")}</FormLabel>
                  <RadioGroup
                    value={selectedColor}
                    onChange={setSelectedColor}
                    className="flex items-center space-x-3"
                  >
                    {product.colors.map((color) => (
                      <Radio
                        key={color}
                        value={color}
                        className={classNames(
                          "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none data-[checked]:ring-2"
                        )}
                      >
                        <span
                          className="size-8 rounded-full border "
                          style={{ backgroundColor: "neutral.500" }}
                        >
                          <Image
                            src={getProductColorImage(color)}
                            rounded="full"
                          />
                        </span>
                      </Radio>
                    ))}
                  </RadioGroup>
                </FormControl>
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
                            {/* Only show the last added item */}
                            {[cart[cart.length - 1]].map((item) => (
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
                                      onClick={() => removeFromCart(item.cartItemId)}
                                    />
                                  </Flex>
                                  <HStack align="flex-start">
                                    <Box w="50px" h="50px">
                                      <Image
                                        w="100%"
                                        h="100%"
                                        src={getProductImage()}
                                      />
                                    </Box>
                                    <VStack align="flex-start">
                                      <Text color="gray.600">
                                        Color: {item.color}, Size: {item.size}, Qty: {item.quantity}
                                      </Text>
                                      <Text>
                                        ₦ {(item.price * item.quantity).toLocaleString()}
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
                            <Link to={`/${event.id}/merch/cart`}>
                              <Button
                                w="122px"
                                rounded="8px"
                                bg="secondary.500"
                                _hover={{ bg: "primary.400" }}
                                _active={{ bg: "secondary.500" }}
                                _focus={{ bg: "secondary.500" }}
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
                            <Link to={`/${event.id}/merch/cart`}>
                              <Button
                                w="122px"
                                rounded="8px"
                                bg="secondary.500"
                                _hover={{ bg: "primary.400" }}
                                _active={{ bg: "secondary.500" }}
                                _focus={{ bg: "secondary.500" }}
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
          </VStack>

          <VStack w="100%" align="flex-start" spacing="50px">
            <Heading color="dark" fontSize={["24px", "28px"]}>
              Related Merch
            </Heading>

            <Grid
              templateColumns={{
                base: "repeat(2, 1fr)",
                md: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              }}
              gap={10}
            >
              {relatedMerch.map((product) => (
                <Link
                  key={product.id}
                  to={`/${event.id}/merch/${Object.keys(products).find(category =>
                    Object.values(products[category]).includes(product)
                  )}}/${product.id}`}
                >
                  <VStack key={product.id} spacing={4}>
                    <Box h={["200px", "250px"]} boxShadow="sm">
                      <Image
                        w="100%"
                        h="100%"
                        src={product.image}
                        alt={product.name}
                        borderRadius="md"
                        objectFit="cover"
                      />
                    </Box>
                    <VStack
                      w="100%"
                      justify="flex-start"
                      align="flex-start"
                      spacing="0"
                    >
                      <Heading
                        color="dark"
                        fontSize={["14px", "18px", "22px"]}
                        fontWeight="500"
                      >
                        {product.name}
                      </Heading>
                      <Text
                        color="primary.500"
                        fontSize={["12px", "14px", "18px"]}
                        fontWeight="600"
                      >
                        ₦ {product.price.toLocaleString()}
                      </Text>
                    </VStack>
                  </VStack>
                </Link>
              ))}
            </Grid>
          </VStack>
        </VStack>
      </VStack>
    </>
  );
};

export default ProductDetails;
