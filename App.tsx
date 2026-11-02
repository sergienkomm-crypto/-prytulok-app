import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  Copy,
  Icon,
  IconButton,
  IconName,
  NotificationBadge,
} from "./src/components/ui";
import { petById } from "./src/data/pets";
import { Home, Feed, Detail, Notifications } from "./src/screens/Browse";
import { Onboarding } from "./src/screens/Onboarding";
import { Search, Results, SearchContext } from "./src/screens/Search";
import { Account, Chats, Conversation, Settings } from "./src/screens/Personal";
import { Application, Auth, Success, Support } from "./src/screens/Flows";
import { NavigationContext, Intent, Route, Tab } from "./src/state/navigation";
import { emptyFilters, Filters, toggleItem } from "./src/state/domain";
import { Store, useStore } from "./src/state/store";
import { theme } from "./src/theme";
const c = theme.color;
const tabs: { id: Tab; label: string; icon: IconName }[] = [
  { id: "home", label: "Головна", icon: "home-outline" },
  { id: "feed", label: "Стрічка", icon: "reader-outline" },
  { id: "search", label: "Пошук", icon: "search-outline" },
  { id: "chats", label: "Чати", icon: "chatbubble-outline" },
  { id: "account", label: "Акаунт", icon: "person-outline" },
];
const titles: Record<Route["name"], string> = {
  detail: "",
  application: "Знайомство",
  support: "Підтримка",
  conversation: "Повідомлення",
  results: "Ваша добірка",
  notifications: "Сповіщення",
  settings: "Налаштування",
  success: "",
};
function Prototype() {
  const { state, setState, storageError } = useStore();
  const [tab, setTab] = useState<Tab>("home");
  const [accountSection, setAccountSection] = useState("Обране");
  const [routes, setRoutes] = useState<Route[]>([]);
  const [intent, setIntent] = useState<Intent | null>(null);
  const [filters, setFilters] = useState<Filters>({
    ...emptyFilters,
    ...state.preferences,
  });
  const route = routes.at(-1);
  const back = useCallback(() => setRoutes((r) => r.slice(0, -1)), []);
  function home() {
    setRoutes([]);
    setTab("home");
  }
  function selectTab(t: Tab, section?: string) {
    setRoutes([]);
    setTab(t);
    if (section) setAccountSection(section);
  }
  function open(r: Route) {
    if (r.name === "detail")
      setState((s) => ({
        ...s,
        viewed: [r.petId, ...s.viewed.filter((id) => id !== r.petId)].slice(
          0,
          12,
        ),
      }));
    if (r.name === "conversation")
      setState((s) => ({
        ...s,
        conversations: s.conversations.some((c) => c.petId === r.petId)
          ? s.conversations.map((c) =>
              c.petId === r.petId ? { ...c, unread: false } : c,
            )
          : [
              {
                petId: r.petId,
                unread: false,
                application: false,
                messages: [
                  {
                    id: `hello-${r.petId}`,
                    mine: false,
                    text: `Вітаємо! Це демо-чат притулку «${petById(r.petId).shelter}». Що хочете дізнатися про ${petById(r.petId).name}?`,
                  },
                ],
              },
              ...s.conversations,
            ],
      }));
    setRoutes((old) => [...old, r]);
  }
  function perform(i: Intent) {
    if (i.kind === "favorite" && i.petId)
      setState((s) => ({ ...s, favorites: toggleItem(s.favorites, i.petId!) }));
    if (i.kind === "application" && i.petId)
      open({ name: "application", petId: i.petId });
    if (i.kind === "chat" && i.petId)
      open({ name: "conversation", petId: i.petId });
    if (i.kind === "account")
      selectTab("account", state.supported.length ? "Підтримую" : "Обране");
  }
  function act(i: Intent) {
    if (!state.user) setIntent(i);
    else perform(i);
  }
  useEffect(() => {
    const handler = BackHandler.addEventListener("hardwareBackPress", () => {
      if (intent) {
        setIntent(null);
        return true;
      }
      if (routes.length) {
        back();
        return true;
      }
      if (tab !== "home") {
        setTab("home");
        return true;
      }
      return false;
    });
    return () => handler.remove();
  }, [intent, routes.length, tab, back]);
  if (!state.onboarded)
    return (
      <Onboarding
        onFinish={(kind, compatible, size) => {
          setFilters({ ...emptyFilters, kind, compatible, size });
          setTab("feed");
          setRoutes([{ name: "results" }]);
        }}
      />
    );
  let screen: React.ReactNode;
  if (route) {
    switch (route.name) {
      case "detail":
        screen = <Detail key={route.petId} petId={route.petId} />;
        break;
      case "application":
        screen = <Application petId={route.petId} />;
        break;
      case "support":
        screen = <Support petId={route.petId} />;
        break;
      case "conversation":
        screen = <Conversation petId={route.petId} />;
        break;
      case "success":
        screen = <Success petId={route.petId} kind={route.kind} />;
        break;
      case "results":
        screen = <Results />;
        break;
      case "notifications":
        screen = <Notifications />;
        break;
      case "settings":
        screen = <Settings />;
    }
  } else
    switch (tab) {
      case "home":
        screen = <Home />;
        break;
      case "feed":
        screen = <Feed />;
        break;
      case "search":
        screen = <Search />;
        break;
      case "chats":
        screen = <Chats />;
        break;
      case "account":
        screen = <Account />;
        break;
    }
  const mainRoute =
    route && route.name !== "detail" && route.name !== "success";
  return (
    <NavigationContext.Provider
      value={{
        tab,
        accountSection,
        selectTab,
        open,
        back,
        home,
        act,
        favorite: (id) => act({ kind: "favorite", petId: id }),
      }}
    >
      <SearchContext.Provider value={{ filters, setFilters }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          {storageError && (
            <View style={{ backgroundColor: c.peach, padding: 8 }}>
              <Copy style={{ fontSize: 12 }}>
                Не вдалося зберегти дані. У цьому сеансі застосунок працює без
                збереження.
              </Copy>
            </View>
          )}
          {mainRoute && (
            <View style={s.topbar}>
              <IconButton name="chevron-back" label="Назад" onPress={back} />
              <Text style={{ color: c.text, fontWeight: "600", fontSize: 17 }}>
                {titles[route.name]}
              </Text>
              <View style={{ width: 44 }} />
            </View>
          )}
          {!route && tab === "feed" && state.preferences.kind !== undefined && (
            <View style={s.recommendation}>
              <Icon name="sparkles-outline" size={15} color={c.primary} />
              <Text style={{ fontSize: 12, color: c.primary }}>
                Ваша добірка · знайомство починається тут
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Відкрити фільтри добірки"
                onPress={() => {
                  open({ name: "results" });
                }}
              >
                <Text style={{ color: c.orangeDark, fontSize: 12 }}>
                  Дивитись
                </Text>
              </Pressable>
            </View>
          )}
          <View
            key={
              route
                ? `${route.name}-${"petId" in route ? route.petId : ""}`
                : tab
            }
            style={{ flex: 1 }}
          >
            {screen}
          </View>
          {!route && (
            <View style={s.nav}>
              {tabs.map((t) => (
                <Pressable
                  accessibilityRole="tab"
                  accessibilityLabel={t.label}
                  accessibilityState={{ selected: tab === t.id }}
                  key={t.id}
                  onPress={() => selectTab(t.id)}
                  style={({ pressed }) => [
                    s.navItem,
                    pressed && { opacity: 0.6 },
                  ]}
                >
                  <View>
                    <Icon
                      name={t.icon}
                      size={24}
                      color={tab === t.id ? c.orange : c.text}
                    />
                    {t.id === "chats" && (
                      <NotificationBadge
                        count={
                          state.conversations.filter((x) => x.unread).length
                        }
                      />
                    )}
                  </View>
                  <Text
                    style={[
                      s.navLabel,
                      tab === t.id && { color: c.orangeDark },
                    ]}
                  >
                    {t.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
          <Auth
            key={intent ? `${intent.kind}-${intent.petId ?? ""}` : "closed"}
            visible={!!intent}
            onClose={() => setIntent(null)}
            onComplete={(name, contact) => {
              setState((s) => ({ ...s, user: { name, contact } }));
              const current = intent;
              setIntent(null);
              if (current) perform(current);
            }}
          />
        </KeyboardAvoidingView>
      </SearchContext.Provider>
    </NavigationContext.Provider>
  );
}
function ReadyPrototype() {
  const { ready } = useStore();
  return ready ? (
    <Prototype />
  ) : (
    <View style={s.loading}>
      <ActivityIndicator color={c.primary} />
    </View>
  );
}
export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <View style={s.canvas}>
        <SafeAreaView style={s.frame}>
          <Store>
            <ReadyPrototype />
          </Store>
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );
}
const s = StyleSheet.create({
  canvas: { flex: 1, backgroundColor: "#E4EBE6" },
  frame: {
    flex: 1,
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    backgroundColor: c.background,
  },
  loading: { flex: 1, alignItems: "center", justifyContent: "center" },
  nav: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingTop: 7,
    paddingBottom: 5,
    backgroundColor: c.background,
    borderTopWidth: 1,
    borderColor: c.border,
  },
  navItem: {
    flex: 1,
    minHeight: 56,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  navLabel: { fontSize: 11, fontWeight: "500", color: c.text },
  topbar: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    backgroundColor: c.background,
  },
  recommendation: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    gap: 7,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#EAF1ED",
  },
});
