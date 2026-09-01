import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  Image,
  Button,
  Flex,
  Heading,
  Text,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { Link } from "react-router-dom";
import { RiArrowRightDoubleFill, RiArrowLeftDoubleFill } from "react-icons/ri";

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

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const Hero = () => {
  const eventsData = [
    {
      url: "ikoyi-block-party",
      image: "https://tlnevents.com/assets/ikoyi-block-party.webp",
      name: "Ikoyi Block Party",
      date: "24 October",
      venue: "29 Macarthy Street, Lagos",
      video: "https://tlnevents.com/assets/ikoyi-block-party.mp4",
      poster: "https://tlnevents.com/assets/ikoyi-block-party-fallback.jpg",
    },
  ];

  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentEvent = eventsData[currentEventIndex];

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    if (!isAutoPlaying || isTransitioning) return;

    const interval = setInterval(() => {
      handleEventChange(
        currentEventIndex === eventsData.length - 1 ? 0 : currentEventIndex + 1,
      );
    }, 10000);

    return () => clearInterval(interval);
  }, [currentEventIndex, isAutoPlaying, isTransitioning, eventsData.length]);

  const handleEventChange = (newIndex) => {
    setIsTransitioning(true);
    setCurrentEventIndex(newIndex);

    // Reset transitioning state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  const nextEvent = () => {
    setIsAutoPlaying(false);
    const newIndex =
      currentEventIndex === eventsData.length - 1 ? 0 : currentEventIndex + 1;
    handleEventChange(newIndex);

    // Resume auto-play after manual navigation
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevEvent = () => {
    setIsAutoPlaying(false);
    const newIndex =
      currentEventIndex === 0 ? eventsData.length - 1 : currentEventIndex - 1;
    handleEventChange(newIndex);

    // Resume auto-play after manual navigation
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToEvent = (index) => {
    if (index === currentEventIndex) return;

    setIsAutoPlaying(false);
    handleEventChange(index);

    // Resume auto-play after manual navigation
    setTimeout(() => setIsAutoPlaying(true), 10000);
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
      {/* Background Video */}
      <Box
        as="video"
        loop
        muted
        autoPlay
        playsInline
        preload="auto"
        poster={currentEvent.poster}
        width="100%"
        height="100%"
        objectFit="cover"
        position="absolute"
        top="0"
        left="0"
        zIndex="-1"
        key={`video-${currentEvent.url}`} // Force complete re-render
      >
        <source src={currentEvent.video} type="video/mp4" />
        Your browser does not support the video tag.
      </Box>

      {/* Carousel Content */}
      <VStack
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        justify="center"
        align="center"
        textAlign="center"
        spacing={(16, 8)}
        width="100%"
        animation={`${fadeIn} 0.5s ease-in-out`}
        key={`content-${currentEvent.url}`} // Force content re-render
      >
        {/* Hero Image */}
        <Box width={["340px", "380px", "420px", "440px"]} height="40vh">
          <Image
            src={currentEvent.image}
            alt={`${currentEvent.name} Logo`}
            key={`image-${currentEvent.url}`} // Force image re-render
            sx={{
              width: ["340px", "380px", "420px", "440px"],
              height: "auto",
              opacity: 1,
              transition: "transform 1s",
              animation: `${fadeAndScale} 3s ease-in-out 3`,
            }}
          />
        </Box>

        {/* Get Tickets Button */}
        <Flex align="center" gap="40px" flexWrap="wrap" justify="center">
          <Link
            to={`/${currentEvent.url}`}
            _hover={{ textDecoration: "none" }}
            target="_blank"
          >
            <Button
              size="lg"
              bg="primary.500"
              _hover={{ bg: "primary.400" }}
              color="dark"
            >
              View Event
            </Button>
          </Link>
          <Link
            to={`/${currentEvent.url}/checkout`}
            _hover={{ textDecoration: "none" }}
            target="_blank"
          >
            <Button
              size="lg"
              bg="secondary.500"
              _hover={{ bg: "primary.400" }}
              color="dark"
            >
              Buy Tickets
            </Button>
          </Link>
        </Flex>

        {/* Event Date and Venue */}
        <VStack justify="center" align="center" spacing="0">
          <Heading
            color="white"
            fontSize={["24px", "26px", "30px", "32px"]}
            textTransform="uppercase"
          >
            {currentEvent.date}
          </Heading>
          <Text
            color="white"
            fontSize={["16px", "18px", "22px", "24px"]}
            textTransform="uppercase"
          >
            {currentEvent.venue}
          </Text>
        </VStack>

        {/* Navigation Controls */}
        {eventsData > 1 && (
          <HStack spacing={4} justify="center" align="center" mt={4}>
            {/* Previous Event Button */}
            <IconButton
              aria-label="Previous event"
              icon={<RiArrowLeftDoubleFill />}
              onClick={prevEvent}
              variant="ghost"
              color="white"
              _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
              size="lg"
            />

            {/* Event Indicators */}
            {eventsData > 1 && (
              <HStack spacing={2} overflow="hidden">
                {eventsData.map((event, index) => (
                  <Button
                    key={event.url}
                    size="sm"
                    variant="ghost"
                    color={
                      index === currentEventIndex ? "primary.500" : "white"
                    }
                    onClick={() => goToEvent(index)}
                    _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
                    minW="auto"
                    px={2}
                    fontSize="sm"
                  >
                    {event.name}
                  </Button>
                ))}
              </HStack>
            )}

            {/* Next Event Button */}
            <IconButton
              aria-label="Next event"
              icon={<RiArrowRightDoubleFill />}
              onClick={nextEvent}
              variant="ghost"
              color="white"
              _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
              size="lg"
            />
          </HStack>
        )}

        {/* Progress Indicator */}
        {eventsData > 1 && (
          <Box position="absolute" bottom="0px" left="0" width="100%" px={4}>
            <Box height="2px" bg="rgba(255, 255, 255, 0.3)" position="relative">
              <Box
                height="100%"
                bg="primary.500"
                width={`${((currentEventIndex + 1) / eventsData.length) * 100}%`}
                transition="width 0.3s ease"
              />
            </Box>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default Hero;
