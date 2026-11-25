// React state and the Radix components that make up the delete-confirmation dialog.
import { useEffect, useState } from "react";
import { AlertDialog, Button, Callout, Flex } from "@radix-ui/themes";
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

  // Clears any earlier error each time the dialog opens.
  useEffect(() => {
    // When a different ingredient is shown, drop any earlier error.
    if (ingredient) {
      setFailure(undefined);
    }
  }, [ingredient]);

  // Confirmation question with No and Yes buttons.
  return (
    <AlertDialog.Root open={ingredient !== null} onOpenChange={(next) => !next && !loading && onClose()}>
      <AlertDialog.Content maxWidth="400px">
        <AlertDialog.Title>Delete ingredient?</AlertDialog.Title>
        <AlertDialog.Description size="2">Are you sure you want to delete {ingredient?.name}?</AlertDialog.Description>
        {failure && (
              <Callout.Root color="red" size="1" mt="3">
                <Callout.Text>{failure}</Callout.Text>
              </Callout.Root>
            )}
        <Flex gap="3" mt="4" justify="end">
          <Button variant="soft" color="gray" onClick={onClose} disabled={loading}>
            No
          </Button>
          {/* Confirm uses a plain Button (not AlertDialog.Action) so the dialog stays open while the request runs. */}
          <Button color="red" onClick={confirm} loading={loading}>
            Yes
          </Button>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}
