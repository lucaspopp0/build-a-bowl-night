// MUI components and the ingredient helpers used to render one table per category.
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { groupByCategory, pluralizeCategory, type Ingredient } from "../lib/ingredients";

// Props: the full list of ingredients to display.
interface IngredientTableProps {
  ingredients: Ingredient[];
  // Phone of the signed-in user; their ingredients get edit and delete buttons. Omit when signed out.
  currentPhone?: string;
  onEdit?: (ingredient: Ingredient) => void;
  onDelete?: (ingredient: Ingredient) => void;
  // Called with the category when the signed-in user clicks "Bring one?" on an empty category.
  onBringOne?: (category: string) => void;
}

// Style for the column header cells: small, bold, all-caps text at 80% opacity with a thicker bottom border.
const headerCellSx = {
  typography: "caption",
  fontSize: "0.65rem",
  fontWeight: "bold",
  textTransform: "uppercase",
  opacity: 0.8,
  borderBottomWidth: 2,
  // Keep the compact (small-size) vertical padding on the header row.
  py: "6px",
} as const;

// Vertical stack of cards, one per category, each with a plain-text title above its table.
export default function IngredientTable({ ingredients, currentPhone, onEdit, onDelete, onBringOne }: IngredientTableProps) {
  // Group the ingredients so each category gets its own table.
  const groups = groupByCategory(ingredients);

  // Render a titled table with small column headers for each group.
  return (
    <Stack spacing={3}>
      {groups.map(([category, items]) => (
        <Box key={category}>
          {/* Category title: plain text sitting above the table, with a small gap before it. */}
          <Typography variant="h6" component="h2" sx={{ mb: 1 }}>
            {pluralizeCategory(category)}
          </Typography>
          {items.length === 0 ? (
            // Fallback shown under the title when nobody has claimed this category yet; no table is rendered.
            <Typography variant="body2" sx={{ fontStyle: "italic", opacity: 0.6 }}>
              No {pluralizeCategory(category).toLowerCase()} yet.
              {/* Prompt to claim the category, offered only when a handler is provided (signed in). */}
              {onBringOne && (
                <>
                  {" "}
                  <Link component="button" type="button" variant="body2" onClick={() => onBringOne(category)} sx={{ fontStyle: "italic", verticalAlign: "baseline" }}>
                    Bring one?
                  </Link>
                </>
              )}
            </Typography>
          ) : (
            // Plain container (no Paper) so the table has no background or shadow.
            <TableContainer>
              {/* First column has no left padding so its text lines up with the category title. */}
              <Table sx={{ tableLayout: "fixed", "& th:first-of-type, & td:first-of-type": { pl: 0 } }}>
                <TableHead>
                  {/* Column headers: small bold caps, set off by a thicker bottom border. */}
                  <TableRow>
                    <TableCell sx={headerCellSx}>Ingredient</TableCell>
                    <TableCell sx={headerCellSx}>Brought by</TableCell>
                    {/* Narrow column reserved for the edit and delete buttons. */}
                    {currentPhone && <TableCell sx={{ ...headerCellSx, width: 96 }} />}
                  </TableRow>
                </TableHead>
                {/* No divider under the final row; the card edge closes the table. */}
                <TableBody sx={{ "& tr:last-child td": { borderBottom: 0 } }}>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.broughtBy}</TableCell>
                      {currentPhone && (
                        // Pencil and red trash buttons, shown only on the signed-in user's own rows.
                        <TableCell align="right" sx={{ py: 0, textAlign: "right", whiteSpace: "nowrap" }}>
                          {item.phone === currentPhone && (
                            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                              <IconButton size="small" aria-label={`Edit ${item.name}`} onClick={() => onEdit?.(item)}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton size="small" color="error" aria-label={`Delete ${item.name}`} onClick={() => onDelete?.(item)}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      ))}
    </Stack>
  );
}
