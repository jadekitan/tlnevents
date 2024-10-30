import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Flex,
  VStack,
  Heading,
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
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";

const PaymentSuccess = () => {
  const {
    LeftArrow,
    currentStep,
    setStep,
    ticketCounts,
    feePercentage,
    contactData,
    assignMultiple,
  } = useContext(multiBookingContext);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const location = useLocation();

  // Extract the reference from the URL query params
  const query = new URLSearchParams(location.search);
  const reference = query.get("reference");

  const { eventId } = useParams(); // Get the event ID from the URL
  const event = eventsData[eventId]; // Lookup event from local data

  const [ticketType, setTicketType] = useState(event ? event.tickets : []);

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
    <Box w="100%" h="100%">
      <VStack
        w="100%"
        h="100dvh"
        justify="flex-start"
        align="center"
        px={["20px", "50px", "75px", "100px"]}
      >
        <VStack w="100%" justify="flex-start" align="center" spacing="50px">
          <VStack align="flex-start" spacing="50px">
            <Flex justify="flex-start" align="center" gap={["10px", "20px"]}>
              <Box
                as="button"
                p="3px"
                bg="primary.500"
                rounded="6px"
                onClick={() => {
                  if (currentStep === 1) {
                    console.log("Back to event page");
                  }
                  if (currentStep > 1) {
                    setStep(currentStep - 1);
                  }
                }}
              >
                <LeftArrow />
              </Box>
              <Heading
                color="dark"
                fontSize={["18px", "22px"]}
                lineHeight="28px"
              >
                Checkout Information
              </Heading>
            </Flex>
            <Box>
              <TableContainer>
                <Table variant="simple">
                  <TableCaption>
                    Checkout Information to push to database and sending of
                    email
                  </TableCaption>
                  <Thead>
                    <Tr>
                      <Th>Order ID</Th>
                      <Th>Name</Th>
                      <Th>Email</Th>
                      <Th>Ticket Type</Th>
                      <Th isNumeric>Quantity</Th>
                      <Th isNumeric>Price</Th>
                      <Th isNumeric>Subtotal</Th>
                      <Th isNumeric>Fees</Th>
                      <Th isNumeric>Total</Th>
                    </Tr>
                  </Thead>

                  {assignMultiple ? (
                    <Tbody>
                      {Object.keys(ticketCounts).map((ticketId) => {
                        const ticketQuantity = ticketCounts[ticketId];
                        const ticketPrice = ticketType[ticketId - 1]?.price;
                        const ticketName = ticketType[ticketId - 1]?.name;
                        const step = ticketType[ticketId - 1]?.step;

                        // Ensure the ticket quantity is valid
                        if (!ticketQuantity || ticketQuantity <= 0) return null;

                        // Group tickets by email, summing quantities, subtotals, fees, and totals
                        const emailGroups = {};

                        Array.from({ length: ticketQuantity }).forEach(
                          (_, i) => {
                            const email =
                              contactData.attendeeAddresses?.[ticketId]?.[i]
                                ?.email;
                            const firstName =
                              contactData.attendeeAddresses?.[ticketId]?.[i]
                                ?.firstName;

                            if (!emailGroups[email]) {
                              emailGroups[email] = {
                                firstName,
                                email,
                                quantity: 0,
                                subtotal: 0,
                                fees: 0,
                                total: 0,
                                orderId: generateUniqueOrderId(email), // Generate once per unique email
                              };
                            }

                            // Increment values for each email group
                            const quantity = 1;
                            const subtotal = (ticketPrice * quantity) / step;
                            const fees =
                              quantity *
                              (ticketPrice * (feePercentage / 100) +
                                100 / step);
                            const total = subtotal + fees;

                            emailGroups[email].quantity += quantity;
                            emailGroups[email].subtotal += subtotal;
                            emailGroups[email].fees += fees;
                            emailGroups[email].total += total;
                          }
                        );

                        // Render each unique email group
                        return Object.values(emailGroups).map(
                          (group, index) => (
                            <Tr key={index}>
                              <Td>{group.orderId}</Td>
                              <Td>{group.firstName}</Td>
                              <Td>{group.email}</Td>
                              <Td>{ticketName}</Td>
                              <Td isNumeric>{group.quantity}</Td>
                              <Td isNumeric>{ticketPrice}</Td>
                              <Td isNumeric>{group.subtotal}</Td>
                              <Td isNumeric>{group.fees}</Td>
                              <Td isNumeric>{group.total}</Td>
                            </Tr>
                          )
                        );
                      })}
                    </Tbody>
                  ) : (
                    <Tbody>
                      {Object.keys(ticketCounts).map((ticketId) => {
                        const ticketQuantity = ticketCounts[ticketId];
                        const ticketPrice = ticketType[ticketId - 1]?.price;
                        const ticketName = ticketType[ticketId - 1]?.name;
                        const step = ticketType[ticketId - 1]?.step;

                        // Ensure the ticket quantity is valid
                        if (!ticketQuantity || ticketQuantity <= 0) return null;

                        // Group tickets by email, summing quantities, subtotals, fees, and totals
                        const emailGroups = {};

                        Array.from({ length: ticketQuantity }).forEach(
                          (_, i) => {
                            const email = contactData.email;
                            const firstName = contactData.firstName;

                            if (!emailGroups[email]) {
                              emailGroups[email] = {
                                firstName,
                                email,
                                quantity: 0,
                                subtotal: 0,
                                fees: 0,
                                total: 0,
                                orderId: generateUniqueOrderId(email), // Generate once per unique email
                              };
                            }

                            // Increment values for each email group
                            const quantity = 1;
                            const subtotal = (ticketPrice * quantity) / step;
                            const fees =
                              quantity *
                              (ticketPrice * (feePercentage / 100) +
                                100 / step);
                            const total = subtotal + fees;

                            emailGroups[email].quantity += quantity;
                            emailGroups[email].subtotal += subtotal;
                            emailGroups[email].fees += fees;
                            emailGroups[email].total += total;
                          }
                        );

                        // Render each unique email group
                        return Object.values(emailGroups).map(
                          (group, index) => (
                            <Tr key={index}>
                              <Td>{group.orderId}</Td>
                              <Td>{group.firstName}</Td>
                              <Td>{group.email}</Td>
                              <Td>{ticketName}</Td>
                              <Td isNumeric>{group.quantity}</Td>
                              <Td isNumeric>{ticketPrice}</Td>
                              <Td isNumeric>{group.subtotal}</Td>
                              <Td isNumeric>{group.fees}</Td>
                              <Td isNumeric>{group.total}</Td>
                            </Tr>
                          )
                        );
                      })}
                    </Tbody>
                  )}

                  <Tfoot>
                    <Tr>
                      <Th>Unique ID</Th>
                      <Th>Attendee</Th>
                      <Th>Send Order to this email</Th>
                      <Th>Ticket Type for each attendees</Th>
                    </Tr>
                  </Tfoot>
                </Table>
              </TableContainer>
            </Box>
          </VStack>
        </VStack>
      </VStack>
    </Box>
  );
};

export default PaymentSuccess;
