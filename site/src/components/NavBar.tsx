// MUI components used to build the top navigation bar.
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

// Props: the signed-in user's name (if any) and the sign-out handler.
interface NavBarProps {
  userName?: string;
  onSignOut: () => void;
}

// Top navigation bar showing the site title and, when signed in, the user and a sign-out button.
export default function NavBar({ userName, onSignOut }: NavBarProps) {
  // Renders a sticky app bar with the title pushing the user controls to the right.
  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
          Build-a-Bowl Night
        </Typography>
        {userName && (
          <>
            <Typography sx={{ mr: 2 }}>{userName}</Typography>
            <Button color="inherit" onClick={onSignOut}>
              Sign out
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
