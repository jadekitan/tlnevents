import React, { useContext, useEffect, useState, useRef } from "react";
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
  Tfoot,
} from "@chakra-ui/react";
import { multiBookingContext } from "./BookingContext";
import { eventsData } from "../../../server/eventsData";
import { useLocation, Link, useParams } from "react-router-dom";
import { order } from "../../../server/order"; // Use the generic order service

const RegisterSuccess = () => {
  useEffect(() => {
    document.title = "Registration Successful | The Lemonade Network";
  }, []);

  const {
    contactData,
    clearAssignMultiple,
    ticketCounts,
    clearContactData,
    clearTicketCounts,
    ticketType,
  } = useContext(multiBookingContext);

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const email = query.get("email");
  const guest = query.get("guest");
  const affiliateCode = query.get("affiliate");

  const { eventId } = useParams();
  const event = eventsData[eventId];

  // State for display purposes (optional, if you still want to show the table)
  const [displayOrders, setDisplayOrders] = useState([]);

  const hasProcessed = useRef(false);

  const clearData = () => {
    clearContactData();
    clearTicketCounts();
    clearAssignMultiple();
    localStorage.removeItem("referral_code");
  };

  // Helper to generate IDs (moved outside the render loop)
  const generateUniqueOrderId = () => {
    const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let orderId = "";
    for (let i = 0; i < 5; i++) {
      orderId += characters[Math.floor(Math.random() * characters.length)];
    }
    return orderId;
  };

  useEffect(() => {
    const processRegistration = async () => {
      if (hasProcessed.current) return;
      hasProcessed.current = true;

      // 1. Build the payload directly from Context Data
      const allOrders = [];
      const isGuestCheckout = guest === "true";

      Object.keys(ticketCounts).forEach((ticketId) => {
        const count = ticketCounts[ticketId];
        const ticket = ticketType.find((t) => t.id === parseInt(ticketId));

        if (!count || !ticket) return;

        // Loop through the quantity of tickets selected
        for (let i = 0; i < count; i++) {
          // Determine Attendee Details
          let attendeeName = `${contactData.firstName} ${contactData.lastName}`;
          let attendeeEmail = contactData.email;

          if (
            isGuestCheckout &&
            contactData.attendeeAddresses?.[ticketId]?.[i]
          ) {
            const guestData = contactData.attendeeAddresses[ticketId][i];
            attendeeName = `${guestData.firstName} ${guestData.lastName}`;
            attendeeEmail = guestData.email;
          }

          // Calculate financials
          const quantity = 1;
          const subTotal = ticket.price; // Assuming step is handled in price or always 1 for calculation here
          const fees = 0; // Free registration usually has 0 fees

          allOrders.push({
            attendeeName,
            email: attendeeEmail,
            ticketType: ticket.name,
            quantity: quantity,
            ticketPrice: ticket.price,
            subTotal: subTotal,
            fees: fees,
            total: subTotal + fees,
            orderId: generateUniqueOrderId(), // Generate ID here
          });
        }
      });

      setDisplayOrders(allOrders); // Save for UI display

      // 2. Prepare Final Payload
      const finalPayload = {
        eventName: event.name,
        affiliateCode:
          affiliateCode && affiliateCode !== "null" ? affiliateCode : "",
        orders: allOrders, // Send ALL orders in one array
      };

      console.log("📤 Sending Batch Payload:", finalPayload);

      // 3. Send Single Request
      try {
        if (allOrders.length > 0) {
          await order(finalPayload);
        }
      } catch (error) {
        console.error("Error submitting registration:", error);
      } finally {
        clearData();
      }
    };

    processRegistration();
  }, [ticketCounts, contactData, event, affiliateCode, guest]);

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
              />
            </Link>
          </Flex>
          <Image
            w={["100px", "150px"]}
            src="https://tlnevents.com/assets/confirmed.svg"
            alt="confirmed Image"
          />
          <VStack w="100%" spacing="20px">
            <Heading color="dark" fontSize="32px">
              Registration Successful!
            </Heading>
            <VStack w="100%" textAlign="center" spacing="10px">
              <Text color="dark" fontSize={["12px", "16px"]}>
                Your order was successful. We've sent a copy to{" "}
                <Text as="span" color="primary.500">
                  {email}
                </Text>
                .
              </Text>
            </VStack>

            {/* Optional: Render table from state instead of scraping it */}
            <Box display="none">
              {/* Use displayOrders state here if you need to render the table for debugging or PDF generation */}
            </Box>

            <VStack>
              <Link to={`/${event.id}`}>
                <Button bg="primary.500" _hover={{ bg: "primary.400" }}>
                  Back to Event
                </Button>
              </Link>
            </VStack>
          </VStack>
        </VStack>
      </VStack>
    </Box>
  );
};

export default RegisterSuccess;
