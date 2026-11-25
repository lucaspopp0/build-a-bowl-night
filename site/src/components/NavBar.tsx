// MUI components used to build the top navigation bar.
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

// Props: the signed-in user's name (if any) and the sign-in and log-out handlers.
interface NavBarProps {
  userName?: string;
  onSignIn: () => void;
  onLogOut: () => void;
}

// Top navigation bar: the title on the left, and a user section on the right.
export default function NavBar({ userName, onSignIn, onLogOut }: NavBarProps) {
  // Renders a sticky app bar with the title pushing the user section to the right.
  return (
    // Always dark green with light text, regardless of light/dark mode.
    <AppBar position="sticky" enableColorOnDark sx={{ bgcolor: "#1b5e20", backgroundImage: "none", color: "#f1f8e9" }}>
      <Toolbar>
        <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
          Build-a-Bowl Ingredients
        </Typography>
        {userName ? (
          // Signed in: one button showing the name with "Log Out" tightly stacked below it.
          <Button
            color="inherit"
            onClick={onLogOut}
            sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", textTransform: "none", lineHeight: 1.2 }}
          >
            <Typography variant="body1" sx={{ lineHeight: 1.2 }}>
              {userName}
            </Typography>
            <Typography variant="caption" sx={{ lineHeight: 1.2, opacity: 0.8 }}>
              LOG OUT
            </Typography>
          </Button>
        ) : (
          // Signed out: a single Sign In button.
          <Button color="inherit" onClick={onSignIn}>
            Sign In
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
