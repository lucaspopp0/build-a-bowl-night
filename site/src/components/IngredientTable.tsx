// Radix components, icons and the ingredient helpers used to render one table per category.
import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { Box, Flex, Heading, IconButton, Link, Table, Text } from "@radix-ui/themes";
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

// Vertical stack of cards, one per category, each with a plain-text title above its table.
export default function IngredientTable({ ingredients, currentPhone, onEdit, onDelete, onBringOne }: IngredientTableProps) {
  // Group the ingredients so each category gets its own table.
  const groups = groupByCategory(ingredients, currentPhone);

  // Render a titled table with small column headers for each group.
  return (
    <Flex direction="column" gap="6">
      {groups.map(([category, items]) => (
        <Box key={category}>
          {/* Category title: plain text sitting above the table, with a small gap before it. */}
          <Heading as="h2" size="4" mb="2">
            {pluralizeCategory(category)}
          </Heading>
          {items.length === 0 ? (
            // Fallback shown under the title when nobody has claimed this category yet; no table is rendered.
            <Text as="p" size="2" style={{ fontStyle: "italic", opacity: 0.6 }}>
              No {pluralizeCategory(category).toLowerCase()} yet.
              {/* Prompt to claim the category, offered only when a handler is provided (signed in). */}
              {onBringOne && (
                <>
                  {" "}
                  <Link asChild>
                    <button type="button" onClick={() => onBringOne(category)} style={{ font: "inherit", fontStyle: "italic" }}>
                      Bring one?
                    </button>
                  </Link>
                </>
              )}
            </Text>
          ) : (
            // Ghost variant: the table has no background, border or shadow.
            <Table.Root variant="ghost" size="2" className="ingredient-table">
              {/* Column headers: small bold caps. */}
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell className="header-cell">Ingredient</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="header-cell">Brought by</Table.ColumnHeaderCell>
                  {/* Narrow column reserved for the edit and delete buttons. */}
                  {currentPhone && <Table.ColumnHeaderCell style={{ width: 112 }} />}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {items.map((item) => (
                  <Table.Row key={item.id} align="center">
                    <Table.Cell>{item.name}</Table.Cell>
                    {/* Brought-by name; the signed-in user's own rows get a slightly transparent " (you)" suffix. */}
                    <Table.Cell>
                      {item.broughtBy}
                      {currentPhone && item.phone === currentPhone && <span style={{ opacity: 0.6 }}> (you)</span>}
                    </Table.Cell>
                    {currentPhone && (
                      // Pencil and trash buttons, shown only on the signed-in user's own rows.
                      <Table.Cell justify="end" style={{ whiteSpace: "nowrap" }}>
                        {item.phone === currentPhone && (
                          <Flex justify="end" gap="2">
                            <IconButton size="2" variant="ghost" color="gray" aria-label={`Edit ${item.name}`} onClick={() => onEdit?.(item)}>
                              <Pencil1Icon width={20} height={20} />
                            </IconButton>
                            <IconButton size="2" variant="ghost" color="gray" aria-label={`Delete ${item.name}`} onClick={() => onDelete?.(item)}>
                              <TrashIcon width={20} height={20} />
                            </IconButton>
                          </Flex>
                        )}
                      </Table.Cell>
                    )}
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          )}
        </Box>
      ))}
    </Flex>
  );
}
