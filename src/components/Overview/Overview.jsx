import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import {
  Flex, VStack, Box, Button, Text, Heading, Tabs, TabList, TabPanels, Tab, TabPanel, Table,
  Thead, Spinner, Tbody, Tr, Th, Td, TableContainer,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { IoTicketOutline, IoWalletOutline, IoCheckmarkDoneSharp } from "react-icons/io5";
import { Link, useParams } from 'react-router-dom';
import { getAllOrders } from '../../../server/allOrder';
import { eventsData } from '../../../server/eventsData';

const TicketDetailsPanel = React.memo(({
  ticketType,
  orders,
  event,
  calculateTicketSummary
}) => {
  const filteredOrders = useMemo(() => {
    return orders.filter(order =>
      ticketType === 'All' || order.ticketType === ticketType
    );
  }, [orders, ticketType]);

  const summary = useMemo(() =>
    calculateTicketSummary(ticketType),
    [ticketType, calculateTicketSummary]
  );

  const summaryBoxes = useMemo(() => [
    { label: "Tickets Sold", value: summary.totalTicketsSold.toLocaleString(), icon: <IoTicketOutline /> },
    { label: "Tickets Available", value: `${(summary.ticketsAvailable - summary.totalTicketsSold).toLocaleString()}/ ${summary.ticketsAvailable.toLocaleString()}`, icon: <IoTicketOutline /> },
    { label: "Total Revenue", value: `NGN ${summary.totalRevenue.toLocaleString()}`, icon: <IoWalletOutline /> },
    { label: "Total Checked In", value: summary.totalCheckedIn.toLocaleString(), icon: <IoCheckmarkDoneSharp /> }
  ], [summary]);

  const formatCreatedAt = useCallback((createdAt) => {
    const date = new Date(createdAt);
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
    const [month, day, year] = formattedDate.split(', ')[0].split('/');
    const time = formattedDate.split(', ')[1];
    return `${year}-${month}-${day} ${time}`;
  }, []);

  return (
    <Box w="100%" h="100%" bg="dark" overflowY="hidden" borderTopRadius="20px" py="40px" px="20px">
      <VStack w="100%" justify="center" align="flex-start" spacing="60px">
        <Flex w="100%" justify="space-between">
          {summaryBoxes.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{ width: "32%" }}
            ><Box w="262px" h="100%" bg="neutral.500" p="20px" rounded="8px">
                <VStack justify="flex-start" align="flex-start">
                  <Flex justify="flex-start" align="flex-start" gap="8px">
                    <Box bg="dark" color="dark" rounded="4px" p="8px"><Box color="white">{item.icon}</Box></Box>
                    <Text color="white">{item.label}</Text>
                  </Flex>
                  <Text color="white">{item.value}</Text>
                </VStack>
              </Box></motion.div>
          ))}
        </Flex>

        <VStack w="100%" spacing="30px">
          <Flex w="100%" justify="space-between" align="center">
            <Heading color="white" fontSize="28px">Recent Orders</Heading>
            <Button
              rightIcon={<ArrowForwardIcon />}
              h="35px"
              bg="neutral.500"
              color="white"
              fontSize="12px"
              _hover={{ bg: "rgb(200,200,200)", color: "dark" }}
              as={Link}
              to={`/manage/${event.id}/guestlist?ticketType=${ticketType}`}
            >
              View All
            </Button>
          </Flex>

          <TableContainer w="100%">
            <Table variant='simple'>
              <Thead>
                <Tr bg="white">
                  {["Order ID", "Attendee Name", "Email", "Date", "Ticket Name", "Quantity", "Amount"].map((header) => (
                    <Th
                      key={header}
                      border="1px"
                      borderColor="transparent"
                      isNumeric={["Quantity", "Amount"].includes(header)}
                    >
                      <Text fontSize="12px" fontWeight="600" color="dark">
                        {header}
                      </Text>
                    </Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {filteredOrders.slice(0, 5).map((order, index) => (
                  <Tr key={order.orderId || index}>
                    <Td><Text color="white" fontSize="12px">{order.orderId}</Text></Td>
                    <Td><Text color="white" fontSize="12px">{order.attendeeName}</Text></Td>
                    <Td><Text color="white" fontSize="12px">{order.email}</Text></Td>
                    <Td><Text color="white" fontSize="12px">{formatCreatedAt(order.createdAt)}</Text></Td>
                    <Td><Text color="white" fontSize="12px">{order.ticketType}</Text></Td>
                    <Td isNumeric><Text color="white" fontSize="12px">{order.quantity}</Text></Td>
                    <Td isNumeric><Text color="white" fontSize="12px">{`NGN ${order.total.toLocaleString()}`}</Text></Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </VStack>
      </VStack>
    </Box>
  );
});

const Overview = () => {
  const { eventId } = useParams();
  const event = eventsData[eventId];
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get all unique ticket types and add "All" option
  const ticketTypes = useMemo(() => {
    const types = Array.isArray(event.tickets)
      ? ['All', ...event.tickets.map(ticket => ticket.name)]
      : ['All', ...Object.values(event.tickets).flat().map(ticket => ticket.name)];
    return [...new Set(types)];
  }, [event.tickets]);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const result = await getAllOrders({});
        if (result.success) {
          setOrders(result.data);
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
  }, []);

  const calculateTicketsAvailable = useCallback((ticketType) => {
    if (ticketType === 'All') {
      return Array.isArray(event.tickets)
        ? event.tickets.reduce((acc, ticket) => acc + ticket.quantity, 0)
        : Object.values(event.tickets).flat().reduce((acc, ticket) => acc + ticket.quantity, 0);
    }

    const ticket = Array.isArray(event.tickets)
      ? event.tickets.find(t => t.name === ticketType)
      : Object.values(event.tickets).flat().find(t => t.name === ticketType);

    return ticket ? ticket.quantity : 0;
  }, [event.tickets]);

  const calculateTicketSummary = useCallback((ticketType) => {
    const filteredOrders = ticketType === 'All'
      ? orders
      : orders.filter(order => order.ticketType === ticketType);

    return {
      totalTicketsSold: filteredOrders.reduce((acc, order) => acc + order.quantity, 0),
      totalRevenue: filteredOrders.reduce((acc, order) => acc + order.total, 0),
      ticketsAvailable: calculateTicketsAvailable(ticketType),
      totalCheckedIn: filteredOrders.filter(order => order.checkIn).length
    };
  }, [orders, calculateTicketsAvailable]);

  if (loading) return (
    <VStack w="100%" h="80vh" justify="center" align="center">
      <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='primary.500' size='xl' />
    </VStack>
  );

  if (error) return <div>{error}</div>;

  return (
    <VStack w="100%" h="100%" justify="flex-start" align="flex-start">
      <Tabs
        w="100%"
        variant="enclosed"
        p="none"
        index={selectedTabIndex}
        onChange={setSelectedTabIndex}
      >
        <TabList pl="60px" borderBottom="none">
          {ticketTypes.map((type) => (
            <Tab
              key={type}
              variant='enclosed'
              sx={{
                color: "neutral.500",
                borderColor: "transparent",
                borderBottom: 'none',
                "_selected": {
                  color: "dark",
                  borderColor: "inherit",
                }
              }}
            >
              <Text>{type}</Text>
            </Tab>
          ))}
        </TabList>

        <TabPanels pb="none">
          {ticketTypes.map((type) => (
            <TabPanel key={type} pt="2px" pb="0">
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