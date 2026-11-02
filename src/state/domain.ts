export type Filters = {
  query: string;
  city: string;
  kind: string;
  sex: string;
  size: string;
  age: string;
  compatible: string[];
  character: string[];
  vaccinated: boolean;
  sterilized: boolean;
  special: boolean;
  shelter: string;
};
export const emptyFilters: Filters = {
  query: "",
  city: "",
  kind: "",
  sex: "",
  size: "",
  age: "",
  compatible: [],
  character: [],
  vaccinated: false,
  sterilized: false,
  special: false,
  shelter: "",
};
export const toggleItem = (items: string[], value: string) =>
  items.includes(value) ? items.filter((x) => x !== value) : [...items, value];
type Searchable = {
  name: string;
  city: string;
  kind: string;
  sex: string;
  size: string;
  ageGroup: string;
  compatible: string[];
  tags: string[];
  vaccinated: boolean;
  sterilized: boolean;
  special: boolean;
  shelter: string;
};
export function matchesPet(p: Searchable, f: Filters) {
  const terms = f.query
    .toLocaleLowerCase("uk")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const content = [p.name, p.city, p.kind, p.shelter, ...p.tags]
    .join(" ")
    .toLocaleLowerCase("uk");
  return (
    terms.every((t) => content.includes(t)) &&
    (!f.city || p.city === f.city) &&
    (!f.kind || p.kind === f.kind) &&
    (!f.sex || p.sex === f.sex) &&
    (!f.size || p.size === f.size) &&
    (!f.age || p.ageGroup === f.age) &&
    f.compatible.every((c) => p.compatible.includes(c)) &&
    f.character.every((t) =>
      p.tags.some((tag) =>
        tag.toLowerCase().startsWith(t.toLowerCase().slice(0, 5)),
      ),
    ) &&
    (!f.vaccinated || p.vaccinated) &&
    (!f.sterilized || p.sterilized) &&
    (!f.special || p.special) &&
    (!f.shelter || p.shelter.toLowerCase().includes(f.shelter.toLowerCase()))
  );
}
export function validContact(value: string) {
  return (
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ||
    /^\+?380\d{9}$/.test(value.replace(/[\s()-]/g, ""))
  );
}
export function validAmount(value: string) {
  const n = Number(value);
  return (
    /^\d+$/.test(value) && Number.isSafeInteger(n) && n >= 10 && n <= 100000
  );
}
export type ChatMessage = { id: string; text: string; mine: boolean };
export type Conversation = {
  petId: string;
  messages: ChatMessage[];
  unread: boolean;
  application: boolean;
};
export type PrototypeState = {
  onboarded: boolean;
  user: { name: string; contact: string } | null;
  favorites: string[];
  supported: string[];
  viewed: string[];
  applications: string[];
  conversations: Conversation[];
  preferences: Pick<Filters, "kind" | "compatible" | "size">;
};
export const initialState: PrototypeState = {
  onboarded: false,
  user: null,
  favorites: [],
  supported: [],
  viewed: [],
  applications: [],
  conversations: [],
  preferences: { kind: "", compatible: [], size: "" },
};
export function addApplication(
  state: PrototypeState,
  petId: string,
): PrototypeState {
  if (state.applications.includes(petId)) return state;
  const message: ChatMessage = {
    id: `application-${petId}`,
    mine: false,
    text: "Дякуємо за заявку! Ми отримали вашу анкету й напишемо тут, щоб домовитися про знайомство 🐾",
  };
  const existing = state.conversations.find((c) => c.petId === petId);
  const conversation: Conversation = {
    ...(existing ?? { petId, messages: [], unread: false, application: false }),
    application: true,
    unread: true,
    messages: [...(existing?.messages ?? []), message],
  };
  return {
    ...state,
    applications: [...state.applications, petId],
    conversations: [
      conversation,
      ...state.conversations.filter((c) => c.petId !== petId),
    ],
  };
}
