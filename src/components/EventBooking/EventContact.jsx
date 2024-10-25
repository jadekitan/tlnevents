import React, { useState, useEffect, useContext } from "react";
import {
  VStack,
  Box,
  Heading,
  FormControl,
  Input,
  FormErrorMessage,
  Select,
  Flex,
  Text,
  Switch,
  Button,
  FormLabel,
  Checkbox,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useFormik } from "formik";
import { multiBookingContext } from "./BookingContext";

const EventContact = ({ handleNextStep, formRef }) => {
  const {
    LeftArrow,
    currentStep,
    setStep,
    contactData,
    setContactData,
    setCountryCode,
    setIsDisable,
    setIsSubmitting,
    ticketType,
    ticketCounts,
    assignMultiple,
    setAssignMultiple,
  } = useContext(multiBookingContext);

  // List of country codes
  const countryCodes = [
    { code: "+234", country: "Nigeria", minLength: 10, maxLength: 11 },
    { code: "+1", country: "USA", minLength: 10, maxLength: 10 },
    { code: "+44", country: "UK", minLength: 10, maxLength: 11 },

    { code: "+91", country: "India", minLength: 10, maxLength: 10 },
  ];

  // Function to fetch country code based on IP
  const fetchCountryCode = async () => {
    try {
      const response = await axios.get("https://ipapi.co/json/"); // Using an IP lookup service
      const userCountryCode = response.data.country_calling_code;
      setCountryCode(userCountryCode); // Automatically set country code
    } catch (error) {
      console.error("Error fetching IP data:", error);
    }
  };

  // Automatically fetch country code when the component loads
  useEffect(() => {
    fetchCountryCode();
  }, []);

  // Validation for phone number based on selected country code
  const validatePhoneNumber = (value, countryCode) => {
    const country = countryCodes.find((c) => c.code === countryCode);
    const phoneLength = value.replace(/\D/g, "").length; // Remove non-numeric characters
    if (!country) return false;
    return phoneLength >= country.minLength && phoneLength <= country.maxLength;
  };

  const initialValues = { ...contactData };

  // Handle Checkbox Change Function
  const handleCheckboxChange = (e, ticketId, i) => {
    const isChecked = e.target.checked;

    // Logic to copy values from the previous attendee (if any)
    if (isChecked) {
      // Get the previous attendee values (i - 1)
      const ticketQuantity = ticketCounts[ticketId];
      const prevAttendeeValues =
        formik.values.attendeeAddresses[ticketQuantity - 1]?.[i - 1];
      console.log(ticketCounts);
      console.log(i);

      // Check if previous attendee values exist and are valid
      if (
        prevAttendeeValues &&
        prevAttendeeValues.firstName &&
        prevAttendeeValues.lastName &&
        prevAttendeeValues.email
      ) {
        // Copy the values if they exist
        formik.setFieldValue(
          `attendeeAddresses[${ticketId - 1}][${i}].firstName`,
          prevAttendeeValues.firstName
        );
        formik.setFieldValue(
          `attendeeAddresses[${ticketId - 1}][${i}].lastName`,
          prevAttendeeValues.lastName
        );
        formik.setFieldValue(
          `attendeeAddresses[${ticketId - 1}][${i}].email`,
          prevAttendeeValues.email
        );

        // Display success toast
        toast({
          title: "Values copied.",
          description:
            "Attendee information has been copied from the previous attendee.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Display error toast if the previous form is empty
        toast({
          title: "Error.",
          description:
            "No values found in the previous attendee's form to copy.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true, // To update countryCode automatically when fetched
    validate: (values) => {
      const errors = {};

      // Validate name
      if (!values.firstName) {
        errors.firstName = "First name is required";
      }
      if (!values.lastName) {
        errors.lastName = "Last name is required";
      }

      // Validate email
      if (!values.email) {
        if (!values.email) {
          errors.email = "Email is required";
        } else if (
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
        ) {
          errors.email = "Invalid email address";
        }
      }

      // Validate phone number based on the selected country code
      const country = countryCodes.find((c) => c.code === values.countryCode);
      if (!values.phone) {
        errors.phone = "Phone number is required";
      } else if (!country) {
        errors.phone = "Invalid country code";
      } else {
        const phoneLength = values.phone.replace(/\D/g, "").length; // Remove non-numeric characters
        if (
          phoneLength < country.minLength ||
          phoneLength > country.maxLength
        ) {
          errors.phone = `Phone number must be between ${country.minLength} and ${country.maxLength} digits`;
        }
      }

      if (assignMultiple) {
        // Validate attendee form for each ticket type
        Object.keys(values.attendeeAddresses).forEach((ticketId) => {
          const attendees = values.attendeeAddresses[ticketId] || [];

          attendees.forEach((attendee, index) => {
            if (!attendee.firstName) {
              errors.attendeeAddresses = errors.attendeeAddresses || {};
              errors.attendeeAddresses[ticketId] =
                errors.attendeeAddresses[ticketId] || [];
              errors.attendeeAddresses[ticketId][index] =
                errors.attendeeAddresses[ticketId][index] || {};
              errors.attendeeAddresses[ticketId][index].firstName =
                "First Name is required";
            }

            if (!attendee.email) {
              errors.attendeeAddresses[ticketId][index] =
                errors.attendeeAddresses[ticketId][index] || {};
              errors.attendeeAddresses[ticketId][index].email =
                "Email is required";
            }
          });
        });
      }

      return errors;
    },
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      const response = await fetch(
        "https://tlnevents.com/server/contacts.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );
      setIsSubmitting(true);
      setIsDisable(true);
      setContactData(values);
      handleNextStep(); // Advance to the next step if everything is valid
    },
  });

  formRef.current = formik;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setContactData({
      ...contactData,
      [name]: val,
    });
    formik.handleChange(e);
  };

  // Inside your component:
  const toast = useToast();

  return (
    <VStack
      as="form"
      w="100%"
      align="flex-start"
      spacing={["20px", "40px"]}
      onSubmit={formik.handleSubmit}
    >
      <Flex justify="flex-start" align="center" gap={["10px", "20px"]}>
        <Box
          as="button"
          p="3px"
          bg="primary.500"
          rounded="6px"
          onClick={() => {
            if (currentStep === 1) {
              console.log("Back to event page");
            }
            if (currentStep > 1) {
              setStep(currentStep - 1);
            }
          }}
        >
          <LeftArrow />
        </Box>
        <Heading color="dark" fontSize={["18px", "22px"]} lineHeight="28px">
          Contact Information
        </Heading>
      </Flex>
      <VStack
        w="100%"
        justify="flex-start"
        align="flex-start"
        spacing={["20px", "40px"]}
      >
        <FormControl
          id="
        firstName"
          isRequired
          isInvalid={formik.errors.firstName && formik.touched.firstName}
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
            onChange={handleChange}
            onBlur={formik.handleBlur}
          />
          <FormErrorMessage fontSize={["14px", "16px"]}>
            {formik.errors.firstName}
          </FormErrorMessage>
        </FormControl>
        <FormControl
          id="
        lastName"
          isRequired
          isInvalid={formik.errors.lastName && formik.touched.lastName}
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
            onChange={handleChange}
            onBlur={formik.handleBlur}
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
            onChange={handleChange}
            onBlur={formik.handleBlur}
          />
          <FormErrorMessage fontSize={["14px", "16px"]}>
            {formik.errors.email}
          </FormErrorMessage>
        </FormControl>

        <Flex w="100%" justify="flex-start" align="flex-start" gap="10px">
          <FormControl
            w="120px"
            isRequired
            isInvalid={formik.errors.countryCode && formik.touched.countryCode}
          >
            <Select
              variant="filled"
              h={["40px", "50px"]}
              bg="rgba(210, 190, 249, 0.10)"
              color="dark"
              textAlign="center"
              fontSize="16px"
              id="countryCode" // Needed for formik validation
              name="countryCode" // Bind this to formik
              value={formik.values.countryCode} // Use formik values
              onChange={handleChange} // Formik change handler
              onBlur={formik.handleBlur} // Formik blur handler
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
            isInvalid={formik.errors.phone && formik.touched.phone}
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
              onChange={handleChange} // Formik change handler
              onBlur={formik.handleBlur} // Formik blur handler
            />
            <FormErrorMessage fontSize={["14px", "16px"]}>
              {formik.errors.phone}
            </FormErrorMessage>
          </FormControl>
        </Flex>
      </VStack>
      {Object.values(ticketCounts).reduce((total, count) => total + count, 0) >
        1 && (
        <VStack
          justify="flex-start"
          align="flex-start"
          spacing={["10px", "20px"]}
        >
          <Heading color="dark" fontSize={["16px", "20px"]} lineHeight="28px">
            Assign tickets to multiple attendees?
          </Heading>
          <Flex justify="flex-start" align="center" gap="10px">
            <Text color="dark" fontSize="14px">
              No
            </Text>
            <FormControl>
              <Switch
                size="lg"
                id="multiple-attendees"
                isChecked={assignMultiple}
                onChange={(e) => setAssignMultiple(e.target.checked)}
                sx={{
                  ".chakra-switch__track": {
                    backgroundColor: "neutral.500", // unselected state track color
                  },
                  ".chakra-switch__thumb": {
                    backgroundColor: "dark", // unselected state thumb color
                  },
                  "&[data-checked] .chakra-switch__track": {
                    backgroundColor: "neutral.500", // selected state track color
                  },
                  "&[data-checked] .chakra-switch__thumb": {
                    backgroundColor: "primary.500", // selected state thumb color
                  },
                }}
              />
            </FormControl>
            <Text color="dark" fontSize="14px">
              Yes
            </Text>
          </Flex>
        </VStack>
      )}
      {/* Additional Address Form */}
      // Your existing JSX structure
      {assignMultiple && (
        <VStack w="100%" align="flex-start" spacing="40px">
          {Object.keys(ticketCounts).map((ticketId) => {
            const ticketQuantity = ticketCounts[ticketId];

            // Ensure the ticket quantity is valid
            if (!ticketQuantity || ticketQuantity <= 0) return null;

            return Array.from({ length: ticketQuantity }).map((_, i) => (
              <Box w="100%" key={`${ticketType.id}-${i}`}>
                <VStack w="100%" align="flex-start" spacing="20px">
                  <FormLabel htmlFor={`attendee-${ticketId}-${i}`}>
                    <Text color="dark" fontSize="16px">
                      Ticket {i + 1} -{" "}
                      {ticketType[ticketId - 1]?.name || "Unknown"}
                    </Text>
                  </FormLabel>

                  {/* Form Inputs */}
                  <FormControl
                    isInvalid={
                      formik.errors.attendeeAddresses?.[ticketId - 1]?.[i]
                        ?.firstName
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
                      id={`attendee-firstname-${ticketId - 1}-${i}`}
                      name={`attendeeAddresses[${
                        ticketId - 1
                      }][${i}].firstName`}
                      onChange={formik.handleChange}
                      placeholder={`First Name (${
                        ticketType[ticketId - 1]?.name || "Unknown"
                      })`}
                      value={
                        formik.values.attendeeAddresses?.[ticketId - 1]?.[i]
                          ?.firstName || ""
                      }
                    />
                    <FormErrorMessage fontSize={["14px", "16px"]}>
                      {
                        formik.errors.attendeeAddresses?.[ticketId - 1]?.[i]
                          ?.firstName
                      }
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl>
                    <Input
                      variant="filled"
                      h={["40px", "50px"]}
                      rounded="8px"
                      color="dark"
                      fontSize={["14px", "16px"]}
                      p={["20px", "24px"]}
                      type="text"
                      id={`attendee-lastname-${ticketId - 1}-${i}`}
                      name={`attendeeAddresses[${ticketId - 1}][${i}].lastName`}
                      onChange={formik.handleChange}
                      placeholder={`Last Name (${
                        ticketType[ticketId - 1]?.name || "Unknown"
                      })`}
                      value={
                        formik.values.attendeeAddresses?.[ticketId - 1]?.[i]
                          ?.lastName || ""
                      }
                    />
                  </FormControl>

                  <FormControl
                    isInvalid={
                      formik.errors.attendeeAddresses?.[ticketId - 1]?.[i]
                        ?.email
                    }
                  >
                    <Input
                      variant="filled"
                      h={["40px", "50px"]}
                      rounded="8px"
                      color="dark"
                      fontSize={["14px", "16px"]}
                      p={["20px", "24px"]}
                      type="email"
                      id={`attendee-email-${ticketId - 1}-${i}`}
                      name={`attendeeAddresses[${ticketId - 1}][${i}].email`}
                      onChange={formik.handleChange}
                      placeholder={`Email Address (${
                        ticketType[ticketId - 1]?.name || "Unknown"
                      })`}
                      value={
                        formik.values.attendeeAddresses?.[ticketId - 1]?.[i]
                          ?.email || ""
                      }
                    />
                    <FormErrorMessage fontSize={["14px", "16px"]}>
                      {
                        formik.errors.attendeeAddresses?.[ticketId - 1]?.[i]
                          ?.email
                      }
                    </FormErrorMessage>
                  </FormControl>

                  {/* Checkbox */}
                  {ticketQuantity !== 1 && (
                    <Checkbox
                      colorScheme="green"
                      onChange={(e) => handleCheckboxChange(e, ticketId, i)}
                    >
                      Copy from previous attendee
                    </Checkbox>
                  )}
                </VStack>
              </Box>
            ));
          })}
        </VStack>
      )}
      {/* Hidden submit button to trigger form submit */}
      <Button type="submit" style={{ display: "none" }}>
        Submit
      </Button>
    </VStack>
  );
};

export default EventContact;
