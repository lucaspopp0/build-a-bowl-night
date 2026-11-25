// MUI components and the ingredient helpers used to render one table per category.
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { groupByCategory, type Ingredient } from "../lib/ingredients";

// Props: the full list of ingredients to display.
interface IngredientTableProps {
  ingredients: Ingredient[];
}

// Style for the column header cells: small, bold, all-caps text with a thicker bottom border.
const headerCellSx = {
  typography: "caption",
  fontWeight: "bold",
  textTransform: "uppercase",
  borderBottomWidth: 2,
} as const;

// Vertical stack of cards, one per category, each with a plain-text title above its table.
export default function IngredientTable({ ingredients }: IngredientTableProps) {
  // Group the ingredients so each category gets its own table.
  const groups = groupByCategory(ingredients);

  // Render a titled table with small column headers for each group.
  return (
    <Stack spacing={3}>
      {groups.map(([category, items]) => (
        <Box key={category}>
          {/* Category title: plain text sitting above the table, with a small gap before it. */}
          <Typography variant="h6" component="h2" sx={{ mb: 1 }}>
            {category}s
          </Typography>
          <TableContainer component={Paper}>
            <Table size="small" sx={{ tableLayout: "fixed" }}>
              <TableHead>
                {/* Column headers: small bold caps, set off by a thicker bottom border. */}
                <TableRow>
                  <TableCell sx={headerCellSx}>Ingredient</TableCell>
                  <TableCell sx={headerCellSx}>Brought by</TableCell>
                </TableRow>
              </TableHead>
              {/* No divider under the final row; the card edge closes the table. */}
              <TableBody sx={{ "& tr:last-child td": { borderBottom: 0 } }}>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.broughtBy}</TableCell>
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
