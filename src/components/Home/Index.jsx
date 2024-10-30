import React from "react";
import { VStack } from "@chakra-ui/react";
import Header from "../Layout/Header";
import Hero from "./Hero";
import Experiences from "./Experiences";
import Testimonials from "./Testimonials";
import Sponsors from "./Sponsors";
import About from "./About";
import Footer from "../Layout/Footer";

const Index = () => {
  return (
    <VStack
      w="100%"
      justify="center"
      align="center"
      spacing={["50px", "60px", "75px", "100px"]}
    >
      <Header />
      <Hero />
      <VStack
        w="100%"
        justify="center"
        align="center"
        spacing={["50px", "60px", "70px", "75px", "100px"]}
        px={["20px", "50px", "75px", "100px"]}
      >
        <Experiences />
        <Testimonials />
      </VStack>
      <Sponsors />
      <VStack
        w="100%"
        justify="center"
        align="center"
        spacing={["50px", "60px", "70px", "75px", "100px"]}
        px={["20px", "50px", "75px", "100px"]}
      >
        <About />
      </VStack>

      <Footer />
    </VStack>
  );
};

export default Index;
