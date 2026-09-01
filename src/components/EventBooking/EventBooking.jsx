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
import EventTickets from "./EventTickets";
import EventContact from "./EventContact";
import { IoClose } from "react-icons/io5";
import { useParams, useNavigate } from "react-router-dom";

const EventBooking = () => {
  const steps = [{ title: "Tickets" }, { title: "Contact" }];

  const {
    currentStep,
    setStep,
    purchaseType,
    ticketType,
    ticketCounts,
    setTicketCounts, // Required to update cart if stock is low
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

  const { eventId } = useParams();
  const event = eventsData[eventId];
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const formRef = useRef(null);

  useEffect(() => {
    document.title = "Checkout | The Lemonade Network";
  }, []);

  // --- CORE VALIDATION LOGIC ---
  const verifyStockAvailability = async () => {
    // 1. (Optional) Fetch latest data from server
    // In a real production app, you would fetch the fresh event data here
    // to ensure you aren't checking against stale data.
    // const freshEvent = await axios.get(`/api/events/${eventId}`);
    // const sourceTickets = freshEvent.data.tickets;

    // For now, we check against the local 'event' object
    const sourceTickets = event.tickets;

    // Simulate network delay for user feedback (optional)
    await new Promise((resolve) => setTimeout(resolve, 500));

    let isStockValid = true;
    const adjustedCounts = { ...ticketCounts };
    let hasChanges = false;

    // 2. Iterate through user's cart and compare with stock
    sourceTickets.forEach((ticket) => {
      const requestedQty = adjustedCounts[ticket.id] || 0;

      // Calculate real available stock (Total Qty / Step)
      // Example: If 10 tickets left and step is 2 (Couple), available units is 5.
      const availableUnits =
        Math.floor(ticket.quantity / ticket.step) * ticket.step;
      const maxPurchasable = availableUnits;

      if (requestedQty > 0) {
        if (requestedQty > maxPurchasable) {
          isStockValid = false;
          hasChanges = true;
          // Clamp the cart to the maximum available
          adjustedCounts[ticket.id] = maxPurchasable;
        }

        // Edge case: If stock is completely 0
        if (ticket.quantity <= 0) {
          isStockValid = false;
          hasChanges = true;
          adjustedCounts[ticket.id] = 0;
        }
      }
    });

    // 3. If issues found, update state and notify user
    if (!isStockValid && hasChanges) {
      setTicketCounts(adjustedCounts);

      toast({
        title: "Stock Update",
        description:
          "Some tickets are no longer available in the requested quantity. We have updated your cart.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }

    return isStockValid;
  };

  const calculateSubtotal = () => {
    return ticketType.reduce((acc, ticket) => {
      return (
        acc + (ticketCounts[ticket.id] || 0) * (ticket.price / ticket.step)
      );
    }, 0);
  };

  const calculateFees = () => {
    if (event.percentCharge === 0) return 0;
    return ticketType.reduce((acc, ticket) => {
      const count = ticketCounts[ticket.id] || 0;
      if (count === 0 || ticket.price === 0) return acc;
      const ticketFee =
        count * (ticket.price * (feePercentage / 100) + 100 / ticket.step);
      return acc + ticketFee;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const fees = calculateFees();
  const total = Math.ceil(subtotal + fees);

  const hasPaidTickets = ticketType.some(
    (ticket) => (ticketCounts[ticket.id] || 0) > 0 && ticket.price > 0
  );

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

  const storedCode = localStorage.getItem("referral_code");

  const handlePaystackPayment = () => {
    const handler = window.PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
      name: `${contactData.firstName} ${contactData.lastName}`,
      email: contactData.email,
      phone: `${contactData.countryCode}${contactData.phone}`,
      amount: total * 100,
      currency: "NGN",
      ref: `${new Date().getTime()}`,
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
        navigate(
          `/${event.id}/checkout/payment-success?&affiliate=${storedCode}&reference=${response.reference}&email=${contactData.email}&guest=${assignMultiple}`
        );
        setStep(1);
        setIsDisable(false);
        setIsSubmitting(false);
      },
    });

    handler.openIframe();
  };

  const handleFreeRegistration = () => {
    setTimeout(() => {
      navigate(
        `/${event.id}/checkout/register-success?&email=${contactData.email}&guest=${assignMultiple}`
      );
      setIsSubmitting(false);
      setIsDisable(false);
    }, 2000);
  };

  // --- UPDATED PROCESS HANDLER ---
  const handleProcessCheckout = async () => {
    setIsSubmitting(true);
    setIsDisable(true);

    try {
      // 1. Verify Stock First
      const isStockAvailable = await verifyStockAvailability();

      // 2. If valid, proceed to payment logic
      if (isStockAvailable) {
        if (total === 0 && !hasPaidTickets) {
          handleFreeRegistration();
        } else {
          handlePaystackPayment();
        }
      } else {
        // If invalid, stop spinner (Toast is handled in verify function)
        setIsSubmitting(false);
        setIsDisable(false);
      }
    } catch (error) {
      console.error("Checkout Verification Error", error);
      setIsSubmitting(false);
      setIsDisable(false);
      toast({
        title: "Error",
        description:
          "Something went wrong verifying your order. Please try again.",
        status: "error",
      });
    }
  };

  const showStep = (step) => {
    switch (step) {
      case 1:
        return <EventTickets />;
      case 2:
        return (
          // Pass the new process handler to the contact form
          <EventContact
            handleNextStep={handleProcessCheckout}
            formRef={formRef}
          />
        );
      default:
        return <EventTickets />;
    }
  };

  const handleContinue = () => {
    const hasSelectedTickets = ticketType.some(
      (ticket) => (ticketCounts[ticket.id] || 0) > 0
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
      handleContinue();
    } else if (currentStep === 2) {
      if (formRef.current) {
        formRef.current.handleSubmit();
      }
    }
  };

  const handleCancel = () => {
    const hasSelectedTickets = ticketType.some(
      (ticket) => (ticketCounts[ticket.id] || 0) > 0
    );
    if (hasSelectedTickets) {
      onOpen();
    } else {
      setStep(1);
      navigate(`/${event.id}`);
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
        {/* Header Section */}
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
                  className="w-6 h-6 cursor-pointer"
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
                            navigate(`/${event.id}`);
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

          {/* Stepper Section */}
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

        {/* Main Content */}
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

          {/* Summary Section - Desktop */}
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
                {Object.values(ticketCounts).some((count) => count > 0) ? (
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
                        (ticketCounts[ticket.id] || 0) > 0 ? (
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
                          ₦ {fees > 0 ? Math.ceil(fees).toLocaleString() : 0}
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
                      loadingText={
                        currentStep === 2 ? "Verifying..." : "Processing..."
                      } // Visual Feedback
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
                  </VStack>
                ) : (
                  <Text color="dark" fontSize="16px" lineHeight="24px">
                    Please, choose a ticket type to continue
                  </Text>
                )}
              </VStack>
            </Box>
          </VStack>

          {/* Mobile Bottom Bar */}
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
            {Object.values(ticketCounts).some((count) => count > 0) ? (
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
                  loadingText={
                    currentStep === 2 ? "Verifying..." : "Processing..."
                  }
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
