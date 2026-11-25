// MUI theme, baseline styles, the app's navbar, page and sign-in dialog.
import { useMemo, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import NavBar from "./components/NavBar";
import IngredientsPage from "./pages/IngredientsPage";
import SignInModal from "./pages/SignInModal";
import { clearCurrentUser, loadCurrentUser, type CurrentUser } from "./lib/session";

// Root component: navbar on top, the ingredients page, and the sign-in dialog.
export default function App() {
  // The signed-in user, restored from local storage on first load.
  const [user, setUser] = useState<CurrentUser | null>(loadCurrentUser);

  // Whether the sign-in dialog is showing.
  const [signInOpen, setSignInOpen] = useState(false);

  // Forgets the signed-in user.
  const logOut = () => {
    clearCurrentUser();
    setUser(null);
  };

  // Follows the system light/dark preference and updates live when it changes.
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDark ? "dark" : "light",
          // In light mode, a very slightly gray page background (cards stay white).
          ...(prefersDark ? {} : { background: { default: "#f5f5f5" } }),
          // Dark green accent; dark mode uses a lighter shade of it so it stays readable on dark surfaces.
          primary: prefersDark
            ? { main: "#66bb6a", light: "#98ee99", dark: "#338a3e", contrastText: "#0b2410" }
            : { main: "#1b5e20", light: "#4c8c4a", dark: "#003300", contrastText: "#ffffff" },
        },
        // Google Sans is bundled via @fontsource in main.tsx.
        typography: { fontFamily: '"Google Sans", "Helvetica", "Arial", sans-serif' },
      }),
    [prefersDark],
  );

  // CssBaseline normalizes browser styles and applies the theme's background.
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NavBar userName={user?.name} onSignIn={() => setSignInOpen(true)} onLogOut={logOut} />
      <IngredientsPage user={user} />
      <SignInModal
        open={signInOpen}
        onClose={() => setSignInOpen(false)}
        onSignedIn={(signedIn) => {
          setUser(signedIn);
          setSignInOpen(false);
        }}
      />
    </ThemeProvider>
  );
}
