// React state and the Radix components that make up the edit-ingredient dialog.
import { useEffect, useState, type FormEvent } from "react";
import { Button, Select, TextField } from "@radix-ui/themes";
import Field from "../components/Field";
import Modal from "../components/Modal";
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
    // Copy the ingredient's current values into the form fields.
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
    <Modal
      open={ingredient !== null}
      title="Edit ingredient"
      onClose={onClose}
      busy={loading}
      onSubmit={submit}
      error={failure}
      actions={
        <>
          <Button type="button" variant="soft" color="gray" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" loading={loading} disabled={!category || !name.trim()}>
            Save
          </Button>
        </>
      }
    >
      <Field label="Category">
        <Select.Root value={category} onValueChange={setCategory} disabled={loading}>
          <Select.Trigger aria-label="Category" style={{ width: "100%" }} />
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
    </Modal>
  );
}
