// The generated API SDK: configuration helpers, the users client and its exception type.
import {
  ApiException,
  PutUserInputBody,
  ServerConfiguration,
  UsersApi,
  createConfiguration,
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
