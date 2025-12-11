import React, { useState, useEffect } from "react";
import {
  HStack,
  Stack,
  Grid,
  GridItem,
  Box,
  Image,
  VStack,
  Heading,
  Text,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Select,
  Button,
  useToast,
  Link,
} from "@chakra-ui/react";
import axios from "axios";
import { baseURL } from "../../../server/base";

const Page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    percentage: 10,
    eventName: selectedEvent,
  });

  const API_BASE_URL = baseURL;

  const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 100000,
  });

  const registerUser = async (userData) => {
    try {
      const apiRequestData = {
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        phoneNumber: userData.phone,
        percentage: 10,
        eventName: selectedEvent,
      };

      const response = await apiClient.post("/affiliates", apiRequestData);
      if (response.data && response.data.data?.accessToken) {
        localStorage.setItem("token", response.data.data?.accessToken);
      }
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        throw new Error(errorMessage);
      }
      throw error;
    }
  };

  const [formErrors, setFormErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  const validateForm = (values) => {
    const errors = {};

    if (!values.firstName) {
      errors.firstName = "First name is required";
    } else if (values.firstName.length < 2) {
      errors.firstName = "First name must be at least 2 characters";
    }

    if (!values.lastName) {
      errors.lastName = "Last name is required";
    } else if (values.lastName.length < 2) {
      errors.lastName = "Last name must be at least 2 characters";
    }

    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = "Invalid email address";
    }

    if (!values.phone) {
      errors.phone = "Phone number is required";
    }

    // Add event validation
    if (!selectedEvent) {
      errors.eventName = "Please select an event";
    }

    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (touchedFields[name]) {
      const errors = validateForm({ ...formValues, [name]: value });
      setFormErrors((prev) => ({
        ...prev,
        [name]: errors[name],
      }));
    }
  };

  const handleInputBlur = (e) => {
    const { name } = e.target;
    setTouchedFields((prev) => ({
      ...prev,
      [name]: true,
    }));

    const errors = validateForm(formValues);
    setFormErrors((prev) => ({
      ...prev,
      [name]: errors[name],
    }));
  };

  const handleEventChange = (event) => {
    const value = event.target.value;
    setSelectedEvent(value);
    setFormValues(prev => ({
      ...prev,
      eventName: value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const allTouched = Object.keys(formValues).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouchedFields(allTouched);

    const errors = validateForm(formValues);
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);
      try {
        const response = await registerUser(formValues);

        toast({
          position: 'top',
          title: "Affiliate Created.",
          description:
            response.message || "We've created your affiliate link for you.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        // FIXED: Use formValues instead of undefined userData
        window.location.href = `/affiliate/dashboard?email=${formValues.email}&eventName=${selectedEvent}`;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";

        toast({
          position: 'top',
          title: "An error occurred.",
          description: errorMessage || "Unable to generate your link.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        console.error("Error submitting form:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/orders/events`);
      const data = await response.json();

      if (data.status === 200) {
        setEvents(data.data || []);
      } else {
        setError(data.message || "Failed to fetch events");
      }
    } catch (err) {
      setError("Failed to fetch events. Please try again.");
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  const floatingLabelStyles = {
    position: "absolute",
    bg: "white",
    color: "gray.500",
    px: "0.5",
    top: "-3",
    left: "2",
    fontWeight: "normal",
    pointerEvents: "none",
    transition: "all 0.2s",
    transformOrigin: "left top",
    _peerPlaceholderShown: {
      color: "gray.500",
      top: "2.5",
      left: "3",
      transform: "scale(1)",
    },
    _peerFocus: {
      color: "dark",
      top: "-5",
      left: "2",
      transform: "scale(0.85)",
    },
  };

  return (
    <Stack
      w="100%"
      h="100vh"
      direction={["column", "column", "row"]}
      justify="space-between"
      align="center"
      bg="white"
      p="20px"
    >
      <Box display={["none", "none", "block"]} width="50%" h="100%">
        <Grid templateColumns={["1fr"]} gap={4} mb="20px">
          <GridItem colSpan={1} position="relative" height={["200px", "30vh"]}>
            <Box
              as="article"
              height="100%"
              overflow="hidden"
              borderRadius="12px"
            >
              <Image
                src="https://tlnevents.com/assets/events-banner/sounds-of-music.webp"
                alt="Podcast Studio"
                bg="linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%)"
                objectFit="cover"
                width="100%"
                height="100%"
                transition="transform 0.3s ease"
                _hover={{ transform: "scale(1.05)" }}
              />
            </Box>
          </GridItem>
        </Grid>

        <Grid templateColumns={["1fr", "repeat(2, 1fr)"]} gap="20px" mb="20px">
          <GridItem position="relative" height={["200px", "30vh"]}>
            <Box as="article" height="100%" overflow="hidden" borderRadius="md">
              <Image
                src="https://tlnevents.com/assets/events-banner/fuji.webp"
                alt="Photo Studio"
                bg="linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%)"
                objectFit="cover"
                width="100%"
                height="100%"
                transition="transform 0.3s ease"
                _hover={{ transform: "scale(1.05)" }}
              />
            </Box>
          </GridItem>

          <GridItem position="relative" height={["200px", "30vh"]}>
            <Box as="article" height="100%" overflow="hidden" borderRadius="md">
              <Image
                src="https://tlnevents.com/assets/events-banner/ikoyi-block-party.webp"
                alt="Game Room"
                bg="linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%)"
                objectFit="cover"
                width="100%"
                height="100%"
                transition="transform 0.3s ease"
                _hover={{ transform: "scale(1.05)" }}
              />
            </Box>
          </GridItem>
        </Grid>
        <Grid templateColumns={["1fr"]} gap={4} mb={4}>
          <GridItem colSpan={1} position="relative" height={["200px", "30vh"]}>
            <Box
              as="article"
              height="100%"
              overflow="hidden"
              borderRadius="12px"
            >
              <Image
                src="https://tlnevents.com/assets/events-banner/silent-disco-3.webp"
                alt="Photo Studio"
                bg="linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%)"
                objectFit="cover"
                width="100%"
                height="100%"
                transition="transform 0.3s ease"
                _hover={{ transform: "scale(1.05)" }}
              />
            </Box>
          </GridItem>
        </Grid>
      </Box>
      <VStack
        position="relative"
        w={["100%", "100%", "50%"]}
        h="100%"
        justify={["space-between", "space-between", "flex-end"]}
        align="center"
      >
        <Box
          position={{ md: "absolute" }}
          top={{ md: "10px" }}
          left={{ md: "40%" }}
        >
          <Image
            w={["80px", "130px"]}
            h={["40px", "56px"]}
            src="/logo.webp"
            alt="The Lemonade Network Logo"
            objectFit="contain"
          />
        </Box>
        <VStack
          w={["100%", "100%", "80%"]}
          h="100%"
          justify="center"
          align="center"
        >
          <VStack
            w="100%"
            h="100%"
            justify={["center", "center", "flex-end"]}
            align="center"
            gap={["26px", "26px", "40px"]}
          >
            <VStack justify="center" align="center" gap={["4px", "10px"]}>
              <Heading color="primary.500" fontSize={["22px", "26px"]}>
                Create an Affilate Link
              </Heading>
              <Text color="neutral.500" fontSize={["12px", "16px"]}>
                Join The Lemonade Network
              </Text>
            </VStack>

            <form style={{ width: "100%" }} onSubmit={handleFormSubmit}>
              <VStack w="100%" align="flex-start" gap="25px">
                <HStack w="100%" justify="space-between" align="flex-start">
                  <FormControl
                    isInvalid={
                      !!formErrors.firstName && touchedFields.firstName
                    }
                    isRequired
                  >
                    <Box pos="relative" w="full">
                      <Input
                        type="text"
                        className="peer"
                        variant="outline"
                        rounded="8px"
                        borderWidth="1px"
                        borderColor={
                          formErrors.firstName && touchedFields.firstName
                            ? "red.500"
                            : "gray.500"
                        }
                        p="10px"
                        color="dark"
                        fontSize={["12px", "14px"]}
                        placeholder=""
                        name="firstName"
                        value={formValues.firstName}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                      />
                      <FormLabel
                        sx={floatingLabelStyles}
                        fontSize={["12px", "14px"]}
                      >
                        First Name
                      </FormLabel>
                    </Box>
                    <FormErrorMessage fontSize="12px">
                      {formErrors.firstName}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl
                    isInvalid={!!formErrors.lastName && touchedFields.lastName}
                    isRequired
                  >
                    <Box pos="relative" w="full">
                      <Input
                        type="text"
                        className="peer"
                        variant="outline"
                        rounded="8px"
                        borderWidth="1px"
                        borderColor={
                          formErrors.lastName && touchedFields.lastName
                            ? "red.500"
                            : "gray.500"
                        }
                        p="10px"
                        color="dark"
                        fontSize={["12px", "14px"]}
                        placeholder=""
                        name="lastName"
                        value={formValues.lastName}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                      />
                      <FormLabel
                        sx={floatingLabelStyles}
                        fontSize={["12px", "14px"]}
                      >
                        Last Name
                      </FormLabel>
                    </Box>
                    <FormErrorMessage fontSize="12px">
                      {formErrors.lastName}
                    </FormErrorMessage>
                  </FormControl>
                </HStack>
                <FormControl
                  isInvalid={!!formErrors.email && touchedFields.email}
                  isRequired
                >
                  <Box pos="relative" w="full">
                    <Input
                      type="email"
                      className="peer"
                      variant="outline"
                      rounded="8px"
                      borderWidth="1px"
                      borderColor={
                        formErrors.email && touchedFields.email
                          ? "red.500"
                          : "gray.500"
                      }
                      p="10px"
                      color="dark"
                      fontSize={["12px", "14px"]}
                      placeholder=""
                      name="email"
                      value={formValues.email}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                    />
                    <FormLabel
                      sx={floatingLabelStyles}
                      fontSize={["12px", "14px"]}
                    >
                      Email Address
                    </FormLabel>
                  </Box>
                  <FormErrorMessage fontSize="12px">
                    {formErrors.email}
                  </FormErrorMessage>
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={!!formErrors.phone && touchedFields.phone}
                >
                  <Box pos="relative" w="full">
                    <Input
                      type="tel"
                      className="peer"
                      variant="outline"
                      rounded="8px"
                      borderWidth="1px"
                      borderColor={
                        formErrors.phone && touchedFields.phone
                          ? "red.500"
                          : "gray.500"
                      }
                      p="10px"
                      color="dark"
                      fontSize={["12px", "14px"]}
                      placeholder=""
                      name="phone"
                      value={formValues.phone}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                    />
                    <FormLabel
                      sx={floatingLabelStyles}
                      fontSize={["12px", "14px"]}
                    >
                      Phone Number
                    </FormLabel>
                  </Box>
                  <FormErrorMessage fontSize="12px">
                    {formErrors.phone}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isRequired isInvalid={!!error}>
                  <Select
                    placeholder={loading ? "Loading events..." : "Select event"}
                    fontSize={["12px", "14px"]}
                    color="dark"
                    value={selectedEvent}
                    onChange={handleEventChange}
                    disabled={loading}
                  >
                    {events.map((event, index) => (
                      <option key={index} value={event}>
                        {event}
                      </option>
                    ))}
                  </Select>
                  {error && <FormErrorMessage>{error}</FormErrorMessage>}
                </FormControl>
                {selectedEvent === "" ? null : (
                  <FormControl>
                    <Box pos="relative" w="full">
                      <Input
                        type="tel"
                        className="peer"
                        variant="outline"
                        rounded="8px"
                        borderWidth="1px"
                        p="10px"
                        color="dark"
                        fontSize={["12px", "14px"]}
                        placeholder="10"
                        value={"10%"}
                        readOnly
                      />
                      <FormLabel
                        sx={floatingLabelStyles}
                        fontSize={["12px", "14px"]}
                      >
                        Comission Per Event
                      </FormLabel>
                    </Box>
                  </FormControl>
                )}
                <VStack w="100%" align="flex-start" gap="24px">
                  <Button
                    type="submit"
                    variant="solid"
                    w="100%"
                    h={["40px", "48px"]}
                    borderWidth="1px"
                    borderStyle="solid"
                    borderColor="#80BC00"
                    bg="linear-gradient(180deg, #9BE303 0%, #7FBB00 100%)"
                    rounded="12px"
                    boxShadow="0px -2px 2px 0px #658E0D inset, 0px 2px 0px 0px #C1FF3C inset"
                    color="white"
                    _hover={{
                      bg: "linear-gradient(180deg, #80BC00 0%, #7FBB00 100%)",
                    }}
                    _active={{
                      bg: "linear-gradient(180deg, #80BC00 0%, #7FBB00 100%)",
                    }}
                    _focus={{
                      bg: "linear-gradient(180deg, #80BC00 0%, #7FBB00 100%)",
                    }}
                    isLoading={isSubmitting}
                  >
                    <Text fontSize={["12px", "14px"]}>Generate Link</Text>
                  </Button>
                  <Text
                    color="gray.700"
                    fontSize={["12px", "16px"]}
                    lineHeight="24px"
                  >
                    Already an affilate ?{" "}
                    <Link href="/affiliate/login">
                      <Text
                        as="span"
                        color="green.500"
                        fontSize={["12px", "16px"]}
                        lineHeight="24px"
                      >
                        Get details of an event
                      </Text>
                    </Link>
                  </Text>
                </VStack>
              </VStack>
            </form>
          </VStack>
        </VStack>
        <Box display={["block", "block", "none"]} w="100%" h="1px" />
      </VStack>
    </Stack>
  );
};

export default Page;
