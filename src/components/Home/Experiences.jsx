import React, { useState, useEffect } from "react";
import { Box, VStack, Skeleton, Image, Heading, Text } from "@chakra-ui/react";
import Glide from "@glidejs/glide";
import "@glidejs/glide/dist/css/glide.core.min.css";
import "@glidejs/glide/dist/css/glide.theme.min.css";

const imageList = [
  "../../src/assets/gallery/Fk shot it-244.jpg",
  "../../src/assets/gallery/Fk shot it-252.jpg",
  "../../src/assets/gallery/IMG_2438.JPG",
  // Add all your image paths here
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

      <Box w={["100%", "100%", "100%", "80%"]} className="glide">
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
                    alt={`Slide ${index}`}
                    style={{ width: "100%" }}
                  />
                </Skeleton>
              </li>
            ))}
          </ul>
        </div>

        {/* Navigation Dots */}
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

        {/* Previous and Next Arrows */}
        {/* <div data-glide-el="controls">
          <button data-glide-dir="<" aria-label="Previous Slide">
            Prev
          </button>
          <button data-glide-dir=">" aria-label="Next Slide">
            Next
          </button>
        </div> */}
      </Box>
    </VStack>
  );
};

export default Experiences;
