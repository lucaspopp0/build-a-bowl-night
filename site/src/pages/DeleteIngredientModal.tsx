// React state and the MUI components that make up the delete-confirmation dialog.
import { useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { deleteIngredient } from "../lib/api";
import type { Ingredient } from "../lib/ingredients";

// Props: the ingredient to delete (null when closed), how to close, and what to do once deleted.
interface DeleteIngredientModalProps {
  ingredient: Ingredient | null;
  onClose: () => void;
  onDeleted: (id: string) => void;
}

// Yes/no confirmation dialog for removing an ingredient.
export default function DeleteIngredientModal({ ingredient, onClose, onDeleted }: DeleteIngredientModalProps) {
  // Request status for the delete call.
  const [loading, setLoading] = useState(false);
  const [failure, setFailure] = useState<string>();

  // Deletes the ingredient through the API, then reports it as deleted.
  const confirm = async () => {
    if (!ingredient) {
      return;
    }

    // Send the delete, then hand the id back to the page.
    setFailure(undefined);
    setLoading(true);
    try {
      await deleteIngredient(ingredient.phone, ingredient.id);
      onDeleted(ingredient.id);
    } catch {
      setFailure("Something went wrong deleting your ingredient. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Confirmation question with No and Yes buttons.
  return (
    <Dialog
      open={ingredient !== null}
      onClose={loading ? undefined : onClose}
      slotProps={{ transition: { onExited: () => setFailure(undefined) } }}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>Delete ingredient?</DialogTitle>
      <DialogContent>
        <DialogContentText>Are you sure you want to delete {ingredient?.name}?</DialogContentText>
        {failure && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {failure}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          No
        </Button>
        <Button color="error" variant="contained" onClick={confirm} disabled={loading}>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
