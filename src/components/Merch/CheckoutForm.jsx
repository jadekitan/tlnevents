import React, { useState, useContext } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Grid,
  Input,
  Text,
  VStack,
  useToast,
  Flex,
  Select,
  Box,
  Icon,
  Heading,
} from "@chakra-ui/react";
import { CartContext } from "./CartProvider";
import { useFormik } from "formik";

const CheckoutForm = ({ handleNextStep, formRef }) => {
  const {
    contactData,
    handleContactDataChange,
    handleBlur,
    setCheckoutStep,
    setIsDisable,
    setIsSubmitting,
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
      setIsSubmitting(true);
      setSubmitting(true);
      setIsDisable(true);
      handleNextStep();
    },
  });

  formRef.current = formik;

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
          onClick={() => setCheckoutStep("cart")}
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
        spacing={["20px", "20px"]}
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
      {/* <Grid templateColumns="repeat(2, 1fr)" gap={4} width="full">
            <FormControl>
              <FormLabel>First Name</FormLabel>
              <Input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </FormControl>
            <FormControl>
              <FormLabel>Last Name</FormLabel>
              <Input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </FormControl>
          </Grid>

          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </FormControl>

          <FormControl>
            <FormLabel>Phone</FormLabel>
            <Input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </FormControl>

          <FormControl>
            <FormLabel>Address</FormLabel>
            <Input
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </FormControl>

          <Grid templateColumns="repeat(2, 1fr)" gap={4} width="full">
            <FormControl>
              <FormLabel>City</FormLabel>
              <Input
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </FormControl>
            <FormControl>
              <FormLabel>Postal Code</FormLabel>
              <Input
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                required
              />
            </FormControl>
          </Grid>

          <FormControl>
            <FormLabel>Country</FormLabel>
            <Input
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
            />
          </FormControl> */}

      <Button display="none" type="submit">
        Place Order
      </Button>
    </VStack>
  );
};

export default CheckoutForm;
