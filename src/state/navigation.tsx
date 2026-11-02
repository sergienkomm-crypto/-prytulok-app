import { createContext, useContext } from "react";
export type Tab = "home" | "feed" | "search" | "chats" | "account";
export type Route =
  | {
      name: "detail" | "application" | "support" | "conversation";
      petId: string;
    }
  | { name: "results" | "notifications" | "settings" }
  | { name: "success"; petId: string; kind: "application" | "support" };
export type Intent = {
  kind: "favorite" | "application" | "chat" | "account";
  petId?: string;
};
export const NavigationContext = createContext<{
  tab: Tab;
  selectTab: (tab: Tab, section?: string) => void;
  accountSection: string;
  open: (r: Route) => void;
  back: () => void;
  home: () => void;
  favorite: (id: string) => void;
  act: (intent: Intent) => void;
} | null>(null);
export function useNav() {
  const v = useContext(NavigationContext);
  if (!v) throw Error("Navigation missing");
  return v;
}
