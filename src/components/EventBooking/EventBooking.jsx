import React, { useContext, useRef, useEffect } from "react";
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
} from "@chakra-ui/react";
import { multiBookingContext } from "./BookingContext";
import { eventsData } from "../../../server/eventsData";
import EventTickets from "./EventTickets";
import EventContact from "./EventContact";
import { IoClose } from "react-icons/io5";
import { Link, useParams } from "react-router-dom";

const EventBooking = () => {
  const steps = [{ title: "Tickets" }, { title: "Contact" }];

  const {
    currentStep,
    setStep,
    ticketType,
    ticketCounts,
    feePercentage,
    contactData,
    isSubmitting,
    setIsSubmitting,
    isDisable,
    setIsDisable,
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

  // Function to get the selected tickets with fees and subtotal
  const getSelectedTickets = () => {
    return ticketType
      .filter((ticket) => ticketCounts[ticket.id] > 0) // Only tickets with count > 0
      .map((ticket) => {
        const subtotal = (ticket.price * ticketCounts[ticket.id]) / ticket.step; // Calculate subtotal per ticket
        const fees =
          ticketCounts[ticket.id] *
          (ticket.price * (feePercentage / 100) + 100 / ticket.step); // Assuming fees are 10% of the ticket price
        const total = subtotal + fees; // Calculate the total including fees
        return {
          ticketId: ticket.id,
          name: ticket.name,
          price: ticket.price,
          quantity: ticketCounts[ticket.id], // Ticket quantity based on the user's input
          subtotal: subtotal, // Add subtotal
          fees: fees, // Add fees
          total: total, // Add total (subtotal + fees)
        };
      });
  };

  // Getting the selected tickets with updated data
  const selectedTickets = getSelectedTickets();

  // console.log("Selected Tickets with Fees and Subtotal:", selectedTickets); // Log the tickets to verify

  // Handle Paystack Payment with the updated selected tickets
  const handlePaystackPayment = (
    firstName,
    lastName,
    email,
    countryCode,
    phone,
    total,
    selectedTickets // Updated array of selected tickets containing ticketId, ticketType, price, quantity, fees, subtotal, and total
  ) => {
    const handler = window.PaystackPop.setup({
      key: "pk_test_2ee3c2c176bb56a26e8213b0ce1546e3088647d6",
      name: `${firstName} ${lastName}`,
      email: email,
      phone: `${countryCode}${phone}`,
      amount: total * 100, // Paystack uses Kobo (1 Naira = 100 Kobo)
      currency: "NGN",
      ref: `${new Date().getTime()}`, // Unique reference
      onClose: () => {
        alert("Payment window closed");
        setIsDisable(false);
        setIsSubmitting(false);
      },
      callback: (response) => {
        // On successful payment, send the ticket details and payment reference to the backend
        fetch("https://tlnevents.com/server/verify-payment.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: `${contactData.firstName} ${contactData.lastName}`,
            reference: response.reference, // Pass the payment reference here
            tickets: selectedTickets, // Include updated ticket details with fees and subtotal
          }),
        })
          .then((res) => res.text()) // Get raw response
          .then((data) => {
            try {
              const jsonData = JSON.parse(data); // Parse JSON
              if (jsonData.success) {
                // Redirect on successful payment verification
                window.location.href = `/${event.id}/checkout/payment-success?reference=${response.reference}`;
                setIsDisable(false);
                setIsSubmitting(false);
              } else {
                console.log("Payment verification failed", jsonData.message);
              }
            } catch (error) {
              console.error("Error parsing JSON response:", error, data); // Show raw response
            }
          })
          .catch((error) => console.error("Error with fetch:", error));
      },
    });

    handler.openIframe();
  };

  // Function to verify payment on your backend
  const verifyPayment = async (reference, email, ticketDetails) => {
    try {
      const response = await fetch("https://tlnevents.com/verify-payment.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reference,
          email,
          ticket_details: ticketDetails,
        }), // Send reference and ticket details
      });

      const result = await response.json();
      if (result.status === "success") {
        // Handle successful order processing
        window.location.href = `/payment-success`; // Redirect to a success page
      } else {
        // Handle errors returned by the backend
        alert("Payment verification failed: " + result.message);
      }
    } catch (error) {
      console.error("An error occurred during payment verification:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleNextStep = () => {
    // setStep((prevStep) => prevStep + 1); // Advance to the next step
    handlePaystackPayment(
      contactData.firstName,
      contactData.lastName,
      contactData.email,
      contactData.countryCode,
      contactData.phone,
      total,
      subtotal,
      fees,
      selectedTickets
    );
  };

  const formRef = useRef(null);

  const showStep = (step) => {
    switch (step) {
      case 1:
        return <EventTickets />;
      case 2:
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
      alert("Please select at least one ticket to continue.");
    }
  };

  const ContinueStep = () => {
    if (currentStep === 1) {
      handleContinue();
    }
    if (currentStep === 2) {
      if (formRef.current) {
        formRef.current.handleSubmit(); // Trigger form submission

        // scrollToSection("stepper");
      }
    }
  };

  return (
    <VStack
      bg="white"
      w="100%"
      h="100%"
      align="flex-start"
      spacing={["50px", "25px", "80px"]}
      px={["20px", "25px", "100px"]}
      pt={["30px", "24px", "40px", "54px"]}
      pb={["30px", "24px", "40px", "54px"]}
    >
      {/* <Header /> */}
      <VStack w="100%" align="flex-start" spacing="40px">
        <Box w="100%">
          <Flex w="100%" align="center" gap="40px">
            {/* <Image src="/logo.svg" /> */}
            <Flex w="100%" justify="space-between" align="center">
              <Heading
                color="dark"
                fontSize={["18px", "22px"]}
                lineHeight="28px"
              >
                Check Out
              </Heading>

              <Link to={`/${event.url}`}>
                <IoClose color="dark" className=" w-6 h-6" />
              </Link>
            </Flex>
          </Flex>
        </Box>
        <VStack w="100%" justify="flex-start" align="flex-start" spacing="20px">
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
        <Box w={["100%", "544px"]} pb={["100px", 0]}>
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
                      ticketCounts[ticket.id] > 0 ? (
                        <Flex
                          key={ticket.id}
                          w="100%"
                          justify="space-between"
                          align="flex-start"
                        >
                          <Text color="dark" fontSize="16px" lineHeight="24px">
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
                    _hover={{ bg: "primary.500" }}
                    _active={{ bg: "primary.400" }}
                    _focus={{ bg: "primary.500" }}
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
          display={["block", "none"]}
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
                _hover={{ bg: "secondary.500" }}
                _active={{ bg: "secondary.500" }}
                _focus={{ bg: "secondary.500" }}
                onClick={ContinueStep}
              >
                <Text
                  color="dark"
                  fontSize="14px"
                  fontWeight="600"
                  lineHeight="20px"
                >
                  {currentStep === steps.length - 1 ? "Continue" : "Checkout"}
                </Text>
              </Button>
            </Flex>
          ) : null}
        </Box>
      </Stack>
    </VStack>
  );
};

export default EventBooking;
