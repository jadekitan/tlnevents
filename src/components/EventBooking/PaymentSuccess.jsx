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
} from "@chakra-ui/react";
import { multiBookingContext } from "./BookingContext";
import { eventsData } from "../../../server/eventsData";
import { useLocation, Link, useParams } from "react-router-dom";
import { order } from "../../../server/order";

const PaymentSuccess = () => {
  useEffect(() => {
    document.title = "Payment Successful | The Lemonade Network";
  }, []);

  const {
    contactData,
    ticketCounts,
    feePercentage,
    clearContactData,
    clearTicketCounts,
    clearAssignMultiple,
    ticketType,
  } = useContext(multiBookingContext);

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const referenceNumber = query.get("reference");
  const email = query.get("email");
  const guest = query.get("guest");
  const affiliateCode = query.get("affiliate");

  const [displayOrders, setDisplayOrders] = useState([]);
  const { eventId } = useParams();
  const event = eventsData[eventId];

  const hasProcessed = useRef(false);

  const clearData = () => {
    clearContactData();
    clearTicketCounts();
    clearAssignMultiple();
    localStorage.removeItem("referral_code");
  };

  const generateUniqueOrderId = (userEmail) => {
    const uniqueKey = `orderId_${userEmail}`;
    const storedOrderId = localStorage.getItem(uniqueKey);
    // Reuse existing ID if available to prevent duplicates on re-render
    if (storedOrderId) return storedOrderId;

    const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let orderId = "";
    for (let i = 0; i < 5; i++) {
      orderId += characters[Math.floor(Math.random() * characters.length)];
    }
    localStorage.setItem(uniqueKey, orderId);
    return orderId;
  };

  useEffect(() => {
    const processOrder = async () => {
      if (hasProcessed.current) return;
      hasProcessed.current = true;

      const allOrders = [];
      const isGuestCheckout = guest === "true";

      // 1. Build Payload from Context
      Object.keys(ticketCounts).forEach((ticketId) => {
        const count = ticketCounts[ticketId];
        const ticket = ticketType.find((t) => t.id === parseInt(ticketId));

        if (!count || !ticket) return;

        // LOGIC BRANCH: Guest Checkout vs Single Purchaser
        if (isGuestCheckout) {
          // --- GUEST LOGIC: Separate entry per ticket (keeps individual names) ---
          for (let i = 0; i < count; i++) {
            let attendeeName = `${contactData.firstName} ${contactData.lastName}`;
            let attendeeEmail = contactData.email;

            // Retrieve specific guest info if available
            if (contactData.attendeeAddresses?.[ticketId]?.[i]) {
              const guestInfo = contactData.attendeeAddresses[ticketId][i];
              attendeeName = `${guestInfo.firstName} ${guestInfo.lastName}`;
              attendeeEmail = guestInfo.email;
            }

            // Calculation for SINGLE ticket
            const quantity = 1;
            const subTotal = ticket.price / ticket.step;
            const singleFee = (ticket.price * (feePercentage / 100)) + (100 / ticket.step);
            const fees = event.percentCharge === 0 || ticket.price === 0 ? 0 : singleFee;

            allOrders.push({
              orderId: generateUniqueOrderId(attendeeEmail),
              attendeeName: attendeeName,
              email: attendeeEmail,
              ticketType: ticket.name,
              quantity: quantity,
              ticketPrice: ticket.price,
              subTotal: subTotal,
              fees: fees,
              total: subTotal + fees,
            });
          }
        } else {
          // --- STANDARD LOGIC: Grouped entry (Quantity > 1) ---
          // No loop here. We create ONE order line for this ticket type.
          
          let attendeeName = `${contactData.firstName} ${contactData.lastName}`;
          let attendeeEmail = contactData.email;

          // Calculation for TOTAL quantity of this ticket type
          const quantity = count;
          const subTotal = (ticket.price * count) / ticket.step;
          
          // Calculate total fees for this batch
          const singleFee = (ticket.price * (feePercentage / 100)) + (100 / ticket.step);
          const totalFees = event.percentCharge === 0 || ticket.price === 0 ? 0 : (singleFee * count);

          allOrders.push({
            orderId: generateUniqueOrderId(attendeeEmail),
            attendeeName: attendeeName,
            email: attendeeEmail,
            ticketType: ticket.name,
            quantity: quantity,
            ticketPrice: ticket.price,
            subTotal: subTotal,
            fees: totalFees,
            total: subTotal + totalFees,
          });
        }
      });

      setDisplayOrders(allOrders);

      // 2. Prepare Final Payload
      const finalPayload = {
        eventName: event.name,
        referenceNumber: referenceNumber ? Number(referenceNumber) : null,
        affiliateCode: (affiliateCode && affiliateCode !== "null") ? affiliateCode : "",
        orders: allOrders.map((item) => ({
          attendeeName: item.attendeeName,
          email: item.email,
          fees: Number(item.fees),
          quantity: Number(item.quantity),
          subTotal: Number(item.subTotal),
          ticketPrice: Number(item.ticketPrice),
          ticketType: item.ticketType,
        })),
      };

      console.log("🚀 Sending Batch Payload:", finalPayload);

      // 3. Send to Server
      try {
        if (allOrders.length > 0) {
          await order(finalPayload);
        }
      } catch (error) {
        console.error("❌ Error submitting order:", error);
      } finally {
        clearData();
      }
    };

    processOrder();
  }, []);

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
            alt="Confirmed"
          />
          <VStack w="100%" spacing="20px">
            <Heading color="dark" fontSize="32px">
              Payment Successful!
            </Heading>
            <VStack w="100%" textAlign="center" spacing="10px">
              <Text color="dark" fontSize={["12px", "16px"]}>
                Your order was successful. We've sent a copy to{" "}
                <Text as="span" color="primary.500">
                  {email}
                </Text>
                .
              </Text>
              <Text color="dark" fontSize={["12px", "16px"]}>
                If you do not receive your ticket, email us at{" "}
                <Link to="mailto:info@lemonade.africa">
                  <Text as="span" color="primary.500">
                    info@lemonade.africa
                  </Text>
                </Link>
                .
              </Text>
            </VStack>

            {/* Hidden Table for PDF/Printing if needed */}
            <Box display="none">
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Order ID</Th>
                      <Th>Name</Th>
                      <Th>Email</Th>
                      <Th>Ticket</Th>
                      <Th isNumeric>Qty</Th>
                      <Th isNumeric>Price</Th>
                      <Th isNumeric>Total</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {displayOrders.map((item, idx) => (
                      <Tr key={idx}>
                        <Td>{item.orderId}</Td>
                        <Td>{item.attendeeName}</Td>
                        <Td>{item.email}</Td>
                        <Td>{item.ticketType}</Td>
                        <Td isNumeric>{item.quantity}</Td>
                        <Td isNumeric>{item.ticketPrice}</Td>
                        <Td isNumeric>{item.total}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
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

export default PaymentSuccess;