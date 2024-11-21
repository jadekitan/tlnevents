import React, { useState, useContext } from "react";
import {
  VStack,
  Box,
  Flex,
  Stack,
  Heading,
  Text,
  Input,
  Button,
  useDisclosure,
  AlertDialog,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { FaPeoplePulling } from "react-icons/fa6";

import { FaChildren } from "react-icons/fa6";
import { multiBookingContext } from "./BookingContext";
import { eventsData } from "../../../server/eventsData";
import { Link, useParams } from "react-router-dom";

const PurchaseType = ({ name, onChange }) => {
  const {
    LeftArrow,
    purchaseType,
    setPurchaseType,
    setStep,
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

  const { eventId } = useParams(); // Get the event ID from the URL
  const event = eventsData[eventId]; // Lookup event from local data

  const handleArrow = () => {
    if (purchaseType) {
      onOpen();
    } else {
      window.location.href = `/${event.id}`;
      setStep(1);
      clearData();
    }
  };
  const options = [
    {
      value: "children",
      label: "Children",
      icon: <FaChildren className=" w-10 h-10" />,
      title: "Children",
      description:
        "For younger attendees, providing age-appropriate activities at reduced price.",
    },
    {
      value: "adult",
      label: "Adult",
      icon: <FaPeoplePulling className=" w-10 h-10" />,
      title: "Adult",
      description:
        "For attendees above 18 years, offering full access to all event features and activities.",
    },
  ];

  const [selectedValue, setSelectedValue] = useState(purchaseType || null);

  const handleClick = (value) => {
    setSelectedValue(value);
    setPurchaseType(value);
    if (onChange) onChange(value); // Optional callback for custom logic
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
          Purchase Type
        </Heading>
      </Flex>
      <Stack
        w="100%"
        flexDir={["column", "column", "row"]}
        justify="space-between"
        align={["center", "center", "center", "flex-start"]}
        spacing={["40px", "50px"]}
      >
        {options.map((option) => (
          <VStack
            w={["80%", "80%", "80%", "45%"]}
            align="center"
            px="11px"
            py="18px"
            bg="rgba(210, 190, 249, 0.10)"
            border={selectedValue === option.value ? "1px" : "0"}
            borderColor={
              selectedValue === option.value ? " primary.500" : "none"
            }
            borderRadius="8px"
            key={option.value}
          >
            <VStack
              w="100%"
              align="center"
              spacing="12px"
              className="cursor-pointer"
              onClick={() => handleClick(option.value)}
            >
              <Box>{option.icon}</Box>
              <Heading
                color="dark"
                fontSize={["14px", "16px"]}
                lineHeight="24px"
              >
                {option.title}
              </Heading>
              <Text
                color={selectedValue === option.value ? "neutral.500" : "dark"}
                fontSize={["12px", "14px"]}
                textAlign="center"
                lineHeight="20px"
              >
                {option.description}
              </Text>
              <input
                type="radio"
                width="1rem"
                height="1rem"
                name={name}
                id={option.value}
                value={option.value}
                checked={selectedValue === option.value}
                cursor="pointer"
                readOnly
                style={{ width: "16px", height: "16px" }}
                className=" relative border-[#80BC00] checked:border-[#80BC00]"
              />
            </VStack>
          </VStack>
        ))}
      </Stack>
    </VStack>
  );
};

export default PurchaseType;
