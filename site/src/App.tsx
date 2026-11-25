// Radix theme, the app's navbar, page and sign-in dialog.
import { useState } from "react";
import { Theme } from "@radix-ui/themes";
import useMediaQuery from "./hooks/useMediaQuery";
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

  // Forgets the signed-in user and closes the edit-name dialog so it can't reappear for the next sign-in.
  const logOut = () => {
    clearCurrentUser();
    setUser(null);
    setEditNameOpen(false);
  };

  // Follows the system light/dark preference and updates live when it changes.
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");

  // The Radix Theme provides colors, fonts and base styles for everything inside it.
  return (
    <Theme appearance={prefersDark ? "dark" : "light"} accentColor="blue" radius="medium">
      {/* Top bar with the sign-in button or user menu. */}
      <NavBar userName={user?.name} onSignIn={() => setSignInOpen(true)} onEditName={() => setEditNameOpen(true)} onLogOut={logOut} />
      <IngredientsPage user={user} />
      <SignInModal
        open={signInOpen}
        // Closes the dialog without signing in.
        onClose={() => setSignInOpen(false)}
        // Stores the signed-in user and closes the dialog.
        onSignedIn={(signedIn) => {
          setUser(signedIn);
          setSignInOpen(false);
        }}
      />
      {/* Edit-name dialog: only available while someone is signed in. */}
      {user && (
        <EditNameModal
          user={user}
          open={editNameOpen}
          // Closes the dialog without saving.
          onClose={() => setEditNameOpen(false)}
          // Adopts the renamed user and closes the dialog.
          onSaved={(updated) => {
            setUser(updated);
            setEditNameOpen(false);
          }}
        />
      )}
    </Theme>
  );
}
