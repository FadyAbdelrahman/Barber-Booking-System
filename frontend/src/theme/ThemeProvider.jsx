import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { GlobalStyles } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: { default: "#0B0B0C", paper: "#111113" },
    primary: { main: "#E7E0D6" },
    secondary: { main: "#C7A86B" },
    text: { primary: "#E7E0D6", secondary: "rgba(231,224,214,0.72)" },
    divider: "rgba(231,224,214,0.12)",
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: ["Inter", "system-ui", "Segoe UI", "Roboto", "Arial", "sans-serif"].join(","),
    h1: { fontFamily: "Playfair Display, serif", letterSpacing: "-0.02em" },
    h2: { fontFamily: "Playfair Display, serif", letterSpacing: "-0.02em" },
    h3: { fontFamily: "Playfair Display, serif", letterSpacing: "-0.02em" },
    h4: { fontFamily: "Playfair Display, serif", letterSpacing: "-0.02em" },
    h5: { fontFamily: "Playfair Display, serif" },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          borderBottom: "1px solid rgba(231,224,214,0.10)",
          backdropFilter: "blur(10px)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 999, paddingLeft: 18, paddingRight: 18 },
        contained: { backgroundColor: "#C7A86B", color: "#0B0B0C" },
        outlined: { borderColor: "rgba(199,168,107,0.6)", color: "#E7E0D6" },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { backgroundImage: "none", border: "1px solid rgba(231,224,214,0.10)" },
      },
    },
  },
});

export function ThemeProvider({ children }) {
  return (
    <MuiThemeProvider theme={theme}>
      <GlobalStyles
        styles={{
          ":root": { colorScheme: "dark" },
          body: {
            background:
              "radial-gradient(900px 500px at 20% 10%, rgba(199,168,107,0.10), transparent 60%)," +
              "radial-gradient(700px 400px at 80% 0%, rgba(231,224,214,0.06), transparent 55%)," +
              "#0B0B0C",
          },
          a: { color: "inherit" },
        }}
      />
      {children}
    </MuiThemeProvider>
  );
}
