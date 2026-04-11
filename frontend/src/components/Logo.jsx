import { Box } from "@mui/material";
import MarkPng from "../assets/brand/sharp-society-assets/png/sharp-society-monogram-color-transparent.png";

export default function Logo({ size = 36 }) {
  return (
    <Box
      component="img"
      src={MarkPng}
      alt="Sharp Society logo"
      sx={{
        width: size,
        height: size,
        display: "inline-block",
        objectFit: "contain",
        userSelect: "none",
      }}
    />
  );
}
