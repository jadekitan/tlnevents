import React, { useContext } from "react";
import {
  Box,
  Grid,
  Heading,
  Image,
  Text,
  VStack,
  Flex,
  Button,
} from "@chakra-ui/react";
import { useParams, Link } from "react-router-dom";
import { eventsData } from "../../../server/eventsData";
import { CartContext } from "./CartProvider";

const Store = () => {
  // Sample product data
  const { eventId } = useParams(); // Get the event ID from the URL
  const event = eventsData[eventId]; // Lookup event from local data

  const products = event ? event.merch : {};

  const { cart, renderCartDrawer, onOpen } = useContext(CartContext);

  return (
    <VStack
      w="100%"
      h="100%"
      justify="center"
      align="center"
      spacing={["25px", "60px", "70px", "75px", "50px"]}
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
        <Button colorScheme="blue" onClick={onOpen} position="relative">
          Cart
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
        </Button>
      </Flex>
      <VStack w="100%" align="flex-start" spacing="50px">
        <Heading color="dark" fontSize={["28px", "32px"]}>
          {event.name} Merch
        </Heading>

        <Grid
          templateColumns={{
            base: "repeat(1, 1fr)",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          }}
          gap={10}
        >
          {Object.values(products).map((product) => (
            <Link key={product.id} to={`/${event.id}/merch/${product.id}`}>
              <VStack key={product.id} spacing={4}>
                <Box h="350px">
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
                    ${product.price}
                  </Text>
                </VStack>
              </VStack>
            </Link>
          ))}
        </Grid>
      </VStack>
      {renderCartDrawer()}
    </VStack>
  );
};

export default Store;
