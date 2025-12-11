import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Flex,
  VStack,
  Box,
  Button,
  Text,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Spinner,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  SimpleGrid,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
  IoTicketOutline,
  IoWalletOutline,
  IoCheckmarkDoneSharp,
} from "react-icons/io5";
import { Link, useParams } from "react-router-dom";
import { getAllOrders } from "../../../server/allOrder";
import { eventsData } from "../../../server/eventsData";

const TicketDetailsPanel = React.memo(
  ({ ticketType, orders, event, calculateTicketSummary }) => {
    const filteredOrders = useMemo(() => {
      return orders.filter(
        (order) => ticketType === "All" || order.ticketType === ticketType
      );
    }, [orders, ticketType]);

    const summary = useMemo(
      () => calculateTicketSummary(ticketType),
      [ticketType, calculateTicketSummary]
    );

    const summaryBoxes = useMemo(
      () => [
        {
          label: "Tickets Sold",
          value: summary.totalTicketsSold.toLocaleString(),
          icon: <IoTicketOutline />,
        },
        {
          label: "Tickets Available",
          value: `${(
            summary.ticketsAvailable - summary.totalTicketsSold
          ).toLocaleString()}/ ${summary.ticketsAvailable.toLocaleString()}`,
          icon: <IoTicketOutline />,
        },
        {
          label: "Total Revenue",
          value: `NGN ${summary.totalRevenue.toLocaleString()}`,
          icon: <IoWalletOutline />,
        },
        {
          label: "Total Checked In",
          value: summary.totalCheckedIn.toLocaleString(),
          icon: <IoCheckmarkDoneSharp />,
        },
      ],
      [summary]
    );

    const formatCreatedAt = useCallback((createdAt) => {
      const date = new Date(createdAt);
      return (
        date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }) +
        " " +
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    }, []);

    return (
      <Box
        w="100%"
        h="100%"
        bg="dark"
        overflowY="hidden"
        borderTopRadius={{ base: "10px", md: "20px" }}
        py={{ base: "20px", md: "40px" }}
        px={{ base: "10px", md: "20px" }}
      >
        <VStack
          w="100%"
          justify="center"
          align="flex-start"
          spacing={{ base: "30px", md: "60px" }}
        >
          {/* Responsive Grid for Summary Boxes */}
          <SimpleGrid
            columns={{ base: 2, md: 2, lg: 4 }} // Changed base to 2
            spacing={{ base: 2, md: 4 }} // Tighter spacing on mobile
            w="100%"
          >
            {summaryBoxes.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                style={{ width: "100%", height: "100%" }}
              >
                <Box
                  h="100%"
                  bg="neutral.500"
                  p={{ base: "12px", md: "20px" }} // Reduced padding for mobile
                  rounded="8px"
                >
                  <VStack
                    justify="flex-start"
                    align="flex-start"
                    h="100%"
                    spacing={{ base: "2px", md: "8px" }}
                  >
                    <Flex
                      justify="flex-start"
                      align="center"
                      gap={{ base: "6px", md: "8px" }}
                    >
                      <Box
                        bg="dark"
                        color="dark"
                        rounded="4px"
                        p={{ base: "5px", md: "8px" }} // Smaller icon box
                        minW={{ base: "24px", md: "auto" }} // Prevent squishing
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Box
                          color="white"
                          fontSize={{ base: "12px", md: "16px" }}
                        >
                          {item.icon}
                        </Box>
                      </Box>
                      <Text
                        color="white"
                        fontSize={{ base: "10px", sm: "xs", md: "md" }} // Smaller text on mobile
                        lineHeight="1.2"
                      >
                        {item.label}
                      </Text>
                    </Flex>
                    <Text
                      color="white"
                      fontWeight="bold"
                      fontSize={{ base: "sm", sm: "md", md: "xl" }} // Smaller value text
                      mt={{ base: "4px", md: "0" }}
                    >
                      {item.value}
                    </Text>
                  </VStack>
                </Box>
              </motion.div>
            ))}
          </SimpleGrid>

          <VStack w="100%" spacing="30px">
            <Flex w="100%" justify="space-between" align="center" gap={4}>
              <Heading
                color="white"
                fontSize={{ base: "20px", md: "28px" }}
                alignSelf={{ base: "flex-start", sm: "center" }}
              >
                Recent Orders
              </Heading>
              <Button
                rightIcon={<ArrowForwardIcon />}
                h="30px"
                bg="neutral.500"
                color="white"
                fontSize="10px"
                w={{ base: "80px", sm: "auto" }}
                _hover={{ bg: "rgb(200,200,200)", color: "dark" }}
                as={Link}
                to={`/manage/${event.id}?view=attendees`}
              >
                View All
              </Button>
            </Flex>

            <>
              {/* Mobile View: Cards */}
              <VStack
                display={{ base: "flex", md: "none" }}
                w="100%"
                spacing={3}
              >
                {filteredOrders.slice(0, 5).map((order, index) => (
                  <Box
                    key={order.orderId || index}
                    bg="neutral.500"
                    p="16px"
                    borderRadius="8px"
                    w="100%"
                  >
                    {/* Top Row: Name and Amount */}
                    <Flex justify="space-between" align="flex-start" mb="8px">
                      <Text
                        color="white"
                        fontWeight="bold"
                        fontSize="14px"
                        noOfLines={1}
                      >
                        {order.attendeeName}
                      </Text>
                      <Text color="green.300" fontWeight="bold" fontSize="14px">
                        NGN {order.total.toLocaleString()}
                      </Text>
                    </Flex>

                    {/* Middle Row: Ticket Info */}
                    <Flex justify="space-between" align="center" mb="12px">
                      <Text color="gray.300" fontSize="12px">
                        {order.ticketType}
                      </Text>
                      <Box bg="dark" px="8px" py="2px" borderRadius="4px">
                        <Text color="white" fontSize="10px">
                          Qty: {order.quantity}
                        </Text>
                      </Box>
                    </Flex>

                    {/* Bottom Row: Footer Meta Data */}
                    <Flex
                      justify="space-between"
                      align="center"
                      pt="8px"
                      borderTop="1px solid"
                      borderColor="whiteAlpha.200"
                    >
                      <Text
                        color="gray.400"
                        fontSize="10px"
                        fontFamily="monospace"
                      >
                        #{order.orderId}
                      </Text>
                      <Text color="gray.400" fontSize="10px">
                        {formatCreatedAt(order.createdAt)}
                      </Text>
                    </Flex>
                  </Box>
                ))}
              </VStack>

              {/* Desktop View: Table */}
              <Box display={{ base: "none", md: "block" }} w="100%">
                <TableContainer w="100%" overflowX="auto">
                  <Table variant="simple" size="md">
                    <Thead>
                      <Tr bg="white">
                        {[
                          "Order ID",
                          "Attendee Name",
                          "Email",
                          "Date",
                          "Ticket Name",
                          "Quantity",
                          "Amount",
                        ].map((header) => (
                          <Th
                            key={header}
                            border="1px"
                            borderColor="transparent"
                            isNumeric={["Quantity", "Amount"].includes(header)}
                          >
                            <Text
                              fontSize="12px"
                              fontWeight="600"
                              color="dark"
                              whiteSpace="nowrap"
                            >
                              {header}
                            </Text>
                          </Th>
                        ))}
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredOrders.slice(0, 5).map((order, index) => (
                        <Tr key={order.orderId || index}>
                          <Td>
                            <Text color="white" fontSize="12px">
                              {order.orderId}
                            </Text>
                          </Td>
                          <Td>
                            <Text color="white" fontSize="12px">
                              {order.attendeeName}
                            </Text>
                          </Td>
                          <Td>
                            <Text color="white" fontSize="12px">
                              {order.email}
                            </Text>
                          </Td>
                          <Td>
                            <Text
                              color="white"
                              fontSize="12px"
                              whiteSpace="nowrap"
                            >
                              {formatCreatedAt(order.createdAt)}
                            </Text>
                          </Td>
                          <Td>
                            <Text color="white" fontSize="12px">
                              {order.ticketType}
                            </Text>
                          </Td>
                          <Td isNumeric>
                            <Text color="white" fontSize="12px">
                              {order.quantity}
                            </Text>
                          </Td>
                          <Td isNumeric>
                            <Text
                              color="white"
                              fontSize="12px"
                            >{`NGN ${order.total.toLocaleString()}`}</Text>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Box>
            </>
          </VStack>
        </VStack>
      </Box>
    );
  }
);

const Overview = () => {
  const { eventId } = useParams();
  const event = eventsData[eventId];
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const ticketTypes = useMemo(() => {
    const types = Array.isArray(event.tickets)
      ? ["All", ...event.tickets.map((ticket) => ticket.name)]
      : [
          "All",
          ...Object.values(event.tickets)
            .flat()
            .map((ticket) => ticket.name),
        ];
    return [...new Set(types)];
  }, [event.tickets]);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const result = await getAllOrders({});
        if (result.success) {
          const eventSpecificOrders = result.data.filter(
            (order) => order.eventName === event.name
          );
          setOrders(eventSpecificOrders);
        } else {
          setError(result.message || "Failed to fetch orders");
        }
      } catch (err) {
        setError("Failed to fetch orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [event.name]);

  const calculateTicketsAvailable = useCallback(
    (ticketType) => {
      if (ticketType === "All") {
        return Array.isArray(event.tickets)
          ? event.tickets.reduce((acc, ticket) => acc + ticket.quantity, 0)
          : Object.values(event.tickets)
              .flat()
              .reduce((acc, ticket) => acc + ticket.quantity, 0);
      }
      const ticket = Array.isArray(event.tickets)
        ? event.tickets.find((t) => t.name === ticketType)
        : Object.values(event.tickets)
            .flat()
            .find((t) => t.name === ticketType);
      return ticket ? ticket.quantity : 0;
    },
    [event.tickets]
  );

  const calculateTicketSummary = useCallback(
    (ticketType) => {
      const eventOrders = orders.filter(
        (order) => order.eventName === event.name
      );
      const filteredOrders =
        ticketType === "All"
          ? eventOrders
          : eventOrders.filter((order) => order.ticketType === ticketType);
      return {
        totalTicketsSold: filteredOrders.reduce(
          (acc, order) => acc + order.quantity,
          0
        ),
        totalRevenue: filteredOrders.reduce(
          (acc, order) => acc + order.total,
          0
        ),
        ticketsAvailable: calculateTicketsAvailable(ticketType),
        totalCheckedIn: filteredOrders.filter((order) => order.checkedIn)
          .length,
      };
    },
    [orders, event.name, calculateTicketsAvailable]
  );

  if (loading)
    return (
      <VStack w="100%" h="80vh" justify="center" align="center">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="primary.500"
          size="xl"
        />
      </VStack>
    );
  if (error) return <div>{error}</div>;

  return (
    <VStack w="100%" h="100%" justify="flex-start" align="flex-start">
      <Tabs
        w="100%"
        variant="enclosed"
        index={selectedTabIndex}
        onChange={setSelectedTabIndex}
        isLazy
      >
        <TabList
          pl={{ base: "10px", md: "60px" }}
          borderBottom="none"
          overflowX="auto"
          whiteSpace="nowrap"
          pb="4px" // Give space for scrollbar
          css={{
            "&::-webkit-scrollbar": { height: "4px" },
            "&::-webkit-scrollbar-thumb": {
              background: "#888",
              borderRadius: "4px",
            },
          }}
        >
          {ticketTypes.map((type) => (
            <Tab
              key={type}
              variant="enclosed"
              _selected={{ color: "dark", borderColor: "inherit" }}
              color="neutral.500"
              borderColor="transparent"
              borderBottom="none"
              flexShrink={0} // Prevent shrinking
            >
              <Text fontSize={{ base: "sm", md: "md" }}>{type}</Text>
            </Tab>
          ))}
        </TabList>

        <TabPanels pb="none">
          {ticketTypes.map((type) => (
            <TabPanel key={type} pt="2px" pb="0" px="0">
              <TicketDetailsPanel
                ticketType={type}
                orders={orders}
                event={event}
                calculateTicketSummary={calculateTicketSummary}
              />
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </VStack>
  );
};

export default Overview;
