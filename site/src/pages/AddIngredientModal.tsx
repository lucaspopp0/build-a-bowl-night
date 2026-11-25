// React state and the MUI components that make up the add-ingredient dialog.
import { useState, type FormEvent } from "react";
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

// Props: whether the dialog is open, who is submitting, how to close it, and what to do once saved.
interface AddIngredientModalProps {
  open: boolean;
  user: CurrentUser;
  onClose: () => void;
  onCreated: (ingredient: { id: string; category: string; name: string }) => void;
}

// Dialog for submitting a new ingredient the current user is bringing.
export default function AddIngredientModal({ open, user, onClose, onCreated }: AddIngredientModalProps) {
  // Form state: the chosen category, the typed name, and request status.
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [failure, setFailure] = useState<string>();

  // Clears the form once the dialog has finished closing.
  const resetForm = () => {
    setCategory("");
    setName("");
    setFailure(undefined);
  };

  // Sends the ingredient to the API on behalf of the current user, then reports it as created.
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setFailure(undefined);

    // Both fields are required; the name ignores surrounding whitespace.
    const trimmed = name.trim();
    if (!category || !trimmed) {
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

  // Category dropdown, name field, and submit button inside a dialog.
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      slotProps={{ transition: { onExited: resetForm } }}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>Bring something</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={submit} noValidate sx={{ display: "grid", gap: 2, pt: 1 }}>
          <TextField
            select
            label="Category"
            fullWidth
            value={category}
            disabled={loading}
            onChange={(e) => setCategory(e.target.value)}
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
            value={name}
            disabled={loading}
            onChange={(e) => setName(e.target.value)}
          />
          {failure && <Alert severity="error">{failure}</Alert>}
          <Button type="submit" variant="contained" disabled={loading || !category || !name.trim()}>
            Add ingredient
          </Button>
          {/* Bottom cancel button that dismisses the dialog. */}
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
