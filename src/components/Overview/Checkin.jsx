import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  VStack,
  Box,
  Text,
  Heading,
  Button,
  Table,
  Thead,
  Spinner,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Flex,
  InputGroup,
  Input,
  InputLeftElement,
} from "@chakra-ui/react";
import {

  ArrowLeftIcon,
  ArrowRightIcon,

  Search2Icon,

} from "@chakra-ui/icons";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { useParams } from "react-router-dom";
import { getAllOrders } from "../../../server/allOrder";
import { eventsData } from "../../../server/eventsData";
import axios from 'axios';


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

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (loading) return (
    <VStack w="100%" h="80vh" justify="center" align="center">
      <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='primary.500' size='xl' />
    </VStack>
  );
  if (error) return <Text color="red.500">{error}</Text>;

  const handleCheckIn = async (orderId) => {
    try {
      // Optimistically update UI state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.orderId === orderId
            ? { ...order, isUpdating: true }
            : order
        )
      );

      // Note: There seems to be a duplicate 'api' in the URL path
      const response = await axios.put('https://tln-411s.onrender.com/api/orders', {
        orderId,
        checkedIn: true,
      });

      // Consider handling non-200 responses explicitly
      if (!response.data.message) {
        throw new Error('Invalid server response');
      }

      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.orderId === orderId
            ? { ...order, checkedIn: true, isUpdating: false }
            : order
        )
      );

      // Add success feedback
      toast?.success('Order checked in successfully');

    } catch (error) {
      console.error('Error checking in order:', error);

      // Reset loading state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.orderId === orderId
            ? { ...order, isUpdating: false }
            : order
        )
      );

      // Add error feedback
      toast?.error('Failed to check in order');
    }
  };


  return (
    <Box w="100%" h="100%" bg="dark" overflowY="hidden" borderTopRadius="20px" py="40px" px="20px">
      <VStack w="100%" spacing="30px">
        {/* <InputGroup>
          <InputLeftElement>
            <Search2Icon />
          </InputLeftElement>
          <Input
            placeholder="Search by order ID, name, email, or date"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </InputGroup> */}

        <Flex justify="space-between" w="100%" align="center">
          <Heading color="white" size="lg">Check In</Heading>

          <InputGroup w="60%">
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

        <TableContainer w="100%">
          <Table>
            <Thead>
              <Tr bg="white">
                <Th fontSize="12px" fontWeight="600" color="dark">Order ID</Th>
                <Th fontSize="12px" fontWeight="600" color="dark">Attendee Name</Th>
                <Th fontSize="12px" fontWeight="600" color="dark">Ticket Type</Th>
                <Th fontSize="12px" fontWeight="600" color="dark">Quantity</Th>
                <Th fontSize="12px" fontWeight="600" color="dark">Date</Th>
                <Th fontSize="12px" fontWeight="600" color="dark">Status</Th>
              </Tr>
            </Thead>

            <Tbody>
              {paginatedOrders.map(order => (
                <Tr key={order.orderId}>
                  <Td><Text color="white" fontSize="12px">{order.orderId}</Text></Td>
                  <Td><Text color="white" fontSize="12px">{order.attendeeName}</Text></Td>
                  <Td><Text color="white" fontSize="12px">{order.ticketType}</Text></Td>
                  <Td isNumeric><Text color="white" fontSize="12px">{order.quantity}</Text></Td>
                  <Td><Text color="white" fontSize="12px">{formatCreatedAt(order.createdAt)}</Text></Td>

                  <Td>
                    {order.checkedIn ? (
                      <Box color="primary.500"><IoCheckmarkDoneSharp /></Box>
                    ) : (
                      <Button
                        bg={"neutral.500"}
                        h="25px"
                        color="dark"
                        onClick={() => handleCheckIn(order.orderId)}
                        isLoading={order.isUpdating}
                        _hover={{
                          bg: "gray.200"
                        }}
                      >
                        <Text fontSize="12px" color="dark">Check In</Text>
                      </Button>

                    )}
                  </Td>

                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>

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
  );
};

export default Checkin;
