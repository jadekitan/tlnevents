import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import "@fontsource/outfit";

import * as ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

const colors = {
  primary: {
    500: "#80BC00",
  },
  secondary: {
    500: "#F7EC31",
  },
};

const theme = extendTheme({
  colors,
  fonts: {
    heading: `'Urbanist', Arial, sans-serif`,
    body: `'Urbanist', Arial, sans-serif`,
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </StrictMode>
);
