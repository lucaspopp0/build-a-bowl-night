// The signed-in user, as remembered between visits.
export interface CurrentUser {
  phone: string;
  name: string;
}

// The localStorage key under which the signed-in user is stored.
const STORAGE_KEY = "bab.currentUser";

// Writes the signed-in user's phone and name to local storage; ignores storage failures.
export function saveCurrentUser(user: CurrentUser): void {
  // Storage can be blocked (private mode, policies), so never let it break sign-in.
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ phone: user.phone, name: user.name }));
  } catch {
    // Nothing else to do: the user simply will not be remembered.
  }
}

// Reads the signed-in user from local storage, or null if absent or malformed.
export function loadCurrentUser(): CurrentUser | null {
  // Parse defensively since the stored value is outside our control.
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      typeof (parsed as CurrentUser).phone === "string" &&
      typeof (parsed as CurrentUser).name === "string"
    ) {
      return { phone: (parsed as CurrentUser).phone, name: (parsed as CurrentUser).name };
    }
  } catch {
    // Fall through to "not signed in".
  }

  return null;
}

// Removes the signed-in user from local storage.
export function clearCurrentUser(): void {
  // Ignore storage failures, as in saveCurrentUser.
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing else to do.
  }
}
