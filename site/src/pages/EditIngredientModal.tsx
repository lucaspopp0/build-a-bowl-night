// React state and the MUI components that make up the edit-ingredient dialog.
import { useEffect, useState, type FormEvent } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { updateIngredient } from "../lib/api";
import { INGREDIENT_CATEGORIES, type Ingredient } from "../lib/ingredients";

// Props: the ingredient being edited (null when closed), how to close, and what to do once saved.
interface EditIngredientModalProps {
  ingredient: Ingredient | null;
  onClose: () => void;
  onSaved: (id: string, category: string, name: string) => void;
}

// Dialog for changing the category or name of an ingredient, with save and cancel buttons.
export default function EditIngredientModal({ ingredient, onClose, onSaved }: EditIngredientModalProps) {
  // Form state: the edited category and name, and request status.
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [failure, setFailure] = useState<string>();

  // Fills the form with the ingredient's current values each time a different one is opened.
  useEffect(() => {
    if (ingredient) {
      setCategory(ingredient.category);
      setName(ingredient.name);
      setFailure(undefined);
    }
  }, [ingredient]);

  // Sends the changes to the API, then reports them back to the page.
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!ingredient || !category || !trimmed) {
      return;
    }

    // Save it, then hand the result back to the page.
    setFailure(undefined);
    setLoading(true);
    try {
      const saved = await updateIngredient(ingredient.phone, ingredient.id, category, trimmed);
      onSaved(ingredient.id, saved.category, saved.name);
    } catch {
      setFailure("Something went wrong saving your changes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Category dropdown and name field, with cancel and save buttons.
  return (
    <Dialog open={ingredient !== null} onClose={loading ? undefined : onClose} fullWidth maxWidth="xs">
      <DialogTitle>Edit ingredient</DialogTitle>
      <Box component="form" onSubmit={submit} noValidate>
        <DialogContent sx={{ display: "grid", gap: 2 }}>
          <TextField
            select
            label="Category"
            fullWidth
            value={category}
            disabled={loading}
            onChange={(e) => setCategory(e.target.value)}
            sx={{ mt: 1 }}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading || !category || !name.trim()}>
            Save
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
