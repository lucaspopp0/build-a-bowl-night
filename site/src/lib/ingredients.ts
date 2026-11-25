// An ingredient a guest plans to bring, with its category and who is bringing it.
export interface Ingredient {
  id: string;
  category: string;
  name: string;
  broughtBy: string;
}

// Placeholder data shown until the page is wired to the API.
export const sampleIngredients: Ingredient[] = [
  { id: "1", category: "Grains", name: "Jasmine rice", broughtBy: "Lucas" },
  { id: "2", category: "Grains", name: "Brown rice", broughtBy: "Sam" },
  { id: "3", category: "Proteins", name: "Teriyaki chicken", broughtBy: "Priya" },
  { id: "4", category: "Proteins", name: "Marinated tofu", broughtBy: "Jordan" },
  { id: "5", category: "Vegetables", name: "Pickled cucumbers", broughtBy: "Alex" },
  { id: "6", category: "Vegetables", name: "Shredded carrots", broughtBy: "Sam" },
  { id: "7", category: "Sauces", name: "Sriracha mayo", broughtBy: "Priya" },
];

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
