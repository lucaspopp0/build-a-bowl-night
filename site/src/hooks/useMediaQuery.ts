// React hook used to track a CSS media query.
import { useSyncExternalStore } from "react";

// Returns whether the media query currently matches, updating live when it changes.
export default function useMediaQuery(query: string): boolean {
  // Subscribe to changes of the query and read its current state.
  return useSyncExternalStore(
    (notify) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", notify);
      return () => list.removeEventListener("change", notify);
    },
    () => window.matchMedia(query).matches,
  );
}
