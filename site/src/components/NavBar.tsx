// MUI components used to build the top navigation bar.
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
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
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
          Build-a-Bowl Night
        </Typography>
        {userName ? (
          // Signed in: the name with a Log Out button underneath it.
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <Typography variant="body1">{userName}</Typography>
            <Button color="inherit" size="small" onClick={onLogOut}>
              Log Out
            </Button>
          </Box>
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
