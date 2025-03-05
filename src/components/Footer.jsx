// src/components/GiponetFooter.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Container } from "@mui/material"; // Import MUI components

const Footer = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        background: "linear-gradient(45deg, darkblue, darkblue)",  // Gradient background
        backdropFilter: "blur(10px)",  // Blur effect on the background
        borderBottom: '1px solid white',
        color: "white",
        padding: "10px 0",
        zIndex: 1000, // Ensure it's always on top
      }}
    >
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          flexWrap: "wrap", // Ensures the content doesn't overflow
        }}
      >
       
        <Typography variant="body2" sx={{ marginRight: 1 }}>
          <Link to="/privacy" style={{ color: "white", textDecoration: "none" }}>
            Gizlilik Politikası
          </Link>
        </Typography>
        <Typography variant="body2" sx={{ marginRight: 1 }}>
          <Link to="/terms" style={{ color: "white", textDecoration: "none" }}>
            Hizmet Şartları
          </Link>
        </Typography>
        <Typography variant="body2" sx={{ marginRight: 1 }}>
          <Link to="/contact" style={{ color: "white", textDecoration: "none" }}>
            Bize Ulaşın
          </Link>
        </Typography>

        {/* Copyright */}
        <Typography variant="body2" sx={{ marginTop: 0, marginLeft: 2 }}>
          © {new Date().getFullYear()}{" "}
          <a
            href="https://giyiyorum.com"
            style={{ color: "white", textDecoration: "none" }}
            target="_blank"
            rel="noopener noreferrer"
          >
            Giyiyorum.com
          </a>{" "}
          | Tüm hakları saklıdır.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
