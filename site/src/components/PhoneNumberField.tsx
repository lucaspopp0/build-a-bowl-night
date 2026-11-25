// MUI text field used for entering a phone number.
import TextField from "@mui/material/TextField";

// Props: the controlled value, its change handler and optional error/disabled state.
interface PhoneNumberFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

// Controlled phone number input that shows a validation error when one is given.
export default function PhoneNumberField({ value, onChange, error, disabled }: PhoneNumberFieldProps) {
  // Telephone keyboard on mobile, with the error shown as helper text.
  return (
    <TextField
      label="Phone number"
      type="tel"
      autoComplete="tel"
      autoFocus
      fullWidth
      value={value}
      disabled={disabled}
      error={Boolean(error)}
      helperText={error ?? "This is how we know who you are"}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
