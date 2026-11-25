// An ingredient a guest plans to bring, with its category and who is bringing it.
export interface Ingredient {
  id: string;
  category: string;
  name: string;
  broughtBy: string;
}

// Groups ingredients by category, sorting categories and ingredients alphabetically.
export function groupByCategory(ingredients: Ingredient[]): [string, Ingredient[]][] {
  // Collect ingredients into a map keyed by category.
  const groups = new Map<string, Ingredient[]>();
  for (const ingredient of ingredients) {
    const list = groups.get(ingredient.category) ?? [];
    list.push(ingredient);
    groups.set(ingredient.category, list);
  }

  // Sort the categories, and the ingredients within each, by name.
  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([category, list]): [string, Ingredient[]] => [
      category,
      [...list].sort((a, b) => a.name.localeCompare(b.name)),
    ]);
}

// The categories a new ingredient can be filed under.
export const INGREDIENT_CATEGORIES = ["Protein", "Veggie", "Sauce", "Grain"] as const;
