import React from "react";
import { VStack, Heading, Text, Stack, Box, Image } from "@chakra-ui/react";
const About = () => {
  return (
    <VStack
      id="about"
      w="100%"
      justify="center"
      align="center"
      spacing={["50px", "50px", "75px", "100px"]}
    >
      <VStack justify="center" align="center" spacing={["5px", "10px"]}>
        <Heading color="dark" fontSize={["32px", "36px", "38px", "42px"]}>
          About Us
        </Heading>
        <Text color="neutral.500" fontSize={["12px", "12px", "14px", "14px"]}>
          Get To Know More
        </Text>
      </VStack>
      <Stack
        w="100%"
        flexDir={["column", "column", "column", "row"]}
        justify="space-between"
        align="center"
        spacing={{ base: "40px" }}
      >
        <Box w={["100%", "100%", "100%", "45%"]} bg="gray.200">
          <Image
            w="100%"
            rounded="8px"
            src="https://tlnevents.com/assets/crew.webp"
            alt="The Lemonade Network Crew"
          />
        </Box>
        <VStack
          w={["100%", "100%", "100%", "50%"]}
          align={["center", "center", "center", "flex-start"]}
          textAlign={["center", "center", "center", "start"]}
          spacing={["20px", "20px", "20px", "40px"]}
        >
          <Heading
            color="primary.500"
            fontSize={["24px", "26px", "32px", "32px"]}
          >
            The Lemonade Network
          </Heading>
          <Text color="dark" fontSize={["14px", "16px"]}>
            At The Lemonade Network, we are more than just a platform – we are a
            thriving community dedicated to fostering connections, igniting
            creativity, and fuelling sustainable development across diverse
            industries. Our mission is to provide a space where creatives and
            professionals can come together, connect, collaborate, and create
            transformative projects that pave the way for their success.
          </Text>
        </VStack>
      </Stack>
      <VStack w="100%" justify="center" align="center" spacing="50px">
        <Heading color="dark" fontSize={["24px", "26px", "30px", "32px"]}>
          Connect &bull; Collaborate &bull; Create{" "}
        </Heading>
        <Stack
          w="100%"
          flexDir={["column", "column", "column", "row"]}
          justify="space-between"
          align={["center", "center", "center", "start"]}
          spacing={["40px", ""]}
        >
          <Stack
            w={["100%", "100%", "100%", "30%"]}
            flexDir={["row", "row", "row", "column"]}
            align="center"
            spacing={{ base: "20px", sm: "20px", md: "40px" }}
          >
            <Image
              w={["150px", "150px", "250px", "150px"]}
              h={["150px", "150px", "250px", "150px"]}
              objectFit="cover"
              rounded={["6px", "6px", "8px", "full"]}
              shadow="md"
              src="https://tlnevents.com/assets/gallery/Fk shot it-244.jpg"
              alt="vision"
            />
            <VStack
              align={["flex-start", "flex-start", "flex-start", "center"]}
              textAlign={["start", "start", "start", "center"]}
            >
              <Heading
                color="primary.500"
                fontSize={["24px", "28px", "38px", "32px"]}
              >
                Vision
              </Heading>
              <Text color="dark" fontSize={["12px", "12px", "16px", "14px"]}>
                To create an autonomous community that serves as a catalyst for
                the achievement of goals.
              </Text>
            </VStack>
          </Stack>
          <Stack
            w={["100%", "100%", "100%", "30%"]}
            flexDir={["row-reverse", "row-reverse", "row-reverse", "column"]}
            align="center"
            spacing={{ base: "20px", sm: "20px", md: "40px" }}
          >
            <Image
              w={["150px", "150px", "250px", "150px"]}
              h={["150px", "150px", "250px", "150px"]}
              objectFit="cover"
              rounded={["6px", "6px", "8px", "full"]}
              shadow="md"
              src="https://tlnevents.com/assets/gallery/DSC_1318_web.jpg"
              alt="mission"
            />
            <VStack
              align={["flex-start", "flex-start", "flex-start", "center"]}
              textAlign={["start", "start", "start", "center"]}
            >
              <Heading
                color="primary.500"
                fontSize={["24px", "28px", "34px", "32px"]}
              >
                Mission
              </Heading>
              <Text color="dark" fontSize={["12px", "12px", "16px", "14px"]}>
                To be a platform with diverse channels for creatives and
                professionals to connect, collaborate and create projects to
                help them achieve sustainable development in their various
                industries
              </Text>
            </VStack>
          </Stack>
          <Stack
            w={["100%", "100%", "100%", "30%"]}
            flexDir={["row", "row", "row", "column"]}
            align="center"
            spacing={{ base: "20px", sm: "20px", md: "40px" }}
          >
            <Image
              w={["150px", "150px", "250px", "150px"]}
              h={["150px", "150px", "250px", "150px"]}
              objectFit="cover"
              rounded={["6px", "6px", "8px", "full"]}
              shadow="md"
              src="https://tlnevents.com/assets/gallery/DSC_9238.jpg"
              alt="goal"
            />
            <VStack
              align={["flex-start", "flex-start", "flex-start", "center"]}
              textAlign={["start", "start", "start", "center"]}
            >
              <Heading
                color="primary.500"
                fontSize={["24px", "28px", "34px", "32px"]}
              >
                Goal
              </Heading>
              <Text color="dark" fontSize={["12px", "12px", "16px", "14px"]}>
                To create an autonomous community for emerging creatives &
                entrepreneurs to gain greater exposure via innovative events &
                programs
              </Text>
            </VStack>
          </Stack>
        </Stack>
      </VStack>
    </VStack>
  );
};

export default About;
