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

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  const clearData = () => {
    clearPurchaseType();
    clearContactData();
    clearTicketCounts();
    clearAssignMultiple();
  };

  // Handle ticket count changes and persist to localStorage
  const handleTicketCountChange = (ticketId, value) => {
    const updatedCounts = {
      ...ticketCounts,
      [ticketId]: value,
    };
    setTicketCounts(updatedCounts);
    localStorage.setItem("ticketCounts", JSON.stringify(updatedCounts)); // Save to localStorage
  };

  const fixAmount = 100;

  // Custom NumberInput component with Chakra's useNumberInput allowing manual input and max quantity validation
  const NumberInput = ({
    ticketId,
    ticketCounts,
    setTicketCounts,
    step = 1, // Default to single-step increment
    max = 5, // Default max value
    price,
  }) => {
    const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
      useNumberInput({
        step, // Dynamic step (e.g., 2 for duo tickets, 3 for group tickets)
        value: ticketCounts[ticketId], // Bind value to ticketCounts state
        min: 0,
        max: max * step, // Max value considering step
        onChange: (valueString) => {
          let value = parseInt(valueString, 10) || 0;

          // Ensure value is a multiple of the step
          if (value % step !== 0) {
            value = Math.floor(value / step) * step;
          }

          value = Math.min(value, max * step) || 0;

          setTicketCounts(ticketId, value);
        },
      });

    const inc = getIncrementButtonProps();
    const dec = getDecrementButtonProps();
    const input = getInputProps({
      inputMode: "numeric", // Allow numeric inputs only
      maxLength: String(max * step).length, // Dynamic max length
    });

    return (
      <HStack maxW="100%" spacing={2}>
        <Button
          minW={["20px", "30px"]}
          h={["20px", "30px"]}
          p="0px"
          fontSize="sm"
          {...dec}
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
        >
          +
        </Button>
      </HStack>
    );
  };

  // State to manage the "show more/less" functionality for each ticket
  const [showDescription, setShowDescription] = useState({});

  const handleToggle = (ticketId) => {
    setShowDescription((prev) => ({
      ...prev,
      [ticketId]: !prev[ticketId], // Toggle only for the specific ticket
    }));
  };

  return (
    <VStack w="100%" align="flex-start" spacing={["20px", "40px"]}>
      <Flex justify="flex-start" align="center" gap={["10px", "20px"]}>
        <Box
          as="button"
          p="3px"
          bg="primary.500"
          rounded="6px"
          onClick={onOpen}
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
      {ticketType.map((ticket) => (
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
              {ticket.step > 1 ? (
                <Badge bg="primary.500">
                  <Text color="white" fontSize={["10px", "12px"]}>
                    Group Ticket
                  </Text>
                </Badge>
              ) : null}

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
                    : `₦ ${(
                        ticket.price +
                        ((ticket.price * feePercentage) / 100 + fixAmount)
                      ).toLocaleString()}`}
                </Text>
                {ticket.price === 0 ? null : (
                  <Text
                    as="h5"
                    color="neutral.500"
                    fontSize={["12px", "14px"]}
                    lineHeight="20px"
                  >
                    includes &#8358;
                    {(
                      (ticket.price * feePercentage) / 100 +
                      fixAmount
                    ).toLocaleString()}{" "}
                     fee
                  </Text>
                )}
              </Flex>
            </VStack>
            <Flex w="100%" justify="space-between" align="flex-start">
              <VStack w="70%" align="flex-start">
                <Box>
                  {ticket.description.perks.length >= 3 ? (
                    <>
                      <Collapse
                        startingHeight={100}
                        in={showDescription[ticket.id]}
                      >
                        <VStack align="flex-start" spacing="10px">
                          {ticket.description.perks && (
                            <VStack align="flex-start" spacing="0">
                              <Heading
                                color="dark"
                                fontSize={["14px", "20px"]}
                                lineHeight="28px"
                              >
                                Perks
                              </Heading>
                              <UnorderedList py="0">
                                {ticket.description.perks.map((perk, i) => (
                                  <ListItem key={i}>
                                    <Text
                                      color="dark"
                                      fontSize={["12px", "14px"]}
                                      lineHeight="20px"
                                    >
                                      {perk}
                                    </Text>
                                  </ListItem>
                                ))}
                              </UnorderedList>
                            </VStack>
                          )}
                          <Text
                            title={ticket.description.info}
                            color="dark"
                            fontSize={["12px", "14px"]}
                            lineHeight="20px"
                          >
                            {ticket.description.info}
                          </Text>
                        </VStack>
                      </Collapse>
                      <Text
                        as="button"
                        color="primary.500"
                        fontSize="14px"
                        lineHeight="20px"
                        onClick={() => handleToggle(ticket.id)}
                      >
                        See {showDescription[ticket.id] ? "less" : "more"}
                      </Text>
                    </>
                  ) : (
                    <VStack align="flex-start" spacing="10px">
                      {ticket.description.perks && (
                        <VStack align="flex-start" spacing="0">
                          <Heading
                            color="dark"
                            fontSize={["14px", "20px"]}
                            lineHeight="28px"
                          >
                            Perks
                          </Heading>
                          <UnorderedList py="0">
                            {ticket.description.perks.map((perk, i) => (
                              <ListItem key={i}>
                                <Text
                                  color="dark"
                                  fontSize={["12px", "14px"]}
                                  lineHeight="20px"
                                >
                                  {perk}
                                </Text>
                              </ListItem>
                            ))}
                          </UnorderedList>
                        </VStack>
                      )}
                      <Text
                        title={ticket.description.info}
                        color="dark"
                        fontSize={["12px", "14px"]}
                        lineHeight="20px"
                      >
                        {ticket.description.info}
                      </Text>
                    </VStack>
                  )}
                </Box>
              </VStack>
              {ticket.quantity > 0 ? (
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
                    max={ticket.maxQuantity}
                    price={ticket.price}
                  />
                  {ticket.quantity <= 10 && (
                    <Text color="neutral-400" fontSize={["12px", "16px"]}>
                      {ticket.quantity} tickets left
                    </Text>
                  )}
                </VStack>
              ) : (
                <Button isDisabled>
                  <Text fontSize="16px">Sold Out</Text>
                </Button>
              )}
            </Flex>
          </VStack>
        </Box>
      ))}
    </VStack>
  );
};

export default EventTickets;
