import React from "react";
import {
  Box,
  VStack,
  Image,
  Button,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { Link } from "react-router-dom";

// Define the keyframes for the animation
const fadeAndScale = keyframes`
  0%, 100% {
    opacity: 0;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
`;

const Hero = () => {
  const eventData = {
    url: "lpe",
    image: "https://tlnevents.com/assets/lpe.webp",
    name: "Lemonade Playground Experience",
    date: "22 December",
    venue: "Muri Okuola Park, Vicotria Island, Lagos",
  };
  return (
    <Box
      w="100%"
      as="section"
      id="hero"
      position="relative"
      height="100dvh"
      overflow="hidden"
      bg="rgba(0, 0, 0, 0.3)"
    >
      <Box
        as="video"
        loop
        muted
        autoPlay
        playsInline
        preload="auto"
        poster="https://tlnevents.com/assets/gallery/Fk shot it-244.jpg"
        width="100%"
        height="100%"
        objectFit="cover"
        position="absolute"
        top="0"
        left="0"
        zIndex="-1"
      >
        <source
          src="https://tlnevents.com/assets/lpe-hero.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </Box>
      <VStack
        position="absolute"
        top="55%"
        left="50%"
        transform="translate(-50%, -50%)"
        justify="center"
        align="center"
        textAlign="center"
        spacing={(16, 8)}
      >
        {/* Hero Image */}
        <Image
          src={eventData.image}
          alt={`${eventData.name} Logo`}
          sx={{
            width: ["350px", "380px", "420px", "440px"],
            height: "auto",
            opacity: 1,
            transition: "transform 1s",
            animation: `${fadeAndScale} 3s ease-in-out 3`,
          }}
        />

        {/* Get Tickets Button */}
        <Flex align="center" gap="40px">
          <Link
            to={`/${eventData.url}/checkout`}
            _hover={{ textDecoration: "none" }}
            target="_blank"
          >
            <Button
              size="lg"
              bg="primary.500"
              _hover={{ bg: "primary.400" }}
              color="dark"
            >
              Get Tickets
            </Button>
          </Link>
          <Link
            to={`/${eventData.url}/merch`}
            _hover={{ textDecoration: "none" }}
            target="_blank"
          >
            <Button
              size="lg"
              bg="secondary.500"
              _hover={{ bg: "primary.400" }}
              color="dark"
            >
              Buy Merch
            </Button>
          </Link>
        </Flex>
        <VStack justify="center" align="center" spacing="0">
          <Heading
            color="white"
            fontSize={["24px", "26px", "30px", "32px"]}
            textTransform="uppercase"
          >
            {eventData.date}
          </Heading>
          <Text
            color="white"
            fontSize={["16px", "18px", "22px", "24px"]}
            textTransform="uppercase"
          >
            {eventData.venue}
          </Text>
        </VStack>
      </VStack>
    </Box>
  );
};

export default Hero;
