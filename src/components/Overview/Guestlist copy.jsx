import React, { useState, useEffect, useMemo } from "react";
import {
  Flex,
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
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useToast,
} from "@chakra-ui/react";
import { DownloadIcon } from "@chakra-ui/icons";
import { Link, useParams } from "react-router-dom";
import { getAllOrders } from "../../../server/allOrder";
import { eventsData } from "../../../server/eventsData";
import * as XLSX from "xlsx";

const Claudia = () => {
  const { eventId } = useParams();
  const event = eventsData[eventId];
  const toast = useToast();

  // Prepare categories and ticket types (same as before)
  const prepareCategories = () => {
    const categoriesObj = {
      all: Object.values(event.tickets).flat(),
    };

    Object.keys(event.tickets).forEach((category) => {
      const categoryTickets = event.tickets[category];

      categoriesObj[category] =
        categoryTickets.length > 1
          ? [
            {
              id: "all",
              name: "All",
              price: 0,
              quantity: categoryTickets.reduce(
                (acc, ticket) => acc + ticket.quantity,
                0
              ),
            },
            ...categoryTickets,
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
      const ticketTypes = categoriesData[category].map((ticket) => ticket.name);
      acc[category] = {
        currentTypeIndex: 0,
        ticketTypes: ticketTypes,
      };
      return acc;
    }, {});
    setNestedTabIndexes(initialNestedIndexes);
  }, []);

  // State for orders and loading
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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

  // Export functionality
  const exportToExcel = (data, fileName) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    XLSX.writeFile(workbook, `${fileName}.xlsx`);

    toast({
      title: "Export Successful",
      description: "The data has been exported to Excel.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <VStack w="100%" h="100%" justify="flex-start" align="flex-start">
      <Tabs
        w="100%"
        variant="enclosed"
        p="none"
        index={mainTabIndex}
        onChange={(index) => setMainTabIndex(index)}
      >
        {/* Main Category Tabs */}
        <TabList pl="60px" borderBottom="none">
          {categories.map((category) => (
            <Tab
              key={category}
              variant="enclosed"
              sx={{
                color: "neutral.500",
                borderColor: "transparent",
                borderBottom: "none",
                _selected: {
                  color: "dark",
                  borderColor: "inherit",
                },
              }}
            >
              <Text>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Text>
            </Tab>
          ))}
        </TabList>

        <TabPanels pb="none">
          {categories.map((category) => (
            <TabPanel key={category} pt="2px" pb="0">
              {category === "all" ? (
                <CategoryDetailsPanel
                  category={category}
                  ticketTypeName={null}
                  orders={orders}
                  event={event}
                  categoriesData={categoriesData}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  setItemsPerPage={setItemsPerPage}
                  exportToExcel={exportToExcel}
                />
              ) : // Only render nested tabs if there's more than one ticket type
                categoriesData[category].length > 1 ? (
                  <Tabs
                    p="none"
                    index={nestedTabIndexes[category]?.currentTypeIndex || 0}
                    onChange={(index) => {
                      setNestedTabIndexes((prev) => ({
                        ...prev,
                        [category]: {
                          ...prev[category],
                          currentTypeIndex: index,
                        },
                      }));
                    }}
                  >
                    {/* Nested Ticket Type Tabs */}
                    <TabList pl="40px" borderBottom="none">
                      {(nestedTabIndexes[category]?.ticketTypes || []).map(
                        (typeName) => (
                          <Tab key={typeName}>{typeName}</Tab>
                        )
                      )}
                    </TabList>

                    <TabPanels p="0">
                      {(nestedTabIndexes[category]?.ticketTypes || []).map(
                        (typeName) => (
                          <TabPanel key={typeName} p="0">
                            <CategoryDetailsPanel
                              category={category}
                              ticketTypeName={typeName}
                              orders={orders}
                              event={event}
                              categoriesData={categoriesData}
                              currentPage={currentPage}
                              setCurrentPage={setCurrentPage}
                              itemsPerPage={itemsPerPage}
                              setItemsPerPage={setItemsPerPage}
                              exportToExcel={exportToExcel}
                            />
                          </TabPanel>
                        )
                      )}
                    </TabPanels>
                  </Tabs>
                ) : (
                  // If only one ticket type, render it directly
                  <CategoryDetailsPanel
                    category={category}
                    ticketTypeName={categoriesData[category][0].name}
                    orders={orders}
                    event={event}
                    categoriesData={categoriesData}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={setItemsPerPage}
                    exportToExcel={exportToExcel}
                  />
                )}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </VStack>
  );
};

// Separate component to render category details
const CategoryDetailsPanel = ({
  category,
  ticketTypeName,
  orders,
  event,
  categoriesData,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  exportToExcel,
}) => {
  // Filter orders based on category and ticket type
  const filteredOrders = orders.filter((order) => {
    const categoryMatch =
      category === "all" ||
      order.ticketType?.toLowerCase().includes(category.toLowerCase());
    const ticketTypeMatch =
      !ticketTypeName ||
      ticketTypeName === "All" ||
      order.ticketType === ticketTypeName;

    return categoryMatch && ticketTypeMatch;
  });

  // Calculate ticket type quantity summary
  const ticketTypeSummary = categoriesData[category]
    .filter(
      (ticket) =>
        !ticketTypeName ||
        ticketTypeName === "All" ||
        ticket.name === ticketTypeName
    )
    .map((ticket) => ({
      name: ticket.name,
      totalQuantity: filteredOrders
        .filter((order) => order.ticketType === ticket.name)
        .reduce((sum, order) => sum + order.quantity, 0),
    }));

  // Pagination calculations
  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  // Pagination handlers
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Export handler
  const handleExport = () => {
    const exportData = currentItems.map((order) => ({
      "Ticket Name": order.ticketType,
      Quantity: order.quantity,
      "Attendee Name": order.attendeeName,
      "Order ID": order.orderId,
      Date: formatCreatedAt(order.createdAt),
    }));
    exportToExcel(exportData, `${category}_${ticketTypeName || "all"}_orders`);
  };

  // Date formatting utility
  const formatCreatedAt = (dateString) => {
    const date = new Date(dateString);
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };
    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
      date
    );
    const [month, day, year] = formattedDate.split(", ")[0].split("/");
    const time = formattedDate.split(", ")[1];
    return `${year}-${month}-${day} ${time}`;
  };

  return (
    <Box
      w="100%"
      h="100%"
      bg="dark"
      overflowY="hidden"
      borderTopRadius="20px"
      py="40px"
      px="20px"
    >
      <VStack w="100%" justify="center" align="flex-start" spacing="50px">
        {/* Summary Boxes for Ticket Type Quantities */}
        <Flex w="100%" justify="space-between">
          {ticketTypeSummary.map((ticket, index) => (
            <Box
              key={index}
              w="262px"
              h="100%"
              bg="neutral.500"
              p="20px"
              rounded="8px"
            >
              <VStack justify="flex-start" align="flex-start">
                <Flex justify="flex-start" align="center" gap="8px">
                  <Box bg="dark" rounded="4px" p="8px"></Box>
                  <Text color="white">{ticket.name}</Text>
                </Flex>
                <Text color="white">
                  {ticket.totalQuantity.toLocaleString()} Tickets
                </Text>
              </VStack>
            </Box>
          ))}
        </Flex>

        {/* Orders Table */}
        <VStack w="100%" spacing="40px">
          <Flex w="100%" justify="space-between" align="center">
            <Heading color="white" fontSize="28px">
              Guest List
            </Heading>
            <Flex align="center" gap="10px">
              <Select
                color="white"
                bg="neutral.500"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(parseInt(e.target.value));
                  setCurrentPage(1);
                }}
                w="100px"
              >
                {[10, 25, 50, 100].map((num) => (
                  <option
                    key={num}
                    value={num}
                    style={{ backgroundColor: "black" }}
                  >
                    {num} per page
                  </option>
                ))}
              </Select>
              <Button
                rightIcon={<DownloadIcon />}
                h="35px"
                bg="neutral.500"
                color="white"
                fontSize="14px"
                _hover={{ bg: "rgb(200,200,200)", color: "dark" }}
                onClick={handleExport}
              >
                Export
              </Button>
            </Flex>
          </Flex>

          <TableContainer w="100%">
            <Table variant="simple">
              <Thead>
                <Tr bg="white">
                  {[
                    "Ticket Name",
                    "Quantity",
                    "Attendee Name",
                    "Order ID",
                    "Date",
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
                <Accordion allowToggle>
                  {currentItems.map((order, index) => (
                    <AccordionItem key={index} border="none">
                      <Tr as={AccordionButton}>
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
                            {order.attendeeName}
                          </Text>
                        </Td>
                        <Td>
                          <Text color="white" fontSize="12px">
                            {order.orderId}
                          </Text>
                        </Td>
                        <Td>
                          <Text color="white" fontSize="12px">
                            {formatCreatedAt(order.createdAt)}
                          </Text>
                        </Td>
                      </Tr>
                      <AccordionPanel pb={4}>
                        <VStack align="start" spacing={2}>
                          <Text>Additional Order Details:</Text>
                          <Text>Email: {order.email || "N/A"}</Text>
                          <Text>Phone: {order.phone || "N/A"}</Text>
                          {/* Add more details as needed */}
                        </VStack>
                      </AccordionPanel>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Tbody>
            </Table>
          </TableContainer>

          {/* Pagination Controls */}
          <Flex w="100%" justify="center" align="center"></Flex>
        </VStack>
      </VStack>
    </Box>
  );
};

export default Claudia;
