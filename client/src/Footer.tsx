import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import React from "react";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import linkedin from "./assets/linkedin.png";
import github from "./assets/github.png";
const Footer = () => {
  return (
    <Stack spacing={1}
      sx={{ display: "flex", flexDirection: "center", alignItems: "center" }}
    >
      <Box>
        <Button
          href="https://github.com/Jbridges1119"
          target="_blank"
          rel="noreferrer noopener"
        >
          <img
            src={github}
            alt={""}
            loading="lazy"
            style={{ height: "60px" }}
          />
        </Button>
        <Button
          href="https://www.linkedin.com/in/jeff-bridges-bb755a236/"
          target="_blank"
          rel="noreferrer noopener"
        >
          <img
            src={linkedin}
            alt={""}
            loading="lazy"
            style={{ height: "60px" }}
          />
        </Button>
        <Button href="mailto:Jbridges1119@gmail.com" target="_blank">
          <MailOutlineIcon
            sx={{ height: "60px", width: "60px", color: "black" }}
          />
        </Button>
      </Box>
      <Divider />
      <Button
        sx={{ all: "unset", cursor: "pointer" }}
        href="https://github.com/Jbridges1119/refrigerant-tracker"
        target="_blank"
        rel="noreferrer noopener"
      >
        <Typography variant="body2">
          Designed and Built By Jeff Bridges
        </Typography>
      </Button>
    </Stack>
  );
};

export default Footer;
