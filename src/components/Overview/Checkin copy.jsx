import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
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
  Flex,
  InputGroup,
  Input,
  InputLeftElement,
  IconButton,
} from "@chakra-ui/react";
import {
  DownloadIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronRightIcon,
  Search2Icon,
  CheckIcon,
} from "@chakra-ui/icons";
import { Formik, Form, Field } from 'formik';
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { IoTicketOutline } from "react-icons/io5";
import { useParams } from "react-router-dom";
import { getAllOrders } from "../../../server/allOrder";
import * as XLSX from "xlsx";
import { eventsData } from "../../../server/eventsData";

class TrieNode {
  constructor() {
    this.children = {};
    this.orderIds = new Set();
    this.isEndOfWord = false;
  }
}

// Trie class for efficient search
class SearchTrie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word, orderId) {
    let node = this.root;
    for (const char of word.toLowerCase()) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
      node.orderIds.add(orderId);
    }
    node.isEndOfWord = true;
  }

  search(prefix) {
    let node = this.root;
    for (const char of prefix.toLowerCase()) {
      if (!node.children[char]) {
        return new Set();
      }
      node = node.children[char];
    }
    return node.orderIds;
  }
}

const createFastSearchIndex = (orders) => {
  const trie = new SearchTrie();
  const dateIndex = new Map();

  orders.forEach(order => {
    trie.insert(order.orderId, order.orderId);
    order.attendeeName.split(' ').forEach(word => {
      trie.insert(word, order.orderId);
    });
    order.email.split(/[@.]/).forEach(part => {
      trie.insert(part, order.orderId);
    });
    const date = new Date(order.createdAt).toLocaleDateString();
    if (!dateIndex.has(date)) {
      dateIndex.set(date, new Set());
    }
    dateIndex.get(date).add(order.orderId);
  });

  return { trie, dateIndex };
};

const fastSearch = (searchTerm, { trie, dateIndex }, allOrders) => {
  if (!searchTerm) return allOrders;
  const matchingIds = trie.search(searchTerm);

  if (/\d/.test(searchTerm)) {
    dateIndex.forEach((orderIds, dateStr) => {
      if (dateStr.toLowerCase().includes(searchTerm)) {
        orderIds.forEach(id => matchingIds.add(id));
      }
    });
  }
  return allOrders.filter(order => matchingIds.has(order.orderId));
};

const Checkin = () => {
  const { eventId } = useParams();
  const event = eventsData[eventId];
  const [activeTab, setActiveTab] = useState(0);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [expandedRow, setExpandedRow] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [searchIndex, setSearchIndex] = useState(null);
  const searchTimeoutRef = useRef(null);

  const tickets = event.tickets;

  useEffect(() => {
    if (orders.length > 0) {
      setSearchIndex(createFastSearchIndex(orders));
    }
  }, [orders]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchTerm(value);
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const filteredOrders = useMemo(() => {
    if (!searchIndex) return orders;
    const search = debouncedSearchTerm.toLowerCase().trim();
    if (!search) {
      return activeTab === 0
        ? orders
        : orders.filter(order => order.ticketType === tickets[activeTab - 1].name);
    }
    const filtered = fastSearch(search, searchIndex, orders);
    return activeTab === 0
      ? filtered
      : filtered.filter(order => order.ticketType === tickets[activeTab - 1].name);
  }, [debouncedSearchTerm, orders, activeTab, tickets, searchIndex]);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const totalTicketsQuantity = useMemo(() => {
    return tickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
  }, [tickets]);

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



  const handleItemsPerPageChange = useCallback((e) => {
    const newValue = Number(e.target.value);
    setItemsPerPage(newValue);
    setCurrentPage(1); // Reset to first page when changing items per page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleTabChange = useCallback((index) => {
    setActiveTab(index);
    setCurrentPage(1);
    setExpandedRow(null);
  }, []);

  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);


  // Memoized tabs data
  const tabsData = useMemo(() => [
    { name: "All", id: "all" },
    ...tickets.map(ticket => ({
      name: ticket.name,
      id: ticket.id
    }))
  ], [tickets]);

  // Calculate check-in statistics
  const checkInStats = useMemo(() => {
    const stats = {};
    tickets.forEach(ticket => {
      const ticketOrders = orders.filter(order => order.ticketType === ticket.name);
      const checkedInCount = ticketOrders.filter(order => order.checkedIn).reduce((sum, order) => sum + order.quantity, 0);
      const totalCount = ticketOrders.reduce((sum, order) => sum + order.quantity, 0);
      stats[ticket.name] = { checkedIn: checkedInCount, total: totalCount };
    });

    // Calculate total stats
    stats.total = {
      checkedIn: orders.filter(order => order.checkedIn).reduce((sum, order) => sum + order.quantity, 0),
      total: orders.reduce((sum, order) => sum + order.quantity, 0)
    };

    return stats;
  }, [orders, tickets]);

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


  // Handle check-in
  const handleCheckIn = useCallback(async (orderId) => {
    try {
      // API call would go here
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.orderId === orderId
            ? { ...order, checkedIn: !order.checkedIn }
            : order
        )
      );
    } catch (error) {
      console.error("Check-in failed:", error);
    }
  }, []);

  // Existing utility functions...
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



  const ticketQuantities = useMemo(() => {
    return tickets.map(ticket => ({
      ...ticket,
      quantity: orders.reduce((sum, order) =>
        order.ticketType === ticket.name ? sum + order.quantity : sum, 0
      )
    }));
  }, [tickets, orders]);

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
                  {/* Updated Ticket Summary with Check-in Stats */}
                  <Flex w="100%" justify="space-between">
                    {ticketQuantities.map((ticket) => {
                      const stats = checkInStats[ticket.name];
                      return (
                        <motion.div
                          key={ticket.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          style={{ width: "32%" }}
                        >

                          <Box w="350px" h="100%" bg="neutral.500" p="20px" rounded="8px">
                            <VStack justify="flex-start" align="flex-start">
                              <Flex justify="flex-start" align="flex-start" gap="8px">
                                <Box bg="dark" color="dark" rounded="4px" p="8px"><Box color="white"><IoCheckmarkDoneSharp /></Box></Box>
                                <Text color="white">{ticket.name}</Text>
                              </Flex>
                              <Text color="white">{stats.checkedIn} / {stats.total}</Text>
                            </VStack>
                          </Box>
                        </motion.div>
                      );
                    })}
                  </Flex>

                  <VStack w="100%" spacing="30px">
                    {/* Search Input */}
                    <Flex justify="space-between" w="100%" align="center">
                      <Heading color="white" size="lg">Check In</Heading>
                      <Flex gap={4} justify="flex-end" align="center">
                        <Flex align={"center"} gap="12px">
                          <Text color="white">Items per page:</Text>
                          <Select
                            variant="unstyled"
                            border="none"
                            p="none"
                            h="100%"
                            value={itemsPerPage}
                            onChange={handleItemsPerPageChange}
                            w="75px"
                            sx={{
                              color: 'white',
                              _hover: { border: 'none' },
                              active: { border: 'none' },
                              focus: { border: 'none' }
                            }}
                          >
                            {paginationOptions.map(num => (
                              <option bg="dark" color="white" key={num} value={num}>
                                {num === totalTicketsQuantity ? `All (${num})` : num}
                              </option>
                            ))}
                          </Select>
                        </Flex>

                        <InputGroup w="300px">
                          <InputLeftElement>
                            <Search2Icon color='gray.300' />
                          </InputLeftElement>
                          <Input
                            variant="filled"
                            bg="neutral.500"
                            _active={{ borderColor: "neutral.500" }}
                            _focus={{ borderColor: "neutral.500" }}
                            color="white"
                            placeholder="Search by order ID, name, email, or date"
                            value={searchTerm}
                            onChange={handleSearchChange}
                          />
                        </InputGroup>
                      </Flex>
                    </Flex>

                    {/* Updated Orders Table */}
                    <TableContainer w="100%" overflowX="hidden">
                      <Table w="100%" variant="simple">
                        <Thead w="100%">
                          <Tr bg="white">
                            <Th fontSize="12px" fontWeight="600" color="dark">Order ID</Th>
                            <Th fontSize="12px" fontWeight="600" color="dark">Attendee Name</Th>
                            <Th fontSize="12px" fontWeight="600" color="dark">Ticket Name</Th>
                            <Th fontSize="12px" fontWeight="600" color="dark">Quantity</Th>
                            <Th fontSize="12px" fontWeight="600" color="dark">Date</Th>
                            <Th fontSize="12px" fontWeight="600" color="dark">Status</Th>
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
                                <Td>
                                  {order.checkedIn ? (<IconButton
                                    aria-label="Check in"
                                    icon={order.checkedIn ? <CheckIcon /> : null}
                                    bg={order.checkedIn ? "green.500" : "neutral.500"}
                                    h="25px"
                                    color={order.checkedIn ? "white" : "dark"}
                                    onClick={() => handleCheckIn(order.orderId)}
                                    _hover={{
                                      bg: order.checkedIn ? "green.600" : "gray.200"
                                    }}

                                  />) : (<Button
                                    aria-label="Check in"
                                    bg={"neutral.500"}
                                    h="25px"
                                    color="dark"
                                    onClick={() => handleCheckIn(order.orderId)}
                                    _hover={{
                                      bg: "gray.200"
                                    }}
                                  >
                                    <Text fontSize="12px" color="dark">Check In</Text>
                                  </Button>)}
                                </Td>
                                {/* Expand/Collapse Button */}
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
                              {/* Expanded Row Content */}
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

                  {/* Pagination section remains the same */}
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

export default Checkin;