// React types for the modal's props and form handler.
import type { FormEvent, ReactNode } from "react";
import { AlertDialog, Callout, Dialog, Flex } from "@radix-ui/themes";

// Props: open state, title, close handler, optional form submit, error text, body content, and the action buttons.
interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  // Blocks dismissing (escape, overlay click) while a request is in flight.
  busy?: boolean;
  // Wraps the body and actions in a form that calls this on submit.
  onSubmit?: (e: FormEvent) => void;
  // Plain-text description; makes this a confirmation (alert) dialog.
  description?: string;
  error?: string;
  children?: ReactNode;
  actions: ReactNode;
}

// Shared dialog shell: consistent width, title, body, error callout, and a horizontal right-aligned button row.
export default function Modal({ open, title, onClose, busy, onSubmit, description, error, children, actions }: ModalProps) {
  // Closes the dialog unless a request is still running.
  const handleOpenChange = (next: boolean) => {
    if (!next && !busy) {
      onClose();
    }
  };

  // Body fields, then the error callout, then the side-by-side action buttons.
  const body = (
    <Flex direction="column" gap="4" mt={description ? "3" : undefined}>
      {children}
      {error && (
        <Callout.Root color="red" size="1">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}
      <Flex gap="3" justify="end">
        {actions}
      </Flex>
    </Flex>
  );

  // Optional form wrapper so Enter submits and a type="submit" action button works.
  const content = onSubmit ? (
    <form onSubmit={onSubmit} noValidate>
      {body}
    </form>
  ) : (
    body
  );

  // Confirmation dialogs use AlertDialog (which requires a description); everything else uses Dialog.
  if (description !== undefined) {
    return (
      <AlertDialog.Root open={open} onOpenChange={handleOpenChange}>
        <AlertDialog.Content maxWidth="400px">
          <AlertDialog.Title>{title}</AlertDialog.Title>
          <AlertDialog.Description size="2">{description}</AlertDialog.Description>
          {content}
        </AlertDialog.Content>
      </AlertDialog.Root>
    );
  }

  // Standard dialog with no description.
  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Content maxWidth="400px" aria-describedby={undefined}>
        <Dialog.Title>{title}</Dialog.Title>
        {content}
      </Dialog.Content>
    </Dialog.Root>
  );
}
