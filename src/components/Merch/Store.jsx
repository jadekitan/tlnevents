import React, { useEffect, useContext } from "react";
import {
  Box,
  Grid,
  Heading,
  Image,
  Text,
  VStack,
  Flex,
} from "@chakra-ui/react";
import { useParams, Link } from "react-router-dom";
import { eventsData } from "../../../server/eventsData";
import { CartContext } from "./CartProvider";
import { FaShoppingCart } from "react-icons/fa";
import { Helmet } from "react-helmet-async";

const Store = () => {
  // Sample product data
  const { eventId } = useParams(); // Get the event ID from the URL
  const event = eventsData[eventId]; // Lookup event from local data

  const products = event ? event.merch : {};

  useEffect(() => {
    setTimeout(() => {
      document.title = `${event?.name} Merch | The Lemonade Network Events`;
      // Set or update description meta tag
      let descriptionMeta = document.querySelector('meta[name="description"]');
      if (!descriptionMeta) {
        descriptionMeta = document.createElement("meta");
        descriptionMeta.name = "description";
        document.head.appendChild(descriptionMeta);
      }
      descriptionMeta.content =
        `Purchase your ${event.name} Merchandise.`;

      // Set or update Open Graph meta tags
      const ogTags = [
        { property: "og:title", content: `${event?.name} Merch | The Lemonade Network Events` },
        {
          property: "og:description",
          content: `Purchase your ${event.name} Merchandise.`,
        },
        { property: "og:image", content: "https://tlnevents.com/full-logo.jpg" },
        { property: "og:url", content: `https://tlnevents.com/${event.id}/merch` },
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

  const { cart } = useContext(CartContext);

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
        <title>{event?.name} Merch | The Lemonade Network Events</title>
        <meta
          name="description"
          content={`Purchase your ${event.name} Merchandise.`}
        />
        <meta
          property="og:title"
          content={`${event?.name} Merch | The Lemonade Network Events`}
        />
        <meta
          property="og:description"
          content={`Purchase your ${event.name} Merchandise.`}
        />
        <meta
          property="og:image"
          content="https://tlnevents.com/full-logo.jpg"
        />
        <meta
          property="og:url"
          content={`https://tlnevents.com/${event?.id}/merch`}
        />
        <meta property="og:type" content="website" />
      </Helmet>
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
        <VStack w="100%" align="flex-start" spacing="100px">
          <VStack w="100%" align="flex-start" spacing="50px">
            <Heading color="dark" fontSize={["28px", "32px"]}>
              Exclusive T-Shirts
            </Heading>

            <Grid
              templateColumns={{
                base: "repeat(2, 1fr)",
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
          <VStack w="100%" align="flex-start" spacing="50px">
            <Heading color="dark" fontSize={["28px", "32px"]}>
              Crop Tops
            </Heading>

            <Grid
              templateColumns={{
                base: "repeat(2, 1fr)",
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
                    <Box h={["200px", "250px"]}>
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
          <VStack w="100%" align="flex-start" spacing="50px">
            <Heading color="dark" fontSize={["28px", "32px"]}>
              Bucket Hats
            </Heading>

            <Grid
              templateColumns={{
                base: "repeat(2, 1fr)",
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
                    <Box h={["200px", "250px"]}>
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
          <VStack w="100%" align="flex-start" spacing="50px">
            <Heading color="dark" fontSize={["28px", "32px"]}>
              Face Caps
            </Heading>

            <Grid
              templateColumns={{
                base: "repeat(2, 1fr)",
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
                    <Box h={["200px", "250px"]}>
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

export default Store;
