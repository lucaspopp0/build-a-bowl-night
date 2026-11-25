// MUI components for a group of dietary checkboxes.
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import { DIETARY_ATTRIBUTES, setDietaryAttribute, type DietaryAttributes } from "../lib/ingredients";

// Props: the current flags, whether the inputs are disabled, and the change callback.
interface DietaryAttributesFieldProps {
  value: DietaryAttributes;
  disabled?: boolean;
  onChange: (value: DietaryAttributes) => void;
}

// Row of checkboxes for choosing which dietary restrictions an ingredient is suitable for.
export default function DietaryAttributesField({ value, disabled, onChange }: DietaryAttributesFieldProps) {
  // One labeled checkbox per flag, wrapped under a shared caption.
  return (
    <FormGroup>
      <FormLabel component="legend" sx={{ fontSize: "0.75rem" }}>
        Dietary info
      </FormLabel>
      <FormGroup row>
        {DIETARY_ATTRIBUTES.map(({ key, label }) => (
          <FormControlLabel
            key={key}
            label={label}
            disabled={disabled}
            control={<Checkbox size="small" checked={value[key]} onChange={(e) => onChange(setDietaryAttribute(value, key, e.target.checked))} />}
          />
        ))}
      </FormGroup>
    </FormGroup>
  );
}
