import React, { useState, useEffect } from "react";
import {
  Box, Flex, Image, Text, Button, Drawer,
  DrawerBody,
  VStack,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,

} from "@chakra-ui/react";
import { HamburgerIcon } from '@chakra-ui/icons'
import { Link } from "react-router-dom";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [placement, setPlacement] = React.useState('right')

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
  const eventData = {
    url: "lpe",
  };
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
      className={`transition duration-500 ease-in-out ${isScrolled ? "white shadow-md" : "transparent"
        }`}
    >
      <Flex w="100%" justify={["space-between"]} align="center">
        <Box display={["block", "block", "block", "none"]} h="100%" w="40px"></Box>
        <Link to="/">
          <Image
            w={isScrolled ? ["100px", "120px"] : ["120px", "150px"]}
            src="/logo.webp"
            alt="The Lemonade Logo"
            className={`duration-1000 ease-in-out `}
          />
        </Link>
        <Button display={["block", "block", "block", "none"]} bg="transparent" p="0" _hover={{ bg: "transparent" }} onClick={onOpen}><HamburgerIcon fontSize="20px" color={isScrolled ? "dark" : "white"} /></Button>
        <Drawer placement={placement} onClose={onClose} isOpen={isOpen} size={"full"}>
          <DrawerOverlay />
          <DrawerContent bg="rgba(0,0,0,0.8)">
            <DrawerCloseButton color="white" fontSize="20px" />
            <DrawerHeader ><Flex justify="center" align="center">
              <Link to="/">
                <Image
                  w={isScrolled ? ["100px", "120px"] : ["120px", "150px"]}
                  src="https://tlnevents.com/logo-white.png"
                  alt="The Lemonade Logo"
                  className={`duration-1000 ease-in-out `}
                />
              </Link>
            </Flex></DrawerHeader>
            <DrawerBody>

              <VStack h="80vh" justify="center" align="center" spacing="30px">

                <Link to={`/${eventData.url}/checkout`} target="_blank"><Text color="white" fontSize="30px" fontWeight="bold">Tickets</Text></Link>
                <Link to={`/${eventData.url}/merch`} target="_blank"><Text color="white" fontSize="30px" fontWeight="bold">Merch</Text></Link>
                <Link to={`/${eventData.url}`} target="_blank"><Text color="white" fontSize="30px" fontWeight="bold">Event</Text></Link>
                <Link as="button" onClick={() => { scrollToSection("experiences"); onClose() }}><Text color="white" fontSize="30px" fontWeight="bold">Experience</Text></Link>
                <Link as="button" onClick={() => { scrollToSection("about"); onClose() }}><Text color="white" fontSize="30px" fontWeight="bold">About</Text></Link>
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
        <Flex
          display={["none", "flex"]}
          justify="center"
          align="center"
          gap={["20px", "20px", "20px", "40px"]}
        >
          <Link to={`/${eventData.url}/checkout`} target="_blank">
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
          <Link to={`/${eventData.url}/merch`} target="_blank">
            <Text
              color={isScrolled ? "dark" : "white"}
              fontSize={
                isScrolled
                  ? ["16px", "18px", "20px", "22px"]
                  : ["18px", "20px", "22px", "24px"]
              }
            >
              Merch
            </Text>
          </Link>
          <Link to={`/${eventData.url}`} target="_blank">
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
