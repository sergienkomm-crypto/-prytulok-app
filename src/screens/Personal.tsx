import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  Button,
  Copy,
  EmptyState,
  FilterChip,
  Heading,
  Icon,
  IconButton,
  NotificationBadge,
  SearchBar,
  SectionHeader,
  ShelterBadge,
  u,
} from "../components/ui";
import { petById } from "../data/pets";
import { useNav } from "../state/navigation";
import { useStore } from "../state/store";
import { PetGrid } from "./Browse";
import { theme } from "../theme";
const c = theme.color;
export function Chats() {
  const nav = useNav();
  const { state } = useStore();
  const [tab, setTab] = useState("Усі");
  const [query, setQuery] = useState("");
  const chats = state.conversations.filter((chat) => {
    const p = petById(chat.petId);
    return (
      (tab !== "Непрочитані" || chat.unread) &&
      (tab !== "Заявки" || chat.application) &&
      `${p.name} ${p.shelter}`.toLowerCase().includes(query.toLowerCase())
    );
  });
  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
      <Heading large>Повідомлення</Heading>
      <View style={{ marginVertical: 16 }}>
        <SearchBar
          placeholder="Пошук повідомлень"
          value={query}
          onChange={setQuery}
        />
      </View>
      <View style={[u.row, { gap: 8, marginBottom: 16 }]}>
        {["Усі", "Непрочитані", "Заявки"].map((v) => (
          <FilterChip
            key={v}
            label={v}
            selected={tab === v}
            onPress={() => setTab(v)}
          />
        ))}
      </View>
      {!state.user ? (
        <EmptyState
          title="Будьмо на зв’язку"
          text="Увійдіть, щоб писати притулкам та отримувати відповіді на заявки."
          action="Увійти або зареєструватись"
          onPress={() => nav.act({ kind: "account" })}
          icon="chatbubbles-outline"
        />
      ) : !chats.length ? (
        <EmptyState
          title="Тут почнеться знайомство"
          text={
            query || tab !== "Усі"
              ? "Немає повідомлень за цими умовами."
              : "Напишіть притулку зі сторінки тварини — розмова з’явиться тут."
          }
          action="Переглянути тварин"
          onPress={() => nav.selectTab("feed")}
          icon="chatbubbles-outline"
        />
      ) : (
        chats.map((chat) => {
          const p = petById(chat.petId);
          return (
            <Pressable
              key={p.id}
              accessibilityRole="button"
              onPress={() => nav.open({ name: "conversation", petId: p.id })}
              style={[u.row, { paddingVertical: 14, gap: 12 }]}
            >
              <ShelterBadge />
              <View style={{ flex: 1, gap: 4 }}>
                <Text numberOfLines={1} style={u.petName}>
                  Притулок «{p.shelter}»
                </Text>
                <Text style={{ fontSize: 12, color: c.orangeDark }}>
                  🐾 {p.name}
                  {chat.application ? " · Заявка" : ""}
                </Text>
                <Text numberOfLines={1} style={u.caption}>
                  {chat.messages.at(-1)?.text}
                </Text>
              </View>
              <View>
                <Image
                  source={p.photo}
                  style={{ width: 52, height: 56, borderRadius: 14 }}
                />
                <NotificationBadge count={chat.unread ? 1 : 0} />
              </View>
            </Pressable>
          );
        })
      )}
    </ScrollView>
  );
}
export function Conversation({ petId }: { petId: string }) {
  const { state, setState } = useStore();
  const p = petById(petId);
  const nav = useNav();
  const [text, setText] = useState("");
  const scroll = React.useRef<React.ComponentRef<typeof ScrollView>>(null);
  const chat = state.conversations.find((c) => c.petId === petId);
  function send() {
    if (!text.trim()) return;
    setState((s) => ({
      ...s,
      conversations: s.conversations.map((c) =>
        c.petId === petId
          ? {
              ...c,
              messages: [
                ...c.messages,
                { id: `${Date.now()}`, mine: true, text: text.trim() },
              ],
            }
          : c,
      ),
    }));
    setText("");
  }
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View
        style={[u.row, { padding: 16, gap: 12, backgroundColor: c.surface }]}
      >
        <ShelterBadge />
        <View style={{ flex: 1 }}>
          <Text style={u.petName}>{p.shelter}</Text>
          <Text style={u.caption}>Розмова про {p.name}</Text>
        </View>
      </View>
      <Pressable
        accessibilityRole="button"
        onPress={() => nav.open({ name: "detail", petId })}
        style={[u.row, { padding: 12, gap: 12, backgroundColor: c.peach }]}
      >
        <Image
          source={p.photo}
          style={{ width: 48, height: 48, borderRadius: 12 }}
        />
        <View style={{ flex: 1 }}>
          <Text style={u.petName}>{p.name}</Text>
          <Text style={u.caption}>
            {chat?.application
              ? "Заявку на знайомство отримано"
              : "Переглянути профіль тварини"}
          </Text>
        </View>
        <Icon name="chevron-forward" size={18} />
      </Pressable>
      <ScrollView
        ref={scroll}
        onContentSizeChange={() =>
          scroll.current?.scrollToEnd({ animated: true })
        }
        contentContainerStyle={{ padding: 16, gap: 14, flexGrow: 1 }}
      >
        <Text style={[u.caption, { textAlign: "center" }]}>
          Демонстраційна розмова · повідомлення зберігаються на пристрої
        </Text>
        {chat?.messages.map((m) => (
          <View
            key={m.id}
            style={{
              maxWidth: "88%",
              alignSelf: m.mine ? "flex-end" : "flex-start",
              backgroundColor: m.mine ? c.primary : c.surface,
              padding: 16,
              borderRadius: 20,
              borderBottomRightRadius: m.mine ? 5 : 20,
              borderBottomLeftRadius: m.mine ? 20 : 5,
            }}
          >
            <Copy style={{ color: m.mine ? c.surface : c.text }}>{m.text}</Copy>
          </View>
        ))}
      </ScrollView>
      <View
        style={[u.row, { padding: 12, gap: 8, backgroundColor: c.surface }]}
      >
        <TextInput
          accessibilityLabel="Ваше повідомлення"
          placeholder="Написати повідомлення…"
          placeholderTextColor={c.muted}
          value={text}
          onChangeText={setText}
          maxLength={2000}
          style={{
            flex: 1,
            padding: 14,
            borderRadius: 24,
            backgroundColor: c.background,
            color: c.text,
            fontSize: 16,
          }}
        />
        <IconButton name="send" label="Надіслати повідомлення" onPress={send} />
      </View>
    </KeyboardAvoidingView>
  );
}
export function Account() {
  const { state } = useStore();
  const nav = useNav();
  const [tab, setTab] = useState(nav.accountSection);
  if (!state.user)
    return (
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Heading large>Акаунт</Heading>
        <EmptyState
          icon="person-outline"
          title="Збережіть своє знайомство"
          text="Обрані тварини, підтримка й заявки — усе поруч у вашому профілі."
          action="Створити акаунт / Увійти"
          onPress={() => nav.act({ kind: "account" })}
        />
      </ScrollView>
    );
  const items = (
    tab === "Обране"
      ? state.favorites
      : tab === "Підтримую"
        ? state.supported
        : []
  ).map(petById);
  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
      <View style={[u.row, { gap: 16, marginVertical: 18 }]}>
        <View
          style={{
            width: 72,
            height: 72,
            borderRadius: 36,
            backgroundColor: c.peach,
            borderColor: c.orange,
            borderWidth: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 30, color: c.orangeDark }}>
            {state.user.name[0]?.toUpperCase()}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Heading large>{state.user.name}</Heading>
          <Copy muted>Україна</Copy>
        </View>
        <IconButton
          name="settings-outline"
          label="Налаштування"
          onPress={() => nav.open({ name: "settings" })}
        />
      </View>
      <SectionHeader title="Про мене" />
      <Copy>
        Люблю тварин і маленькі добрі справи. Тут починається історія нашої
        дружби.
      </Copy>
      <View
        style={[
          u.row,
          { marginVertical: 28, borderBottomWidth: 1, borderColor: c.border },
        ]}
      >
        {["Обране", "Підтримую", "Мої оголошення"].map((v) => (
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === v }}
            key={v}
            onPress={() => setTab(v)}
            style={{
              flex: 1,
              paddingVertical: 14,
              borderBottomWidth: 2,
              borderColor: tab === v ? c.primary : "transparent",
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: tab === v ? c.primary : c.muted,
                fontSize: 13,
                fontWeight: tab === v ? "600" : "400",
              }}
            >
              {v}
            </Text>
          </Pressable>
        ))}
      </View>
      {items.length ? (
        <PetGrid items={items} />
      ) : (
        <EmptyState
          icon={tab === "Обране" ? "heart-outline" : "paw-outline"}
          title={
            tab === "Обране"
              ? "Хтось припаде до серця"
              : tab === "Підтримую"
                ? "Ваша допомога важлива"
                : "Мої оголошення"
          }
          text={
            tab === "Мої оголошення"
              ? "Створення оголошень додамо на наступному етапі. Зараз можна знайти друга або підтримати тварину."
              : tab === "Обране"
                ? "Натисніть сердечко на картці тварини, щоб зберегти її тут."
                : "Підтримайте тварину — її картка з’явиться тут."
          }
          action="Переглянути тварин"
          onPress={() => nav.selectTab("feed")}
        />
      )}
    </ScrollView>
  );
}
export function Settings() {
  const { reset, setState } = useStore();
  const nav = useNav();
  const [confirm, setConfirm] = useState(false);
  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }}>
      <Heading large>Налаштування</Heading>
      <Copy muted>
        Це UI-прототип: реєстрація та оплата імітуються. Стан зберігається лише
        на цьому пристрої.
      </Copy>
      <Button
        secondary
        onPress={() => {
          setState((s) => ({ ...s, user: null }));
          nav.home();
        }}
      >
        Вийти з акаунту
      </Button>
      <Button secondary onPress={() => setConfirm(!confirm)}>
        Почати демонстрацію спочатку
      </Button>
      {confirm && (
        <View style={{ gap: 14 }}>
          <Copy>
            Очистити локальні обране, повідомлення, підтримку та заявки?
          </Copy>
          <Button
            onPress={() => {
              reset();
              nav.home();
            }}
          >
            Так, очистити й пройти онбординг
          </Button>
          <Button secondary onPress={() => setConfirm(false)}>
            Скасувати
          </Button>
        </View>
      )}
    </ScrollView>
  );
}
