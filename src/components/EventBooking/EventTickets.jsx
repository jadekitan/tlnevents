import React, { useContext, useState } from "react";
import {
  Flex,
  VStack,
  Box,
  Heading,
  Text,
  Collapse,
  HStack,
  Input,
  useNumberInput,
  Button,
  Badge,
  useDisclosure,
  AlertDialog,
  AlertDialogContent,
  AlertDialogOverlay,
  ListItem,
  UnorderedList,
} from "@chakra-ui/react";
import { multiBookingContext } from "./BookingContext";
import { eventsData } from "../../../server/eventsData";
import { useParams } from "react-router-dom";

const EventTickets = () => {
  const {
    LeftArrow,
    setStep,
    ticketType,
    ticketCounts,
    setTicketCounts,
    feePercentage,
    clearPurchaseType,
    clearContactData,
    clearTicketCounts,
    clearAssignMultiple,
  } = useContext(multiBookingContext);

  const { eventId } = useParams();
  const event = eventsData[eventId];

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  const clearData = () => {
    clearPurchaseType();
    clearContactData();
    clearTicketCounts();
    clearAssignMultiple();
  };

  const handleTicketCountChange = (ticketId, value) => {
    const updatedCounts = {
      ...ticketCounts,
      [ticketId]: value,
    };
    setTicketCounts(updatedCounts);
    localStorage.setItem("ticketCounts", JSON.stringify(updatedCounts));
  };

  const fixAmount = 100;

  // --- UPDATED NUMBER INPUT COMPONENT ---
  const NumberInput = ({
    ticketId,
    ticketCounts,
    setTicketCounts,
    step = 1,
    max, // This now receives the 'effective' max (lower of limit or stock)
  }) => {
    const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
      useNumberInput({
        step,
        value: ticketCounts[ticketId],
        min: 0,
        max: max * step, // Cap the value at the calculated max
        keepWithinMax: true,
        onChange: (valueString) => {
          let value = parseInt(valueString, 10) || 0;

          if (value % step !== 0) {
            value = Math.floor(value / step) * step;
          }

          // Ensure we never exceed the passed max
          value = Math.min(value, max * step) || 0;

          setTicketCounts(ticketId, value);
        },
      });

    const inc = getIncrementButtonProps();
    const dec = getDecrementButtonProps();
    const input = getInputProps({
      inputMode: "numeric",
      readOnly: true, // Prevent typing invalid numbers manually
    });

    // Check if we have reached the limit to disable the (+) button
    const currentVal = parseInt(ticketCounts[ticketId] || 0);
    const isFull = currentVal >= max * step;
    const isEmpty = currentVal <= 0;

    return (
      <HStack maxW="100%" spacing={2}>
        <Button
          minW={["20px", "30px"]}
          h={["20px", "30px"]}
          p="0px"
          fontSize="sm"
          {...dec}
          isDisabled={isEmpty} // Disable (-) if 0
        >
          -
        </Button>
        <Input
          width="100%"
          height={["20px", "30px"]}
          p={["0px", "10px"]}
          fontSize={["12px", "16px"]}
          textAlign="center"
          {...input}
        />
        <Button
          minW={["20px", "30px"]}
          h={["20px", "30px"]}
          p="0px"
          fontSize="sm"
          {...inc}
          isDisabled={isFull} // Disable (+) if max reached
        >
          +
        </Button>
      </HStack>
    );
  };

  const [showDescription, setShowDescription] = useState({});

  const handleToggle = (ticketId) => {
    setShowDescription((prev) => ({
      ...prev,
      [ticketId]: !prev[ticketId],
    }));
  };

  const handleArrow = () => {
    const hasSelectedTickets = ticketType.some(
      (ticket) => ticketCounts[ticket.id] > 0
    );
    if (hasSelectedTickets) {
      onOpen();
    } else {
      setStep(1);
      window.location.href = `/${event.id}`;
      clearData();
    }
  };

  return (
    <VStack w="100%" align="flex-start" spacing={["20px", "40px"]}>
      <Flex justify="flex-start" align="center" gap={["10px", "20px"]}>
        <Box
          as="button"
          p="3px"
          bg="primary.500"
          rounded="6px"
          onClick={handleArrow}
        >
          <LeftArrow />
        </Box>

        <AlertDialog
          motionPreset="slideInBottom"
          leastDestructiveRef={cancelRef}
          onClose={onClose}
          isOpen={isOpen}
          isCentered
        >
          <AlertDialogOverlay />
          <AlertDialogContent
            borderRadius={["16px", "8px"]}
            marginBottom={["0px", "auto"]}
          >
            <VStack align="center" spacing="20px" padding="30px 15px">
              <Heading color="dark" fontSize="18px" lineHeight="28px">
                Release Tickets
              </Heading>
              <Text textAlign="center">
                Are you sure you want to cancel? This will cancel the order and
                release your tickets?
              </Text>
              <Flex width="100%" justify="space-between">
                <Button width="50%" ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  width="50%"
                  bg="primary.500"
                  color="dark"
                  ml={3}
                  onClick={() => {
                    window.location.href = `/${event.id}`;
                    setStep(1);
                    clearData();
                  }}
                >
                  Release Ticket
                </Button>
              </Flex>
            </VStack>
          </AlertDialogContent>
        </AlertDialog>

        <Heading color="dark" fontSize={["18px", "22px"]} lineHeight="28px">
          Ticket Types
        </Heading>
      </Flex>

      {ticketType.map((ticket) => {
        // --- CALCULATION LOGIC ---
        // 1. Calculate how many "units" (e.g. couples/groups) exist in the remaining stock
        const stockAvailable = Math.floor((ticket.quantity || 0) / ticket.step);

        // 2. The user can buy the lesser of: The Limit set by admin OR The Stock remaining
        const effectiveMax = Math.min(ticket.maxQuantity, stockAvailable);

        return (
          <Box
            key={ticket.id}
            w="100%"
            h="100%"
            p="20px"
            rounded="8px"
            border="1px"
            borderColor="primary.500"
          >
            <VStack w="100%" spacing={["10px", "20px"]}>
              <VStack w="100%" align="flex-start">
                {ticket.step > 1 && (
                  <Badge bg="primary.500">
                    <Text color="white" fontSize={["10px", "12px"]}>
                      Group Ticket
                    </Text>
                  </Badge>
                )}

                <Heading
                  color="dark"
                  fontSize={["16px", "22px"]}
                  lineHeight="28px"
                >
                  {ticket.name}
                </Heading>
                <Flex align="center" gap="10px">
                  <Text
                    as="span"
                    color="primary-color300"
                    fontSize={["12px", "16px"]}
                    fontWeight="700"
                  >
                    {ticket.price === 0
                      ? "Free 🎉"
                      : `₦ ${Math.ceil(
                          ticket.price +
                            (ticket.price * feePercentage) / 100 +
                            (event.percentCharge === 0 ? 0 : fixAmount)
                        ).toLocaleString()}`}
                  </Text>
                  {ticket.price !== 0 && event.percentCharge !== 0 && (
                    <Text
                      as="h5"
                      color="neutral.500"
                      fontSize={["12px", "14px"]}
                      lineHeight="20px"
                    >
                      includes &#8358;
                      {Math.ceil(
                        (ticket.price * feePercentage) / 100 + fixAmount
                      ).toLocaleString()}{" "}
                      fee
                    </Text>
                  )}
                </Flex>
              </VStack>
              <Flex w="100%" justify="space-between" align="flex-start">
                <VStack w="70%" align="flex-start">
                  {/* ... Description Logic ... */}
                  <Box>
                    <VStack align="flex-start" spacing="10px">
                      <Text
                        title={ticket.description.info}
                        color="dark"
                        fontSize={["12px", "14px"]}
                        lineHeight="20px"
                      >
                        {/* Simplified for brevity, your existing show/hide logic works fine here */}
                        {ticket.description.info}
                      </Text>
                      {/* You can keep your existing description show/hide logic here */}
                    </VStack>
                  </Box>
                </VStack>

                {/* --- DISPLAY LOGIC --- */}
                {/* Check if explicit quantity is > 0 AND calculated stock units > 0 */}
                {ticket.quantity > 0 && effectiveMax > 0 ? (
                  <VStack
                    maxW="25%"
                    justify="flex-end"
                    align="flex-end"
                    spacing="15px"
                  >
                    <NumberInput
                      ticketId={ticket.id}
                      ticketCounts={ticketCounts}
                      setTicketCounts={handleTicketCountChange}
                      step={ticket.step}
                      max={effectiveMax} // Use the effective limit
                      price={ticket.price}
                    />

                    {/* Show Low Stock Warning */}
                    {ticket.quantity <= 10 && (
                      <Text
                        color="red.500"
                        fontSize={["10px", "12px"]}
                        fontWeight="bold"
                      >
                        {ticket.quantity} tickets left
                      </Text>
                    )}
                  </VStack>
                ) : (
                  <Button isDisabled bg="gray.300" _hover={{ bg: "gray.300" }}>
                    <Text fontSize="16px" color="gray.600">
                      Sold Out
                    </Text>
                  </Button>
                )}
              </Flex>
            </VStack>
          </Box>
        );
      })}
    </VStack>
  );
};

export default EventTickets;
