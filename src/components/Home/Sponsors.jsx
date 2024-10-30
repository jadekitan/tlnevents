import React from "react";
import { VStack, Flex, Box, Image } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

const Sponsors = () => {
  const brands = ["../../../src/assets/sponsors/morenag-energy.png"];

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
      <Flex overflow="hidden">
        <Flex
          flexShrink="0"
          gap="70px"
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
            <Box key={i} maxH="80px" maxW="150px" flexShrink="0">
              <Image w="100%" h="100%" objectFit="contain" src={image} />
            </Box>
          ))}
        </Flex>
      </Flex>
    </VStack>
  );
};

export default Sponsors;
