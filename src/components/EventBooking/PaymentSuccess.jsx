import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Flex,
  VStack,
  Image,
  Heading,
  Text,
  Button,
} from "@chakra-ui/react";
import { multiBookingContext } from "./BookingContext";
import { eventsData } from "../../../server/eventsData";
import { useLocation, Link, useParams } from "react-router-dom";
import axios from "axios";

const PaymentSuccess = () => {
  useEffect(() => {
    document.title = "Payment Successful | The Lemonade Network";
  }, []);

  const { contactData, assignMultiple } = useContext(multiBookingContext);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const location = useLocation();

  // Extract the reference from the URL query params
  const query = new URLSearchParams(location.search);
  const reference = query.get("reference");

  useEffect(() => {
    if (reference) {
      // Make POST request to PHP backend to verify payment
      axios
        .post("https://tlnevents.com/server/verify-payment.php", { reference })
        .then((response) => {
          setPaymentStatus(response.data.status); // Success or failure status
        })
        .catch((error) => {
          console.error("Error verifying payment:", error);
        });
    }
  }, [reference]);

  const { eventId } = useParams(); // Get the event ID from the URL
  const event = eventsData[eventId]; // Lookup event from local data

  return (
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
              <Text color="dark" fontSize="16px">
                Your order was successful. We've also sent a copy to your email
                address{" "}
                <Text as="span" color="primary.500">
                  {contactData.email}
                </Text>{" "}
                {assignMultiple === true
                  ? "and all the attending guests."
                  : "."}
              </Text>
              <Text color="dark" fontSize="16px">
                If you don't recieve your ticket from us, please email us at{" "}
                <Link to="mailto:info@thelemonadenetwork.ng">
                  <Text as="span" color="primary.500">
                    info@thelemonadenetwork.ng
                  </Text>
                </Link>
              </Text>
            </VStack>
            <Flex>
              <Link to={`/${event.id}`}>
                <Button bg="primary.500" _hover={{ bg: "primary.400" }}>
                  Back to Event
                </Button>
              </Link>
            </Flex>
          </VStack>
        </VStack>
      </VStack>
    </Box>
  );
};

export default PaymentSuccess;
