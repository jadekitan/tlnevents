import React, { useState, useEffect } from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }
  return (
    <Box
      w="100%"
      position="fixed"
      top="0"
      left="0"
      zIndex="1400"
      py="20px"
      px={["20px", "20px", "50px", "100px"]}
      bg={isScrolled ? "white" : "transparent"}
      className={`transition duration-500 ease-in-out ${
        isScrolled ? "white shadow-md" : "transparent"
      }`}
    >
      <Flex w="100%" justify={["center", "space-between"]} align="center">
        <Link to="/">
          <Image
            w={isScrolled ? ["100px", "120px"] : ["120px", "150px"]}
            src="/logo.webp"
            alt="The Lemonade Logo"
            className={`duration-1000 ease-in-out `}
          />
        </Link>
        <Flex
          display={["none", "flex"]}
          justify="center"
          align="center"
          gap={["20px", "20px", "20px", "40px"]}
        >
          <Link to="/lpe/checkout">
            <Text
              color={isScrolled ? "dark" : "white"}
              fontSize={
                isScrolled
                  ? ["16px", "18px", "20px", "22px"]
                  : ["18px", "20px", "22px", "24px"]
              }
            >
              Tickets
            </Text>
          </Link>
          <Link to="/lpe">
            <Text
              color={isScrolled ? "dark" : "white"}
              fontSize={
                isScrolled
                  ? ["16px", "18px", "20px", "22px"]
                  : ["18px", "20px", "22px", "24px"]
              }
            >
              Event
            </Text>
          </Link>
          <Link as="button" onClick={() => scrollToSection("experiences")}>
            <Text
              color={isScrolled ? "dark" : "white"}
              fontSize={
                isScrolled
                  ? ["16px", "18px", "20px", "22px"]
                  : ["18px", "20px", "22px", "24px"]
              }
            >
              Experiences
            </Text>
          </Link>
          <Link as="button" onClick={() => scrollToSection("about")}>
            <Text
              color={isScrolled ? "dark" : "white"}
              fontSize={
                isScrolled
                  ? ["16px", "18px", "20px", "22px"]
                  : ["18px", "20px", "22px", "24px"]
              }
            >
              About
            </Text>
          </Link>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
