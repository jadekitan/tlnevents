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
  Flex,
  SimpleGrid,
} from "@chakra-ui/react";
import {
  DownloadIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { IoTicketOutline } from "react-icons/io5";
import { useParams } from "react-router-dom";
import { getAllOrders } from "../../../server/allOrder";
import * as XLSX from "xlsx";
import { eventsData } from "../../../server/eventsData";

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

  const tabsData = useMemo(
    () => [
      { name: "All", id: "all" },
      ...tickets.map((ticket) => ({ name: ticket.name, id: ticket.id })),
    ],
    [tickets]
  );

  const ticketQuantities = useMemo(() => {
    return tickets.map((ticket) => ({
      ...ticket,
      quantity: orders.reduce(
        (sum, order) =>
          order.ticketType === ticket.name ? sum + order.quantity : sum,
        0
      ),
    }));
  }, [tickets, orders]);

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

  const filteredOrders = useMemo(() => {
    if (activeTab === 0) return orders;
    const selectedTicket = tickets[activeTab - 1];
    return orders.filter((order) => order.ticketType === selectedTicket.name);
  }, [orders, activeTab, tickets]);

  const paginatedOrders = useMemo(() => {
    return filteredOrders.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredOrders, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

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

  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const totalTicketsQuantity = useMemo(
    () => tickets.reduce((sum, ticket) => sum + ticket.quantity, 0),
    [tickets]
  );

  const paginationOptions = useMemo(() => {
    const options = [10];
    let current = 25;
    while (current <= totalTicketsQuantity && current <= 100) {
      options.push(current);
      current = current * 2;
    }
    if (totalTicketsQuantity > options[options.length - 1]) {
      options.push(totalTicketsQuantity);
    }
    return options;
  }, [totalTicketsQuantity]);

  const handleItemsPerPageChange = useCallback((e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleTabChange = useCallback((index) => {
    setActiveTab(index);
    setCurrentPage(1);
    setExpandedRow(null);
  }, []);

  const exportToExcel = useCallback((data, tabName) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${tabName}-orders.xlsx`);
  }, []);

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
    <VStack w="100%" h="100%" justify="flex-start" align="flex-start">
      <Tabs
        w="100%"
        variant="enclosed"
        index={activeTab}
        onChange={handleTabChange}
        isLazy
      >
        <TabList
          pl={{ base: "10px", md: "60px" }}
          borderBottom="none"
          overflowX="auto"
          whiteSpace="nowrap"
          css={{ "&::-webkit-scrollbar": { display: "none" } }}
        >
          {tabsData.map((tab) => (
            <Tab
              key={tab.id}
              variant="enclosed"
              sx={{
                color: "neutral.500",
                borderColor: "transparent",
                borderBottom: "none",
                transition: "all 0.2s",
                _selected: { color: "dark", borderColor: "inherit" },
              }}
            >
              <Text fontSize={{ base: "sm", md: "md" }}>{tab.name}</Text>
            </Tab>
          ))}
        </TabList>

        <TabPanels pb="none">
          {tabsData.map((tab) => (
            <TabPanel key={tab.id} pt="2px" pb="0" px="0">
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
                  {/* Responsive Grid for Tickets */}
                  <SimpleGrid
                    columns={{ base: 2, sm: 2, lg: 3 }} // Changed base to 2
                    spacing={{ base: 2, md: 4 }} // Tighter spacing on mobile
                    w="100%"
                  >
                    {ticketQuantities.map((ticket) => (
                      <motion.div
                        key={ticket.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Box
                          bg="neutral.500"
                          p={{ base: 2, md: 4 }} // Smaller padding on mobile
                          borderRadius="md"
                          w="100%"
                        >
                          <Flex align="center" gap={{ base: 2, md: 3 }}>
                            <Box
                              bg="dark"
                              p={{ base: "4px", md: "8px" }} // Smaller icon container
                              borderRadius="4px"
                              minW={{ base: "30px", md: "auto" }} // Ensure it doesn't shrink too much
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <VStack spacing={0}>
                                <Text
                                  color="white"
                                  fontWeight="bold"
                                  fontSize={{ base: "sm", md: "md" }}
                                >
                                  {ticket.quantity}
                                </Text>
                                <Box
                                  fontSize={{ base: "10px", md: "14px" }}
                                  color="white"
                                >
                                  <IoTicketOutline />
                                </Box>
                              </VStack>
                            </Box>
                            <Text
                              color="white"
                              fontSize={{ base: "xs", md: "sm" }} // Smaller font for ticket name
                              noOfLines={2} // Prevent text overflow
                              lineHeight="1.2"
                            >
                              {ticket.name}
                            </Text>
                          </Flex>
                        </Box>
                      </motion.div>
                    ))}
                  </SimpleGrid>

                  <VStack w="100%" spacing="30px">
                    {/* Header Controls */}
                    <Flex
                      justify="space-between"
                      w="100%"
                      align="center"
                      gap={4}
                    >
                      <Heading
                        color="white"
                        size="lg"
                        alignSelf={{ base: "flex-start", md: "center" }}
                      >
                        Guest List
                      </Heading>
                      <Flex
                        gap={0}
                        align="center"
                        w={{ base: "200px", md: "auto" }}
                        justify={{ base: "space-between", md: "flex-end" }}
                      >
                        <Flex align={"center"} gap="12px">
                          <Text color="white" fontSize={["12px", "14px"]}>
                            Per page:
                          </Text>
                          <Select
                            variant="unstyled"
                            value={itemsPerPage}
                            onChange={handleItemsPerPageChange}
                            w={["45px", "75px"]}
                            fontSize={["12px", "14px"]}
                            color="white"
                            sx={{ "& option": { bg: "dark", color: "white" } }}
                          >
                            {paginationOptions.map((num) => (
                              <option key={num} value={num}>
                                {num === totalTicketsQuantity
                                  ? `All (${num})`
                                  : num}
                              </option>
                            ))}
                          </Select>
                        </Flex>
                        <Button
                          rightIcon={<DownloadIcon />}
                          h={["30px", "35px"]}
                          bg="neutral.500"
                          color="white"
                          fontSize={["12px", "14px"]}
                          _hover={{ bg: "rgb(200,200,200)", color: "dark" }}
                          onClick={() =>
                            exportToExcel(filteredOrders, tab.name)
                          }
                        >
                          Export
                        </Button>
                      </Flex>
                    </Flex>

                    {/* Mobile View: Cards */}
                    <VStack
                      display={{ base: "flex", md: "none" }}
                      w="100%"
                      spacing={4}
                    >
                      {paginatedOrders.map((order, idx) => (
                        <Box
                          key={idx}
                          bg="neutral.500"
                          p="16px"
                          borderRadius="8px"
                          w="100%"
                          position="relative"
                        >
                          {/* Header: Name and Ticket Type */}
                          <Flex
                            justify="space-between"
                            align="flex-start"
                            mb="8px"
                          >
                            <Text
                              color="white"
                              fontWeight="bold"
                              fontSize="14px"
                              noOfLines={1}
                            >
                              {order.attendeeName}
                            </Text>
                            <Box bg="dark" px="8px" py="2px" borderRadius="4px">
                              <Text color="white" fontSize="10px">
                                {order.ticketType}
                              </Text>
                            </Box>
                          </Flex>

                          {/* Body: Quantity and Date */}
                          <Flex
                            justify="space-between"
                            align="center"
                            mb="12px"
                          >
                            <Text color="gray.300" fontSize="12px">
                              Qty: {order.quantity}
                            </Text>
                            <Text color="gray.400" fontSize="12px">
                              {formatCreatedAt(order.createdAt)}
                            </Text>
                          </Flex>

                          {/* Footer: Order ID and Expand Button */}
                          <Flex
                            justify="space-between"
                            align="center"
                            pt="8px"
                            borderTop="1px solid"
                            borderColor="whiteAlpha.200"
                          >
                            <Text
                              color="gray.500"
                              fontSize="10px"
                              fontFamily="monospace"
                            >
                              #{order.orderId}
                            </Text>
                            <Box
                              as={motion.button}
                              whileTap={{ scale: 0.95 }}
                              onClick={() =>
                                setExpandedRow(idx === expandedRow ? null : idx)
                              }
                            >
                              <motion.div
                                animate={{
                                  rotate: expandedRow === idx ? 90 : 0,
                                }}
                                transition={{ duration: 0.3 }}
                              >
                                <ChevronRightIcon
                                  color="white"
                                  fontSize="20px"
                                />
                              </motion.div>
                            </Box>
                          </Flex>

                          {/* Expanded Details (Email/Phone) */}
                          <AnimatePresence>
                            {expandedRow === idx && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                style={{ overflow: "hidden" }}
                              >
                                <VStack
                                  align="start"
                                  spacing={1}
                                  mt="12px"
                                  pt="12px"
                                  borderTop="1px dashed"
                                  borderColor="whiteAlpha.300"
                                >
                                  <Text fontSize="12px" color="white">
                                    <Text as="span" color="gray.400">
                                      Email:{" "}
                                    </Text>
                                    {order.email}
                                  </Text>
                                  <Text fontSize="12px" color="white">
                                    <Text as="span" color="gray.400">
                                      Phone:{" "}
                                    </Text>
                                    {order.phone || "N/A"}
                                  </Text>
                                </VStack>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </Box>
                      ))}
                    </VStack>

                    {/* Desktop View: Table */}
                    <Box display={{ base: "none", md: "block" }} w="100%">
                      <TableContainer w="100%" overflowX="auto">
                        <Table w="100%" variant="simple" size="md">
                          <Thead w="100%">
                            <Tr bg="white">
                              <Th fontSize="12px">Order ID</Th>
                              <Th fontSize="12px">Attendee Name</Th>
                              <Th fontSize="12px">Ticket Name</Th>
                              <Th fontSize="12px">Quantity</Th>
                              <Th fontSize="12px">Date</Th>
                            </Tr>
                          </Thead>
                          <Tbody w="100%">
                            {paginatedOrders.map((order, idx) => (
                              <React.Fragment key={idx}>
                                <Tr position="relative">
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
                                  <Td>
                                    <Text color="white" fontSize="12px">
                                      {order.quantity}
                                    </Text>
                                  </Td>
                                  <Td>
                                    <Text color="white" fontSize="12px">
                                      {formatCreatedAt(order.createdAt)}
                                    </Text>
                                  </Td>
                                  <Box
                                    position="absolute"
                                    top="11px"
                                    right="-3px"
                                    as={motion.button}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() =>
                                      setExpandedRow(
                                        idx === expandedRow ? null : idx
                                      )
                                    }
                                  >
                                    <motion.div
                                      animate={{
                                        rotate: expandedRow === idx ? 90 : 0,
                                      }}
                                      transition={{ duration: 0.3 }}
                                    >
                                      <ChevronRightIcon
                                        color="neutral.500"
                                        fontSize="25px"
                                      />
                                    </motion.div>
                                  </Box>
                                </Tr>
                                <AnimatePresence>
                                  {expandedRow === idx && (
                                    <motion.tr
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      exit={{ opacity: 0, height: 0 }}
                                    >
                                      <Td colSpan={6} bg="gray.800">
                                        <VStack
                                          align="start"
                                          spacing={2}
                                          color="white"
                                          p={4}
                                        >
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
                    </Box>
                  </VStack>

                  {/* Pagination */}
                  <Flex justify="center" gap={2} w="100%" wrap="wrap">
                    <Button
                      onClick={() =>
                        handlePageChange(Math.max(1, currentPage - 1))
                      }
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
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </VStack>
  );
};

export default Guestlist;
