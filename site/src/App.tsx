// MUI theme, baseline styles and the app's navbar and page.
import { useMemo } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import NavBar from "./components/NavBar";
import IngredientsPage from "./pages/IngredientsPage";

// Root component: navbar on top, with the single page below it.
export default function App() {
  // Follows the system light/dark preference and updates live when it changes.
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = useMemo(
    () =>
      createTheme({
        palette: { mode: prefersDark ? "dark" : "light" },
        // Google Sans is bundled via @fontsource in main.tsx.
        typography: { fontFamily: '"Google Sans", "Helvetica", "Arial", sans-serif' },
      }),
    [prefersDark],
  );

  // CssBaseline normalizes browser styles and applies the theme's background.
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NavBar />
      <IngredientsPage />
    </ThemeProvider>
  );
}
