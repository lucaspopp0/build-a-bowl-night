// MUI pieces for an "x" button pinned to a dialog's top-right corner.
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

// Props: the close handler and whether closing is currently blocked (e.g. while saving).
interface DialogCloseButtonProps {
  onClose: () => void;
  disabled?: boolean;
}

// Small "x" button positioned in the top-right corner of a dialog; place it inside the Dialog.
export default function DialogCloseButton({ onClose, disabled }: DialogCloseButtonProps) {
  // Absolutely positioned icon button that calls the close handler.
  return (
    <IconButton
      aria-label="Close"
      onClick={onClose}
      disabled={disabled}
      sx={{ position: "absolute", right: 8, top: 8, color: "text.secondary" }}
    >
      <CloseIcon />
    </IconButton>
  );
}
