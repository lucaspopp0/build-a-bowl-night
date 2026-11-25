// Radix text field used for entering a phone number.
import { TextField } from "@radix-ui/themes";
import Field from "./Field";

// Props: the controlled value, its change handler and optional error/disabled state.
interface PhoneNumberFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

// Controlled phone number input that shows a validation error when one is given.
export default function PhoneNumberField({ value, onChange, error, disabled }: PhoneNumberFieldProps) {
  // Telephone keyboard on mobile, with the error shown as the hint line.
  return (
    <Field hint={error ?? "This is how we know who you are"} error={Boolean(error)}>
      <TextField.Root
        placeholder="(999) 999-9999"
        aria-label="Phone number"
        type="tel"
        autoComplete="tel"
        autoFocus
        size="3"
        value={value}
        disabled={disabled}
        color={error ? "red" : undefined}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}
