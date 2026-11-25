// MUI components and the ingredient helpers used to render one table per category.
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
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
  // Phone of the signed-in user; their ingredients get a delete button. Omit when signed out.
  currentPhone?: string;
  onDelete?: (ingredient: Ingredient) => void;
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
export default function IngredientTable({ ingredients, currentPhone, onDelete }: IngredientTableProps) {
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
          <TableContainer component={Paper}>
            <Table sx={{ tableLayout: "fixed" }}>
              <TableHead>
                {/* Column headers: small bold caps, set off by a thicker bottom border. */}
                <TableRow>
                  <TableCell sx={headerCellSx}>Ingredient</TableCell>
                  <TableCell sx={headerCellSx}>Brought by</TableCell>
                  {/* Narrow column reserved for the delete button. */}
                  {currentPhone && <TableCell sx={{ ...headerCellSx, width: 56 }} />}
                </TableRow>
              </TableHead>
              {/* No divider under the final row; the card edge closes the table. */}
              <TableBody sx={{ "& tr:last-child td": { borderBottom: 0 } }}>
                {items.length === 0 && (
                  // Fallback row shown when nobody has claimed this category yet.
                  <TableRow>
                    <TableCell
                      colSpan={currentPhone ? 3 : 2}
                      sx={{ fontStyle: "italic", opacity: 0.6 }}
                    >
                      No {pluralizeCategory(category).toLowerCase()} yet
                    </TableCell>
                  </TableRow>
                )}
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.broughtBy}</TableCell>
                    {currentPhone && (
                      // Red trash button, shown only on the signed-in user's own rows.
                      <TableCell align="right" sx={{ py: 0, textAlign: "right", whiteSpace: "nowrap" }}>
                        {item.phone === currentPhone && (
                          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
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
        </Box>
      ))}
    </Stack>
  );
}
