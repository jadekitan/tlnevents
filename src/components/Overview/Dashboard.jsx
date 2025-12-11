import React, { useState, useEffect } from "react";
import {
  Flex,
  VStack,
  Box,
  Image,
  Text,
  Avatar,
  AvatarBadge,
  Spinner,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
} from "@chakra-ui/react";
import Overview from "./Overview";
import Guestlist from "./Guestlist.jsx";
import Checkin from "./Checkin";
import { Link, useParams, useLocation } from "react-router-dom";
import { getAllOrders } from "../../../server/allOrder";
import { eventsData } from "../../../server/eventsData";
import { HamburgerIcon } from "@chakra-ui/icons";

const Dashboard = () => {
  const location = useLocation();
  const isActiveLink = (path) => location.pathname + location.search === path;
  const { eventId } = useParams();
  const event = eventsData[eventId];
  const { isOpen, onOpen, onClose } = useDisclosure(); // For mobile menu

  const [currentStep, setStep] = useState(() => {
    const storedStep = localStorage.getItem("currentStep");
    return storedStep ? parseInt(storedStep, 10) : 1;
  });

  useEffect(() => {
    localStorage.setItem("currentStep", currentStep);
  }, [currentStep]);

  const showStep = (step) => {
    switch (step) {
      case 1:
        return <Overview />;
      case 2:
        return <Guestlist />;
      case 3:
        return <Checkin />;
      default:
        return <Overview />;
    }
  };

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      <VStack w="100%" h="100vh" justify="center" align="center">
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

  const NavItems = () => (
    <>
      <Text
        as="button"
        onClick={() => {
          setStep(2);
          window.location.href = `/manage/${event.id}?view=overview`;
          onClose();
        }}
        color={
          isActiveLink(`/manage/${event.id}?view=overview`) ||
          isActiveLink(`/manage/${event.id}`)
            ? "primary.500"
            : "dark"
        }
        fontSize="14px"
        fontWeight="500"
      >
        Dashboard
      </Text>
      <Text
        as="button"
        onClick={() => {
          setStep(3);
          window.location.href = `/manage/${event.id}?view=attendees`;
          onClose();
        }}
        color={
          isActiveLink(`/manage/${event.id}?view=attendees`) ||
          isActiveLink(`/manage/${event.id}/attendees`)
            ? "primary.500"
            : "dark"
        }
        fontSize="14px"
        fontWeight="500"
      >
        Guest List
      </Text>
      <Text
        as="button"
        onClick={() => {
          setStep(4);
          window.location.href = `/manage/${event.id}?view=checkin`;
          onClose();
        }}
        color={
          isActiveLink(`/manage/${event.id}?view=checkin`) ||
          isActiveLink(`/manage/${event.id}/checkin`)
            ? "primary.500"
            : "dark"
        }
        fontSize="14px"
        fontWeight="500"
      >
        Check In
      </Text>
      <Text
        color={
          isActiveLink(`/manage/${event.id}?view=sales`)
            ? "primary.500"
            : "dark"
        }
        fontSize="14px"
        fontWeight="500"
      >
        Sales
      </Text>
    </>
  );

  return (
    <VStack
      w="100%"
      h="100%"
      justify="flex-start"
      align="flex-start"
      px={{ base: "10px", md: "40px" }}
    >
      <Flex
        w="100%"
        justify="space-between"
        align="center"
        py="20px"
        px={{ base: "10px", md: "20px" }}
      >
        <Link>
          <Image
            w={{ base: "80px", md: "100px" }}
            src="https://tlnevents.com/logo.webp"
          />
        </Link>

        {/* Desktop Navigation */}
        <Flex gap="40px" display={{ base: "none", md: "flex" }}>
          <NavItems />
        </Flex>

        <Avatar
          display={{ base: "none", md: "flex" }}
          size="xs"
          src="https://bit.ly/broken-link"
          rounded="5px"
        >
          <AvatarBadge boxSize="0.75em" bg="green.500" />
        </Avatar>

        {/* Mobile Menu Button */}
        <IconButton
          display={{ base: "flex", md: "none" }}
          icon={<HamburgerIcon />}
          variant="ghost"
          onClick={onOpen}
          aria-label="Open menu"
        />
      </Flex>

      {/* Mobile Drawer Navigation */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody pt={10}>
            <VStack spacing={6} align="start">
              <NavItems />
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Box w="100%" p="0" overflowX="hidden">
        {showStep(currentStep - 1)}
      </Box>
    </VStack>
  );
};

export default Dashboard;
