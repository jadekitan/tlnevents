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
  Flex,
} from "@chakra-ui/react";
import { AddIcon, MinusIcon, DeleteIcon } from "@chakra-ui/icons";
import { useParams, Link } from "react-router-dom";
import { eventsData } from "../../../server/eventsData";

// Create Cart Context
const CartContext = createContext();

function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [checkoutStep, setCheckoutStep] = useState("cart");

  const { eventId } = useParams(); // Get the event ID from the URL
  const event = eventsData[eventId]; // Lookup event from local data

  const products = useState(event ? event.merch : []);

  const addToCart = (product, size, color, quantity) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) =>
          item.id === product.id && item.size === size && item.color === color
      );

      if (existingItem) {
        return prevCart.map((item) =>
          item === existingItem
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [
        ...prevCart,
        {
          ...product,
          size,
          color,
          quantity,
          cartItemId: `${product.id}-${size}-${color}`,
        },
      ];
    });
  };

  const updateQuantity = (cartItemId, newQuantity) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: Math.max(0, newQuantity) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const value = {
    products,
    cart,
    addToCart,
    updateQuantity,
    getTotal,
    checkoutStep,
    setCheckoutStep,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

function ProductCard({ product }) {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useContext(CartContext);
  const toast = useToast();

  const handleAddToCart = () => {
    if (selectedSize && selectedColor) {
      addToCart(product, selectedSize, selectedColor, quantity);
      setQuantity(1);
      setSelectedSize("");
      setSelectedColor("");
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Card>
      <CardBody>
        <VStack spacing={4}>
          <Image
            src={product.image}
            alt={product.name}
            borderRadius="lg"
            objectFit="cover"
          />
        </VStack>
      </CardBody>
      <CardFooter>
        <VStack w="100%" justify="flex-start" align="flex-start" spacing="10px">
          <Heading size="md">{product.name}</Heading>
          <Text fontSize="2xl" fontWeight="bold">
            ${product.price}
          </Text>
        </VStack>
      </CardFooter>
    </Card>
  );
}
function ProductDetails({ product }) {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useContext(CartContext);
  const toast = useToast();

  const handleAddToCart = () => {
    if (selectedSize && selectedColor) {
      addToCart(product, selectedSize, selectedColor, quantity);
      setQuantity(1);
      setSelectedSize("");
      setSelectedColor("");
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <Heading size="md">{product.name}</Heading>
        <Text color="gray.600">{product.description}</Text>
      </CardHeader>
      <CardBody>
        <VStack spacing={4}>
          <Image
            src={product.image}
            alt={product.name}
            borderRadius="lg"
            objectFit="cover"
          />
          <Text fontSize="2xl" fontWeight="bold">
            ${product.price.toFixed(2)}
          </Text>

          <FormControl>
            <FormLabel>Size</FormLabel>
            <RadioGroup value={selectedSize} onChange={setSelectedSize}>
              <Stack direction="row" spacing={4}>
                {product.sizes.map((size) => (
                  <Radio key={size} value={size}>
                    {size}
                  </Radio>
                ))}
              </Stack>
            </RadioGroup>
          </FormControl>

          <FormControl>
            <FormLabel>Color</FormLabel>
            <RadioGroup value={selectedColor} onChange={setSelectedColor}>
              <Stack direction="row" spacing={4}>
                {product.colors.map((color) => (
                  <Radio key={color} value={color}>
                    {color}
                  </Radio>
                ))}
              </Stack>
            </RadioGroup>
          </FormControl>

          <HStack>
            <IconButton
              icon={<MinusIcon />}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            />
            <Text width="40px" textAlign="center">
              {quantity}
            </Text>
            <IconButton
              icon={<AddIcon />}
              onClick={() => setQuantity((q) => q + 1)}
            />
          </HStack>
        </VStack>
      </CardBody>
      <CardFooter>
        <Button
          colorScheme="blue"
          width="full"
          onClick={handleAddToCart}
          isDisabled={!selectedSize || !selectedColor}
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}

function CheckoutForm() {
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
}

function Cart() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { cart, updateQuantity, getTotal, checkoutStep, setCheckoutStep } =
    useContext(CartContext);

  return (
    <>
      <Button onClick={onOpen} position="relative" variant="outline">
        Cart
        {cart.length > 0 && (
          <Badge
            colorScheme="red"
            position="absolute"
            top="-2"
            right="-2"
            borderRadius="full"
          >
            {cart.reduce((sum, item) => sum + item.quantity, 0)}
          </Badge>
        )}
      </Button>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {checkoutStep === "cart" ? "Shopping Cart" : "Checkout"}
          </DrawerHeader>

          <DrawerBody>
            {checkoutStep === "cart" ? (
              <VStack spacing={4}>
                {cart.map((item) => (
                  <Box
                    key={item.cartItemId}
                    p={4}
                    borderWidth={1}
                    borderRadius="lg"
                    width="full"
                  >
                    <HStack justify="space-between">
                      <VStack align="start">
                        <Text fontWeight="bold">{item.name}</Text>
                        <Text color="gray.600">
                          Size: {item.size}, Color: {item.color}
                        </Text>
                        <Text>${(item.price * item.quantity).toFixed(2)}</Text>
                      </VStack>
                      <HStack>
                        <IconButton
                          icon={<MinusIcon />}
                          onClick={() =>
                            updateQuantity(item.cartItemId, item.quantity - 1)
                          }
                        />
                        <Text width="40px" textAlign="center">
                          {item.quantity}
                        </Text>
                        <IconButton
                          icon={<AddIcon />}
                          onClick={() =>
                            updateQuantity(item.cartItemId, item.quantity + 1)
                          }
                        />
                      </HStack>
                    </HStack>
                  </Box>
                ))}
              </VStack>
            ) : (
              <CheckoutForm />
            )}
          </DrawerBody>

          <DrawerFooter>
            {checkoutStep === "cart" ? (
              cart.length > 0 ? (
                <VStack width="full" spacing={4}>
                  <Text fontSize="xl" fontWeight="bold">
                    Total: ${getTotal().toFixed(2)}
                  </Text>
                  <Button
                    colorScheme="blue"
                    width="full"
                    onClick={() => setCheckoutStep("checkout")}
                  >
                    Proceed to Checkout
                  </Button>
                </VStack>
              ) : (
                <Text color="gray.500">Your cart is empty</Text>
              )
            ) : (
              <Button
                variant="outline"
                mr={3}
                onClick={() => setCheckoutStep("cart")}
              >
                Back to Cart
              </Button>
            )}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

function FestivalStore() {
  // Sample product data
  const { eventId } = useParams(); // Get the event ID from the URL
  const event = eventsData[eventId]; // Lookup event from local data

  const products = event ? event.merch : {};
  return (
    <CartProvider>
      <VStack
        w="100%"
        h="100%"
        justify="center"
        align="center"
        spacing={["25px", "60px", "70px", "75px", "50px"]}
        px={["20px", "50px", "75px", "100px"]}
      >
        <Flex w="100%" justify="space-between" align="center" py="20px">
          <Link to="/">
            <Image
              w={["120px", "150px"]}
              src="/logo.webp"
              alt="The Lemonade Logo"
            ></Image>
          </Link>
          <Cart />
        </Flex>
        <VStack w="100%" align="flex-start" spacing="50px">
          <Heading color="dark" fontSize={["28px", "32px"]}>
            {event.name} Merch
          </Heading>

          <Grid
            templateColumns={{
              base: "repeat(1, 1fr)",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            }}
            gap={10}
          >
            {Object.values(products).map((product) => (
              <Link key={product.id} to={`/${event.id}/merch/${product.id}`}>
                <VStack key={product.id} spacing={4}>
                  <Box h="350px">
                    <Image
                      w="100%"
                      h="100%"
                      src={product.image}
                      alt={product.name}
                      borderRadius="md"
                      objectFit="cover"
                    />
                  </Box>
                  <VStack
                    w="100%"
                    justify="flex-start"
                    align="flex-start"
                    spacing="0"
                  >
                    <Heading
                      color="dark"
                      fontSize={["18px", "22px"]}
                      fontWeight="500"
                    >
                      {product.name}
                    </Heading>
                    <Text
                      color="primary.500"
                      fontSize={["14px", "18px"]}
                      fontWeight="600"
                    >
                      ${product.price}
                    </Text>
                  </VStack>
                </VStack>
              </Link>
            ))}
          </Grid>
        </VStack>
      </VStack>
    </CartProvider>
  );
}

export default FestivalStore;
