// MUI components and the ingredient helpers used to render one table per category.
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

// Style for the column header cells: small, bold, all-caps text in white at 40% opacity.
const headerCellSx = {
  typography: "caption",
  fontWeight: "bold",
  textTransform: "uppercase",
  color: "common.white",
  opacity: 0.4,
} as const;

// Vertical stack of cards, one per category, each with a title heading above its table.
export default function IngredientTable({ ingredients }: IngredientTableProps) {
  // Group the ingredients so each category gets its own table.
  const groups = groupByCategory(ingredients);

  // Render a titled table with small column headers for each group.
  return (
    <Stack spacing={3}>
      {groups.map(([category, items]) => (
        <TableContainer key={category} component={Paper}>
          {/* Category title, a heading above the table in the accent color. */}
          <Typography
            variant="h6"
            component="h2"
            sx={{ px: 2, py: 1.5, bgcolor: "primary.main", color: "primary.contrastText" }}
          >
            {category}s
          </Typography>
          <Table size="small" sx={{ tableLayout: "fixed" }}>
            <TableHead>
              {/* Column headers: a darker shade of the accent color, small, bold, all caps. */}
              <TableRow sx={{ bgcolor: "primary.dark" }}>
                <TableCell sx={headerCellSx}>
                  Ingredient
                </TableCell>
                <TableCell sx={headerCellSx}>
                  Brought by
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.broughtBy}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ))}
    </Stack>
  );
}
