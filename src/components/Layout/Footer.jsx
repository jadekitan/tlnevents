import React from "react";
import { Box, VStack, Flex, Image, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { IoMailOutline } from "react-icons/io5";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa";

const Footer = () => {
  return (
    <Box
      as="footer"
      w="100%"
      h={["150px", "175px"]}
      px={["20px", "50px", "75px", "100px"]}
    >
      <VStack w="100%" align="center" spacing="20px">
        <Flex w="100%" justify="space-between" align="center">
          <Link>
            <Image
              w={["100px", "125px", "135px", "150px"]}
              src="./logo.webp"
              alt="The Lemonade Logo"
            />
          </Link>
          <Flex justify="center" align="center" gap="20px">
            <Box display={["block", "block", "block", "none"]}>
              <Link to="mailto:info@lemonade.africa">
                <IoMailOutline />
              </Link>
            </Box>
            <Box display={["none", "none", "none", "block"]}>
              <Link to="mailto: info@lemonade.africa">
                <Text color="dark" fontSize="16px" lineHeight="24px">
                  info@lemonade.africa
                </Text>
              </Link>
            </Box>
            <Link to="https://instagram.com/lemonade.africa " target="_blank">
              <FaInstagram />
            </Link>
            <Link to="https://twitter.com/lemonade_africa" target="_blank">
              <FaXTwitter />
            </Link>
            <Link to="https://www.tiktok.com/@lemonade.africa" target="_blank">
              <FaTiktok />
            </Link>
          </Flex>
        </Flex>
        <Box w="100%" h={["1px", "2px"]} bg="dark"></Box>
        <Text color="dark" fontSize={["12px", "14px"]} lineHeight="20px">
          &copy; {new Date().getFullYear()} The Lemonade Network
        </Text>
      </VStack>
    </Box>
  );
};

export default Footer;
