// React state and the Radix components that make up the bring-one dialog.
import { useEffect, useState, type FormEvent } from "react";
import { Button, TextField } from "@radix-ui/themes";
import Field from "../components/Field";
import Modal from "../components/Modal";
import { createIngredient } from "../lib/api";
import type { CurrentUser } from "../lib/session";

// Props: whether the dialog is open, the category it was opened for, who is submitting, and the close and saved callbacks.
interface BringOneModalProps {
  open: boolean;
  category: string;
  user: CurrentUser;
  onClose: () => void;
  onCreated: (ingredient: { id: string; category: string; name: string }) => void;
}

// Dialog for volunteering to bring an ingredient in a specific category, opened from that category's section.
export default function BringOneModal({ open, category, user, onClose, onCreated }: BringOneModalProps) {
  // Form state: the typed name and request status; the category is fixed by the prop.
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [failure, setFailure] = useState<string>();

  // Clears the typed name and any error once the dialog has finished closing.
  const resetForm = () => {
    setName("");
    setFailure(undefined);
  };

  // Clears the form each time the dialog opens, so it never shows stale input.
  useEffect(() => {
    // On open, clear the form so it never shows stale input.
    if (open) {
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Sends the ingredient to the API on behalf of the current user, then reports it as created.
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setFailure(undefined);

    // Both fields are required; the name ignores surrounding whitespace.
    const trimmed = name.trim();
    if (!trimmed) {
      return;
    }

    // Save it, then hand the result back to the page.
    setLoading(true);
    try {
      const created = await createIngredient(user.phone, category, trimmed);
      onCreated({ id: created.id, category: created.category, name: created.name });
    } catch {
      setFailure("Something went wrong saving your ingredient. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Modal titled with the fixed category, containing a name field and cancel/submit buttons.
  return (
    <Modal
      open={open}
      title={`Bring a ${category.toLowerCase()}`}
      onClose={onClose}
      busy={loading}
      onSubmit={submit}
      error={failure}
      actions={
        <>
          <Button type="button" variant="soft" color="gray" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" loading={loading} disabled={!name.trim()}>
            Add {category.toLowerCase()}
          </Button>
        </>
      }
    >
      <Field label={category}>
        <TextField.Root autoFocus value={name} disabled={loading} onChange={(e) => setName(e.target.value)} />
      </Field>
    </Modal>
  );
}
