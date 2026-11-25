// React state and the Radix components that make up the sign-in dialog.
import { useEffect, useState, type FormEvent } from "react";
import { Button, Callout, Dialog, Flex, Select, Text, TextField } from "@radix-ui/themes";
import Field from "../components/Field";
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

  // Clears the form each time the dialog opens, so it never shows stale input.
  useEffect(() => {
    if (open) {
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Phone step first; once the number is unknown, the name step replaces it.
  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && !loading && onClose()}>
      <Dialog.Content maxWidth="400px" aria-describedby={undefined}>
        <Dialog.Title>Sign in</Dialog.Title>
        {newUserPhone === null ? (
          <form onSubmit={submitPhone} noValidate>
            <Flex direction="column" gap="4">
              <PhoneNumberField value={phoneInput} onChange={setPhoneInput} error={phoneError} disabled={loading} />
              {failure && (
              <Callout.Root color="red" size="1">
                <Callout.Text>{failure}</Callout.Text>
              </Callout.Root>
            )}
              <Button type="submit" size="3" loading={loading}>
                Continue
              </Button>
              {/* Bottom cancel button that dismisses the dialog. */}
              <Button type="button" variant="soft" color="gray" size="3" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
            </Flex>
          </form>
        ) : (
          <form onSubmit={submitName} noValidate>
            <Flex direction="column" gap="4">
              <Text color="gray">
                We don't know {newUserPhone} yet. What's your name?
              </Text>
              <Field label="Your name">
                <TextField.Root autoComplete="name" autoFocus value={name} disabled={loading} onChange={(e) => setName(e.target.value)} />
              </Field>
              {failure && (
              <Callout.Root color="red" size="1">
                <Callout.Text>{failure}</Callout.Text>
              </Callout.Root>
            )}
              <Button type="submit" size="3" loading={loading} disabled={!name.trim()}>
                Create account
              </Button>
              <Button type="button" variant="soft" color="gray" size="3" onClick={changeNumber} disabled={loading}>
                Change number
              </Button>
              {/* Bottom cancel button that dismisses the dialog. */}
              <Button type="button" variant="soft" color="gray" size="3" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
            </Flex>
          </form>
        )}
      </Dialog.Content>
    </Dialog.Root>
  );
}
