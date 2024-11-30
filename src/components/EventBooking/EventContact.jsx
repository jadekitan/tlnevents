import React, { useEffect, useContext, useCallback } from "react";
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
  useDisclosure,
  AlertDialog,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import axios from "axios";
import { useFormik } from "formik";
import { multiBookingContext } from "./BookingContext";
import { debounce } from "lodash";
import { contacts } from "../../../server/contacts";

const EventContact = ({ handleNextStep, formRef }) => {
  const {
    LeftArrow,
    currentStep,
    setStep,
    contactData,
    setContactData,
    handleContactDataChange,
    handleBlur,
    saveToLocalStorage,
    setCountryCode,
    setIsDisable,
    setIsSubmitting,
    ticketType,
    ticketCounts,
    assignMultiple,
    setAssignMultiple,
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

  const handleArrow = () => {
    const hasSelectedTickets = ticketType.some(
      (ticket) => ticketCounts[ticket.id] > 0
    );

    if (currentStep === 3) {
      if (hasSelectedTickets) {
        onOpen();
      } else {
        setStep(currentStep - 1);
        clearData();
      }
    } else {
      onOpen();
    }
  };

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

  const debouncedValidate = useCallback(
    debounce((values) => {
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
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
      ) {
        errors.email = "Invalid email address";
      }
      if (!values.phone?.trim()) {
        errors.phone = "Phone number is required";
      } else if (!validatePhoneNumber(values.phone, values.countryCode)) {
        errors.phone = "Invalid phone number";
      }

      // Only validate attendeeAddresses if assignMultiple is true
      if (assignMultiple) {
        const attendeeErrors = {};
        let hasAttendeeErrors = false;

        // Iterate through all ticket types
        Object.keys(ticketCounts).forEach((ticketId) => {
          const ticketQuantity = ticketCounts[ticketId];
          if (ticketQuantity > 0) {
            const ticketErrors = [];

            // Validate each attendee for this ticket type
            for (let i = 0; i < ticketQuantity; i++) {
              const attendee = values.attendeeAddresses?.[ticketId]?.[i] || {};
              const attendeeError = {};

              if (!attendee.firstName?.trim()) {
                attendeeError.firstName = "First name is required";
                hasAttendeeErrors = true;
              }
              if (!attendee.email?.trim()) {
                attendeeError.email = "Email is required";
                hasAttendeeErrors = true;
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(attendee.email)
              ) {
                attendeeError.email = "Invalid email address";
                hasAttendeeErrors = true;
              }

              if (Object.keys(attendeeError).length > 0) {
                ticketErrors[i] = attendeeError;
              }
            }

            if (ticketErrors.length > 0) {
              attendeeErrors[ticketId] = ticketErrors;
            }
          }
        });

        if (hasAttendeeErrors) {
          errors.attendeeAddresses = attendeeErrors;
        }
      }

      return errors;
    }, 300)
  );

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

    // Only validate attendeeAddresses if assignMultiple is true
    if (assignMultiple) {
      const attendeeErrors = {};
      let hasAttendeeErrors = false;

      // Iterate through all ticket types
      Object.keys(ticketCounts).forEach((ticketId) => {
        const ticketQuantity = ticketCounts[ticketId];
        if (ticketQuantity > 0) {
          const ticketErrors = [];

          // Validate each attendee for this ticket type
          for (let i = 0; i < ticketQuantity; i++) {
            const attendee = values.attendeeAddresses?.[ticketId]?.[i] || {};
            const attendeeError = {};

            if (!attendee.firstName?.trim()) {
              attendeeError.firstName = "First name is required";
              hasAttendeeErrors = true;
            }
            if (!attendee.email?.trim()) {
              attendeeError.email = "Email is required";
              hasAttendeeErrors = true;
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(attendee.email)
            ) {
              attendeeError.email = "Invalid email address";
              hasAttendeeErrors = true;
            }

            if (Object.keys(attendeeError).length > 0) {
              ticketErrors[i] = attendeeError;
            }
          }

          if (ticketErrors.length > 0) {
            attendeeErrors[ticketId] = ticketErrors;
          }
        }
      });

      if (hasAttendeeErrors) {
        errors.attendeeAddresses = attendeeErrors;
      }
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
      setIsSubmitting(true);
      setSubmitting(true);
      setIsDisable(true);
      try {
        // Flatten all attendee addresses
        const allAttendees = Object.values(contactData.attendeeAddresses || {}).flat();

        // Validate inputs
        const errors = validate(values);
        if (Object.keys(errors).length > 0) {
          formik.setErrors(errors);
          setIsSubmitting(false);
          setSubmitting(false);
          setIsDisable(false);
          return;
        }

        contacts(
          contactData.firstName,
          contactData.lastName,
          contactData.email,
          contactData.phone,
          allAttendees,
          "Ticket"
        );
      } catch (error) { }
      handleNextStep(); // Advance to the next step if everything is valid
    },
  });

  formRef.current = formik;

  const handleAttendeeDataChange = useCallback(
    (ticketId, index, field, value) => {
      formik.setFieldValue(
        `attendeeAddresses[${ticketId}][${index}].${field}`,
        value
      );

      // Batch state updates for attendee data
      requestAnimationFrame(() => {
        setContactData((prevData) => {
          const updatedAddresses = { ...prevData.attendeeAddresses };
          if (!updatedAddresses[ticketId]) {
            updatedAddresses[ticketId] = [];
          }
          if (!updatedAddresses[ticketId][index]) {
            updatedAddresses[ticketId][index] = {
              firstName: "",
              lastName: "",
              email: "",
            };
          }
          updatedAddresses[ticketId][index] = {
            ...updatedAddresses[ticketId][index],
            [field]: value,
          };
          const newData = { ...prevData, attendeeAddresses: updatedAddresses };
          saveToLocalStorage(newData);
          return newData;
        });
      });
    },
    [setContactData, saveToLocalStorage]
  );

  const handleAttendeeChange = (ticketId, index, field, value) => {
    // Update Formik field value
    formik.setFieldValue(
      `attendeeAddresses[${ticketId}][${index}].${field}`,
      value
    );

    // Update local contactData for tracking and saving purposes
    handleContactDataChange((prevData) => {
      // Clone the current attendeeAddresses or initialize if absent
      const updatedAddresses = { ...prevData.attendeeAddresses };

      // Initialize ticket array if it doesn't exist
      if (!updatedAddresses[ticketId]) {
        updatedAddresses[ticketId] = [];
      }

      // Initialize the specific attendee entry if it doesn't exist
      if (!updatedAddresses[ticketId][index]) {
        updatedAddresses[ticketId][index] = {
          firstName: "",
          lastName: "",
          email: "",
        };
      }

      // Update only the specified field for the current attendee
      updatedAddresses[ticketId][index] = {
        ...updatedAddresses[ticketId][index],
        [field]: value,
      };

      // Return the new state with updated attendee addresses
      return { ...prevData, attendeeAddresses: updatedAddresses };
    });
  };

  // Copy from previous attendee
  const handleCopyFromPrevious = useCallback(
    (ticketId, currentIndex) => {
      if (currentIndex > 0) {
        const previousAttendee =
          contactData.attendeeAddresses[ticketId][currentIndex - 1];
        handleAttendeeChange(
          ticketId,
          currentIndex,
          "firstName",
          previousAttendee.firstName
        );
        handleAttendeeChange(
          ticketId,
          currentIndex,
          "lastName",
          previousAttendee.lastName
        );
        handleAttendeeChange(
          ticketId,
          currentIndex,
          "email",
          previousAttendee.email
        );
      }
    },
    [contactData.attendeeAddresses, handleAttendeeChange]
  );

  // Inside your component:
  const toast = useToast();

  // Handle Checkbox Change Function
  const handleCheckboxChange = (e, ticketId, i) => {
    const isChecked = e.target.checked;

    // Only proceed if the checkbox is checked and the current index `i` is not the first attendee
    if (isChecked && i > 0) {
      // Get the previous attendee values (i - 1)
      const prevAttendeeValues =
        formik.values.attendeeAddresses[ticketId]?.[i - 1];

      // Check if previous attendee values exist and are valid
      if (
        prevAttendeeValues &&
        prevAttendeeValues.firstName &&
        prevAttendeeValues.lastName &&
        prevAttendeeValues.email
      ) {
        // Copy the values if they exist
        formik.setFieldValue(
          `attendeeAddresses[${ticketId}][${i}].firstName`,
          prevAttendeeValues.firstName
        );
        formik.setFieldValue(
          `attendeeAddresses[${ticketId}][${i}].lastName`,
          prevAttendeeValues.lastName
        );
        formik.setFieldValue(
          `attendeeAddresses[${ticketId}][${i}].email`,
          prevAttendeeValues.email
        );

        // Display success toast
        toast({
          position: "top",
          title: "Values copied.",
          description:
            "Attendee information has been copied from the previous attendee.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Display error toast if the previous form is empty or invalid
        toast({
          position: "top",
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
          type="button"
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
                  type="button"
                  width="50%"
                  bg="primary.500"
                  color="dark"
                  ml={3}
                  onClick={() => {
                    setStep(currentStep - 2);
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
            onChange={(e) => {
              formik.handleChange(e);
              handleContactDataChange({ firstName: e.target.value });
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
            onChange={(e) => {
              formik.handleChange(e);
              handleContactDataChange({ lastName: e.target.value });
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
              handleContactDataChange({ email: e.target.value });
            }}
            onBlur={handleBlur}
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
              color="dark"
              textAlign="center"
              fontSize="16px"
              id="countryCode" // Needed for formik validation
              name="countryCode" // Bind this to formik
              value={formik.values.countryCode} // Use formik values
              onChange={(e) => {
                formik.handleChange(e);
                handleContactDataChange({ countryCode: e.target.value });
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
              onChange={(e) => {
                formik.handleChange(e);
                handleContactDataChange({ phone: e.target.value });
              }} // Formik change handler
              onBlur={handleBlur} // Formik blur handler
            />
            <FormErrorMessage fontSize={["14px", "16px"]}>
              {formik.errors.phone}
            </FormErrorMessage>
          </FormControl>
        </Flex>
      </VStack>
      {Object.values(ticketCounts).reduce((total, count) => total + count, 0) >=
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

      {assignMultiple && (
        <VStack w="100%" align="flex-start" spacing="40px">
          {Object.keys(ticketCounts).map((ticketId) => {
            const ticketQuantity = ticketCounts[ticketId];

            if (!ticketQuantity || ticketQuantity <= 0) return null;

            return Array.from({ length: ticketQuantity }).map((_, i) => (
              <Box w="100%" key={`${ticketId}-${i}`}>
                <VStack w="100%" align="flex-start" spacing="20px">
                  <FormLabel htmlFor={`attendee-${ticketId}-${i}`}>
                    <Text color="dark" fontSize="16px">
                      Ticket {i + 1} -{" "}
                      {ticketType[ticketId - 1]?.name || "Unknown"}
                    </Text>
                  </FormLabel>

                  <FormControl
                    isInvalid={
                      formik.errors.attendeeAddresses?.[ticketId]?.[i]
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
                      id={`attendee-firstname-${ticketId}-${i}`}
                      name={`attendeeAddresses[${ticketId}][${i}].firstName`}
                      placeholder={`First Name (${ticketType[ticketId - 1]?.name || "Unknown"
                        })`}
                      value={
                        formik.values.attendeeAddresses?.[ticketId]?.[i]
                          ?.firstName || ""
                      }
                      onChange={(e) =>
                        handleAttendeeDataChange(
                          ticketId,
                          i,
                          "firstName",
                          e.target.value
                        )
                      }
                      onBlur={handleBlur}
                    />
                    <FormErrorMessage fontSize={["14px", "16px"]}>
                      {
                        formik.errors.attendeeAddresses?.[ticketId]?.[i]
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
                      id={`attendee-lastname-${ticketId}-${i}`}
                      name={`attendeeAddresses[${ticketId}][${i}].lastName`}
                      placeholder={`Last Name (${ticketType[ticketId - 1]?.name || "Unknown"
                        })`}
                      value={
                        formik.values.attendeeAddresses?.[ticketId]?.[i]
                          ?.lastName || ""
                      }
                      onChange={(e) =>
                        handleAttendeeDataChange(
                          ticketId,
                          i,
                          "lastName",
                          e.target.value
                        )
                      }
                      onBlur={handleBlur}
                    />
                  </FormControl>

                  <FormControl
                    isInvalid={
                      formik.errors.attendeeAddresses?.[ticketId]?.[i]?.email
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
                      id={`attendee-email-${ticketId}-${i}`}
                      name={`attendeeAddresses[${ticketId}][${i}].email`}
                      placeholder={`Email Address (${ticketType[ticketId - 1]?.name || "Unknown"
                        })`}
                      value={
                        formik.values.attendeeAddresses?.[ticketId]?.[i]
                          ?.email || ""
                      }
                      onChange={(e) =>
                        handleAttendeeDataChange(
                          ticketId,
                          i,
                          "email",
                          e.target.value
                        )
                      }
                      onBlur={handleBlur}
                    />
                    <FormErrorMessage fontSize={["14px", "16px"]}>
                      {formik.errors.attendeeAddresses?.[ticketId]?.[i]?.email}
                    </FormErrorMessage>
                  </FormControl>

                  {i > 0 && (
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
