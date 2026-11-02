import React, { createContext, useContext, useState } from "react";
import { Keyboard, ScrollView, Switch, Text, View } from "react-native";
import {
  Button,
  Copy,
  EmptyState,
  Field,
  FilterChip,
  Heading,
  Icon,
  SearchBar,
  SectionHeader,
  VisualFilterCard,
  u,
} from "../components/ui";
import { emptyFilters, Filters, matchesPet, toggleItem } from "../state/domain";
import { pets } from "../data/pets";
import { useNav } from "../state/navigation";
import { PetGrid } from "./Browse";
import { theme } from "../theme";
export const SearchContext = createContext<{
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
} | null>(null);
export function useSearch() {
  const v = useContext(SearchContext);
  if (!v) throw Error("Search missing");
  return v;
}
export function Search() {
  const { filters: f, setFilters } = useSearch();
  const nav = useNav();
  const [more, setMore] = useState(false);
  const [cities, setCities] = useState(false);
  const set = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    setFilters((old) => ({ ...old, [key]: value }));
  const count = pets.filter((p) => matchesPet(p, f)).length;
  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 16, paddingBottom: 28 }}
        showsVerticalScrollIndicator={false}
      >
        <SearchBar
          value={f.query}
          onChange={(q) => set("query", q)}
          onFilter={() => setMore(!more)}
        />
        <SectionHeader title="Місто" />
        <View style={[u.wrap, { gap: 8 }]}>
          {["Київ", "Львів", "Харків", "Одеса", "Дніпро"].map((city) => (
            <FilterChip
              key={city}
              label={city}
              selected={f.city === city}
              onPress={() => set("city", f.city === city ? "" : city)}
            />
          ))}
        </View>
        <View style={{ marginTop: 12 }}>
          <Button secondary onPress={() => setCities(!cities)}>
            {f.city || "Усі міста"} ⌄
          </Button>
        </View>
        {cities && (
          <View style={{ gap: 10, marginTop: 12 }}>
            <FilterChip
              label="Усі міста"
              selected={!f.city}
              onPress={() => {
                set("city", "");
                setCities(false);
              }}
            />
            <Field
              label="Місто"
              placeholder="Наприклад, Полтава"
              value={f.city}
              onChangeText={(v) => set("city", v)}
            />
          </View>
        )}
        <SectionHeader title="Вид тварини" />
        <View style={[u.row, { gap: 10 }]}>
          {[
            ["Собака", "🐶"],
            ["Кіт", "🐱"],
            ["", "🐾"],
          ].map(([v, i]) => (
            <VisualFilterCard
              key={v}
              label={v || "Не важливо"}
              icon={i}
              selected={f.kind === v}
              onPress={() => set("kind", v)}
            />
          ))}
        </View>
        <SectionHeader title="Стать" />
        <View style={[u.row, { gap: 10 }]}>
          {[
            ["Дівчинка", "♀"],
            ["Хлопчик", "♂"],
          ].map(([v, i]) => (
            <VisualFilterCard
              key={v}
              label={v}
              icon={i}
              selected={f.sex === v}
              onPress={() => set("sex", f.sex === v ? "" : v)}
            />
          ))}
        </View>
        <SectionHeader title="Розмір" />
        <View style={[u.row, { gap: 8 }]}>
          {[
            ["S", "до 5 кг"],
            ["M", "5–15 кг"],
            ["L", "15–25 кг"],
            ["XL", "понад 25 кг"],
          ].map(([v, w], i) => (
            <VisualFilterCard
              key={v}
              label={v}
              caption={w}
              icon={f.kind === "Кіт" ? "🐈" : "🐕"}
              scale={18 + i * 7}
              selected={f.size === v}
              onPress={() => set("size", f.size === v ? "" : v)}
            />
          ))}
        </View>
        <SectionHeader title="Вік" />
        <View style={[u.row, { gap: 6 }]}>
          {[
            ["Малюк", "🐣"],
            ["Молодий", "🌱"],
            ["Дорослий", "🐾"],
            ["Старший", "☀️"],
          ].map(([v, i]) => (
            <VisualFilterCard
              key={v}
              label={v}
              icon={i}
              selected={f.age === v}
              onPress={() => set("age", f.age === v ? "" : v)}
            />
          ))}
        </View>
        <SectionHeader title="Може жити разом" />
        <View style={[u.row, { gap: 6 }]}>
          {[
            ["Діти", "🧒"],
            ["Собаки", "🐶"],
            ["Коти", "🐱"],
            ["Люди", "👤"],
          ].map(([v, i]) => (
            <VisualFilterCard
              key={v}
              label={v}
              icon={i}
              selected={f.compatible.includes(v)}
              onPress={() => set("compatible", toggleItem(f.compatible, v))}
            />
          ))}
        </View>
        <SectionHeader title="Характер" />
        <View style={[u.wrap, { gap: 8 }]}>
          {[
            "Активний",
            "Спокійний",
            "Лагідний",
            "Грайливий",
            "Добрий",
            "Самостійний",
          ].map((v) => (
            <FilterChip
              key={v}
              label={v}
              selected={f.character.includes(v)}
              onPress={() => set("character", toggleItem(f.character, v))}
            />
          ))}
        </View>
        <View style={{ marginTop: 24 }}>
          <Button secondary onPress={() => setMore(!more)}>
            Додаткові параметри {more ? "−" : "+"}
          </Button>
        </View>
        {more && (
          <View style={{ gap: 14, marginTop: 20 }}>
            {(
              [
                ["vaccinated", "Вакцинована"],
                ["sterilized", "Стерилізована"],
                ["special", "Особливі потреби"],
              ] as const
            ).map(([key, label]) => (
              <View key={key} style={u.between}>
                <Copy>{label}</Copy>
                <Switch
                  accessibilityLabel={label}
                  value={f[key]}
                  onValueChange={(v) => set(key, v)}
                  trackColor={{ true: theme.color.primary }}
                />
              </View>
            ))}
            <Field
              label="Притулок"
              placeholder="Назва притулку"
              value={f.shelter}
              onChangeText={(v) => set("shelter", v)}
            />
          </View>
        )}
      </ScrollView>
      <View
        style={{
          padding: 16,
          backgroundColor: theme.color.surface,
          flexDirection: "row",
          gap: 10,
        }}
      >
        <Button secondary onPress={() => setFilters({ ...emptyFilters })}>
          Очистити
        </Button>
        <Button
          onPress={() => {
            Keyboard.dismiss();
            nav.open({ name: "results" });
          }}
          style={{ flex: 1 }}
        >
          Показати: {count}
        </Button>
      </View>
    </View>
  );
}
export function Results() {
  const nav = useNav();
  const { filters } = useSearch();
  const items = pets.filter((p) => matchesPet(p, filters));
  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
      <Heading large>Ваша добірка</Heading>
      <View style={[u.between, { marginVertical: 16 }]}>
        <Copy muted>Знайдено тварин: {items.length}</Copy>
        <Button
          secondary
          onPress={() => {
            nav.back();
            nav.selectTab("search");
          }}
        >
          Фільтри
        </Button>
      </View>
      {items.length ? (
        <PetGrid items={items} />
      ) : (
        <EmptyState
          icon="search-outline"
          title="Поки без збігів"
          text="Спробуйте обрати інше місто або прибрати кілька фільтрів."
          action="Змінити фільтри"
          onPress={nav.back}
        />
      )}
      <View style={[u.row, { marginTop: 20, gap: 8 }]}>
        <Icon name="heart-outline" size={18} />
        <Text style={u.caption}>Свій друг обов’язково знайдеться.</Text>
      </View>
    </ScrollView>
  );
}
