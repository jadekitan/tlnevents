import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
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
import { ArrowLeftIcon, ArrowRightIcon, Search2Icon } from "@chakra-ui/icons";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { useParams } from "react-router-dom";
import { getAllOrders } from "../../../server/allOrder";
import { eventsData } from "../../../server/eventsData";
import axios from "axios";

// ... Trie Node and Logic classes remain the same ...
class TrieNode {
  constructor() {
    this.children = {};
    this.orderIds = new Set();
    this.isEndOfWord = false;
  }
}
class SearchTrie {
  constructor() {
    this.root = new TrieNode();
  }
  insert(word, orderId) {
    let node = this.root;
    for (const char of word.toLowerCase()) {
      if (!node.children[char]) node.children[char] = new TrieNode();
      node = node.children[char];
      node.orderIds.add(orderId);
    }
    node.isEndOfWord = true;
  }
  search(prefix) {
    let node = this.root;
    for (const char of prefix.toLowerCase()) {
      if (!node.children[char]) return new Set();
      node = node.children[char];
    }
    return node.orderIds;
  }
}
const createFastSearchIndex = (orders) => {
  const trie = new SearchTrie();
  const dateIndex = new Map();
  orders.forEach((order) => {
    trie.insert(order.orderId, order.orderId);
    order.attendeeName
      .split(" ")
      .forEach((word) => trie.insert(word, order.orderId));
    order.email
      .split(/[@.]/)
      .forEach((part) => trie.insert(part, order.orderId));
    const date = new Date(order.createdAt).toLocaleDateString();
    if (!dateIndex.has(date)) dateIndex.set(date, new Set());
    dateIndex.get(date).add(order.orderId);
  });
  return { trie, dateIndex };
};
const fastSearch = (searchTerm, { trie, dateIndex }, allOrders) => {
  if (!searchTerm) return allOrders;
  const matchingIds = trie.search(searchTerm);
  if (/\d/.test(searchTerm)) {
    dateIndex.forEach((orderIds, dateStr) => {
      if (dateStr.toLowerCase().includes(searchTerm))
        orderIds.forEach((id) => matchingIds.add(id));
    });
  }
  return allOrders.filter((order) => matchingIds.has(order.orderId));
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
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [searchIndex, setSearchIndex] = useState(null);
  const searchTimeoutRef = useRef(null);

  const tickets = event.tickets;

  useEffect(() => {
    if (orders.length > 0) setSearchIndex(createFastSearchIndex(orders));
  }, [orders]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(
      () => setDebouncedSearchTerm(value),
      300
    );
  };

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  const filteredOrders = useMemo(() => {
    if (!searchIndex) return orders;
    const search = debouncedSearchTerm.toLowerCase().trim();
    if (!search)
      return activeTab === 0
        ? orders
        : orders.filter(
            (order) => order.ticketType === tickets[activeTab - 1].name
          );
    const filtered = fastSearch(search, searchIndex, orders);
    return activeTab === 0
      ? filtered
      : filtered.filter(
          (order) => order.ticketType === tickets[activeTab - 1].name
        );
  }, [debouncedSearchTerm, orders, activeTab, tickets, searchIndex]);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

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

  const handleCheckIn = async (orderId) => {
    try {
      setOrders((prev) =>
        prev.map((o) =>
          o.orderId === orderId ? { ...o, isUpdating: true } : o
        )
      );
      const response = await axios.put(
        "https://tln-411s.onrender.com/api/orders",
        { orderId, checkedIn: true }
      );
      if (!response.data.message) throw new Error("Invalid server response");
      setOrders((prev) =>
        prev.map((o) =>
          o.orderId === orderId
            ? { ...o, checkedIn: true, isUpdating: false }
            : o
        )
      );
    } catch (error) {
      console.error("Error checking in order:", error);
      setOrders((prev) =>
        prev.map((o) =>
          o.orderId === orderId ? { ...o, isUpdating: false } : o
        )
      );
    }
  };

  const handlePageChange = (newPage) => setCurrentPage(newPage);

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
  if (error) return <Text color="red.500">{error}</Text>;

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
      <VStack w="100%" spacing={{ base: "20px", md: "30px" }}>
        {/* Responsive Header and Search */}
        <Flex justify="space-between" w="100%" align="center" gap={4}>
          <Heading
            color="white"
            size="lg"
            alignSelf={{ base: "flex-start", md: "center" }}
          >
            Check In
          </Heading>
          <InputGroup w={{ base: "60%", md: "60%" }}>
            <InputLeftElement>
              <Search2Icon color="gray.300" />
            </InputLeftElement>
            <Input
              variant="filled"
              bg="neutral.500"
              _active={{ borderColor: "neutral.500" }}
              _focus={{ borderColor: "neutral.500" }}
              color="white"
              placeholder="Search by ID, name, email..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </InputGroup>
        </Flex>

        {/* Mobile View: Cards */}
        <VStack display={{ base: "flex", md: "none" }} w="100%" spacing={4}>
          {paginatedOrders.map((order) => (
            <Box
              key={order.orderId}
              bg="neutral.500"
              p="16px"
              borderRadius="8px"
              w="100%"
            >
              {/* Top Row: Name and Check-In Status/Button */}
              <Flex justify="space-between" align="center" mb="12px">
                <VStack align="flex-start" spacing={0}>
                  <Text
                    color="white"
                    fontWeight="bold"
                    fontSize="14px"
                    noOfLines={1}
                  >
                    {order.attendeeName}
                  </Text>
                  <Text color="gray.400" fontSize="10px" fontFamily="monospace">
                    #{order.orderId}
                  </Text>
                </VStack>

                <Box>
                  {order.checkedIn ? (
                    <Flex
                      align="center"
                      bg="green.900"
                      color="green.300"
                      px="8px"
                      py="4px"
                      borderRadius="4px"
                      gap="4px"
                    >
                      <IoCheckmarkDoneSharp size="12px" />
                      <Text fontSize="10px" fontWeight="bold">
                        Checked In
                      </Text>
                    </Flex>
                  ) : (
                    <Button
                      size="xs"
                      bg="white"
                      color="dark"
                      onClick={() => handleCheckIn(order.orderId)}
                      isLoading={order.isUpdating}
                      _hover={{ bg: "gray.200" }}
                      height="28px"
                      px="12px"
                    >
                      Check In
                    </Button>
                  )}
                </Box>
              </Flex>

              {/* Bottom Row: Ticket Details */}
              <Flex
                justify="space-between"
                align="center"
                pt="8px"
                borderTop="1px solid"
                borderColor="whiteAlpha.200"
              >
                <Text color="gray.300" fontSize="12px">
                  {order.ticketType}
                </Text>
                <Flex align="center" gap="8px">
                  <Box bg="dark" px="6px" py="2px" borderRadius="4px">
                    <Text color="white" fontSize="10px">
                      Qty: {order.quantity}
                    </Text>
                  </Box>
                  {/* Optional: Show Date if needed, or keep clean */}
                  {/* <Text color="gray.500" fontSize="10px">
                    {formatCreatedAt(order.createdAt).split(',')[0]}
                  </Text> */}
                </Flex>
              </Flex>
            </Box>
          ))}
        </VStack>

        {/* Desktop View: Table */}
        <Box display={{ base: "none", md: "block" }} w="100%">
          <TableContainer w="100%" overflowX="auto">
            <Table size="md">
              <Thead>
                <Tr bg="white">
                  {[
                    "Order ID",
                    "Attendee Name",
                    "Ticket Type",
                    "Quantity",
                    "Date",
                    "Status",
                  ].map((h) => (
                    <Th key={h} fontSize="12px" fontWeight="600" color="dark">
                      {h}
                    </Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {paginatedOrders.map((order) => (
                  <Tr key={order.orderId}>
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
                        {order.ticketType}
                      </Text>
                    </Td>
                    <Td isNumeric>
                      <Text color="white" fontSize="12px">
                        {order.quantity}
                      </Text>
                    </Td>
                    <Td>
                      <Text color="white" fontSize="12px">
                        {formatCreatedAt(order.createdAt)}
                      </Text>
                    </Td>
                    <Td>
                      {order.checkedIn ? (
                        <Box color="primary.500">
                          <IoCheckmarkDoneSharp />
                        </Box>
                      ) : (
                        <Button
                          bg={"neutral.500"}
                          h="25px"
                          color="dark"
                          onClick={() => handleCheckIn(order.orderId)}
                          isLoading={order.isUpdating}
                          _hover={{ bg: "gray.200" }}
                        >
                          <Text fontSize="12px" color="dark">
                            Check In
                          </Text>
                        </Button>
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>

        {/* Responsive Pagination */}
        <Flex justify="center" gap={2} w="100%" wrap="wrap">
          <Button
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            size="sm"
          >
            <ArrowLeftIcon />
          </Button>
          <Text color="white" alignSelf="center">
            Page {currentPage} of {totalPages}
          </Text>
          <Button
            onClick={() =>
              handlePageChange(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            size="sm"
          >
            <ArrowRightIcon />
          </Button>
        </Flex>
      </VStack>
    </Box>
  );
};

export default Checkin;
