// The ingredient shape the UI renders, shared with the table.
import type { DietaryAttributes, Ingredient as IngredientWithOwner } from "./ingredients";

// The generated API SDK: configuration helpers, the users client and its exception type.
import {
  ApiException,
  CreateIngredientInputBody,
  IngredientsApi,
  PutUserInputBody,
  ServerConfiguration,
  UsersApi,
  createConfiguration,
  type Ingredient,
  type User,
} from "@build-a-bowl-night/api-sdk";

// Users client pointed at the API's Function URL, configured at build time via VITE_API_URL.
const usersApi = new UsersApi(
  createConfiguration({
    baseServer: new ServerConfiguration((import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, ""), {}),
  }),
);

// Looks up a user by phone number; resolves to null if no user has that number.
export async function findUser(phone: string): Promise<User | null> {
  // The SDK throws on non-2xx, so translate a 404 into "no such user".
  try {
    return await usersApi.getUser(phone);
  } catch (err) {
    if (err instanceof ApiException && err.code === 404) {
      return null;
    }
    throw err;
  }
}

// Creates a user with the given phone number and name (the API call is an upsert).
export async function createUser(phone: string, name: string): Promise<User> {
  // Build the request body the SDK expects and send it.
  const body = new PutUserInputBody();
  body.name = name;
  return usersApi.putUser(phone, body);
}

// Ingredients client sharing the same base URL configuration as the users client.
const ingredientsApi = new IngredientsApi(
  createConfiguration({
    baseServer: new ServerConfiguration((import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, ""), {}),
  }),
);

// Copies the SDK's dietary flags into the plain object the UI uses, treating missing flags as false.
function toDietaryAttributes(attrs?: { glutenFree?: boolean; vegetarian?: boolean; vegan?: boolean }): DietaryAttributes {
  return { glutenFree: !!attrs?.glutenFree, vegetarian: !!attrs?.vegetarian, vegan: !!attrs?.vegan };
}

// Fetches every ingredient and the users who bring them, resolving each ingredient's owner to a display name.
export async function listIngredients(): Promise<IngredientWithOwner[]> {
  // Load both lists in parallel; the API only returns the owner's phone number on an ingredient.
  const [ingredients, users] = await Promise.all([ingredientsApi.listIngredients(), usersApi.listUsers()]);

  // Index user names by phone so each ingredient can be labeled with who brings it.
  const names = new Map((users.users ?? []).map((u) => [u.phone, u.name]));
  return (ingredients.ingredients ?? []).map((i) => ({
    id: i.id,
    category: i.category,
    name: i.name,
    dietaryAttributes: toDietaryAttributes(i.dietaryAttributes),
    broughtBy: names.get(i.user) ?? i.user,
    phone: i.user,
  }));
}

// Submits a new ingredient brought by the user with the given phone number.
export async function createIngredient(phone: string, category: string, name: string, dietaryAttributes: DietaryAttributes): Promise<Ingredient> {
  // Build the request body the SDK expects and send it.
  const body = new CreateIngredientInputBody();
  body.category = category;
  body.name = name;
  body.dietaryAttributes = { ...dietaryAttributes };
  return ingredientsApi.createIngredient(phone, body);
}

// Deletes an ingredient owned by the user with the given phone number.
export async function deleteIngredient(phone: string, id: string): Promise<void> {
  return ingredientsApi.deleteIngredient(phone, id);
}
