import React, { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  ActionCard,
  Button,
  Copy,
  EmptyState,
  FavoriteButton,
  Heading,
  Icon,
  IconButton,
  PetCard,
  SearchBar,
  SectionHeader,
  ShelterBadge,
  StoryRow,
  Tags,
  u,
} from "../components/ui";
import { Pet, pets, petById } from "../data/pets";
import { useStore } from "../state/store";
import { useNav } from "../state/navigation";
import { matchesPet, emptyFilters } from "../state/domain";
import { theme } from "../theme";
import { BrandLogo } from "../components/BrandLogo";
const c = theme.color;
export function PetGrid({ items }: { items: Pet[] }) {
  const { state } = useStore();
  const nav = useNav();
  return (
    <View style={s.grid}>
      {items.map((p) => (
        <View key={p.id} style={s.gridCell}>
          <PetCard
            pet={p}
            favorite={state.favorites.includes(p.id)}
            onPress={() => nav.open({ name: "detail", petId: p.id })}
            onFavorite={() => nav.favorite(p.id)}
          />
        </View>
      ))}
    </View>
  );
}
export function Home() {
  const { state } = useStore();
  const nav = useNav();
  const recommended = pets.filter((p) =>
    matchesPet(p, { ...emptyFilters, ...state.preferences }),
  );
  return (
    <ScrollView
      contentContainerStyle={s.bottom}
      showsVerticalScrollIndicator={false}
    >
      <View style={s.pad}>
        <View style={[u.between, { marginBottom: 18 }]}>
          <View style={[u.row, { gap: 10 }]}>
            <BrandLogo size={50} />
            <Text style={s.brand}>Притулок</Text>
          </View>
          <IconButton
            name="notifications-outline"
            label="Сповіщення"
            onPress={() => nav.open({ name: "notifications" })}
          />
        </View>
        <SearchBar
          placeholder="Кого шукаємо?"
          onPress={() => nav.selectTab("search")}
        />
        <SectionHeader
          title="Підтримую"
          action="Усі"
          onPress={() => nav.selectTab("account", "Підтримую")}
        />
      </View>
      {state.supported.length ? (
        <StoryRow
          items={state.supported.map(petById)}
          onOpen={(p) => nav.open({ name: "detail", petId: p.id })}
        />
      ) : (
        <View style={s.pad}>
          <ActionCard
            emoji="💛"
            title="Стати чиєюсь підтримкою"
            subtitle="Навіть маленька допомога має значення"
            onPress={() => nav.open({ name: "support", petId: "luna" })}
          />
        </View>
      )}
      <View style={s.pad}>
        <SectionHeader title="Наступні дії" />
        {state.applications.length ? (
          <View style={{ gap: 10 }}>
            {state.applications.slice(0, 3).map((id) => (
              <ActionCard
                key={id}
                emoji="📩"
                title="Ваша заявка розглядається"
                subtitle={`${petById(id).name} · відповідь з’явиться в чаті`}
                onPress={() => nav.open({ name: "conversation", petId: id })}
              />
            ))}
          </View>
        ) : (
          <ActionCard
            emoji="🐾"
            title="Знайомство починається тут"
            subtitle="Знайдіть друга та дізнайтеся його історію"
            onPress={() => nav.selectTab("feed")}
          />
        )}
        <SectionHeader
          title="Продовжити перегляд"
          action="Усі"
          onPress={() => nav.selectTab("feed")}
        />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.carousel}
      >
        {(state.viewed.length
          ? state.viewed.map(petById)
          : pets.slice(1, 4)
        ).map((p) => (
          <PetCard
            key={p.id}
            wide
            pet={p}
            favorite={state.favorites.includes(p.id)}
            onFavorite={() => nav.favorite(p.id)}
            onPress={() => nav.open({ name: "detail", petId: p.id })}
          />
        ))}
      </ScrollView>
      <View style={s.pad}>
        <SectionHeader title="Може підійти для вас" />
        <PetGrid items={recommended.length ? recommended : pets} />
      </View>
    </ScrollView>
  );
}
export function Feed() {
  const nav = useNav();
  const { state } = useStore();
  return (
    <ScrollView
      contentContainerStyle={s.bottom}
      showsVerticalScrollIndicator={false}
    >
      <View style={[u.between, s.pad, { paddingTop: 8 }]}>
        <Heading large>Стрічка</Heading>
        <View style={u.row}>
          <IconButton
            name="chatbubble-outline"
            label="Повідомлення"
            onPress={() => nav.selectTab("chats")}
          />
          <IconButton
            name="heart-outline"
            label="Обране"
            onPress={() => nav.selectTab("account")}
          />
        </View>
      </View>
      <StoryRow
        items={[pets[6], pets[3], pets[4], pets[5]]}
        onOpen={(p) => nav.open({ name: "support", petId: p.id })}
      />
      {pets.map((p) => (
        <View key={p.id} style={s.feedCard}>
          <View style={[u.row, { padding: 16, gap: 10 }]}>
            <ShelterBadge />
            <View style={{ flex: 1, gap: 3 }}>
              <Text style={u.petName}>{p.shelter}</Text>
              <Text style={u.caption}>{p.city}</Text>
            </View>
            <Icon name="paw-outline" size={18} color={c.muted} />
          </View>
          <Copy style={{ paddingHorizontal: 16, paddingBottom: 14 }}>
            {p.story.split(".").slice(0, 2).join(".")}.
          </Copy>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Відкрити профіль: ${p.name}`}
            onPress={() => nav.open({ name: "detail", petId: p.id })}
          >
            <Image source={p.photo} style={s.feedPhoto} />
          </Pressable>
          <View style={{ padding: 16, paddingTop: 4, gap: 8 }}>
            <View style={u.between}>
              <View>
                <Heading>{p.name}</Heading>
                <Text style={u.caption}>
                  {p.age} · {p.city}
                </Text>
              </View>
              <FavoriteButton
                active={state.favorites.includes(p.id)}
                onPress={() => nav.favorite(p.id)}
              />
            </View>
            <Tags items={p.tags} />
            <Pressable
              accessibilityRole="button"
              onPress={() => nav.open({ name: "support", petId: p.id })}
              style={s.supportLink}
            >
              <Icon name="heart-outline" size={16} color={c.orangeDark} />
              <Text style={{ color: c.orangeDark, fontWeight: "500" }}>
                Підтримати {p.name}
              </Text>
              <Icon name="arrow-forward" size={16} color={c.orangeDark} />
            </Pressable>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
export function Detail({ petId }: { petId: string }) {
  const p = petById(petId);
  const nav = useNav();
  const { state } = useStore();
  const [photo, setPhoto] = useState(p.photo);
  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View>
          <Image source={photo} style={s.detailPhoto} />
          <View style={s.photoNav}>
            <IconButton
              name="chevron-back"
              label="Назад"
              onPress={nav.back}
              inverse
            />
            <IconButton
              name="chatbubble-ellipses-outline"
              label="Написати притулку"
              onPress={() => nav.act({ kind: "chat", petId })}
              inverse
            />
          </View>
        </View>
        <View style={s.detailBody}>
          <View style={u.between}>
            <Heading large>{p.name}</Heading>
            <FavoriteButton
              active={state.favorites.includes(p.id)}
              onPress={() => nav.favorite(p.id)}
            />
          </View>
          <ShelterBadge name={p.shelter} />
          <View style={[u.between, { marginVertical: 14, gap: 8 }]}>
            {[
              ["Вік", p.age],
              ["Стать", p.sex],
              ["Розмір", `${p.size} · ${p.weight}`],
              ["Місто", p.city],
            ].map(([label, value]) => (
              <View key={label} style={{ flexShrink: 1 }}>
                <Text style={u.caption}>{label}</Text>
                <Text
                  style={{ fontSize: 13, fontWeight: "600", color: c.text }}
                >
                  {value}
                </Text>
              </View>
            ))}
          </View>
          <Tags items={p.tags} />
          <SectionHeader title="Про мене" />
          <Copy muted>{p.story}</Copy>
          <SectionHeader title="Галерея" />
          <View style={[u.row, { gap: 10 }]}>
            {[p.photo].map((item, i) => (
              <Pressable
                key={i}
                accessibilityRole="button"
                accessibilityLabel={`Фото ${i + 1}`}
                onPress={() => setPhoto(item)}
                style={{ flex: 1 }}
              >
                <Image
                  source={item}
                  style={{ height: 100, width: "100%", borderRadius: 18 }}
                />
              </Pressable>
            ))}
          </View>
          <SectionHeader title="Здоров’я" />
          <Tags
            items={[
              p.vaccinated ? "Вакцинована" : "Вакцинація за віком",
              p.sterilized ? "Стерилізована" : "Ще не стерилізована",
              ...(p.special ? ["Потрібен особливий догляд"] : []),
            ]}
          />
          <SectionHeader title="Притулок" />
          <Copy>
            «{p.shelter}» · {p.city}
          </Copy>
          <Copy muted>
            Волонтери розкажуть про звички, догляд та допоможуть підготуватися
            до зустрічі.
          </Copy>
          <Button
            secondary
            onPress={() => nav.act({ kind: "chat", petId })}
            style={{ marginTop: 16 }}
          >
            Написати притулку
          </Button>
        </View>
      </ScrollView>
      <View style={s.cta}>
        <Button
          secondary
          onPress={() => nav.open({ name: "support", petId })}
          style={{ flex: 1 }}
        >
          Підтримати
        </Button>
        <Button
          onPress={() => nav.act({ kind: "application", petId })}
          style={{ flex: 1 }}
        >
          {state.applications.includes(petId) ? "Моя заявка" : "Познайомитися"}
        </Button>
      </View>
    </View>
  );
}
export function Notifications() {
  const nav = useNav();
  const { state } = useStore();
  return (
    <ScrollView contentContainerStyle={[s.pad, s.bottom]}>
      <SectionHeader title="Сповіщення" />
      {state.applications.length ? (
        state.applications.map((id) => (
          <View key={id} style={{ marginBottom: 12 }}>
            <ActionCard
              emoji="📩"
              title="Заявку отримано"
              subtitle={`Знайомство з ${petById(id).name}`}
              onPress={() => nav.open({ name: "conversation", petId: id })}
            />
          </View>
        ))
      ) : (
        <EmptyState
          title="Усе спокійно"
          text="Тут з’являтимуться відповіді притулків і новини про ваші заявки."
          icon="notifications-outline"
        />
      )}
    </ScrollView>
  );
}
const s = StyleSheet.create({
  pad: { paddingHorizontal: 16 },
  bottom: { paddingBottom: 28 },
  brand: {
    fontSize: 25,
    fontWeight: "600",
    letterSpacing: -0.6,
    color: c.primary,
  },
  logo: {
    width: 42,
    height: 42,
    borderRadius: 22,
    backgroundColor: c.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  carousel: { paddingHorizontal: 16, gap: 14 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 14 },
  gridCell: { width: "47.8%", flexGrow: 1, maxWidth: "49%" },
  feedCard: { marginTop: 10, backgroundColor: c.surface },
  feedPhoto: { width: "100%", height: 290, resizeMode: "cover" },
  supportLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingTop: 8,
    minHeight: 40,
  },
  detailPhoto: { width: "100%", height: 300 },
  photoNav: {
    position: "absolute",
    left: 16,
    right: 16,
    top: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailBody: {
    marginTop: -28,
    padding: 16,
    paddingTop: 22,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: c.surface,
  },
  cta: {
    flexDirection: "row",
    gap: 10,
    padding: 16,
    paddingTop: 12,
    backgroundColor: c.surface,
    borderTopWidth: 1,
    borderColor: c.border,
  },
});
