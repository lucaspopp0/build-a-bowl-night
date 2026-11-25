// Layout component and the ingredient table with its placeholder data.
import Container from "@mui/material/Container";
import IngredientTable from "../components/IngredientTable";
import { sampleIngredients } from "../lib/ingredients";

// Page listing everything guests are bringing; will load from the API later.
export default function IngredientsPage() {
  // Show the grouped table inside a centered container.
  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <IngredientTable ingredients={sampleIngredients} />
    </Container>
  );
}
