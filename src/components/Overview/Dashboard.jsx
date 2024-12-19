import React, { useState, useEffect } from 'react'
import {
  Flex, VStack, Box, Image, Text, Avatar, AvatarBadge,
  Spinner,
} from "@chakra-ui/react"
import Overview from "./Overview"
import Guestlist from './Guestlist.jsx';
import Checkin from './Checkin';
import { Link, useParams, useLocation } from 'react-router-dom'
import { getAllOrders } from '../../../server/allOrder'
import { eventsData } from '../../../server/eventsData'


const Dashboard = () => {
  const location = useLocation();
  // Function to check if the current link is active
  const isActiveLink = (path) => location.pathname + location.search === path;

  const { eventId } = useParams();
  const event = eventsData[eventId];

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
        return (
          <Checkin />
        );
      default:
        return <Overview />;
    }
  };


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

  if (loading) return <VStack w="100%" h="100vh" justify="center" align="center"><Spinner
    thickness='4px'
    speed='0.65s'
    emptyColor='gray.200'
    color='primary.500'
    size='xl'
  /></VStack>;
  if (error) return <div>{error}</div>;

  return (
    <VStack w="100%" h="100%" justify="flex-start" align="flex-start" px="40px">
      <Flex w="100%" justify="space-between" align="center" py="20px" px="20px">
        <Link>
          <Image w="100px" src="https://tlnevents.com/logo.webp" />
        </Link>
        <Flex gap="40px">
          <Text
            as="button"
            onClick={() => {
              setStep(2);
              window.location.href = `/manage/${event.id}?view=overview`;
            }}
            color={
              isActiveLink(`/manage/${event.id}?view=overview`) ||
                isActiveLink(`/manage/${event.id}`)
                ? "primary.500"
                : "dark"
            }
            fontSize="14px"
          >
            Dashboard
          </Text>
          <Text
            as="button"
            onClick={() => {
              setStep(3);
              window.location.href = `/manage/${event.id}?view=attendees`;
            }}
            color={
              isActiveLink(`/manage/${event.id}?view=attendees`) ||
                isActiveLink(`/manage/${event.id}/attendees`)
                ? "primary.500"
                : "dark"
            }
            fontSize="14px"
          >
            Guest List
          </Text>
          <Text
            as="button"
            onClick={() => {
              setStep(4);
              window.location.href = `/manage/${event.id}?view=checkin`;
            }}
            color={
              isActiveLink(`/manage/${event.id}?view=checkin`) ||
                isActiveLink(`/manage/${event.id}/checkin`)
                ? "primary.500"
                : "dark"
            }
            fontSize="14px"
          >
            Check In
          </Text>
          <Text color={isActiveLink(`/manage/${event.id}?view=sales`) ? "primary.500" : "dark"} fontSize="14px">
            Sales
          </Text>
        </Flex>

        <Avatar size="xs" src="https://bit.ly/broken-link" rounded="5px" >
          <AvatarBadge boxSize='0.75em' bg='green.500' /></Avatar>
      </Flex>

      <Box w="100%" p="0">{showStep(currentStep - 1)}</Box>
    </VStack >
  )
}

export default Dashboard;