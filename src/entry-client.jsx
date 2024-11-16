import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import "@fontsource/urbanist";
import "@glidejs/glide/dist/css/glide.core.min.css";
import "@glidejs/glide/dist/css/glide.theme.min.css";
import * as ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import App from "./App";
import "./index.css";

const colors = {
  dark: "#000000",
  primary: {
    400: "#BFDF37",
    500: "#80BC00",
  },
  secondary: {
    500: "#F7EC31",
  },
  neutral: {
    500: "#606060",
  },
  white: "#fff",
};

const theme = extendTheme({
  colors,
  fonts: {
    heading: `'Urbanist', Arial, sans-serif`,
    body: `'Urbanist', Arial, sans-serif`,
  },
});

hydrateRoot(
  document.getElementById("root"),
  <StrictMode>
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </BrowserRouter>
    </ChakraProvider>
  </StrictMode>
);
