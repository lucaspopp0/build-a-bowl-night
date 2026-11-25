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

// Style for the column header cells: small, bold, all-caps text in the default text color at 40% opacity.
const headerCellSx = {
  typography: "caption",
  fontWeight: "bold",
  textTransform: "uppercase",
  color: "text.primary",
  opacity: 0.4,
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
                {/* Column headers: light gray in light mode, dark gray in dark mode. */}
                <TableRow
                  sx={(theme) => ({
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? theme.palette.grey[800]
                        : theme.palette.grey[200],
                  })}
                >
                  <TableCell sx={headerCellSx}>Ingredient</TableCell>
                  <TableCell sx={headerCellSx}>Brought by</TableCell>
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
        </Box>
      ))}
    </Stack>
  );
}
