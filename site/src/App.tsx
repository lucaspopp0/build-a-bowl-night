// MUI theme, baseline styles, the app's navbar and the page for the current sign-in state.
import { useMemo, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import NavBar from "./components/NavBar";
import IngredientsPage from "./pages/IngredientsPage";
import SignInPage from "./pages/SignInPage";
import { clearCurrentUser, loadCurrentUser, type CurrentUser } from "./lib/session";

// Root component: navbar on top, then the sign-in page or the ingredients page.
export default function App() {
  // The signed-in user, restored from local storage on first load.
  const [user, setUser] = useState<CurrentUser | null>(loadCurrentUser);

  // Forgets the signed-in user, which returns the app to the sign-in page.
  const signOut = () => {
    clearCurrentUser();
    setUser(null);
  };

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
      <NavBar userName={user?.name} onSignOut={signOut} />
      {user ? <IngredientsPage /> : <SignInPage onSignedIn={setUser} />}
    </ThemeProvider>
  );
}
