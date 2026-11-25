// React hook used to track a CSS media query.
import { useCallback, useSyncExternalStore } from "react";

// Returns whether the media query currently matches, updating live when it changes.
export default function useMediaQuery(query: string): boolean {
  // Subscribes to changes of the query; stable per query so React doesn't resubscribe on every render.
  const subscribe = useCallback(
    (notify: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", notify);
      return () => list.removeEventListener("change", notify);
    },
    [query],
  );

  // Reads whether the query matches right now.
  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);

  // Re-renders the component whenever the query's match state changes.
  return useSyncExternalStore(subscribe, getSnapshot);
}
