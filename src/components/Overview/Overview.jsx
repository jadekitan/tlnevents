import React, { useState, useEffect } from 'react'
import {
  Flex, VStack, Box, Button, Image, Text, Heading, Tabs, TabList, TabPanels, Tab, TabIndicator, TabPanel, Table,
  Thead,
  Spinner,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react"
import { ArrowForwardIcon } from "@chakra-ui/icons"
import { IoTicketOutline, IoWalletOutline, IoCheckmarkDoneSharp } from "react-icons/io5";
import { Link, useParams } from 'react-router-dom'
import { getAllOrders } from '../../../server/allOrder'
import { eventsData } from '../../../server/eventsData'


const Overview = () => {
  const { eventId } = useParams();
  const event = eventsData[eventId];

  // Prepare categories and ticket types
  const prepareCategories = () => {
    const categoriesObj = {
      all: Object.values(event.tickets).flat()
    };

    Object.keys(event.tickets).forEach(category => {
      const categoryTickets = event.tickets[category];

      categoriesObj[category] = categoryTickets.length > 1
        ? [
          {
            id: 'all',
            name: 'All',
            price: 0,
            quantity: categoryTickets.reduce((acc, ticket) => acc + ticket.quantity, 0)
          },
          ...categoryTickets
        ]
        : categoryTickets;
    });

    return categoriesObj;
  };

  const categoriesData = prepareCategories();
  const categories = Object.keys(categoriesData);

  // State management
  const [mainTabIndex, setMainTabIndex] = useState(0);
  const [nestedTabIndexes, setNestedTabIndexes] = useState({});

  // Initialize nested tab indexes
  useEffect(() => {
    const initialNestedIndexes = categories.reduce((acc, category) => {
      const ticketTypes = categoriesData[category].map(ticket => ticket.name);
      acc[category] = {
        currentTypeIndex: 0,
        ticketTypes: ticketTypes
      };
      return acc;
    }, {});
    setNestedTabIndexes(initialNestedIndexes);
  }, []);

  // State for orders and loading
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);

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

  if (loading) return <VStack w="100%" h="80vh" justify="center" align="center"><Spinner
    thickness='4px'
    speed='0.65s'
    emptyColor='gray.200'
    color='primary.500'
    size='xl'
  /></VStack>;
  if (error) return <div>{error}</div>;


  // Calculation helpers
  const calculateTotalTicketsAvailable = (category, ticketTypeName = null) => {
    if (category === 'all') {
      return Object.values(event.tickets).flat().reduce((acc, ticket) => acc + ticket.quantity, 0);
    }

    // If specific category exists in event.tickets
    if (event.tickets[category]) {
      if (ticketTypeName && ticketTypeName !== 'All') {
        const ticket = event.tickets[category].find(t => t.name === ticketTypeName);
        return ticket ? ticket.quantity : 0;
      }

      return event.tickets[category].reduce((acc, ticket) => acc + ticket.quantity, 0);
    }

    // Fallback if category not found
    return 0;
  };

  const calculateCategorySummary = (category, ticketTypeName) => {
    let filteredOrders = orders;

    // Filter by ticket type first
    if (ticketTypeName && ticketTypeName !== 'All') {
      filteredOrders = filteredOrders.filter(order => order.ticketType === ticketTypeName);
    }

    // If category is not 'all', try to match based on available information
    if (category !== 'all') {
      filteredOrders = filteredOrders.filter(order =>
        // Modify this logic based on how you want to match categories
        order.ticketType?.toLowerCase().includes(category.toLowerCase())
      );
    }

    return {
      totalTicketsSold: filteredOrders.reduce((acc, order) => acc + order.quantity, 0),
      totalRevenue: filteredOrders.reduce((acc, order) => acc + order.total, 0), // Changed from subTotal to total
      ticketsAvailable: calculateTotalTicketsAvailable(category, ticketTypeName),
      totalCheckedIn: filteredOrders.filter(order => order.checkIn).length
    };
  };

  return (
    <VStack w="100%" h="100%" justify="flex-start" align="flex-start">
      <Tabs
        w="100%"
        variant="enclosed"
        p="none"
        index={mainTabIndex}
        onChange={(index) => {
          setMainTabIndex(index);
          setNestedTabIndexes((prev) => ({
            ...prev,
            [categories[index]]: {
              ...prev[categories[index]],
              currentTypeIndex: 0, // Reset nested index when switching main tab
            },
          }));
        }}
      >
        {/* Main Category Tabs */}
        <TabList pl="60px" borderBottom="none">
          {categories.map((category) => (
            <Tab key={category} variant='enclosed'
              sx={{
                color: "neutral.500",
                borderColor: "transparent",
                borderBottom: 'none',
                "_selected": {
                  color: "dark",
                  borderColor: "inherit",
                }
              }} >
              <Text>{category.charAt(0).toUpperCase() + category.slice(1)}</Text>
            </Tab>
          ))}
        </TabList>

        <TabPanels pb="none">
          {categories.map((category) => (
            <TabPanel key={category} pt="2px" pb="0">
              {category === 'all' ? (
                <CategoryDetailsPanel
                  category={category}
                  ticketTypeName={null}
                  orders={orders}
                  event={event}
                  calculateCategorySummary={calculateCategorySummary}
                />
              ) : (
                // Only render nested tabs if there's more than one ticket type
                categoriesData[category].length > 1 ? (
                  <Tabs
                    position='relative' variant='unstyled'

                    p="none"

                    index={nestedTabIndexes[category]?.currentTypeIndex || 0}
                    onChange={(index) => {
                      setNestedTabIndexes(prev => ({
                        ...prev,
                        [category]: {
                          ...prev[category],
                          currentTypeIndex: index
                        }
                      }));
                    }}
                  >
                    {/* Nested Ticket Type Tabs */}
                    <TabList pl="40px" borderBottom="none">
                      {(nestedTabIndexes[category]?.ticketTypes || []).map((typeName) => (
                        <Tab key={typeName} sx={{
                          color: "neutral.500",

                          "_selected": {
                            color: "dark",
                          }
                        }}>{typeName}</Tab>
                      ))}
                    </TabList>
                    <TabIndicator mt='-1.5px' height='2px' bg='neutral.500' borderRadius='1px' />
                    <TabPanels p="0">
                      {(nestedTabIndexes[category]?.ticketTypes || []).map((typeName) => (
                        <TabPanel key={typeName} p="0">
                          <CategoryDetailsPanel
                            category={category}
                            ticketTypeName={typeName}
                            orders={orders}
                            event={event}
                            calculateCategorySummary={calculateCategorySummary}
                          />
                        </TabPanel>
                      ))}
                    </TabPanels>
                  </Tabs>
                ) : (
                  // If only one ticket type, render it directly
                  <CategoryDetailsPanel
                    category={category}
                    ticketTypeName={categoriesData[category][0].name}
                    orders={orders}
                    event={event}
                    calculateCategorySummary={calculateCategorySummary}
                  />
                )
              )}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </VStack >
  )
}

// Separate component to render category details
const CategoryDetailsPanel = ({
  category,
  ticketTypeName,
  orders,
  event,
  calculateCategorySummary
}) => {
  // Filter orders based on category and ticket type
  const filteredOrders = orders.filter(order => {
    const categoryMatch = category === 'all' || order.ticketType?.toLowerCase().includes(category.toLowerCase());;
    const ticketTypeMatch = !ticketTypeName || ticketTypeName === "All" || order.ticketType === ticketTypeName;

    return categoryMatch && ticketTypeMatch;
  });

  // Calculate summary
  const summary = calculateCategorySummary(category, ticketTypeName);

  return (
    <Box w="100%" h="100%" bg="dark" overflowY="hidden" borderTopRadius="20px" py="40px" px="20px">
      <VStack w="100%" justify="center" align="flex-start" spacing="60px">
        {/* Summary Boxes */}
        <Flex w="100%" justify="space-between">
          {[
            { label: "Tickets Sold", value: summary.totalTicketsSold.toLocaleString(), icon: <IoTicketOutline /> },
            { label: "Tickets Available", value: `${(summary.ticketsAvailable - summary.totalTicketsSold).toLocaleString()}/ ${summary.ticketsAvailable.toLocaleString()}`, icon: <IoTicketOutline /> },
            { label: "Total Revenue", value: `NGN ${summary.totalRevenue.toLocaleString()}`, icon: <IoWalletOutline /> },
            { label: "Total Checked In", value: summary.totalCheckedIn.toLocaleString(), icon: <IoCheckmarkDoneSharp /> }
          ].map((item, index) => (
            <Box key={index} w="262px" h="100%" bg="neutral.500" p="20px" rounded="8px">
              <VStack justify="flex-start" align="flex-start">
                <Flex justify="flex-start" align="flex-start" gap="8px">
                  <Box bg="dark" color="dark" rounded="4px" p="8px"><Box color="white">{item.icon}</Box></Box>
                  <Text color="white">{item.label}</Text>
                </Flex>
                <Text color="white">{item.value}</Text>
              </VStack>
            </Box>
          ))}
        </Flex>

        {/* Orders Table */}
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
              to={`/manage/${event.id}/guestlist?category=${category}&nestedTab=${ticketTypeName || 'All' || order.ticketType}`}
            >
              View All
            </Button>

          </Flex>

          <TableContainer w="100%">
            <Table variant='simple'>
              <Thead>
                <Tr bg="white">
                  {[
                    "Order ID", "Attendee Name", "Email", "Date",
                    "Ticket Name", "Quantity", "Amount"
                  ].map((header) => (
                    <Th
                      key={header}
                      border="1px"
                      borderColor="transparent"
                      isNumeric={["Quantity", "Price"].includes(header)}
                    >
                      <Text fontSize="12px" fontWeight="600" color="dark">
                        {header}
                      </Text>
                    </Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {filteredOrders.slice(0, 5).map((order, index) => {
                  const formatCreatedAt = () => {
                    const date = new Date(order.createdAt);
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
                  };

                  return (
                    <Tr key={index}>
                      <Td><Text color="white" fontSize="12px">{order.orderId}</Text></Td>
                      <Td><Text color="white" fontSize="12px">{order.attendeeName}</Text></Td>
                      <Td><Text color="white" fontSize="12px">{order.email}</Text></Td>
                      <Td><Text color="white" fontSize="12px">{formatCreatedAt()}</Text></Td>
                      <Td><Text color="white" fontSize="12px">{order.ticketType}</Text></Td>
                      <Td isNumeric><Text color="white" fontSize="12px">{order.quantity}</Text></Td>
                      <Td isNumeric><Text color="white" fontSize="12px">{`NGN ${order.total.toLocaleString()}`}</Text></Td>
                    </Tr>
                  )
                })}
              </Tbody>
            </Table>
          </TableContainer>
        </VStack>
      </VStack>
    </Box>
  );
};

export default Overview;