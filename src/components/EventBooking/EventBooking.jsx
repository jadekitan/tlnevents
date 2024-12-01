import React, { useContext, useRef, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  VStack,
  Flex,
  Heading,
  Box,
  Step,
  StepIcon,
  StepIndicator,
  StepStatus,
  StepTitle,
  Stepper,
  StepSeparator,
  Stack,
  Text,
  Button,
  useToast,
  useDisclosure,
  AlertDialog,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { multiBookingContext } from "./BookingContext";
import { eventsData } from "../../../server/eventsData";
import PurchaseType from "./PurchaseType";
import EventTickets from "./EventTickets";
import EventContact from "./EventContact";
import { IoClose } from "react-icons/io5";
import { useParams } from "react-router-dom";

const EventBooking = () => {
  const steps = [{ title: "Type" }, { title: "Tickets" }, { title: "Contact" }];

  const {
    currentStep,
    setStep,
    purchaseType,
    ticketType,
    ticketCounts,
    feePercentage,
    contactData,
    isSubmitting,
    setIsSubmitting,
    isDisable,
    setIsDisable,
    assignMultiple,
    clearPurchaseType,
    clearContactData,
    clearTicketCounts,
    clearAssignMultiple,
  } = useContext(multiBookingContext);
  {
    multiBookingContext;
  }

  useEffect(() => {
    document.title = "Checkout | The Lemonade Network";
  }, []);

  // Function to calculate the subtotal
  const calculateSubtotal = () => {
    return ticketType.reduce((acc, ticket) => {
      return acc + ticketCounts[ticket.id] * (ticket.price / ticket.step);
    }, 0);
  };

  // Fees and Total Calculation (fees calculated as price * feePercentage + 100)
  const fees = ticketType.reduce((acc, ticket) => {
    const ticketSubtotal =
      ticketCounts[ticket.id] *
      (ticket.price * (feePercentage / 100) + 100 / ticket.step);
    return acc + (ticketSubtotal > 0 ? ticketSubtotal : 0);
  }, 0);

  const subtotal = calculateSubtotal();
  const total = subtotal + (subtotal > 0 ? fees : 0);

  function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }

  const clearData = () => {
    clearPurchaseType();
    clearContactData();
    clearTicketCounts();
    clearAssignMultiple();
  };

  const toast = useToast();

  // Handle Paystack Payment with the updated selected tickets
  const handlePaystackPayment = (
    firstName,
    lastName,
    email,
    countryCode,
    phone,
    total
  ) => {
    const handler = window.PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
      name: `${firstName} ${lastName}`,
      email: email,
      phone: `${countryCode}${phone}`,
      amount: total * 100, // Paystack uses Kobo (1 Naira = 100 Kobo)
      currency: "NGN",
      ref: `${new Date().getTime()}`, // Unique reference
      onClose: () => {
        toast({
          position: "top",
          title: "Payment cancelled.",
          description: "You have exited the payment process.",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
        setIsDisable(false);
        setIsSubmitting(false);
      },
      callback: (response) => {
        // Redirect on successful payment verification
        window.location.href = `/${event.id}/checkout/payment-success?reference=${response.reference}&email=${email}&guest=${assignMultiple}`;
        setStep(1);
        setIsDisable(false);
        setIsSubmitting(false);
      },
    });

    handler.openIframe();
  };

  const handleNextStep = () => {
    handlePaystackPayment(
      contactData.firstName,
      contactData.lastName,
      contactData.email,
      contactData.countryCode,
      contactData.phone,
      total
    );
  };

  const formRef = useRef(null);

  const showStep = (step) => {
    switch (step) {
      case 1:
        return <PurchaseType />;
      case 2:
        return <EventTickets />;
      case 3:
        return (
          <EventContact handleNextStep={handleNextStep} formRef={formRef} /> // Pass formRef and handleNextStep
        );
      default:
        return <EventTickets />;
    }
  };

  const { eventId } = useParams(); // Get the event ID from the URL
  const event = eventsData[eventId]; // Lookup event from local data

  // Updated handleContinue to allow free ticket selection
  const handleContinue = () => {
    const hasSelectedTickets = ticketType.some(
      (ticket) => ticketCounts[ticket.id] > 0
    );

    if (hasSelectedTickets) {
      setStep(currentStep + 1);
      scrollToSection("stepper");
    } else {
      toast({
        position: "top",
        title: "Select A Ticket",
        description: "Please select at least one ticket to continue.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const ContinueStep = () => {
    if (currentStep === 1) {
      if (purchaseType) {
        setStep(2);
        window.location.href = `/${event.id}/checkout?type=${purchaseType}`;
      } else {
        toast({
          position: "top",
          title: "Select A Purchase Type",
          description: "Please select a purchase type to continue.",
          status: "info",
          duration: 3000,
          isClosable: true,
        }); // show alert if continue is clicked without selection
      }
    }
    if (currentStep === 2) {
      handleContinue();
    }
    if (currentStep === 3) {
      if (formRef.current) {
        formRef.current.handleSubmit(); // Trigger form submission
        // scrollToSection("stepper");
      }
    }
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  const handleCancel = () => {
    const hasSelectedTickets = ticketType.some(
      (ticket) => ticketCounts[ticket.id] > 0
    );
    if (purchaseType) {
      onOpen();
    } else if (hasSelectedTickets) {
      onOpen();
    } else {
      setStep(1);
      window.location.href = `/${event.id}`;
      clearData();
    }
  };

  return (
    <>
      <Helmet>
        <title>Checkout | The Lemonade Network</title>
        <meta name="description" content={`${event.name} Checkout`} />
        <meta property="og:title" content="Checkout | The Lemonade Network" />
        <meta property="og:description" content={`${event.name} Checkout`} />
      </Helmet>
      <VStack
        bg="white"
        w="100%"
        h="100%"
        align="flex-start"
        spacing={["50px", "25px", "80px"]}
        px={["20px", "25px", "50px", "75px", "100px"]}
        pt={["30px", "24px", "40px", "54px"]}
        pb={["30px", "24px", "40px", "54px"]}
      >
        {/* <Header /> */}
        <VStack w="100%" align="flex-start" spacing="40px">
          <Box w="100%">
            <Flex w="100%" align="center" gap="40px">
              <Flex w="100%" justify="space-between" align="center">
                <Heading
                  color="dark"
                  fontSize={["18px", "22px"]}
                  lineHeight="28px"
                >
                  Checkout
                </Heading>

                <IoClose
                  color="dark"
                  className=" w-6 h-6"
                  onClick={handleCancel}
                />

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
                        Are you sure you want to cancel? This will cancel the
                        order and release your tickets?
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
              </Flex>
            </Flex>
          </Box>
          <VStack
            w="100%"
            justify="flex-start"
            align="flex-start"
            spacing="20px"
          >
            <VStack
              w={["100%", "100%", "100%", "871px"]}
              align="flex-start"
              spacing="20px"
            >
              <Box id="stepper" position="relative" width={["100%", "85%"]}>
                <Stepper index={currentStep} size="sm" gap="0">
                  {steps.map((step, index) => (
                    <Step key={index} gap="10px">
                      <StepIndicator
                        sx={{
                          "[data-status=complete] &": {
                            width: ["18px", "24px"],
                            height: ["18px", "24px"],
                            background: "primary.500",
                            borderColor: "black",
                          },
                          "[data-status=active] &": {
                            width: ["18px", "24px"],
                            height: ["18px", "24px"],
                            rounded: "full",
                            borderColor: "primary.500",
                            background: "rgba(210, 190, 249, 0.1)",
                          },
                          "[data-status=incomplete] &": {
                            width: ["18px", "24px"],
                            height: ["18px", "24px"],
                            rounded: "full",
                            border: "none",
                            background: "rgba(210, 190, 249, 0.1)",
                          },
                        }}
                      >
                        <StepStatus complete={<StepIcon />} />
                      </StepIndicator>
                      <Box flexShrink="0">
                        <StepTitle
                          color="dark"
                          fontSize={["12px", "16px"]}
                          fontWeight="700"
                          lineHeight="24px"
                        >
                          {step.title}
                        </StepTitle>
                      </Box>

                      <StepSeparator
                        mx="10px"
                        sx={{
                          "[data-status=complete] &": {
                            height: "1px",
                            background: "primary.500",
                          },
                          "[data-status=active] &": {
                            height: "1px",
                            background: "primary.500",
                          },
                          "[data-status=incomplete] &": {
                            height: "1px",
                            background: "primary.500",
                          },
                        }}
                      />
                    </Step>
                  ))}
                </Stepper>
              </Box>
            </VStack>
          </VStack>
        </VStack>
        <Stack
          position="relative"
          flexDir={["column", "row"]}
          w="100%"
          justify={["flex-start", "space-between"]}
          align="flex-start"
        >
          <Box
            w={["100%", "100%", "100%", "544px"]}
            pb={["100px", "100px", "100px", 0]}
          >
            {showStep(currentStep)}
          </Box>
          <VStack
            display={["none", "none", "none", "flex"]}
            position="sticky"
            top="20px"
            w="450px"
            align="flex-start"
            spacing="40px"
          >
            <Heading color="dark" fontSize="22px" lineHeight="28px">
              Summary
            </Heading>
            <Box
              w="100%"
              py="40px"
              px="40px"
              rounded="8px"
              border="1px"
              borderColor="primary.500"
            >
              <VStack align="center" spacing="50px">
                <Heading color="dark" fontSize="22px" lineHeight="28px">
                  {event.name}
                </Heading>
                {currentStep === 1 ? (
                  purchaseType ? (
                    <Button
                      type="submit"
                      w="100%"
                      bg="primary.500"
                      rounded="8px"
                      _hover={{ bg: "primary.400" }}
                      _active={{ bg: "secondary.500" }}
                      _focus={{ bg: "secondary.500" }}
                      onClick={ContinueStep}
                      isDisabled={isDisable}
                      isLoading={isSubmitting}
                      loadingText="Checkout"
                      spinnerPlacement="end"
                    >
                      <Text
                        color="dark"
                        fontSize="14px"
                        fontWeight="600"
                        lineHeight="20px"
                      >
                        Continue
                      </Text>
                    </Button>
                  ) : (
                    <Text color="dark" fontSize="16px" lineHeight="24px">
                      Please, choose a purchase type to continue
                    </Text>
                  )
                ) : Object.values(ticketCounts).some((count) => count > 0) ? (
                  <VStack
                    width="100%"
                    justify="flex-start"
                    align="start"
                    spacing="30px"
                  >
                    <VStack
                      w="100%"
                      justify="flex-start"
                      align="start"
                      spacing="20px"
                    >
                      {ticketType.map((ticket) =>
                        ticketCounts[ticket.id] > 0 ? (
                          <Flex
                            key={ticket.id}
                            w="100%"
                            justify="space-between"
                            align="flex-start"
                          >
                            <Text
                              color="dark"
                              fontSize="16px"
                              lineHeight="24px"
                            >
                              {`${ticketCounts[ticket.id]} x ${ticket.name}`}
                            </Text>

                            {ticket.price === 0 ? (
                              <Heading
                                color="dark"
                                fontSize="16px"
                                lineHeight="24px"
                              >
                                Free🎉
                              </Heading>
                            ) : (
                              <Heading
                                color="dark"
                                fontSize="16px"
                                lineHeight="24px"
                              >
                                ₦{" "}
                                {(
                                  (ticketCounts[ticket.id] / ticket.step) *
                                  ticket.price
                                ).toLocaleString()}
                              </Heading>
                            )}
                          </Flex>
                        ) : null
                      )}
                    </VStack>
                    <Box w="100%" h="1px" bg="primary.500"></Box>
                    <VStack
                      w="100%"
                      justify="flex-start"
                      align="start"
                      spacing="20px"
                    >
                      <Flex w="100%" justify="space-between" align="flex-start">
                        <Text color="dark" fontSize="16px" lineHeight="24px">
                          Subtotal
                        </Text>
                        <Heading color="dark" fontSize="16px" lineHeight="24px">
                          ₦ {subtotal.toLocaleString()}
                        </Heading>
                      </Flex>
                      <Flex w="100%" justify="space-between" align="flex-start">
                        <Text color="dark" fontSize="16px" lineHeight="24px">
                          Fees
                        </Text>
                        <Heading color="dark" fontSize="16px" lineHeight="24px">
                          ₦ {subtotal > 0 ? fees.toLocaleString() : 0}
                        </Heading>
                      </Flex>
                    </VStack>
                    <Box w="100%" h="1px" bg="primary.500"></Box>
                    <Flex w="100%" justify="space-between" align="flex-start">
                      <Text color="dark" fontSize="16px" lineHeight="24px">
                        Total
                      </Text>
                      <Heading color="dark" fontSize="16px" lineHeight="24px">
                        ₦ {total.toLocaleString()}
                      </Heading>
                    </Flex>

                    {/* Continue Button */}
                    <Button
                      type="submit"
                      w="100%"
                      bg="primary.500"
                      rounded="8px"
                      _hover={{ bg: "primary.400" }}
                      _active={{ bg: "secondary.500" }}
                      _focus={{ bg: "secondary.500" }}
                      onClick={ContinueStep}
                      isDisabled={isDisable}
                      isLoading={isSubmitting}
                      loadingText="Checkout"
                      spinnerPlacement="end"
                    >
                      <Text
                        color="dark"
                        fontSize="14px"
                        fontWeight="600"
                        lineHeight="20px"
                      >
                        {currentStep === steps.length - 1
                          ? "Continue"
                          : "Checkout"}
                      </Text>
                    </Button>
                  </VStack>
                ) : (
                  <Text color="dark" fontSize="16px" lineHeight="24px">
                    Please, choose a ticket type to continue
                  </Text>
                )}
              </VStack>
            </Box>
          </VStack>
          <Box
            display={["block", "block", "block", "none"]}
            w="100%"
            h="93px"
            position="fixed"
            left="0"
            bottom="17px"
            px="20px"
            rounded="8px"
          >
            {currentStep === 1 ? (
              purchaseType ? (
                <Flex
                  h="100%"
                  py="14px"
                  px="20px"
                  rounded="8px"
                  bg="primary.500"
                  justify="space-between"
                  align="center"
                >
                  <Heading color="dark" fontSize="24px" lineHeight="32px">
                    ₦ 0
                  </Heading>
                  <Button
                    w="122px"
                    rounded="8px"
                    bg="secondary.500"
                    _hover={{ bg: "primary.400" }}
                    _active={{ bg: "secondary.500" }}
                    _focus={{ bg: "secondary.500" }}
                    onClick={ContinueStep}
                    isDisabled={isDisable}
                    isLoading={isSubmitting}
                    loadingText="Checkout"
                    spinnerPlacement="end"
                  >
                    <Text
                      color="dark"
                      fontSize="14px"
                      fontWeight="600"
                      lineHeight="20px"
                    >
                      {currentStep === steps.length ? "Checkout" : "Continue"}
                    </Text>
                  </Button>
                </Flex>
              ) : (
                <Flex
                  h="100%"
                  py="14px"
                  px="20px"
                  rounded="8px"
                  bg="primary.500"
                  justify="space-between"
                  align="center"
                >
                  <Heading color="dark" fontSize="24px" lineHeight="32px">
                    ₦ 0
                  </Heading>
                  <Button
                    w="122px"
                    rounded="8px"
                    bg="secondary.500"
                    _hover={{ bg: "primary.400" }}
                    _active={{ bg: "secondary.500" }}
                    _focus={{ bg: "secondary.500" }}
                    onClick={ContinueStep}
                    isDisabled={isDisable}
                    isLoading={isSubmitting}
                    loadingText="Checkout"
                    spinnerPlacement="end"
                  >
                    <Text
                      color="dark"
                      fontSize="14px"
                      fontWeight="600"
                      lineHeight="20px"
                    >
                      {currentStep === steps.length ? "Checkout" : "Continue"}
                    </Text>
                  </Button>
                </Flex>
              )
            ) : Object.values(ticketCounts).some((count) => count >= 0) ? (
              <Flex
                h="100%"
                py="14px"
                px="20px"
                rounded="8px"
                bg="primary.500"
                justify="space-between"
                align="center"
              >
                <Heading color="dark" fontSize="24px" lineHeight="32px">
                  {` ₦ ${total.toLocaleString()}`}
                </Heading>
                <Button
                  w="122px"
                  rounded="8px"
                  bg="secondary.500"
                  _hover={{ bg: "primary.400" }}
                  _active={{ bg: "secondary.500" }}
                  _focus={{ bg: "secondary.500" }}
                  onClick={ContinueStep}
                  isDisabled={isDisable}
                  isLoading={isSubmitting}
                  loadingText="Checkout"
                  spinnerPlacement="end"
                >
                  <Text
                    color="dark"
                    fontSize="14px"
                    fontWeight="600"
                    lineHeight="20px"
                  >
                    {currentStep === steps.length ? "Checkout" : "Continue"}
                  </Text>
                </Button>
              </Flex>
            ) : null}
          </Box>
        </Stack>
      </VStack>
    </>
  );
};

export default EventBooking;
