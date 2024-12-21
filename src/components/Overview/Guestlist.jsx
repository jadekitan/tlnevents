import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  VStack,
  Box,
  Text,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  Table,
  Thead,
  Spinner,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Select,
  Flex
} from "@chakra-ui/react";
import { DownloadIcon, ArrowLeftIcon, ArrowRightIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { IoTicketOutline } from "react-icons/io5";
import { useParams } from "react-router-dom";
import { getAllOrders } from "../../../server/allOrder";
import * as XLSX from "xlsx";
import { eventsData } from "../../../server/eventsData";
import { debounce } from "lodash";

const Guestlist = () => {
  const { eventId } = useParams();
  const event = eventsData[eventId];
  const [activeTab, setActiveTab] = useState(0);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [expandedRow, setExpandedRow] = useState(null);

  const tickets = event.tickets;

  // Memoized tabs data
  const tabsData = useMemo(() => [
    { name: "All", id: "all" },
    ...tickets.map(ticket => ({
      name: ticket.name,
      id: ticket.id
    }))
  ], [tickets]);

  // Memoized ticket quantities
  const ticketQuantities = useMemo(() => {
    return tickets.map(ticket => ({
      ...ticket,
      quantity: orders.reduce((sum, order) =>
        order.ticketType === ticket.name ? sum + order.quantity : sum, 0
      )
    }));
  }, [tickets, orders]);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAllOrders({});
      if (result.success) {
        setOrders(result.data);
      } else {
        setError("Failed to fetch orders");
      }
    } catch (err) {
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Memoized filtered orders
  const filteredOrders = useMemo(() => {
    if (activeTab === 0) return orders;
    const selectedTicket = tickets[activeTab - 1];
    return orders.filter(order => order.ticketType === selectedTicket.name);
  }, [orders, activeTab, tickets]);

  // Memoized paginated orders
  const paginatedOrders = useMemo(() => {
    return filteredOrders.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredOrders, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

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

  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const totalTicketsQuantity = useMemo(() => {
    return tickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
  }, [tickets]);

  // Generate pagination options
  const paginationOptions = useMemo(() => {
    const options = [10];  // Start with 10
    let current = 25;

    // Add intermediate options (25, 50, 100, etc.) if they're less than total
    while (current <= totalTicketsQuantity && current <= 100) {
      options.push(current);
      current = current * 2;
    }

    // Add the total quantity as the last option if it's greater than the last standard option
    if (totalTicketsQuantity > options[options.length - 1]) {
      options.push(totalTicketsQuantity);
    }

    return options;
  }, [totalTicketsQuantity]);

  // Updated items per page change handler
  const handleItemsPerPageChange = useCallback((e) => {
    const newValue = Number(e.target.value);
    setItemsPerPage(newValue);
    setCurrentPage(1); // Reset to first page when changing items per page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleTabChange = useCallback((index) => {
    // Immediate update for active tab to ensure instant UI feedback
    setActiveTab(index);

    // Non-critical updates performed synchronously, no debounce
    setCurrentPage(1);
    setExpandedRow(null);
  }, []);



  const exportToExcel = useCallback((data, tabName) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${tabName}-orders.xlsx`);
  }, []);

  if (loading) return (
    <VStack w="100%" h="80vh" justify="center" align="center">
      <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='primary.500' size='xl' />
    </VStack>
  );
  if (error) return <Text color="red.500">{error}</Text>;

  return (
    <VStack w="100%" h="100%" justify="flex-start" align="flex-start">
      <Tabs w="100%" variant="enclosed" p="none" index={activeTab} onChange={handleTabChange}>
        <TabList pl="60px" borderBottom="none">
          {tabsData.map((tab) => (
            <Tab
              key={tab.id}
              variant='enclosed'
              sx={{
                color: "neutral.500",
                borderColor: "transparent",
                borderBottom: 'none',
                transition: "all 0.2s",
                "_selected": {
                  color: "dark",
                  borderColor: "inherit",
                }
              }}
            >
              {tab.name}
            </Tab>
          ))}
        </TabList>

        <TabPanels pb="none">
          {tabsData.map((tab) => (
            <TabPanel key={tab.id} pt="2px" pb="0">
              <Box w="100%" h="100%" bg="dark" overflowY="hidden" borderTopRadius="20px" py="40px" px="20px">
                <VStack w="100%" justify="center" align="flex-start" spacing="60px">
                  {/* Ticket Summary */}
                  <Flex w="100%" justify="space-between">
                    {ticketQuantities.map((ticket) => (
                      <motion.div
                        key={ticket.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ width: "32%" }}
                      >
                        <Box bg="neutral.500" p={4} borderRadius="md" w="100%">
                          <Flex align="center" gap={2}>
                            <Box bg="dark" p="8px" borderRadius="4px">
                              <VStack spacing={1}>
                                <Text color="white">{ticket.quantity}</Text>
                                <IoTicketOutline color="white" />
                              </VStack>
                            </Box>
                            <Text color="white" fontSize="sm">{ticket.name}</Text>
                          </Flex>
                        </Box>
                      </motion.div>
                    ))}
                  </Flex>

                  <VStack w="100%" spacing="30px">
                    {/* Table Header */}
                    <Flex justify="space-between" w="100%" align="center">
                      <Heading color="white" size="lg">Guest List</Heading>
                      <Flex gap={4} align="center">
                        <Flex align={"center"} gap="12px">
                          <Text color="white">Items per page:</Text>
                          <Select
                            variant="unstyled"
                            border="none"
                            p="0"
                            h="100%"
                            value={itemsPerPage}
                            onChange={handleItemsPerPageChange}
                            w="75px"
                            sx={{
                              color: 'white',
                              _hover: { border: 'none' },
                              _active: { border: 'none' },
                              _focus: { border: 'none' },
                              // Change the icon color
                              "& svg": {
                                color: "white",
                              },
                            }}
                          >
                            {paginationOptions.map((num) => (
                              <option
                                style={{
                                  backgroundColor: 'dark', // Background for the option
                                  color: 'white',          // Text color for the option
                                  padding: '20px',            // Remove padding from options
                                }}
                                key={num}
                                value={num}
                              >
                                {num === totalTicketsQuantity ? `All (${num})` : num}
                              </option>
                            ))}
                          </Select>

                        </Flex>
                        <Button
                          rightIcon={<DownloadIcon />}
                          h="35px"
                          bg="neutral.500"
                          color="white"
                          fontSize="12px"
                          _hover={{ bg: "rgb(200,200,200)", color: "dark" }}
                          onClick={() => exportToExcel(filteredOrders, tab.name)}
                        >
                          Export
                        </Button>
                      </Flex>
                    </Flex>

                    {/* Orders Table */}
                    <TableContainer w="100%" overflowX="hidden">
                      <Table w="100%" variant="simple">
                        <Thead w="100%">
                          <Tr bg="white">
                            <Th fontSize="12px" fontWeight="600" color="dark">Order ID</Th>
                            <Th fontSize="12px" fontWeight="600" color="dark">Attendee Name</Th>
                            <Th fontSize="12px" fontWeight="600" color="dark">Ticket Name</Th>
                            <Th fontSize="12px" fontWeight="600" color="dark">Quantity</Th>
                            <Th fontSize="12px" fontWeight="600" color="dark">Date</Th>
                          </Tr>
                        </Thead>
                        <Tbody w="100%">
                          {paginatedOrders.map((order, idx) => (
                            <React.Fragment key={idx}>
                              <Tr position="relative" overflowX="none">
                                <Td><Text color="white" fontSize="12px">{order.orderId}</Text></Td>
                                <Td><Text color="white" fontSize="12px">{order.attendeeName}</Text></Td>
                                <Td><Text color="white" fontSize="12px">{order.ticketType}</Text></Td>
                                <Td><Text color="white" fontSize="12px">{order.quantity}</Text></Td>
                                <Td><Text color="white" fontSize="12px">{formatCreatedAt(order.createdAt)}</Text></Td>
                                <Box
                                  position="absolute"
                                  top="11px"
                                  right="-3px"
                                  as={motion.button}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => setExpandedRow(idx === expandedRow ? null : idx)}
                                >
                                  <motion.div
                                    animate={{ rotate: expandedRow === idx ? 90 : 0 }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    <ChevronRightIcon color="neutral.500" fontSize="25px" />
                                  </motion.div>
                                </Box>
                              </Tr>
                              <AnimatePresence>
                                {expandedRow === idx && (
                                  <motion.tr
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    <Td colSpan={6} bg="gray.800">
                                      <VStack align="start" spacing={2} color="white" p={4}>
                                        <Text>Email: {order.email}</Text>
                                        <Text>Phone: {order.phone}</Text>
                                      </VStack>
                                    </Td>
                                  </motion.tr>
                                )}
                              </AnimatePresence>
                            </React.Fragment>
                          ))}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </VStack>

                  {/* Pagination */}
                  <Flex justify="center" gap={4} w="100%">
                    <Button
                      bg="transparent"
                      _hover={{ bg: "transparent" }}
                      focus={{ bg: "transparent" }}
                      active={{ bg: "transparent" }}
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      <ArrowLeftIcon color="white" />
                    </Button>
                    <Flex gap={2}>
                      {Array.from({ length: totalPages }, (_, i) => (
                        <motion.div
                          key={i + 1}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            bg="transparent"
                            _hover={{ bg: "transparent" }}
                            focus={{ bg: "transparent" }}
                            active={{ bg: "transparent" }}
                            color={currentPage === i + 1 ? "white" : "neutral.500"}
                            onClick={() => handlePageChange(i + 1)}
                          >
                            {i + 1}
                          </Button>
                        </motion.div>
                      ))}
                    </Flex>
                    <Button
                      bg="transparent"
                      _hover={{ bg: "transparent" }}
                      focus={{ bg: "transparent" }}
                      active={{ bg: "transparent" }}
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ArrowRightIcon color="white" />
                    </Button>
                  </Flex>
                </VStack>
              </Box>
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </VStack>
  );
};

export default Guestlist;