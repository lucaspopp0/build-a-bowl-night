// Radix layout components, the ingredient table, and the add, edit and delete flows.
import { useEffect, useState } from "react";
import { PlusIcon } from "@radix-ui/react-icons";
import { Button, Callout, Container, Flex, Spinner } from "@radix-ui/themes";
import IngredientTable from "../components/IngredientTable";
import { listIngredients } from "../lib/api";
import type { Ingredient } from "../lib/ingredients";
import type { CurrentUser } from "../lib/session";
import AddIngredientModal from "./AddIngredientModal";
import BringOneModal from "./BringOneModal";
import DeleteIngredientModal from "./DeleteIngredientModal";
import EditIngredientModal from "./EditIngredientModal";

// Props: the signed-in user, if any; only signed-in users can add ingredients.
interface IngredientsPageProps {
  user: CurrentUser | null;
}

// Page listing everything guests are bringing; loaded from the API.
export default function IngredientsPage({ user }: IngredientsPageProps) {
  // The displayed ingredients and whether the add dialog is showing.
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [addOpen, setAddOpen] = useState(false);

  // The category the bring-one dialog was opened for, and whether it is showing (kept separate so the title stays put while closing).
  const [bringCategory, setBringCategory] = useState("");
  const [bringOpen, setBringOpen] = useState(false);

  // The ingredient currently being edited or deleted, if any.
  const [editing, setEditing] = useState<Ingredient | null>(null);
  const [deleting, setDeleting] = useState<Ingredient | null>(null);

  // Loading and error state for the initial fetch.
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  // Fetches the ingredient list once on mount, ignoring the result if the page unmounts first.
  useEffect(() => {
    let cancelled = false;
    listIngredients()
      .then((list) => !cancelled && setIngredients(list))
      .catch(() => !cancelled && setFailed(true))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  // The user's own ingredients always show their current name, even right after a rename.
  const shown = user ? ingredients.map((i) => (i.phone === user.phone ? { ...i, broughtBy: user.name } : i)) : ingredients;

  // Show the grouped table, plus a floating add button and its dialog when signed in.
  return (
    <Container size="3" px="4" py="5">
      {failed && (
        <Callout.Root color="red" mb="4">
          <Callout.Text>Couldn't load the ingredients. Please refresh to try again.</Callout.Text>
        </Callout.Root>
      )}
      {loading ? (
        <Flex justify="center" my="6">
          <Spinner size="3" />
        </Flex>
      ) : (
        <IngredientTable
          ingredients={shown}
          currentPhone={user?.phone}
          onEdit={setEditing}
          onDelete={setDeleting}
          onBringOne={
            user
              ? (category) => {
                  setBringCategory(category);
                  setBringOpen(true);
                }
              : undefined
          }
        />
      )}
      {user && (
        <>
          {/* Floating button labelled "Bring something" that opens the add dialog. */}
          <Button className="fab" size="3" radius="full" onClick={() => setAddOpen(true)}>
            <PlusIcon /> Bring something
          </Button>
          <AddIngredientModal
            open={addOpen}
            user={user}
            onClose={() => setAddOpen(false)}
            onCreated={(created) => {
              setIngredients((prev) => [...prev, { ...created, broughtBy: user.name, phone: user.phone }]);
              setAddOpen(false);
            }}
          />
          {/* Bring-one dialog: opened from an empty category, pre-filled with that category. */}
          <BringOneModal
            open={bringOpen}
            category={bringCategory}
            user={user}
            onClose={() => setBringOpen(false)}
            onCreated={(created) => {
              setIngredients((prev) => [...prev, { ...created, broughtBy: user.name, phone: user.phone }]);
              setBringOpen(false);
            }}
          />
          {/* Edit dialog: applies the saved changes to the local list. */}
          <EditIngredientModal
            ingredient={editing}
            onClose={() => setEditing(null)}
            onSaved={(id, category, name) => {
              setIngredients((prev) => prev.map((i) => (i.id === id ? { ...i, category, name } : i)));
              setEditing(null);
            }}
          />
          {/* Delete dialog: removes the ingredient from the local list once confirmed. */}
          <DeleteIngredientModal
            ingredient={deleting}
            onClose={() => setDeleting(null)}
            onDeleted={(id) => {
              setIngredients((prev) => prev.filter((i) => i.id !== id));
              setDeleting(null);
            }}
          />
        </>
      )}
    </Container>
  );
}
