// Radix components used to build the page header and its signed-in status line.
import { Button, Container, Flex, Heading, Link, Text } from "@radix-ui/themes";
// Icon shown next to links that leave the site.
import { ExternalLinkIcon } from "@radix-ui/react-icons";

// Address of the event's Partiful page.
const PARTIFUL_URL = "https://partiful.com/e/FYr9aQWNWEZX2Q9hshEh?c=qOMivMPb";

// Props: the signed-in user's name (if any) and the sign-in, edit-name and log-out handlers.
interface PageHeaderProps {
  userName?: string;
  onSignIn: () => void;
  onEditName: () => void;
  onLogOut: () => void;
}

// Page header: a left-aligned title with a line below saying who is signed in and what they can do.
export default function PageHeader({ userName, onSignIn, onEditName, onLogOut }: PageHeaderProps) {
  // Renders the title, then either the signed-out prompt or the user's name with edit and log-out buttons.
  return (
    <Container size="3" px="4" pt="5" asChild>
      <header>
        <Heading as="h1" size="7">
          Build-a-Bowl Night
        </Heading>
        {/* Link to the Partiful event page, opening in a new tab, with an external-link icon. */}
        <Text as="p" size="3" mt="2">
          <Link href={PARTIFUL_URL} target="_blank" rel="noopener noreferrer">
            View Partiful event <ExternalLinkIcon style={{ verticalAlign: "middle" }} />
          </Link>
        </Text>
        <Flex align="center" gap="3" wrap="wrap" mt="2">
          {!userName ? (
            // Signed out: the "sign in" words are a link that opens the sign-in dialog.
            <Text as="p" size="3" color="gray">
              Not signed in,{" "}
              <Link
                href="#"
                // Opens the sign-in dialog instead of navigating.
                onClick={(e) => {
                  e.preventDefault();
                  onSignIn();
                }}
              >
                sign in
              </Link>{" "}
              to bring something
            </Text>
          ) : (
            <>
              {/* Signed in: the current user's name, followed by the edit-name and log-out buttons. */}
              <Text as="p" size="3">
                Signed in as <Text weight="bold">{userName}</Text>
              </Text>
              <Button variant="soft" color="gray" size="1" onClick={onEditName}>
                edit username
              </Button>
              <Button variant="soft" color="gray" size="1" onClick={onLogOut}>
                logout
              </Button>
            </>
          )}
        </Flex>
      </header>
    </Container>
  );
}
