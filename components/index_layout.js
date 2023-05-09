import { ThemeProvider, CSSReset, theme, Box } from "@chakra-ui/react";
import Footer from "./footer";
import Header from "./header";
import React from "react";

export default function IndexLayout({ children }) {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Header />
        <Box>
          <main>{children}</main>
        </Box>
        <Footer />
      </ThemeProvider>
    </>
  );
}
