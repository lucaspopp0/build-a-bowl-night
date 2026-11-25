// React state and the MUI components used to build the top navigation bar and its user menu.
import { useRef, useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import EditIcon from "@mui/icons-material/Edit";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

// Props: the signed-in user's name (if any) and the sign-in, edit-name and log-out handlers.
interface NavBarProps {
  userName?: string;
  onSignIn: () => void;
  onEditName: () => void;
  onLogOut: () => void;
}

// Top navigation bar: the title on the left, and a user section on the right.
export default function NavBar({ userName, onSignIn, onEditName, onLogOut }: NavBarProps) {
  // Narrow screens get a hamburger menu; wider ones get a menu that opens on hover.
  const isMobile = useMediaQuery(useTheme().breakpoints.down("sm"));

  // The element the menu anchors to; its presence also means the menu is open.
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const close = () => setAnchor(null);

  // Closes the menu, then runs the chosen action.
  const choose = (action: () => void) => () => {
    close();
    action();
  };

  // The shared menu entries: edit name, then log out.
  const items = [
    <MenuItem key="edit" onClick={choose(onEditName)}>
      <ListItemIcon>
        <EditIcon fontSize="small" />
      </ListItemIcon>
      Edit name
    </MenuItem>,
    <MenuItem key="logout" onClick={choose(onLogOut)}>
      <ListItemIcon>
        <LogoutIcon fontSize="small" />
      </ListItemIcon>
      Log out
    </MenuItem>,
  ];

  // Renders a sticky app bar with the title pushing the user section to the right.
  return (
    // Default (non-accent) app bar colors, following the light/dark theme.
    <AppBar position="sticky" color="default">
      <Toolbar>
        <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
          Build-a-Bowl
        </Typography>
        {!userName ? (
          // Signed out: a single Sign In button.
          <Button color="inherit" onClick={onSignIn}>
            Sign In
          </Button>
        ) : isMobile ? (
          // Mobile: a hamburger button opening a click menu headed by the user's name.
          <>
            <IconButton color="inherit" aria-label="Open user menu" edge="end" onClick={(e) => setAnchor(e.currentTarget)}>
              <MenuIcon />
            </IconButton>
            <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={close}>
              <Typography variant="body2" color="text.secondary" sx={{ px: 2, py: 0.5 }}>
                Signed in as {userName}
              </Typography>
              <Divider />
              {items}
            </Menu>
          </>
        ) : (
          // Desktop: the name opens a menu on hover (or click/focus, for keyboard and touch users).
          <Box onMouseEnter={() => setAnchor(buttonRef.current)} onMouseLeave={close}>
            <Button
              ref={buttonRef}
              color="inherit"
              endIcon={<ArrowDropDownIcon />}
              aria-haspopup="menu"
              aria-expanded={Boolean(anchor)}
              onClick={() => setAnchor(buttonRef.current)}
              sx={{ textTransform: "none", fontSize: "1rem" }}
            >
              {userName}
            </Button>
            <Popper open={Boolean(anchor)} anchorEl={anchor} placement="bottom-end" sx={{ zIndex: "modal" }}>
              <ClickAwayListener onClickAway={close}>
                <Paper elevation={8}>
                  <MenuList autoFocusItem={false} onKeyDown={(e) => e.key === "Escape" && close()}>
                    {items}
                  </MenuList>
                </Paper>
              </ClickAwayListener>
            </Popper>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
