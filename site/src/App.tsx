// MUI theme, baseline styles, the app's navbar, page and sign-in dialog.
import { useMemo, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import NavBar from "./components/NavBar";
import IngredientsPage from "./pages/IngredientsPage";
import EditNameModal from "./pages/EditNameModal";
import SignInModal from "./pages/SignInModal";
import { clearCurrentUser, loadCurrentUser, type CurrentUser } from "./lib/session";

// Root component: navbar on top, the ingredients page, and the sign-in dialog.
export default function App() {
  // The signed-in user, restored from local storage on first load.
  const [user, setUser] = useState<CurrentUser | null>(loadCurrentUser);

  // Whether the sign-in dialog is showing.
  const [signInOpen, setSignInOpen] = useState(false);

  // Whether the edit-name dialog is showing.
  const [editNameOpen, setEditNameOpen] = useState(false);

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
      <NavBar userName={user?.name} onSignIn={() => setSignInOpen(true)} onEditName={() => setEditNameOpen(true)} onLogOut={logOut} />
      <IngredientsPage user={user} />
      <SignInModal
        open={signInOpen}
        onClose={() => setSignInOpen(false)}
        onSignedIn={(signedIn) => {
          setUser(signedIn);
          setSignInOpen(false);
        }}
      />
      {user && (
        <EditNameModal
          user={user}
          open={editNameOpen}
          onClose={() => setEditNameOpen(false)}
          onSaved={(updated) => {
            setUser(updated);
            setEditNameOpen(false);
          }}
        />
      )}
    </ThemeProvider>
  );
}
