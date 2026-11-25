// MUI chip and stack used to show the dietary flags that apply.
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { DIETARY_ATTRIBUTES, type DietaryAttributes } from "../lib/ingredients";

// Props: the dietary flags of one ingredient.
interface DietaryChipsProps {
  attributes: DietaryAttributes;
}

// Small outlined chips for each flag that is set; renders nothing when none apply.
export default function DietaryChips({ attributes }: DietaryChipsProps) {
  // Keep only the flags that are on.
  const active = DIETARY_ATTRIBUTES.filter(({ key }) => attributes[key]);
  if (active.length === 0) {
    return null;
  }

  // Wrap the chips in a row beneath the ingredient name.
  return (
    <Stack direction="row" spacing={0.5} useFlexGap sx={{ flexWrap: "wrap", mt: 0.5 }}>
      {active.map(({ key, label }) => (
        <Chip key={key} label={label} size="small" variant="outlined" color="success" sx={{ height: 20, fontSize: "0.65rem" }} />
      ))}
    </Stack>
  );
}
