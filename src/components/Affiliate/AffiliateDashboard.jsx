import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  GridItem,
  VStack,
  HStack,
  Stack,
  Heading,
  Text,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  Divider,
  Flex,
  Icon,
  useClipboard,
  SimpleGrid,
} from "@chakra-ui/react";
import { CopyIcon, CheckIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import {
  FiUsers,
  FiDollarSign,
  FiPercent,
  FiLink,
  FiArrowLeft,
} from "react-icons/fi";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { baseURL } from "../../../server/base";
import { eventsData } from "../../../server/eventsData";

const AffiliateDashboard = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [affiliateData, setAffiliateData] = useState(null);
  const [downlinks, setDownlinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const email = searchParams.get("email");
  const eventName = searchParams.get("eventName");

  // Find event ID from eventsData
  const findEventId = (eventName) => {
    const event = Object.values(eventsData).find(
      (event) => event.name === eventName
    );
    return event ? event.id : null;
  };

  const eventId = findEventId(eventName);
  const API_BASE_URL = baseURL;

  // Generate affiliate link with event ID
  const affiliateLink = `${window.location.origin}/${
    eventId || encodeURIComponent(eventName || "")
  }?affiliate=${affiliateData?.code}`;

  const { hasCopied, onCopy } = useClipboard(affiliateLink);

  const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 10000,
  });

  useEffect(() => {
    if (!email || !eventName) {
      setError("Missing required parameters: email and eventName");
      setLoading(false);
      return;
    }
    fetchAffiliateData();
  }, [email, eventName]);

  const fetchAffiliateData = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch affiliate details
      const affiliateResponse = await apiClient.get(
        `/affiliates?email=${encodeURIComponent(
          email
        )}&eventName=${encodeURIComponent(eventName)}`
      );

      if (affiliateResponse.data.status === 200) {
        setAffiliateData(affiliateResponse.data.data);

        // Fetch downlinks
        const downlinksResponse = await apiClient.get(
          `/affiliates/downlinks?email=${encodeURIComponent(
            email
          )}&eventName=${encodeURIComponent(eventName)}`
        );

        if (downlinksResponse.data.status === 200) {
          setDownlinks(downlinksResponse.data.data);
        }
      } else {
        throw new Error(
          affiliateResponse.data.message || "Failed to fetch affiliate data"
        );
      }
    } catch (error) {
      console.error("Error fetching affiliate data:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load dashboard"
      );

      toast({
        title: "Error",
        description: "Failed to load affiliate data",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateCommission = () => {
    if (!affiliateData || !downlinks.length || !eventName) return 0;

    // Find the event data based on eventName
    const event = Object.values(eventsData).find(
      (event) => event.name === eventName
    );

    if (!event) {
      console.warn(`Event not found: ${eventName}`);
      return downlinks.length * affiliateData.commission; // Fallback to default
    }

    let totalCommission = 0;

    downlinks.forEach((downlink) => {
      const ticketType = downlink.ticketType;

      // Find the matching ticket in the event data
      const matchingTicket = event.tickets?.find(
        (ticket) =>
          ticket.name.toLowerCase().includes(ticketType.toLowerCase()) ||
          ticketType.toLowerCase().includes(ticket.name.toLowerCase())
      );

      if (matchingTicket) {
        // Calculate commission based on ticket price and affiliate percentage
        const commission =
          (matchingTicket.price * affiliateData.percentage) / 100;
        totalCommission += commission;
      } else {
        // Fallback to default commission if ticket type not found
        totalCommission += affiliateData.commission;
      }
    });

    return totalCommission;
  };

  // Additional helper functions for detailed breakdown
  const getCommissionBreakdown = () => {
    if (!affiliateData || !downlinks.length || !eventName) return [];

    const event = Object.values(eventsData).find(
      (event) => event.name === eventName
    );

    if (!event) return [];

    const breakdown = downlinks.map((downlink) => {
      const ticketType = downlink.ticketType;
      const matchingTicket = event.tickets?.find(
        (ticket) =>
          ticket.name.toLowerCase().includes(ticketType.toLowerCase()) ||
          ticketType.toLowerCase().includes(ticket.name.toLowerCase())
      );

      if (matchingTicket) {
        const commission =
          (matchingTicket.price * affiliateData.percentage) / 100;
        return {
          name: downlink.name,
          email: downlink.email,
          ticketType: downlink.ticketType,
          ticketPrice: matchingTicket.price,
          commission: commission,
          percentage: affiliateData.percentage,
        };
      } else {
        return {
          name: downlink.name,
          email: downlink.email,
          ticketType: downlink.ticketType,
          ticketPrice: null,
          commission: affiliateData.commission,
          percentage: affiliateData.percentage,
          note: "Used default commission",
        };
      }
    });

    return breakdown;
  };

  // Function to get commission by ticket type
  const getCommissionByTicketType = () => {
    const breakdown = getCommissionBreakdown();
    const byTicketType = {};

    breakdown.forEach((item) => {
      const key = item.ticketType;
      if (!byTicketType[key]) {
        byTicketType[key] = {
          ticketType: item.ticketType,
          count: 0,
          totalCommission: 0,
          averageTicketPrice: item.ticketPrice,
        };
      }
      byTicketType[key].count += 1;
      byTicketType[key].totalCommission += item.commission;
    });

    return Object.values(byTicketType);
  };

  const getUniqueReferrals = () => {
    const uniqueEmails = new Set(downlinks.map((downlink) => downlink.email));
    return uniqueEmails.size;
  };

  const handleCopyLink = () => {
    onCopy();
    toast({
      title: "Link Copied!",
      description: "Affiliate link has been copied to clipboard",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minH="100vh"
        px={4}
      >
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" />
          <Text textAlign="center">Loading your dashboard...</Text>
        </VStack>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxW="container.xl" py={10} px={4}>
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <Box flex="1">
            <Text fontWeight="bold">Error loading dashboard</Text>
            <Text fontSize="sm">{error}</Text>
          </Box>
          <Button
            size="sm"
            onClick={() => navigate("/affiliate/login")}
            leftIcon={<FiArrowLeft />}
          >
            Back to Login
          </Button>
        </Alert>
      </Container>
    );
  }

  if (!affiliateData) {
    return (
      <Container maxW="container.xl" py={10} px={4}>
        <Alert status="warning" borderRadius="md">
          <AlertIcon />
          <Text>No affiliate data found for the provided credentials.</Text>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={4} px={4}>
      {/* Mobile Header with Back Button */}
      <VStack spacing={4} align="stretch" mb={6}>
        <Box>
          <Button
            variant="ghost"
            leftIcon={<ChevronLeftIcon />}
            onClick={() => navigate("/affiliate/login")}
            size="sm"
            mb={2}
            px={0}
          >
            Back to Login
          </Button>
          <Heading as="h1" size="lg" color="gray.800">
            Affiliate Dashboard
          </Heading>
          <Text color="gray.600" fontSize="md">
            Welcome back, {affiliateData.name}!
          </Text>
        </Box>

        {/* Affiliate Link Card - Mobile Optimized */}
        <Card shadow="md">
          <CardBody p={4}>
            <VStack spacing={3} align="stretch">
              <HStack>
                <Icon as={FiLink} color="blue.500" boxSize={5} />
                <Text fontWeight="bold" fontSize="md">
                  Your Affiliate Link
                </Text>
              </HStack>

              <Box
                p={3}
                bg="gray.50"
                borderRadius="md"
                border="1px"
                borderColor="gray.200"
              >
                <VStack spacing={2} align="stretch">
                  <Text
                    fontFamily="mono"
                    fontSize="10px"
                    color="gray.700"
                    wordBreak="break-all"
                    textAlign="left"
                  >
                    {affiliateLink}
                  </Text>
                  <Button
                    size="sm"
                    leftIcon={hasCopied ? <CheckIcon /> : <CopyIcon />}
                    onClick={handleCopyLink}
                    colorScheme="blue"
                    width="full"
                  >
                    {hasCopied ? "Copied!" : "Copy Link"}
                  </Button>
                </VStack>
              </Box>

              <Text fontSize="xs" color="gray.600" textAlign="center">
                Share this link to start earning commissions on ticket sales!
              </Text>
            </VStack>
          </CardBody>
        </Card>
      </VStack>

      {/* Stats Grid - Mobile Responsive */}
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4} mb={6}>
        {/* Total Referrals */}
        <Card shadow="sm">
          <CardBody p={4}>
            <Stat>
              <Stack direction="row" align="center" spacing={3}>
                <Icon as={FiUsers} boxSize={5} color="blue.500" />
                <Box>
                  <StatLabel fontSize="sm">Total Referrals</StatLabel>
                  <StatNumber fontSize="xl">{downlinks.length}</StatNumber>
                  <StatHelpText fontSize="xs" mb={0}>
                    {getUniqueReferrals()} unique customers
                  </StatHelpText>
                </Box>
              </Stack>
            </Stat>
          </CardBody>
        </Card>

        {/* Total Commission */}
        <Card shadow="sm">
          <CardBody p={4}>
            <Stat>
              <Stack direction="row" align="center" spacing={3}>
                <Icon as={FiDollarSign} boxSize={5} color="green.500" />
                <Box>
                  <StatLabel fontSize="sm">Total Commission</StatLabel>
                  <StatNumber fontSize="xl">
                    ₦{calculateCommission().toLocaleString()}
                  </StatNumber>
                  <StatHelpText fontSize="xs" mb={0}>
                    ₦{affiliateData.percentage}% per ticket
                  </StatHelpText>
                </Box>
              </Stack>
            </Stat>
          </CardBody>
        </Card>

        {/* Commission Rate */}
        <Card shadow="sm">
          <CardBody p={4}>
            <Stat>
              <Stack direction="row" align="center" spacing={3}>
                <Icon as={FiPercent} boxSize={5} color="purple.500" />
                <Box>
                  <StatLabel fontSize="sm">Commission Rate</StatLabel>
                  <StatNumber fontSize="xl">
                    {affiliateData.percentage}%
                  </StatNumber>
                  <StatHelpText fontSize="xs" mb={0}>
                    Code:{" "}
                    <Badge colorScheme="blue" fontSize="xs">
                      {affiliateData.code}
                    </Badge>
                  </StatHelpText>
                </Box>
              </Stack>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Recent Referrals Table - Mobile Optimized */}
      <Card shadow="md" mb={6}>
        <CardHeader pb={0}>
          <Heading as="h2" size="md">
            Recent Referrals
          </Heading>
        </CardHeader>
        <Divider />
        <CardBody p={0}>
          {downlinks.length > 0 ? (
            <Box overflowX="auto">
              {/* Desktop Table */}
              <Table variant="simple" display={{ base: "none", md: "table" }}>
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Email</Th>
                    <Th>Ticket Type</Th>
                    <Th isNumeric>Commission</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {getCommissionBreakdown().map((item, index) => (
                    <Tr key={index}>
                      <Td fontWeight="medium">{item.name}</Td>
                      <Td>{item.email}</Td>
                      <Td>
                        <Badge colorScheme="green" variant="subtle">
                          {item.ticketType}
                        </Badge>
                      </Td>
                      {/* <Td fontWeight="bold" color="green.500" isNumeric>
                        ₦{affiliateData.commission?.toLocaleString()}
                      </Td> */}
                      <Td fontWeight="bold" color="green.500" isNumeric>
                        ₦{Math.round(item.commission).toLocaleString()}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>

              {/* Mobile Cards */}
              <Stack spacing={3} display={{ base: "flex", md: "none" }} p={4}>
                {getCommissionBreakdown().map((item, index) => (
                  <Card key={index} variant="outline" size="sm">
                    <CardBody p={3}>
                      <VStack align="stretch" spacing={2}>
                        <HStack justify="space-between">
                          <Text fontWeight="bold">{item.name}</Text>
                          <Badge colorScheme="green" size="sm">
                            {item.ticketType}
                          </Badge>
                        </HStack>
                        <Text fontSize="sm" color="gray.600">
                          {item.email}
                        </Text>
                        <HStack justify="space-between">
                          <Text fontSize="sm" color="gray.600">
                            Commission:
                          </Text>
                          <Text fontWeight="bold" color="green.500" isNumeric>
                            ₦{Math.round(item.commission).toLocaleString()}
                          </Text>
                        </HStack>
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </Stack>
            </Box>
          ) : (
            <Box textAlign="center" py={8} px={4}>
              <Text color="gray.500" fontSize="xs">
                No referrals yet. Share your affiliate link to start earning!
              </Text>
            </Box>
          )}
        </CardBody>
        {downlinks.length > 0 && (
          <CardFooter pt={0}>
            <Text color="gray.600" fontSize="sm">
              Showing {downlinks.length} referral
              {downlinks.length !== 1 ? "s" : ""}
            </Text>
          </CardFooter>
        )}
      </Card>

      {/* Event Information & Actions - Mobile Stack */}
      <Stack direction={{ base: "column", lg: "row" }} spacing={4}>
        <Card shadow="md" flex={2}>
          <CardHeader pb={0}>
            <Heading as="h2" size="md">
              Event Information
            </Heading>
          </CardHeader>
          <Divider />
          <CardBody>
            <VStack align="stretch" spacing={4}>
              <Box>
                <Text fontWeight="bold" color="gray.600" fontSize="sm">
                  Event Name
                </Text>
                <Text fontSize="md">{affiliateData.eventName}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold" color="gray.600" fontSize="sm">
                  Affiliate Since
                </Text>
                <Text fontSize="md">
                  {new Date(affiliateData.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </Text>
              </Box>
              {/* {eventId && (
                <Box>
                  <Text fontWeight="bold" color="gray.600" fontSize="sm">
                    Event ID
                  </Text>
                  <Text fontSize="md">{eventId}</Text>
                </Box>
              )} */}
            </VStack>
          </CardBody>
        </Card>

        <Card shadow="md" flex={1}>
          <CardHeader pb={0}>
            <Heading as="h2" size="md">
              Quick Actions
            </Heading>
          </CardHeader>
          <Divider />
          <CardBody>
            <VStack spacing={3}>
              <Button
                leftIcon={<CopyIcon />}
                onClick={handleCopyLink}
                colorScheme="blue"
                width="full"
                size="sm"
              >
                Copy Link
              </Button>
              <Button
                onClick={fetchAffiliateData}
                width="full"
                variant="outline"
                size="sm"
              >
                Refresh Data
              </Button>
              <Button
                onClick={() => navigate("/affiliate/login")}
                width="full"
                variant="ghost"
                size="sm"
              >
                Switch Account
              </Button>
            </VStack>
          </CardBody>
        </Card>
      </Stack>
    </Container>
  );
};

export default AffiliateDashboard;
