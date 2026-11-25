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

// Style for the column header cells: small, bold, all-caps text.
const headerCellSx = {
  typography: "caption",
  fontWeight: "bold",
  textTransform: "uppercase",
  color: "text.secondary",
} as const;

// Vertical stack of tables, one per category, each titled with its category name.
export default function IngredientTable({ ingredients }: IngredientTableProps) {
  // Group the ingredients so each category gets its own table.
  const groups = groupByCategory(ingredients);

  // Render a titled table with small column headers for each group.
  return (
    <Stack spacing={3}>
      {groups.map(([category, items]) => (
        <TableContainer key={category} component={Paper}>
          <Table size="small" sx={{ tableLayout: "fixed" }}>
            <TableHead>
              {/* Title row spanning both columns, separated from the column headers by a normal row border. */}
              <TableRow>
                <TableCell colSpan={2} sx={{ py: 1.5 }}>
                  <Typography variant="h6" component="h2">
                    {category}s
                  </Typography>
                </TableCell>
              </TableRow>
              {/* Column headers: shaded, small, bold, all caps. */}
              <TableRow sx={{ bgcolor: "action.hover" }}>
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
