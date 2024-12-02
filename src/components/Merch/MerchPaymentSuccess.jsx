import React, { useContext, useEffect, useRef } from "react";
import {
  Box,
  Flex,
  VStack,
  Image,
  Heading,
  Text,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import { CartContext } from "./CartProvider";
import { eventsData } from "../../../server/eventsData";
import { useLocation, Link, useParams } from "react-router-dom";
import { merch } from "../../../server/merch";
import { Helmet } from "react-helmet-async";

const MerchPaymentSuccess = () => {
  const { eventId } = useParams();

  useEffect(() => {
    setTimeout(() => {
      document.title = 'Payment Successful | The Lemonade Network Events';
      // Set or update description meta tag
      let descriptionMeta = document.querySelector('meta[name="description"]');
      if (!descriptionMeta) {
        descriptionMeta = document.createElement("meta");
        descriptionMeta.name = "description";
        document.head.appendChild(descriptionMeta);
      }
      descriptionMeta.content =
        `Your Payment for ${event.name} Merchandise has been successful.`;

      // Set or update Open Graph meta tags
      const ogTags = [
        { property: "og:title", content: 'Payment Successful | The Lemonade Network Events' },
        {
          property: "og:description",
          content: `Your Payment for ${event.name} Merchandise has been successful.`,
        },
        { property: "og:image", content: "https://tlnevents.com/full-logo.jpg" },
        { property: "og:url", content: `https://tlnevents.com/${event.id}/merch/checkout/payment-success` },
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

  const { contactData, cart, clearContactData, clearCart } = useContext(CartContext);
  const location = useLocation();

  // Extract the reference from the URL query params
  const query = new URLSearchParams(location.search);
  const email = query.get("email");


  const clearData = () => {
    clearContactData();
    clearCart()
  };

  const hasProcessedOrders = useRef(false);

  useEffect(() => {
    const processOrders = async () => {
      if (hasProcessedOrders.current) return;
      hasProcessedOrders.current = true;

      // Extract order data directly from cart and contactData
      const extractedData = Object.values(cart).map(item => ({
        name: contactData.firstName,
        productName: item.name,
        email: contactData.email,
        phone: contactData.phone,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        productPrice: item.price,
        total: item.price * item.quantity
      }));

      for (const item of extractedData) {
        try {
          await merch(
            item.name,
            item.productName,
            item.email,
            item.phone,
            item.size,
            item.color,
            item.quantity,
            item.productPrice,
            item.total
          );
          clearData()
        } catch (error) {
          console.error("Error submitting order:", error);
        }
      }

      // Rest of the function remains the same...
    };

    processOrders();
  }, [cart, contactData]);

  const event = eventsData[eventId]; // Lookup event from local data

  // Helper function to generate a unique order ID per email
  function generateUniqueOrderId(email) {
    const uniqueKey = `orderId_${email}`;
    const storedOrderId = localStorage.getItem(uniqueKey);

    if (storedOrderId) {
      return storedOrderId;
    }

    const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let orderId = "";

    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      orderId += characters[randomIndex];
    }

    localStorage.setItem(uniqueKey, orderId);
    return orderId;
  }

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
        <title>Payment Successful | The Lemonade Network Events</title>
        <meta
          name="description"
          content={`Your Payment for ${event.name} Merchandise has been successful.`}
        />
        <meta
          property="og:title"
          content="Payment Successful | The Lemonade Network Events"
        />
        <meta
          property="og:description"
          content={`Your Payment for ${event.name} Merchandise has been successful.`}
        />
        <meta
          property="og:image"
          content="https://tlnevents.com/full-logo.jpg"
        />
        <meta
          property="og:url"
          content={`https://tlnevents.com/${event.id}/merch/checkout/payment-success.`}
        />
        <meta property="og:type" content="website" />
      </Helmet>
      <Box w="100%" h="100%">
        <VStack
          w="100%"
          h="100dvh"
          justify="flex-start"
          align="center"
          px={["20px", "50px", "75px", "100px"]}
        >
          <VStack w="100%" justify="center" align="center" spacing="50px">
            <Flex w="100%" justify="space-between" align="center" py="20px">
              <Link to="/">
                <Image
                  w={["120px", "150px"]}
                  src="/logo.webp"
                  alt="The Lemonade Logo"
                ></Image>
              </Link>
            </Flex>
            <Image
              w={["100px", "150px"]}
              src="https://tlnevents.com/assets/confirmed.svg"
              alt="confirmed Image"
            />
            <VStack w="100%" spacing="20px">
              <Heading color="dark" fontSize="32px">
                Payment Succesful !
              </Heading>
              <VStack w="100%" textAlign="center" spacing="10px">
                <Text color="dark" fontSize={["12px", "16px"]}>
                  Your order was successful. We've also sent a copy to your email
                  address{" "}
                  <Text as="span" color="primary.500">
                    {email}
                  </Text>

                </Text>
                <Text color="dark" fontSize={["12px", "16px"]}>
                  If you do not receive your order from us, please email us at{" "}
                  <Link to="mailto:info@lemonade.africa">
                    <Text as="span" color="primary.500">
                      info@lemonade.africa
                    </Text>
                  </Link>
                  .
                </Text>
              </VStack>
              <Box display="none" >
                <TableContainer>
                  <Table variant="simple">
                    <TableCaption>
                      Checkout Information to push to database and sending of
                      email
                    </TableCaption>
                    <Thead>
                      <Tr>
                        <Th>OrderID</Th>
                        <Th>Name</Th>
                        <Th>Product Name</Th>
                        <Th>Email</Th>
                        <Th isNumeric>Phone Number</Th>
                        <Th>Size</Th>
                        <Th>Color</Th>
                        <Th isNumeric>Quantity</Th>
                        <Th isNumeric>Product Price</Th>
                        <Th isNumeric>Total</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {Object.values(cart).map((item, index) => {
                        const uniqueOrderId = generateUniqueOrderId(contactData.email); // Generate unique ID
                        const total = item.price * item.quantity;
                        return (
                          <Tr key={index}>
                            <Td>{uniqueOrderId}</Td> {/* Use the generated unique ID */}
                            <Td>{contactData.firstName}</Td>
                            <Td>{item.name}</Td>
                            <Td>{contactData.email}</Td>
                            <Td>{contactData.phone}</Td>
                            <Td>{item.size}</Td>
                            <Td>{item.color}</Td>
                            <Td isNumeric>{item.quantity}</Td>
                            <Td isNumeric>{item.price}</Td>
                            <Td isNumeric>{total}</Td>
                          </Tr>
                        );
                      })}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Box>
              <VStack spacing="10px">
                <Link to={`/${event.id}/merch`}>
                  <Button bg="primary.500" _hover={{ bg: "primary.400" }}>
                    Continue Shopping
                  </Button>
                </Link>
                <Link to={`/${event.id}`}>
                  <Text color="dark" fontSize={["16px", "20px"]}>
                    Get Event Tickets
                  </Text>
                </Link>
              </VStack >
            </VStack >
          </VStack >
        </VStack >
      </Box >
    </>
  );
};

export default MerchPaymentSuccess;
