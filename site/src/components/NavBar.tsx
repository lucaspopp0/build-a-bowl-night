// MUI components used to build the top navigation bar.
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

// Top navigation bar showing the site title.
export default function NavBar() {
  // Renders a fixed app bar with the title.
  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" component="h1">
          Build-a-Bowl Night
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
