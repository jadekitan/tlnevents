import React, { useState, useEffect } from "react";
import {
  VStack,
  Heading,
  Box,
  Stack,
  Image,
  Text,
  Flex,
} from "@chakra-ui/react";
import { GrPrevious } from "react-icons/gr";
import { GrNext } from "react-icons/gr";
import { motion } from "framer-motion";

const testimonialsData = [
  {
    id: 1,
    image: "https://tlnevents.com/assets/testimonial/oyin.jpg",
    text: "Attending The Lemonade Network’s parties has been an absolute delight! The vibrant atmosphere, diverse crowd, and thoughtfully curated activities make each event a memorable experience. The attention to detail and the host's commitment to creating a fun environment ensure that I always look forward to these gatherings. It's more than just a party; it's a celebration of good times and great company!",
    name: "Oyin",
    role: "Attendee",
  },
  {
    id: 2,
    image: "https://tlnevents.com/assets/testimonial/MC_Bombastic.jpg",
    text: "The concoct of a successful event that runs smoothly means meetings, budget, timeline and goals clearly written, while ensuring a great experience for attendees. To me an event brief can serve as a key resource that sets the right expectation with stakeholders and keeps one on his your toes throughout the event! LEMONADE doesn't joke with the required planning and implementation of the blue print leaving room for the fusion of creativity into the whole mix, this is why is always a delight to grace the stage. Think events, think LEMONADE",
    name: "MC Bombastic",
    role: "Event Host",
  },
  {
    id: 3,
    image: "https://tlnevents.com/assets/testimonial/odun.jpg",
    text: "As a networking platform, Lemonade Network ticks all the boxes for me as they not only create events that allow you unwind and have absolute enjoyment, they also create opportunities to connect, network and collaborate with like minded professionals and what’s more? Their latter event is always better than their former which is an admirable trait that’s hard to come by as most people just want to throw parties for partying sake. It’s no surprise that thousands of people, myself inclusive, troop down to their events every time as they’ve proven themselves to be exceptional. Hearing about their triumphs is not enough, you should have a first hand experience.",
    name: "Odun",
    role: "Frequent Attendee",
  },
  {
    id: 4,
    image: "https://tlnevents.com/assets/testimonial/shizzy.jpg",
    text: "It's always a Thrilling Experience with The Lemonade Network, From Music to Food, Art, and Creative performance, it's always a good opportunity to unwind and chill with amazing sights and ambiance. Can't wait for the next Lemonade Experience",
    name: "Shizzy",
    role: "Frequent Attendee",
  },
  {
    id: 5,
    image: "https://tlnevents.com/assets/testimonial/vivian.jpg",
    text: "Hi, I’m Vivian 🥰 So whenever I hear The Lemonade Network is having an event, i clear my calendar asap so I don’t miss out on the fun and vibes🎉🎉🎉 You see ehn me I’m the life of the party ooo, energy goddess and I’m only found in places that are very lit and exciting. The Lemonade Network so far holds the record for the best and fun filled event, and they are overall best in encouraging and supporting upcoming acts and our safety is always top notch 👍 Looking forward to their next event🥰",
    name: "Vivan",
    role: "Frequent Attendee",
  },
  {
    id: 6,
    image: "https://tlnevents.com/assets/testimonial/marley.jpg",
    text: "The Lemonade Network has mastered the art of curating shows that seamlessly blend various forms of entertainment. The fusion of live music, interactive art installations, and immersive performances created a dynamic and unforgettable experience. Each show felt like a carefully crafted journey, taking the audience on a rollercoaster of emotions and sensory delights.",
    name: "Marley",
    role: "Artist Manager",
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Automatically move to the next testimonial
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 10000); // Change slide every 10 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, [currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonialsData.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonialsData.length - 1 : prevIndex - 1
    );
  };

  const { image, text, name, role } = testimonialsData[currentIndex];

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <VStack
      position="relative"
      w="100%"
      justify="center"
      align="center"
      spacing="40px"
    >
      <Heading
        color="dark"
        fontSize={["20px", "32px"]}
        textTransform="capitalize"
      >
        The next experience is the best of all
      </Heading>
      <Box position="relative" w="100%" h={["92vh", "90vh", "90vh", "90vh", "90vh"]}>
        <Flex
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          zIndex="1300"
          w="100%"
          justify={["center", "space-between"]}
          align="flex-end"
        >
          <Box
            as="button"
            display={["none", "none", "none", "block"]}
            p="20px"
            color="white"
            onClick={handlePrev}
          >
            <GrPrevious className="w-6 h-6" />
          </Box>

          <Stack
            w={["100%", "100%", "100%", "90%"]}
            flexDir={["column", "column", "column", "row"]}
            justify={["flex-end", "flex-end", "flex-end", "center"]}
            align="flex-end"
            spacing="40px"
          >
            <Box
              w={["100%", "100%", "100%", "50%", "40%"]}
              h={["40vh", "50vh", "50vh", "75vh", "75vh"]}
            >
              <Image
                w="100%"
                h="100%"
                rounded="8px"
                objectFit="cover"
                src={image}
                alt={name}
              />
            </Box>
            <VStack
              w={["100%", "100%", "100%", "50%"]}
              h={{ base: "45vh", sm: "30vh", md: "27vh", lg: "100%" }}
              justify={{
                base: "space-between",
                sm: "space-between",
                md: "space-between",
                lg: "center",
              }}
              align="flex-start"
              spacing={{ sm: "100px" }}
            >
              <motion.div
                key={currentIndex}
                custom={direction}
                initial="enter"
                animate="center"
                exit="exit"
                variants={variants}
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
              >
                <Text color="dark" fontSize={["12px", "12px", "14px", "14px"]}>
                  {text}
                </Text>
              </motion.div>

              <VStack align="flex-start" spacing="0" px={{ base: "20px" }}>
                <Heading
                  color="white"
                  fontSize={["24px", "26px", "28px", "32px"]}
                >
                  {name}
                </Heading>
                <Text color="white" fontSize={["14px", "14px", "16px", "18px"]}>
                  {role}
                </Text>
              </VStack>
            </VStack>
          </Stack>

          <Box
            as="button"
            display={["none", "none", "none", "block"]}
            p="20px"
            color="white"
            onClick={handleNext}
          >
            <GrNext className="w-6 h-6" />
          </Box>
        </Flex>

        <Box
          position="absolute"
          bottom="0px"
          left="0"
          zIndex="1200"
          w="100%"
          h={["75px", "100px", "125px", "150px"]}
          bg="dark"
          rounded="8px"
        ></Box>
      </Box>
    </VStack>
  );
};

export default Testimonials;
