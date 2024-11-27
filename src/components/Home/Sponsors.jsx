import React from "react";
import { VStack, Text, Flex, Box, Image } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { Link } from "react-router-dom";

const Sponsors = () => {
  const brands = [
    {
      image: "https://tlnevents.com/assets/sponsors/morenag-energy.png",
      url: "https://morenagenergy.com",
    },
    {
      image: "https://tlnevents.com/assets/sponsors/gameevo.png",
      url: "https://gameevotech.com",
    },
    {
      image: "https://tlnevents.com/assets/sponsors/dj-skit.png",
      url: "",
    },
    {
      image: "https://tlnevents.com/assets/sponsors/mfr.png",
      url: "",
    },
    {
      image: "https://tlnevents.com/assets/sponsors/pelia's-place.png",
      url: "",
    },
  ];

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
      <Text color="neutral.500" fontSize={["12px", "12px", "14px", "14px"]}>
        Our Sponsors
      </Text>

      <Flex w="100%" overflow="hidden">
        <Flex
          align="center"
          flexShrink="0"
          gap={["40px", "70px"]}
          animation={`${scrollAnimation} 30s linear infinite`}
          animationplaystate="running" // Control animation state
          onMouseEnter={(e) => {
            e.currentTarget.style.animationPlayState = "paused";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.animationPlayState = "running";
          }}
        >
          {brands.map((brand, i) =>
            brand.url === !"" ? (
              <Link
                key={i}
                to={brand.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Box
                  h={["70px", "70px", "100px"]}
                  w={["100px", "100px", "150px", "150px"]}
                  flexShrink="0"
                >
                  <Image
                    w="100%"
                    h="100%"
                    objectFit="contain"
                    src={brand.image}
                    alt={`Sponsor ${i + 1}`}
                    bg={i == 1 ? "dark" : "transparent"}
                  />
                </Box>
              </Link>
            ) : (
              <Box
                key={i}
                h={["70px", "70px", "100px"]}
                w={["100px", "100px", "150px", "150px"]}
                flexShrink="0"
              >
                <Image
                  w="100%"
                  h="100%"
                  objectFit="contain"
                  src={brand.image}
                  alt={`Sponsor ${i + 1}`}
                  bg={i == 1 ? "dark" : "transparent"}
                />
              </Box>
            )
          )}
          {brands.map((brand, i) =>
            brand.url === !"" ? (
              <Link
                key={i}
                to={brand.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Box
                  h={["70px", "70px", "100px"]}
                  w={["100px", "100px", "150px", "150px"]}
                  flexShrink="0"
                >
                  <Image
                    w="100%"
                    h="100%"
                    objectFit="contain"
                    src={brand.image}
                    alt={`Sponsor ${i + 1}`}
                    bg={i == 1 ? "dark" : "transparent"}
                  />
                </Box>
              </Link>
            ) : (
              <Box
                key={i}
                h={["70px", "70px", "100px"]}
                w={["100px", "100px", "150px", "150px"]}
                flexShrink="0"
              >
                <Image
                  w="100%"
                  h="100%"
                  objectFit="contain"
                  src={brand.image}
                  alt={`Sponsor ${i + 1}`}
                  bg={i == 1 ? "dark" : "transparent"}
                />
              </Box>
            )
          )}
        </Flex>
      </Flex>
    </VStack>
  );
};

export default Sponsors;
