// React state and the Radix components that make up the delete-confirmation dialog.
import { useEffect, useState } from "react";
import { Button } from "@radix-ui/themes";
import Modal from "../components/Modal";
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

  // The most recent ingredient, kept so the dialog text doesn't go blank while it fades out.
  const [lastIngredient, setLastIngredient] = useState<Ingredient | null>(null);
  if (ingredient && ingredient !== lastIngredient) {
    setLastIngredient(ingredient);
  }

  // Clears any earlier error each time the dialog opens.
  useEffect(() => {
    // When a different ingredient is shown, drop any earlier error.
    if (ingredient) {
      setFailure(undefined);
    }
  }, [ingredient]);

  // Confirmation question with No and Yes buttons.
  return (
    <Modal
      open={ingredient !== null}
      title="Delete ingredient?"
      description={`Are you sure you want to delete ${(ingredient ?? lastIngredient)?.name}?`}
      onClose={onClose}
      busy={loading}
      error={failure}
      actions={
        <>
          <Button variant="soft" color="gray" onClick={onClose} disabled={loading}>
            No
          </Button>
          {/* Confirm uses a plain Button (not AlertDialog.Action) so the dialog stays open while the request runs. */}
          <Button color="red" onClick={confirm} loading={loading}>
            Yes
          </Button>
        </>
      }
    />
  );
}
