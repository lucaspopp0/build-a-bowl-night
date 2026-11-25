// MUI table components and the ingredient helpers used to render the grouped table.
import Badge from "@mui/material/Badge";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { groupByCategory, type Ingredient } from "../lib/ingredients";

// Props: the full list of ingredients to display.
interface IngredientTableProps {
  ingredients: Ingredient[];
}

// Table of ingredients and who brought them, with a header row per category.
export default function IngredientTable({ ingredients }: IngredientTableProps) {
  // Group the ingredients so each category gets its own section.
  const groups = groupByCategory(ingredients);

  // Render the column headings, then a category header and rows for each group.
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Ingredient</TableCell>
            <TableCell>Brought by</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {groups.map(([category, items]) => [
            <TableRow key={`category-${category}`} sx={{ bgcolor: "action.hover" }}>
              <TableCell colSpan={2} sx={{ fontWeight: "bold" }}>
                {/* Badge showing how many items are in this category. */}
                <Badge
                  badgeContent={items.length}
                  color="primary"
                  sx={{
                    alignItems: "center",
                    // Place the badge inline after the title, vertically centered with it.
                    "& .MuiBadge-badge": { position: "static", transform: "none", ml: 1.5 },
                  }}
                >
                  {category}
                </Badge>
              </TableCell>
            </TableRow>,
            ...items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.broughtBy}</TableCell>
              </TableRow>
            )),
          ])}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
