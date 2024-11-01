import React from "react";
import { VStack, Heading, Text, Flex, Box, Image } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

const Sponsors = () => {
  const brands = ["https://tlnevents.com/assets/sponsors/morenag-energy.png"];

  // Define keyframes for scrolling animation
  const scrollAnimation = keyframes`
    0% { transform: translateX(0); }
    100% { transform: translateX(-100%); }
  `;

  return (
    <VStack
      id="sponsors"
      w="100%"
      justify="center"
      align="center"
      spacing={["50px", "50px", "75px", "100px"]}
    >
      <VStack justify="center" align="center" spacing={["5px", "10px"]}>
        <Heading color="dark" fontSize={["32px", "36px", "38px", "42px"]}>
          Our Sponsors
        </Heading>
        <Text color="neutral.500" fontSize={["12px", "12px", "14px", "14px"]}>
          Get To Know More
        </Text>
      </VStack>
      <Flex overflow="hidden">
        <Flex
          flexShrink="0"
          gap={["40px", "70px"]}
          animation={
            brands >= 5 ? [`${scrollAnimation} 30s linear infinite`] : ""
          }
          animationplaystate="running" // Control animation state
          onMouseEnter={(e) => {
            e.currentTarget.style.animationPlayState = "paused";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.animationPlayState = "running";
          }}
        >
          {brands.map((image, i) => (
            <Box
              key={i}
              maxH={["70px", "70px", "80px"]}
              maxW={["100px", "100px", "150px", "150px"]}
              flexShrink="0"
            >
              <Image w="100%" h="100%" objectFit="contain" src={image} />
            </Box>
          ))}
        </Flex>
      </Flex>
    </VStack>
  );
};

export default Sponsors;
