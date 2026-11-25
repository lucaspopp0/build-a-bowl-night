// React state and the Radix components that make up the add-ingredient dialog.
import { useEffect, useState, type FormEvent } from "react";
import { Button, Callout, Dialog, Flex, Select, TextField } from "@radix-ui/themes";
import Field from "../components/Field";
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

  // Clears the form each time the dialog opens, so it never shows stale input.
  useEffect(() => {
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
    <Dialog.Root open={open} onOpenChange={(next) => !next && !loading && onClose()}>
      <Dialog.Content maxWidth="400px" aria-describedby={undefined}>
        <Dialog.Title>Bring something</Dialog.Title>
        <form onSubmit={submit} noValidate>
          <Flex direction="column" gap="4">
            <Field label="Category">
              <Select.Root value={category} onValueChange={setCategory} disabled={loading}>
                <Select.Trigger placeholder="Choose a category" aria-label="Category" style={{ width: "100%" }} />
                <Select.Content>
                  {INGREDIENT_CATEGORIES.map((c) => (
                    <Select.Item key={c} value={c}>
                      {c}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </Field>
            <Field label="Ingredient">
              <TextField.Root value={name} disabled={loading} onChange={(e) => setName(e.target.value)} />
            </Field>
            {failure && (
              <Callout.Root color="red" size="1">
                <Callout.Text>{failure}</Callout.Text>
              </Callout.Root>
            )}
            <Button type="submit" size="3" loading={loading} disabled={!category || !name.trim()}>
              Add ingredient
            </Button>
            {/* Bottom cancel button that dismisses the dialog. */}
            <Button type="button" variant="soft" color="gray" size="3" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
