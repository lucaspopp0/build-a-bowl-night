// React state and the Radix components that make up the edit-name dialog.
import { useEffect, useState, type FormEvent } from "react";
import { Button, Callout, Dialog, Flex, TextField } from "@radix-ui/themes";
import Field from "../components/Field";
import { createUser } from "../lib/api";
import { saveCurrentUser, type CurrentUser } from "../lib/session";

// Props: the signed-in user, whether the dialog is open, how to close it, and what to do once the name is saved.
interface EditNameModalProps {
  user: CurrentUser;
  open: boolean;
  onClose: () => void;
  onSaved: (user: CurrentUser) => void;
}

// Dialog for changing the signed-in user's display name (the user API call is an upsert keyed by phone).
export default function EditNameModal({ user, open, onClose, onSaved }: EditNameModalProps) {
  // The typed name (null until edited, so it starts from the current name) plus request status.
  const [typed, setTyped] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [failure, setFailure] = useState<string>();
  const name = typed ?? user.name;

  // Starts from the current name with no error each time the dialog opens.
  useEffect(() => {
    // On open, start from the current name with no error.
    if (open) {
      setTyped(null);
      setFailure(undefined);
    }
  }, [open]);

  // Saves the trimmed name to the API and local storage, then reports the updated user.
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setFailure(undefined);

    // The name is required, ignoring surrounding whitespace.
    const trimmed = name.trim();
    if (!trimmed) {
      return;
    }

    // Skip the request when nothing changed; otherwise persist and update the session.
    setLoading(true);
    try {
      if (trimmed !== user.name) {
        await createUser(user.phone, trimmed);
      }
      const updated = { phone: user.phone, name: trimmed };
      saveCurrentUser(updated);
      onSaved(updated);
    } catch {
      setFailure("Something went wrong saving your name. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // A single name field with save and cancel buttons.
  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && !loading && onClose()}>
      <Dialog.Content maxWidth="400px" aria-describedby={undefined}>
        <Dialog.Title>Edit name</Dialog.Title>
        <form onSubmit={submit} noValidate>
          <Flex direction="column" gap="4">
            <Field label="Your name">
              <TextField.Root autoComplete="name" autoFocus value={name} disabled={loading} onChange={(e) => setTyped(e.target.value)} />
            </Field>
            {failure && (
              <Callout.Root color="red" size="1">
                <Callout.Text>{failure}</Callout.Text>
              </Callout.Root>
            )}
            <Button type="submit" size="3" loading={loading} disabled={!name.trim()}>
              Save
            </Button>
            <Button type="button" variant="soft" color="gray" size="3" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
