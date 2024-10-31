import React, { useState, createContext, useContext } from "react";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Container,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Image,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useDisclosure,
  VStack,
  HStack,
  Badge,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { AddIcon, MinusIcon, DeleteIcon } from "@chakra-ui/icons";
import { CartContext } from "./CartProvider";

const CheckoutForm = () => {
  const { cart, getTotal } = useContext(CartContext);
  const toast = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Order submitted:", { cart, formData, total: getTotal() });
    toast({
      title: "Order placed!",
      description: "We've received your order and will process it shortly.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={4}>
        <Grid templateColumns="repeat(2, 1fr)" gap={4} width="full">
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
        </FormControl>

        <Text fontSize="xl" fontWeight="bold">
          Total: ${getTotal().toFixed(2)}
        </Text>

        <Button type="submit" colorScheme="blue" width="full">
          Place Order
        </Button>
      </VStack>
    </form>
  );
};

export default CheckoutForm;
