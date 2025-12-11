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
import axios from "axios";
import { order } from "../../../server/free-order";

const RegisterSuccess = () => {
  useEffect(() => {
    document.title = "Payment Successful | The Lemonade Network";
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

  // Extract the reference from the URL query params
  const query = new URLSearchParams(location.search);
  const email = query.get("email");
  const guest = query.get("guest");
  const affiliateCode = query.get("affiliate");

  const [orderData, setOrderData] = useState([]);
  const { eventId } = useParams();
  const event = eventsData[eventId];

  // Debug affiliate code on component mount
  useEffect(() => {
    // Check if affiliate code passes validation
    const isValidAffiliate =
      affiliateCode &&
      affiliateCode !== "null" &&
      affiliateCode !== "undefined" &&
      affiliateCode.trim() !== "";
  }, [affiliateCode, query]);

  const clearData = () => {
    clearContactData();
    clearTicketCounts();
    clearAssignMultiple();
    localStorage.removeItem("referral_code");
  };

  const hasExtractedData = useRef(false); // Ensure extraction only happens once

  useEffect(() => {
    const extractOrderData = () => {
      const data = [];
      const tbodyRows = document.querySelectorAll("tbody tr");

      tbodyRows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        if (cells.length === 9) {
          data.push({
            orderId: cells[0].textContent,
            attendeeName: cells[1].textContent,
            email: cells[2].textContent,
            ticketType: cells[3].textContent,
            quantity: parseInt(cells[4].textContent, 10),
            ticketPrice: parseFloat(cells[5].textContent),
            subTotal: parseFloat(cells[6].textContent),
            fees: parseFloat(cells[7].textContent),
            total: parseFloat(cells[8].textContent),
            eventName: event.name,
          });
        }
      });

      return data;
    };

    const handleOrderData = async () => {
      if (hasExtractedData.current) return;
      hasExtractedData.current = true;

      const extractedData = extractOrderData();
      setOrderData(extractedData);

      const isValidAffiliateCode = (code) => {
        return (
          code && code !== "null" && code !== "undefined" && code.trim() !== ""
        );
      };

      // Then use it consistently
      const refCode = isValidAffiliateCode(affiliateCode)
        ? affiliateCode
        : null;

      for (const item of extractedData) {
        try {
          const data = await order(
            item.attendeeName,
            item.email,
            Number.parseInt(item.fees),
            Number.parseInt(item.quantity),
            Number.parseInt(item.subTotal),
            item.ticketType,
            Number.parseInt(item.ticketPrice),
            event.name,
            isValidAffiliateCode(affiliateCode) ? affiliateCode : undefined
          );
        } catch (error) {
          console.error("Error submitting order:", error.message);
        }
      }

      clearData();
    };

    // Add a small delay to ensure all debug info is logged first
    const timer = setTimeout(() => {
      handleOrderData();
    }, 100);

    return () => clearTimeout(timer);
  }, [affiliateCode, event.name]); // Empty dependency array ensures this runs only on component mount

  // const [ticketType] = useState(event ? event.tickets : []);

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
              Registration Succesful !
            </Heading>
            <VStack w="100%" textAlign="center" spacing="10px">
              <Text color="dark" fontSize={["12px", "16px"]}>
                Your order was successful. We've also sent a copy to your email
                address{" "}
                <Text as="span" color="primary.500">
                  {email}
                </Text>
                {guest === "true" ? " and all the attending guests." : "."}
              </Text>
              <Text color="dark" fontSize={["12px", "16px"]}>
                If you do not receive your ticket from us, please email us at{" "}
                <Link to="mailto:info@lemonade.africa">
                  <Text as="span" color="primary.500">
                    info@lemonade.africa
                  </Text>
                </Link>
                .
              </Text>
            </VStack>
            <Box display="none">
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

                  {guest === "true" ? (
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
                            const lastName =
                              contactData.attendeeAddresses?.[ticketId]?.[i]
                                ?.lastName;

                            if (!emailGroups[email]) {
                              emailGroups[email] = {
                                firstName,
                                lastName,
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
                            const fees = 0;

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
                              <Td>{`${group.firstName} ${group.lastName}`}</Td>
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
                            const fees = 0;
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
            <VStack>
              <Link to={`/${event.id}`}>
                <Button bg="primary.500" _hover={{ bg: "primary.400" }}>
                  Back to Event
                </Button>
              </Link>
              {/* <Link to={`/${event.id}`}>
                <Text color="dark" fontSize={["14px", "16px"]}>
                  Shop Merch
                </Text>
              </Link> */}
            </VStack>
          </VStack>
        </VStack>
      </VStack>
    </Box>
  );
};

export default RegisterSuccess;
