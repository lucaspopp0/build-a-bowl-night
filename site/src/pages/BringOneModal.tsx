// React state and the MUI components that make up the bring-one dialog.
import { useEffect, useState, type FormEvent } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { createIngredient } from "../lib/api";
import { INGREDIENT_CATEGORIES } from "../lib/ingredients";
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
  // Form state: the chosen category (pre-filled from the prop), the typed name, and request status.
  const [selected, setSelected] = useState(category);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [failure, setFailure] = useState<string>();

  // Pre-populates the category each time the dialog is opened for a (possibly different) category.
  useEffect(() => {
    if (open) {
      setSelected(category);
    }
  }, [open, category]);

  // Clears the typed name and any error once the dialog has finished closing.
  const resetForm = () => {
    setName("");
    setFailure(undefined);
  };

  // Sends the ingredient to the API on behalf of the current user, then reports it as created.
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setFailure(undefined);

    // Both fields are required; the name ignores surrounding whitespace.
    const trimmed = name.trim();
    if (!selected || !trimmed) {
      return;
    }

    // Save it, then hand the result back to the page.
    setLoading(true);
    try {
      const created = await createIngredient(user.phone, selected, trimmed);
      onCreated({ id: created.id, category: created.category, name: created.name });
    } catch {
      setFailure("Something went wrong saving your ingredient. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Titled dialog with the pre-selected category, a name field, and a submit button.
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      slotProps={{ transition: { onExited: resetForm } }}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>Bring a {category}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={submit} noValidate sx={{ display: "grid", gap: 2, pt: 1 }}>
          <TextField
            select
            label="Category"
            fullWidth
            value={selected}
            disabled={loading}
            onChange={(e) => setSelected(e.target.value)}
          >
            {INGREDIENT_CATEGORIES.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Ingredient"
            fullWidth
            autoFocus
            value={name}
            disabled={loading}
            onChange={(e) => setName(e.target.value)}
          />
          {failure && <Alert severity="error">{failure}</Alert>}
          <Button type="submit" variant="contained" disabled={loading || !selected || !name.trim()}>
            Add ingredient
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
