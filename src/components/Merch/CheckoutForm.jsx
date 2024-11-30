import React, { useContext, useEffect } from "react";
import {
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  Text,
  VStack,
  Stack,
  useToast,
  Flex,
  Select,
  Box,
  Icon,
  Heading,
} from "@chakra-ui/react";
import { CartContext } from "./CartProvider";
import { useFormik } from "formik";
import { Link, useParams } from "react-router-dom";
import { eventsData } from "../../../server/eventsData";
import { contacts } from "../../../server/merch-contacts";
import { Helmet } from "react-helmet-async";

const CheckoutForm = () => {
  const {
    cart,
    contactData,
    handleContactDataChange,
    handleBlur,
    setIsDisable,
    setIsSubmitting,
    isDisable,
    isSubmitting,
    getTotal,
  } = useContext(CartContext);

  const LeftArrow = (props) => (
    <Icon
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M4 11.9998H20"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.99948 17C8.99948 17 3.99953 13.3176 3.99951 12C3.9995 10.6824 8.99951 7 8.99951 7"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );

  const countryCodes = [
    { code: "+234", country: "Nigeria", minLength: 10, maxLength: 11 },
    { code: "+1", country: "USA", minLength: 10, maxLength: 10 },
    { code: "+44", country: "UK", minLength: 10, maxLength: 11 },
    { code: "+91", country: "India", minLength: 10, maxLength: 10 },
  ];

  const validatePhoneNumber = (value, countryCode) => {
    const country = countryCodes.find((c) => c.code === countryCode);
    const phoneLength = value.replace(/\D/g, "").length; // Remove non-numeric characters
    if (!country) return false;
    return phoneLength >= country.minLength && phoneLength <= country.maxLength;
  };

  const { eventId } = useParams(); // Get the event ID from the URL
  const event = eventsData[eventId]; // Lookup event from local data

  useEffect(() => {
    setTimeout(() => {
      document.title = "Checkout | The Lemonade Network Events";
      // Set or update description meta tag
      let descriptionMeta = document.querySelector('meta[name="description"]');
      if (!descriptionMeta) {
        descriptionMeta = document.createElement("meta");
        descriptionMeta.name = "description";
        document.head.appendChild(descriptionMeta);
      }
      descriptionMeta.content =
        "Checkout to payment for your shopping cart.";

      // Set or update Open Graph meta tags
      const ogTags = [
        { property: "og:title", content: "Checkout | The Lemonade Network Events" },
        {
          property: "og:description",
          content: "Checkout to payment for your shopping cart.",
        },
        { property: "og:image", content: "https://tlnevents.com/full-logo.jpg" },
        { property: "og:url", content: `https://tlnevents.com/${event.id}/merch/checkout` },
      ];

      ogTags.forEach(({ property, content }) => {
        let metaTag = document.querySelector(`meta[property="${property}"]`);
        if (!metaTag) {
          metaTag = document.createElement("meta");
          metaTag.setAttribute("property", property);
          document.head.appendChild(metaTag);
        }
        metaTag.content = content;
      });
    }, 100);
  }, []);

  const toast = useToast();

  const total = getTotal();

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
        window.location.href = `/${event.id}/merch/checkout/payment-success?reference=${response.reference}&email=${email}`;
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

  const validate = (values) => {
    const errors = {};

    // Basic field validation
    if (!values.firstName?.trim()) {
      errors.firstName = "First name is required";
    }
    if (!values.lastName?.trim()) {
      errors.lastName = "Last name is required";
    }
    if (!values.email?.trim()) {
      errors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = "Invalid email address";
    }
    if (!values.phone?.trim()) {
      errors.phone = "Phone number is required";
    } else if (!validatePhoneNumber(values.phone, values.countryCode)) {
      errors.phone = "Invalid phone number";
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: contactData,
    enableReinitialize: false,
    validateOnMount: false,
    validateOnBlur: true,
    validateOnChange: false,
    validate,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        contacts(
          contactData.firstName,
          contactData.lastName,
          contactData.email,
          "Merch"
        );
      } catch (error) {
        console.log(error)
      }
      setIsSubmitting(true);
      setSubmitting(true);
      setIsDisable(true);
      handleNextStep();

    },
  });

  return (
    <>
      <Helmet>
        <meta charset="UTF-8" />
        <link
          rel="icon"
          type="image/svg+xml"
          href="https://tlnevents.com/favicon.png"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Checkout | The Lemonade Network Events</title>
        <meta
          name="description"
          content="Checkout to payment for your shopping cart."
        />
        <meta
          property="og:title"
          content='Checkout | The Lemonade Network Events'
        />
        <meta
          property="og:description"
          content="Checkout to payment for your shopping cart."
        />
        <meta
          property="og:image"
          content="https://tlnevents.com/full-logo.jpg"
        />
        <meta
          property="og:url"
          content={`https://tlnevents.com/${event?.id}/merch/cart`}
        />
        <meta property="og:type" content="website" />
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
          <Flex w="100%" justify="space-between" align="center">
            <Heading color="dark" fontSize={["18px", "22px"]} lineHeight="28px">
              Checkout
            </Heading>
            <Text>
              {cart.length} {cart.length > 0 ? "items" : "item"}
            </Text>
          </Flex>
        </VStack>
        {cart.length > 0 ? (
          <Stack
            as="form"
            position="relative"
            flexDir={["column", "row"]}
            w="100%"
            justify={["flex-start", "space-between"]}
            align="flex-start"
            onSubmit={formik.handleSubmit}
          >
            <Box
              w={["100%", "100%", "100%", "544px"]}
              pb={["100px", "100px", "100px", 0]}
            >
              <Box w="100%">
                <VStack
                  w="100%"
                  justify="flex-start"
                  align="flex-start"
                  spacing={["20px", "40px"]}
                >
                  <VStack
                    w="100%"
                    align="flex-start"
                    spacing={["20px", "40px"]}
                  >
                    <Flex
                      justify="flex-start"
                      align="center"
                      gap={["10px", "20px"]}
                    >
                      <Link to={`/${event.id}/merch/cart`}>
                        <Box
                          as="button"
                          type="button"
                          p="3px"
                          bg="primary.500"
                          rounded="6px"
                        >
                          <LeftArrow />
                        </Box>
                      </Link>
                      <Heading
                        color="dark"
                        fontSize={["18px", "22px"]}
                        lineHeight="28px"
                      >
                        Contact Information
                      </Heading>
                    </Flex>

                    <VStack
                      w="100%"
                      justify="flex-start"
                      align="flex-start"
                      spacing={["20px", "20px"]}
                    >
                      <FormControl
                        id="
          firstName"
                        isRequired
                        isInvalid={
                          formik.errors.firstName && formik.touched.firstName
                        }
                      >
                        <Input
                          variant="filled"
                          h={["40px", "50px"]}
                          rounded="8px"
                          color="dark"
                          fontSize={["14px", "16px"]}
                          p={["20px", "24px"]}
                          type="text"
                          id="firstName"
                          name="firstName"
                          placeholder="First Name"
                          value={formik.values.firstName}
                          onChange={(e) => {
                            formik.handleChange(e);
                            handleContactDataChange({
                              firstName: e.target.value,
                            });
                          }}
                          onBlur={handleBlur}
                        />
                        <FormErrorMessage fontSize={["14px", "16px"]}>
                          {formik.errors.firstName}
                        </FormErrorMessage>
                      </FormControl>
                      <FormControl
                        id="
          lastName"
                        isRequired
                        isInvalid={
                          formik.errors.lastName && formik.touched.lastName
                        }
                      >
                        <Input
                          variant="filled"
                          h={["40px", "50px"]}
                          rounded="8px"
                          color="dark"
                          fontSize={["14px", "16px"]}
                          p={["20px", "24px"]}
                          type="text"
                          id="lastName"
                          name="lastName"
                          placeholder="Last Name"
                          value={formik.values.lastName}
                          onChange={(e) => {
                            formik.handleChange(e);
                            handleContactDataChange({
                              lastName: e.target.value,
                            });
                          }}
                          onBlur={handleBlur}
                        />
                        <FormErrorMessage fontSize={["14px", "16px"]}>
                          {formik.errors.lastName}
                        </FormErrorMessage>
                      </FormControl>

                      <FormControl
                        id="
          email"
                        isRequired
                        isInvalid={formik.errors.email && formik.touched.email}
                      >
                        <Input
                          variant="filled"
                          h={["40px", "50px"]}
                          rounded="8px"
                          color="dark"
                          fontSize={["14px", "16px"]}
                          p={["20px", "24px"]}
                          type="email"
                          id="email"
                          name="email"
                          placeholder="Email Address"
                          value={formik.values.email}
                          onChange={(e) => {
                            formik.handleChange(e);
                            handleContactDataChange({
                              email: e.target.value,
                            });
                          }}
                          onBlur={handleBlur}
                        />
                        <FormErrorMessage fontSize={["14px", "16px"]}>
                          {formik.errors.email}
                        </FormErrorMessage>
                      </FormControl>

                      <Flex
                        w="100%"
                        justify="flex-start"
                        align="flex-start"
                        gap="10px"
                      >
                        <FormControl
                          w="120px"
                          isRequired
                          isInvalid={
                            formik.errors.countryCode &&
                            formik.touched.countryCode
                          }
                        >
                          <Select
                            variant="filled"
                            h={["40px", "50px"]}
                            color="dark"
                            textAlign="center"
                            fontSize="16px"
                            id="countryCode" // Needed for formik validation
                            name="countryCode" // Bind this to formik
                            value={formik.values.countryCode} // Use formik values
                            onChange={(e) => {
                              formik.handleChange(e);
                              handleContactDataChange({
                                countryCode: e.target.value,
                              });
                            }} // Formik change handler
                            onBlur={handleBlur} // Formik blur handler
                            border="none"
                            outline="none"
                          >
                            {countryCodes.map((code) => (
                              <option key={code.code} value={code.code}>
                                {code.code}
                              </option>
                            ))}
                          </Select>
                        </FormControl>
                        <FormControl
                          isRequired
                          isInvalid={
                            formik.errors.phone && formik.touched.phone
                          }
                        >
                          <Input
                            variant="filled"
                            h={["40px", "50px"]}
                            type="tel"
                            color="dark"
                            id="phone"
                            name="phone"
                            placeholder="Phone number"
                            value={formik.values.phone} // Bind to formik values
                            onChange={(e) => {
                              formik.handleChange(e);
                              handleContactDataChange({
                                phone: e.target.value,
                              });
                            }} // Formik change handler
                            onBlur={handleBlur} // Formik blur handler
                          />
                          <FormErrorMessage fontSize={["14px", "16px"]}>
                            {formik.errors.phone}
                          </FormErrorMessage>
                        </FormControl>
                      </Flex>
                    </VStack>
                  </VStack>
                </VStack>
              </Box>
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
                Order Summary
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
                  <Heading
                    color="dark"
                    textAlign="center"
                    fontSize="20px"
                    lineHeight="28px"
                  >
                    {event.name} Merch
                  </Heading>

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
                      <Flex w="100%" justify="space-between" align="flex-start">
                        <Text color="dark" fontSize="16px" lineHeight="24px">
                          Subtotal
                        </Text>
                        <Heading color="dark" fontSize="16px" lineHeight="24px">
                          ₦ {total.toLocaleString()}
                        </Heading>
                      </Flex>

                      <Flex w="100%" justify="space-between" align="flex-start">
                        <Text color="dark" fontSize="16px" lineHeight="24px">
                          Fees
                        </Text>
                        <Heading color="dark" fontSize="16px" lineHeight="24px">
                          Free 🎉
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

                    <Button
                      type="submit"
                      w="100%"
                      bg="primary.500"
                      rounded="8px"
                      _hover={{ bg: "primary.400" }}
                      _active={{ bg: "secondary.500" }}
                      _focus={{ bg: "secondary.500" }}
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
                        Checkout
                      </Text>
                    </Button>
                  </VStack>
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
                  type="submit"
                  w="122px"
                  rounded="8px"
                  bg="secondary.500"
                  _hover={{ bg: "primary.400" }}
                  _active={{ bg: "secondary.500" }}
                  _focus={{ bg: "secondary.500" }}
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
                    Checkout
                  </Text>
                </Button>
              </Flex>
            </Box>
          </Stack>
        ) : (
          <VStack w="100%" h="60vh" justify="center" align="center">
            <Text color="neutral.500" fontSize={["16px", "18px", "20px"]}>
              There are no items in your cart.
            </Text>
            <Link to={`/${event.id}/merch`}>
              <Button bg="primary.500">
                <Text fontSize={["14px", "16px"]}>Continue Shopping</Text>
              </Button>
            </Link>
          </VStack>
        )}
      </VStack>
    </>
  );
};

export default CheckoutForm;
