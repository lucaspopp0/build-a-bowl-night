// React state and the MUI components that make up the edit-name dialog.
import { useState, type FormEvent } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
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

  // A single name field with save and cancel buttons; the field resets once the dialog has closed.
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      slotProps={{ transition: { onExited: () => { setTyped(null); setFailure(undefined); } } }}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>Edit name</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={submit} noValidate sx={{ display: "grid", gap: 2, pt: 1 }}>
          <TextField
            label="Your name"
            autoComplete="name"
            autoFocus
            fullWidth
            value={name}
            disabled={loading}
            onChange={(e) => setTyped(e.target.value)}
          />
          {failure && <Alert severity="error">{failure}</Alert>}
          <Button type="submit" variant="contained" disabled={loading || !name.trim()}>
            Save
          </Button>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
