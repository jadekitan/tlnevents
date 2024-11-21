import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Grid,
  Heading,
  Image,
  Text,
  VStack,
  Flex,
  Center,
} from "@chakra-ui/react";
import { useParams, Link } from "react-router-dom";
import { eventsData } from "../../../server/eventsData";
import { CartContext } from "./CartProvider";
import { FaShoppingCart } from "react-icons/fa";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { useSwipeable } from "react-swipeable";

const Store = () => {
  // Sample product data
  const { eventId } = useParams(); // Get the event ID from the URL
  const { itemId } = useParams();
  const event = eventsData[eventId]; // Lookup event from local data

  const products = event ? event.merch : {};
  const item = products[itemId];

  const { cart, renderCartDrawer, onOpen } = useContext(CartContext);

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSwipeLeft = () => {
    if (currentIndex < products.tees.length - 2) {
      setCurrentIndex(currentIndex + 2);
    }
  };

  const handleSwipeRight = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 2);
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: handleSwipeLeft,
    onSwipedRight: handleSwipeRight,
  });

  useEffect(() => {
    let interval;
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const updateIndex = () => {
      if (mediaQuery.matches) {
        // If screen width is >= 1024px
        setCurrentIndex((prevIndex) =>
          prevIndex < products.tees.length - 3 ? prevIndex + 3 : 0
        );
      } else {
        // For smaller screens (less than 1024px)
        setCurrentIndex((prevIndex) =>
          prevIndex < products.tees.length - 2 ? prevIndex + 2 : 0
        );
      }
    };

    interval = setInterval(updateIndex, 3000); // Adjust index every 3 seconds

    // Cleanup the interval and media query listener on component unmount
    return () => {
      clearInterval(interval);
    };
  }, [products.tees.length]);

  return (
    <VStack
      w="100%"
      h="100%"
      justify="center"
      align="center"
      spacing={["25px", "60px", "70px", "75px", "50px"]}
      px={["20px", "50px", "75px", "100px"]}
      pb="50px"
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
            <FaShoppingCart className=" w-6 h-6" />
          </Box>
          {cart.length > 0 && (
            <Box
              position="absolute"
              top="-2"
              right="-2"
              bg="red.500"
              color="white"
              borderRadius="full"
              w={5}
              h={5}
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="xs"
            >
              {cart.length}
            </Box>
          )}
        </Box>
      </Flex>
      <VStack w="100%" align="flex-start" spacing="100px">
        <VStack w="100%" align="flex-start" spacing="50px">
          <Heading color="dark" fontSize={["28px", "32px"]}>
            Exclusive T-Shirts
          </Heading>

          <Box w="100%" position="relative">
            <Flex
              w="100%"
              {...handlers}
              overflowX={["hidden", "hidden", "hidden", "hidden"]}
              position="relative"
            >
              <Flex
                w="100%"
                align="flex-start"
                gap={["20px", 8]}
                transform={[
                  `translateX(-${currentIndex * 50}%)`,
                  `translateX(-${currentIndex * 20}%)`,
                ]}
                transition="transform 0.5s"
              >
                {Object.values(products.tees).map((product) => (
                  <Link
                    key={product.id}
                    to={`/${event.id}/merch/tees/${product.id}`}
                  >
                    <Box maxW={["400px", "256px"]} maxH="100%">
                      <VStack
                        width="100%"
                        h="100%"
                        flex={["0 0 45%", "0 0 45%", "0 0 45%", "0 0 45%"]}
                        justify="space-between"
                        align="flex-start"
                      >
                        <Box h="250px">
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
                            title={product.name}
                            color="dark"
                            fontSize={["18px", "22px"]}
                            fontWeight="500"
                            lineHeight="24px"
                            maxW={["160px", "200px", "256px"]} // Set the maximum width for the text container
                            noOfLines={2} // Limit to two lines
                            isTruncated={false} // Set this to false, since 'noOfLines' handles truncation
                            overflow="hidden" // Ensures overflow text is hidden
                            display="-webkit-box" // Needed for truncating after a specific number of lines
                            textOverflow="ellipsis" // Adds the ellipsis for overflow
                            css={{
                              WebkitLineClamp: 2, // Specifies the number of lines to clamp to
                              WebkitBoxOrient: "vertical", // Establishes vertical orientation
                            }}
                          >
                            {product.name}
                          </Heading>
                          <Text
                            color="primary.500"
                            fontSize={["14px", "18px"]}
                            fontWeight="600"
                          >
                            ₦ {product.price.toLocaleString()}
                          </Text>
                        </VStack>
                      </VStack>
                    </Box>
                  </Link>
                ))}
              </Flex>
            </Flex>
          </Box>

          <Box
            display={[
              products.tees.length <= 2 ? "none" : "block",
              products.tees.length <= 3 ? "none" : "block",
            ]}
            w="100%"
            align="center"
          >
            <Flex w={["100px", "158px"]} justify="space-between" align="center">
              <Box
                as="button"
                w={["30px", "40px"]}
                h={["30px", "40px"]}
                rounded="full"
                bg={currentIndex > 0 ? "primary-color500" : "primary-color50"}
                onClick={() => {
                  if (currentIndex > 1) {
                    setCurrentIndex(currentIndex - 2);
                  }
                }}
              >
                <Center>
                  <FaArrowLeftLong
                    color="white"
                    className=" w-[14px] h-[14px]"
                  />
                </Center>
              </Box>
              <Box
                as="button"
                w={["30px", "40px"]}
                h={["30px", "40px"]}
                rounded="full"
                bg={
                  currentIndex < products.tees.length - 2
                    ? "primary-color500"
                    : "primary-color50"
                }
                onClick={() => {
                  if (currentIndex < products.tees.length - 2) {
                    setCurrentIndex(currentIndex + 2);
                  }
                }}
              >
                <Center>
                  <FaArrowRightLong
                    color="white"
                    className=" w-[14px] h-[14px]"
                  />
                </Center>
              </Box>
            </Flex>
          </Box>

          <Grid
            templateColumns={{
              base: "repeat(1, 1fr)",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            }}
            gap={10}
          >
            {Object.values(products.tees).map((product) => (
              <Link
                key={product.id}
                to={`/${event.id}/merch/tees/${product.id}`}
              >
                <VStack key={product.id} spacing={4}>
                  <Box h="250px">
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
                      fontSize={["18px", "22px"]}
                      fontWeight="500"
                    >
                      {product.name}
                    </Heading>
                    <Text
                      color="primary.500"
                      fontSize={["14px", "18px"]}
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
        <VStack w="100%" align="flex-start" spacing="50px">
          <Heading color="dark" fontSize={["28px", "32px"]}>
            Crop Tops
          </Heading>

          <Grid
            templateColumns={{
              base: "repeat(1, 1fr)",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            }}
            gap={10}
          >
            {Object.values(products["crop-tops"]).map((product) => (
              <Link
                key={product.id}
                to={`/${event.id}/merch/crop-tops/${product.id}`}
              >
                <VStack key={product.id} spacing={4}>
                  <Box h="250px">
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
                      fontSize={["18px", "22px"]}
                      fontWeight="500"
                    >
                      {product.name}
                    </Heading>
                    <Text
                      color="primary.500"
                      fontSize={["14px", "18px"]}
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
        <VStack w="100%" align="flex-start" spacing="50px">
          <Heading color="dark" fontSize={["28px", "32px"]}>
            Bucket Hats
          </Heading>

          <Grid
            templateColumns={{
              base: "repeat(1, 1fr)",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            }}
            gap={10}
          >
            {Object.values(products["bucket-hats"]).map((product) => (
              <Link
                key={product.id}
                to={`/${event.id}/merch/bucket-hats/${product.id}`}
              >
                <VStack key={product.id} spacing={4}>
                  <Box h="250px">
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
                      fontSize={["18px", "22px"]}
                      fontWeight="500"
                    >
                      {product.name}
                    </Heading>
                    <Text
                      color="primary.500"
                      fontSize={["14px", "18px"]}
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
        <VStack w="100%" align="flex-start" spacing="50px">
          <Heading color="dark" fontSize={["28px", "32px"]}>
            Face Caps
          </Heading>

          <Grid
            templateColumns={{
              base: "repeat(1, 1fr)",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            }}
            gap={10}
          >
            {Object.values(products.caps).map((product) => (
              <Link
                key={product.id}
                to={`/${event.id}/merch/caps/${product.id}`}
              >
                <VStack key={product.id} spacing={4}>
                  <Box h="250px">
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
                      fontSize={["18px", "22px"]}
                      fontWeight="500"
                    >
                      {product.name}
                    </Heading>
                    <Text
                      color="primary.500"
                      fontSize={["14px", "18px"]}
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
      {renderCartDrawer()}
    </VStack>
  );
};

export default Store;
