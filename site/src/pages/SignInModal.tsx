// React state and the MUI components that make up the sign-in dialog.
import { useState, type FormEvent } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import PhoneNumberField from "../components/PhoneNumberField";
import { createUser, findUser } from "../lib/api";
import { normalizePhone } from "../lib/phone";
import { saveCurrentUser, type CurrentUser } from "../lib/session";

// Props: whether the dialog is open, how to close it, and what to do once the user is signed in.
interface SignInModalProps {
  open: boolean;
  onClose: () => void;
  onSignedIn: (user: CurrentUser) => void;
}

// Sign-in dialog by phone number; unknown numbers are asked for a name and registered as new users.
export default function SignInModal({ open, onClose, onSignedIn }: SignInModalProps) {
  // Form state: what was typed, the validated phone once looked up, and request status.
  const [phoneInput, setPhoneInput] = useState("");
  const [phoneError, setPhoneError] = useState<string>();
  const [newUserPhone, setNewUserPhone] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [failure, setFailure] = useState<string>();

  // Stores the user locally and tells the app they are signed in.
  const finishSignIn = (user: CurrentUser) => {
    saveCurrentUser(user);
    onSignedIn(user);
  };

  // Validates the phone number, then signs in the existing user or asks for a name.
  const submitPhone = async (e: FormEvent) => {
    e.preventDefault();
    setFailure(undefined);

    // Reject numbers that cannot be real before calling the API.
    const phone = normalizePhone(phoneInput);
    if (!phone) {
      setPhoneError("Enter a valid phone number");
      return;
    }
    setPhoneError(undefined);

    // Look the number up: known users sign in, unknown numbers move on to the name step.
    setLoading(true);
    try {
      const user = await findUser(phone);
      if (user) {
        finishSignIn({ phone: user.phone, name: user.name });
      } else {
        setNewUserPhone(phone);
      }
    } catch {
      setFailure("Something went wrong looking up your number. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Creates the new user with the entered name, then signs them in.
  const submitName = async (e: FormEvent) => {
    e.preventDefault();
    setFailure(undefined);

    // The name is required, ignoring surrounding whitespace.
    const trimmed = name.trim();
    if (!newUserPhone || !trimmed) {
      return;
    }

    // Create the user, then store exactly the phone and name that were entered.
    setLoading(true);
    try {
      await createUser(newUserPhone, trimmed);
      finishSignIn({ phone: newUserPhone, name: trimmed });
    } catch {
      setFailure("Something went wrong creating your account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Goes back to the phone step so a mistyped number can be corrected.
  const changeNumber = () => {
    setNewUserPhone(null);
    setName("");
    setFailure(undefined);
  };

  // Clears the form once the dialog has finished closing, so it reopens on the phone step.
  const resetForm = () => {
    setPhoneInput("");
    setPhoneError(undefined);
    setNewUserPhone(null);
    setName("");
    setFailure(undefined);
  };

  // Phone step first; once the number is unknown, the name step replaces it.
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      slotProps={{ transition: { onExited: resetForm } }}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>Sign in</DialogTitle>
      <DialogContent>
        {newUserPhone === null ? (
          <Box component="form" onSubmit={submitPhone} noValidate sx={{ display: "grid", gap: 2, pt: 1 }}>
            <PhoneNumberField value={phoneInput} onChange={setPhoneInput} error={phoneError} disabled={loading} />
            {failure && <Alert severity="error">{failure}</Alert>}
            <Button type="submit" variant="contained" disabled={loading}>
              Continue
            </Button>
          </Box>
        ) : (
          <Box component="form" onSubmit={submitName} noValidate sx={{ display: "grid", gap: 2, pt: 1 }}>
            <Typography color="text.secondary">
              We don't know {newUserPhone} yet. What's your name?
            </Typography>
            <TextField
              label="Your name"
              autoComplete="name"
              autoFocus
              fullWidth
              value={name}
              disabled={loading}
              onChange={(e) => setName(e.target.value)}
            />
            {failure && <Alert severity="error">{failure}</Alert>}
            <Button type="submit" variant="contained" disabled={loading || !name.trim()}>
              Create account
            </Button>
            <Button onClick={changeNumber} disabled={loading}>
              Change number
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
