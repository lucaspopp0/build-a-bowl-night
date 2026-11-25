// Layout components, the ingredient table with its placeholder data, and the add-ingredient flow.
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import Container from "@mui/material/Container";
import Fab from "@mui/material/Fab";
import IngredientTable from "../components/IngredientTable";
import { sampleIngredients, type Ingredient } from "../lib/ingredients";
import type { CurrentUser } from "../lib/session";
import AddIngredientModal from "./AddIngredientModal";

// Props: the signed-in user, if any; only signed-in users can add ingredients.
interface IngredientsPageProps {
  user: CurrentUser | null;
}

// Page listing everything guests are bringing; will load from the API later.
export default function IngredientsPage({ user }: IngredientsPageProps) {
  // The displayed ingredients and whether the add dialog is showing.
  const [ingredients, setIngredients] = useState<Ingredient[]>(sampleIngredients);
  const [addOpen, setAddOpen] = useState(false);

  // Show the grouped table, plus a floating add button and its dialog when signed in.
  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <IngredientTable ingredients={ingredients} />
      {user && (
        <>
          <Fab
            color="primary"
            aria-label="Add ingredient"
            onClick={() => setAddOpen(true)}
            sx={{ position: "fixed", right: 24, bottom: 24 }}
          >
            <AddIcon />
          </Fab>
          <AddIngredientModal
            open={addOpen}
            user={user}
            onClose={() => setAddOpen(false)}
            onCreated={(created) => {
              setIngredients((prev) => [...prev, { ...created, broughtBy: user.name }]);
              setAddOpen(false);
            }}
          />
        </>
      )}
    </Container>
  );
}
