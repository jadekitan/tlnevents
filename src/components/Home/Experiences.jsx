import React, { useEffect } from "react";
import { Box, VStack, Skeleton, Image, Heading, Text } from "@chakra-ui/react";
import Glide from "@glidejs/glide";
import "@glidejs/glide/dist/css/glide.core.min.css";
import "@glidejs/glide/dist/css/glide.theme.min.css";

const imageList = [
  "https://tlnevents.com/assets/gallery/Fk shot it-244.jpg",
  "https://tlnevents.com/assets/gallery/Fk shot it-252.jpg",
  "https://tlnevents.com/assets/gallery/IMG_2438.jpg",
  "https://tlnevents.com/assets/gallery/IMG_2413.jpg",
  "https://tlnevents.com/assets/gallery/IMG_2374.jpg",
  "https://tlnevents.com/assets/gallery/IMG_2334.jpg",
  "https://tlnevents.com/assets/gallery/IMG_2320.jpg",
  "https://tlnevents.com/assets/gallery/DSC_1318_web.jpg",
  "https://tlnevents.com/assets/gallery/DSC_1336_web.jpg",
  "https://tlnevents.com/assets/gallery/DSC_1348_web copy.jpg",
  "https://tlnevents.com/assets/gallery/DSC_1355_web.jpg",
  "https://tlnevents.com/assets/gallery/DSC_1358_web copy.jpg",
  "https://tlnevents.com/assets/gallery/DSC_1440_web.jpg",
  "https://tlnevents.com/assets/gallery/Fk shot it-266.jpg",
  "https://tlnevents.com/assets/gallery/DSC_1444_web.jpg",
  "https://tlnevents.com/assets/gallery/DSC_1561_web.jpg",
  "https://tlnevents.com/assets/gallery/DSC_1641_web.jpg",
  "https://tlnevents.com/assets/gallery/DSC_1727_web.jpg",
  "https://tlnevents.com/assets/gallery/DSC_1753_web.jpg",
];

const Experiences = () => {
  useEffect(() => {
    const glide = new Glide(".glide", {
      type: "carousel",
      startAt: 0,
      perView: 1,
      autoplay: 3000, // Automatically move to the next slide every 5 seconds
      hoverpause: true, // Pauses on hover
      animationDuration: 1000, // Transition speed
    });

    glide.mount();

    // Cleanup the Glide instance when component unmounts
    return () => glide.destroy();
  }, []);

  return (
    <VStack
      as="section"
      id="experiences"
      w="100%"
      justify="center"
      align="center"
      spacing="8"
    >
      <VStack justify="center" align="center" spacing="10px" textAlign="center">
        <Heading color="dark" fontSize={["32px", "48px"]}>
          Experiences
        </Heading>
        <Text color="neutral.500" fontSize={["14px", "16px"]}>
          Relive Unforgettable Moments
        </Text>
      </VStack>

      <Box w={["100%", "100%", "100%", "70%"]} className="glide">
        {/* The Carousel */}
        <div className="glide__track" data-glide-el="track">
          <ul className="glide__slides">
            {imageList.map((image, index) => (
              <li className="glide__slide" key={index}>
                <Skeleton isLoaded rounded="8px">
                  <Image
                    w="100%"
                    h={["30vh", "50vh", "50vh", "75vh"]}
                    bg="gray.500"
                    rounded={["6px", "8px"]}
                    src={image}
                    alt={`Slide ${index - 1}`}
                    style={{ width: "100%" }}
                  />
                </Skeleton>
              </li>
            ))}
          </ul>
        </div>

        {/* Navigation Dots */}
        <Box display={["none", "block"]}>
          <div className="glide__bullets" data-glide-el="controls[nav]">
            {imageList.map((_, index) => (
              <button
                key={index}
                className="glide__bullet"
                data-glide-dir={`=${index}`}
                aria-label={`Go to slide ${index + 1}`}
              ></button>
            ))}
          </div>
        </Box>
      </Box>
    </VStack>
  );
};

export default Experiences;
