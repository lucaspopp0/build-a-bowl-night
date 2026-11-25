// React types for the wrapper's children.
import type { ReactNode } from "react";
import { Flex, Text } from "@radix-ui/themes";

// Props: the visible label, an optional hint or error line, and the input to wrap.
interface FieldProps {
  label?: string;
  hint?: string;
  error?: boolean;
  children: ReactNode;
}

// Labelled form field: label above the control, with an optional hint (or red error) below it.
export default function Field({ label, hint, error, children }: FieldProps) {
  // The label wraps the control so clicking it focuses the input.
  return (
    <Flex direction="column" gap="1" asChild>
      <label>
        {label && (
          <Text size="2" weight="medium">
            {label}
          </Text>
        )}
        {children}
        {hint && (
          <Text size="1" color={error ? "red" : "gray"}>
            {hint}
          </Text>
        )}
      </label>
    </Flex>
  );
}
