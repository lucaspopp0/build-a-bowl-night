// An ingredient a guest plans to bring, with its category and who is bringing it.
export interface Ingredient {
  id: string;
  category: string;
  name: string;
  broughtBy: string;
  // Phone number of the user bringing it, used to tell which ingredients the signed-in user owns.
  phone: string;
}

// The categories a new ingredient can be filed under, in the order they are displayed.
export const INGREDIENT_CATEGORIES = [
  "Grain",
  "Protein",
  "Veggie / Fruit",
  "Sauce",
] as const;

// Plurals that can't be formed by appending "s"; keyed by the lowercase singular category.
const CUSTOM_PLURALS: Record<string, string> = {
  "veggie / fruit": "Veggies / Fruits",
};

// Returns the plural form of a category, using the custom map and falling back to appending "s".
export function pluralizeCategory(category: string): string {
  return CUSTOM_PLURALS[category.toLowerCase()] ?? `${category}s`;
}

// Groups ingredients by category: every known category first (even if empty), then any others alphabetically.
// Within a category, the signed-in user's own ingredients (matched by currentPhone) come first, then by name.
export function groupByCategory(
  ingredients: Ingredient[],
  currentPhone?: string,
): [string, Ingredient[]][] {
  // Seed the map with every known category so empty ones still appear, in their defined order.
  const groups = new Map<string, Ingredient[]>(
    INGREDIENT_CATEGORIES.map((c) => [c, []]),
  );

  // Collect ingredients into the map, adding any category not in the known list.
  for (const ingredient of ingredients) {
    const list = groups.get(ingredient.category) ?? [];
    list.push(ingredient);
    groups.set(ingredient.category, list);
  }

  // Keep known categories in order, sort unknown ones by name, and sort each category's ingredients (own first, then by name).
  const known: readonly string[] = INGREDIENT_CATEGORIES;
  const rank = (category: string) => known.indexOf(category);
  return [...groups.entries()]
    .sort(([a], [b]) => {
      if (rank(a) !== -1 || rank(b) !== -1) {
        return (
          (rank(a) === -1 ? Infinity : rank(a)) -
          (rank(b) === -1 ? Infinity : rank(b))
        );
      }
      return a.localeCompare(b);
    })
    .map(([category, list]): [string, Ingredient[]] => [
      category,
      [...list].sort((a, b) => {
        const aMine = currentPhone !== undefined && a.phone === currentPhone;
        const bMine = currentPhone !== undefined && b.phone === currentPhone;
        if (aMine !== bMine) return aMine ? -1 : 1;
        return a.name.localeCompare(b.name);
      }),
    ]);
}
