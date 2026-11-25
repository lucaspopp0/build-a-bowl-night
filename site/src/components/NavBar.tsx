// Radix components and icons used to build the top navigation bar and its user menu.
import { ChevronDownIcon, ExitIcon, HamburgerMenuIcon, Pencil1Icon } from "@radix-ui/react-icons";
import { useRef } from "react";
import { Button, DropdownMenu, Flex, Heading, IconButton } from "@radix-ui/themes";
import useMediaQuery from "../hooks/useMediaQuery";

// Props: the signed-in user's name (if any) and the sign-in, edit-name and log-out handlers.
interface NavBarProps {
  userName?: string;
  onSignIn: () => void;
  onEditName: () => void;
  onLogOut: () => void;
}

// Top navigation bar: the title on the left, and a user section on the right.
export default function NavBar({ userName, onSignIn, onEditName, onLogOut }: NavBarProps) {
  // Narrow screens get a hamburger icon; wider ones show the user's name on the menu button.
  const isMobile = useMediaQuery("(max-width: 599.95px)");

  // Set while the menu is closing to open the edit-name dialog, so the menu skips returning focus to its trigger.
  const openingDialog = useRef(false);

  // Opens the edit-name dialog and flags that focus should stay with the dialog.
  const openEditName = () => {
    openingDialog.current = true;
    onEditName();
  };

  // Stops the menu from stealing focus back from the dialog it just opened; otherwise focus returns to the trigger as usual.
  const handleCloseAutoFocus = (e: Event) => {
    if (openingDialog.current) {
      e.preventDefault();
      openingDialog.current = false;
    }
  };

  // Renders a sticky bar with the title pushing the user section to the right.
  return (
    <Flex className="navbar" align="center" justify="between" px="4" asChild>
      <header>
        <Heading as="h1" size="5">
          Build-a-Bowl
        </Heading>
        {!userName ? (
          // Signed out: a single Sign In button.
          <Button variant="ghost" color="gray" highContrast size="3" onClick={onSignIn}>
            Sign In
          </Button>
        ) : (
          // Signed in: a click menu headed by the user's name, with edit-name and log-out entries.
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              {isMobile ? (
                <IconButton variant="ghost" color="gray" highContrast size="3" aria-label="Open user menu">
                  <HamburgerMenuIcon width="20" height="20" />
                </IconButton>
              ) : (
                <Button variant="ghost" color="gray" highContrast size="3">
                  {userName}
                  <ChevronDownIcon />
                </Button>
              )}
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end" onCloseAutoFocus={handleCloseAutoFocus}>
              {isMobile && <DropdownMenu.Label>Signed in as {userName}</DropdownMenu.Label>}
              <DropdownMenu.Item onSelect={openEditName}>
                <Pencil1Icon /> Edit name
              </DropdownMenu.Item>
              <DropdownMenu.Item onSelect={onLogOut}>
                <ExitIcon /> Log out
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        )}
      </header>
    </Flex>
  );
}
