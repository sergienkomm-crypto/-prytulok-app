import React, { useEffect, useState } from "react";
import {
  Animated,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import {
  Button,
  Copy,
  Field,
  FilterChip,
  Heading,
  Icon,
  IconButton,
  u,
} from "../components/ui";
import { petById } from "../data/pets";
import { addApplication, validAmount, validContact } from "../state/domain";
import { useStore } from "../state/store";
import { useNav } from "../state/navigation";
import { theme } from "../theme";
const c = theme.color;
export function Auth({
  visible,
  onClose,
  onComplete,
}: {
  visible: boolean;
  onClose: () => void;
  onComplete: (name: string, contact: string) => void;
}) {
  const [method, setMethod] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [login, setLogin] = useState(false);
  const [error, setError] = useState("");
  function choose(value: string) {
    setMethod(value);
    setError("");
    setContact("");
  }
  function submit() {
    if (!name.trim()) {
      setError("Як до вас звертатися?");
      return;
    }
    if (
      (method === "Email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) ||
      (method === "Телефон" &&
        !/^\+?380\d{9}$/.test(contact.replace(/[\s()-]/g, "")))
    ) {
      setError(
        method === "Email"
          ? "Вкажіть коректний email."
          : "Вкажіть номер у форматі +380XXXXXXXXX.",
      );
      return;
    }
    onComplete(
      name.trim(),
      method === "Google" || method === "Apple"
        ? "demo@prytulok.example"
        : contact.trim(),
    );
  }
  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      transparent
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "#002E2580",
          justifyContent: "flex-end",
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ maxHeight: "95%" }}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              padding: 24,
              paddingBottom: 36,
              gap: 16,
              backgroundColor: c.background,
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
            }}
          >
            <View style={u.between}>
              <View style={{ width: 44 }} />
              <View
                style={{
                  width: 40,
                  height: 4,
                  backgroundColor: c.border,
                  borderRadius: 3,
                }}
              />
              <IconButton
                name="close"
                label="Закрити реєстрацію"
                onPress={onClose}
              />
            </View>
            <View
              style={{
                alignSelf: "center",
                padding: 20,
                backgroundColor: c.peach,
                borderRadius: 50,
              }}
            >
              <Icon name="paw" size={36} color={c.primary} />
            </View>
            <Heading large>
              {login ? "Раді бачити знову" : "Створити акаунт"}
            </Heading>
            <Copy muted>
              Збережіть обране, напишіть притулку та зробіть крок до знайомства.
            </Copy>
            <Text style={{ color: c.orangeDark, fontSize: 12 }}>
              Демо-вхід · без реальної авторизації та пароля
            </Text>
            {!method ? (
              <>
                <Button secondary onPress={() => choose("Google")}>
                  Продовжити з Google
                </Button>
                <Button secondary onPress={() => choose("Apple")}>
                  Продовжити з Apple
                </Button>
                <Button secondary onPress={() => choose("Email")}>
                  Через Email
                </Button>
                <Button secondary onPress={() => choose("Телефон")}>
                  За номером телефону
                </Button>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setLogin(!login)}
                  style={{ padding: 10 }}
                >
                  <Copy style={{ textAlign: "center" }}>
                    {login
                      ? "Немає акаунту? Зареєструватися"
                      : "Уже є акаунт? Увійти"}
                  </Copy>
                </Pressable>
              </>
            ) : (
              <>
                <Copy>
                  {method === "Google" || method === "Apple"
                    ? `Імітація входу через ${method}. Оберіть ім’я для демопрофілю.`
                    : `Демо-вхід через ${method}. Дані залишаються на цьому пристрої.`}
                </Copy>
                <Field
                  label="Ваше ім’я"
                  value={name}
                  onChangeText={setName}
                  placeholder="Наприклад, Олена"
                  maxLength={40}
                />
                {(method === "Email" || method === "Телефон") && (
                  <Field
                    label={method === "Email" ? "Email" : "Номер телефону"}
                    value={contact}
                    onChangeText={setContact}
                    placeholder={
                      method === "Email" ? "name@example.com" : "+380XXXXXXXXX"
                    }
                    autoCapitalize="none"
                    keyboardType={
                      method === "Email" ? "email-address" : "phone-pad"
                    }
                    maxLength={100}
                  />
                )}
                {!!error && (
                  <Text accessibilityRole="alert" style={{ color: c.error }}>
                    {error}
                  </Text>
                )}
                <Button onPress={submit}>Продовжити</Button>
                <Button secondary onPress={() => setMethod("")}>
                  Інший спосіб
                </Button>
              </>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
export function Application({ petId }: { petId: string }) {
  const { state, setState } = useStore();
  const nav = useNav();
  const p = petById(petId);
  const [name, setName] = useState(state.user?.name ?? "");
  const [contact, setContact] = useState(
    state.user?.contact === "demo@prytulok.example"
      ? ""
      : (state.user?.contact ?? ""),
  );
  const [housing, setHousing] = useState("");
  const [about, setAbout] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  function submit() {
    if (!name.trim() || !validContact(contact) || !housing || !agreed) {
      setError(
        "Вкажіть ім’я, коректний email або український номер телефону, тип житла та згоду на зв’язок.",
      );
      return;
    }
    setState((s) => addApplication(s, petId));
    nav.open({ name: "success", petId, kind: "application" });
  }
  if (state.applications.includes(petId))
    return (
      <View style={{ padding: 24, gap: 20 }}>
        <Heading large>Заявку вже надіслано 🐾</Heading>
        <Copy>
          Притулок отримав вашу заявку щодо {p.name}. Подальші домовленості — у
          повідомленнях.
        </Copy>
        <Button onPress={() => nav.open({ name: "conversation", petId })}>
          Перейти в чат
        </Button>
      </View>
    );
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }}
      >
        <Image
          source={p.photo}
          style={{ width: 88, height: 88, borderRadius: 44 }}
        />
        <Heading large>Крок до знайомства</Heading>
        <Copy muted>
          Розкажіть трохи про себе. Притулок «{p.shelter}» зв’яжеться з вами,
          щоб домовитися про зустріч із {p.name}.
        </Copy>
        <Field
          label="Ваше ім’я"
          value={name}
          onChangeText={setName}
          maxLength={40}
        />
        <Field
          label="Телефон або Email"
          placeholder="+380XXXXXXXXX або email"
          value={contact}
          onChangeText={setContact}
          autoCapitalize="none"
          error={!!error && !validContact(contact)}
        />
        <Copy>Де житиме ваш друг?</Copy>
        <View style={[u.row, { gap: 10 }]}>
          {["Квартира", "Будинок"].map((v) => (
            <FilterChip
              key={v}
              label={v}
              selected={housing === v}
              onPress={() => setHousing(v)}
            />
          ))}
        </View>
        <Field
          label="Що хочете розповісти? (необов’язково)"
          placeholder="Чи є у вас тварини, досвід догляду…"
          multiline
          value={about}
          onChangeText={setAbout}
          maxLength={1000}
        />
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: agreed }}
          onPress={() => setAgreed(!agreed)}
          style={[u.row, { gap: 12 }]}
        >
          <Icon
            name={agreed ? "checkbox" : "square-outline"}
            color={c.primary}
          />
          <Copy style={{ flex: 1, fontSize: 14 }}>
            Погоджуюся, щоб притулок зв’язався зі мною щодо знайомства.
          </Copy>
        </Pressable>
        {!!error && (
          <Text
            accessibilityRole="alert"
            style={{ color: c.error, lineHeight: 22 }}
          >
            {error}
          </Text>
        )}
        <Button onPress={submit}>Надіслати заявку</Button>
        <Text style={[u.caption, { textAlign: "center" }]}>
          Демо-заявка. Дані не надсилаються до справжнього притулку.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
export function Support({ petId }: { petId: string }) {
  const p = petById(petId);
  const { setState } = useStore();
  const nav = useNav();
  const [amount, setAmount] = useState("200");
  const [monthly, setMonthly] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [error, setError] = useState("");
  function submit() {
    if (!validAmount(amount)) {
      setError("Вкажіть цілу суму від 10 до 100 000 ₴.");
      return;
    }
    if (!checkout) {
      setCheckout(true);
      setError("");
      return;
    }
    setState((s) => ({
      ...s,
      supported: s.supported.includes(petId)
        ? s.supported
        : [...s.supported, petId],
    }));
    nav.open({ name: "success", petId, kind: "support" });
  }
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ padding: 24, gap: 20, paddingBottom: 32 }}
    >
      <Image
        source={p.photo}
        style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          alignSelf: "center",
        }}
      />
      <Heading large>
        {checkout ? "Маленький крок добра" : "Стати підтримкою"}
      </Heading>
      <Copy muted>
        {checkout
          ? `Ваша допомога для ${p.name} — ${amount} ₴${monthly ? " щомісяця" : ""}.`
          : `Їжа, турбота й теплі дні для ${p.name}. Оберіть комфортну для вас суму.`}
      </Copy>
      <View
        style={{
          padding: 16,
          borderRadius: 18,
          backgroundColor: c.peach,
          gap: 6,
        }}
      >
        <Text style={{ color: c.orangeDark, fontWeight: "600" }}>
          Демонстраційна оплата
        </Text>
        <Copy style={{ fontSize: 14 }}>
          Кошти не списуються. Дані банківської картки не потрібні.
        </Copy>
      </View>
      {!checkout ? (
        <>
          <View style={[u.row, { gap: 10 }]}>
            <FilterChip
              label="Разово"
              selected={!monthly}
              onPress={() => setMonthly(false)}
            />
            <FilterChip
              label="Щомісяця"
              selected={monthly}
              onPress={() => setMonthly(true)}
            />
          </View>
          <View style={[u.wrap, { gap: 10 }]}>
            {["100", "200", "500", "1000"].map((v) => (
              <FilterChip
                key={v}
                label={`${v} ₴`}
                selected={amount === v}
                onPress={() => setAmount(v)}
              />
            ))}
          </View>
          <Field
            label="Сума допомоги, ₴"
            keyboardType="number-pad"
            value={amount}
            onChangeText={setAmount}
            placeholder="Від 10 ₴"
            maxLength={6}
            error={!!error}
          />
          <Copy muted style={{ fontSize: 14 }}>
            Допомога для притулку «{p.shelter}». Для прототипу регулярний платіж
            також лише імітується.
          </Copy>
        </>
      ) : (
        <View
          style={{
            backgroundColor: c.surface,
            padding: 20,
            borderRadius: 20,
            gap: 14,
          }}
        >
          <View style={u.between}>
            <Copy>Сума</Copy>
            <Heading>{amount} ₴</Heading>
          </View>
          <View style={u.between}>
            <Copy muted>Періодичність</Copy>
            <Copy>{monthly ? "Щомісяця" : "Разово"}</Copy>
          </View>
          <View style={u.between}>
            <Copy muted>Спосіб</Copy>
            <Copy>Демо-платіж</Copy>
          </View>
        </View>
      )}
      {!!error && (
        <Text accessibilityRole="alert" style={{ color: c.error }}>
          {error}
        </Text>
      )}
      <Button onPress={submit}>
        {checkout ? "Підтвердити демо-підтримку" : "Продовжити"}
      </Button>
      {checkout && (
        <Button secondary onPress={() => setCheckout(false)}>
          Змінити суму
        </Button>
      )}
    </ScrollView>
  );
}
export function Success({
  petId,
  kind,
}: {
  petId: string;
  kind: "application" | "support";
}) {
  const nav = useNav();
  const { state } = useStore();
  const p = petById(petId);
  const [scale] = useState(() => new Animated.Value(0.25));
  const [opacity] = useState(() => new Animated.Value(0));
  useEffect(() => {
    const a = Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: Platform.OS !== "web",
        friction: 6,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 450,
        useNativeDriver: Platform.OS !== "web",
      }),
    ]);
    a.start();
    return () => a.stop();
  }, [scale, opacity]);
  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        padding: 28,
        gap: 24,
        alignItems: "center",
      }}
    >
      <Animated.View
        style={{
          transform: [{ scale }],
          opacity,
          width: 124,
          height: 124,
          borderRadius: 62,
          backgroundColor: c.peach,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon
          name={kind === "application" ? "checkmark" : "heart"}
          size={60}
          color={c.primary}
        />
      </Animated.View>
      <Text
        style={{
          fontSize: 30,
          color: c.text,
          fontWeight: "600",
          textAlign: "center",
        }}
      >
        {kind === "application"
          ? "Знайомство вже ближче!"
          : "Дякуємо за ваше тепло!"}
      </Text>
      <Copy muted style={{ textAlign: "center" }}>
        {kind === "application"
          ? `Притулок отримав вашу демо-заявку щодо ${p.name}. Відповідь і наступні кроки знайдете в повідомленнях.`
          : `${p.name} тепер у вашому списку підтримки. Це демонстрація: кошти не списано й підписку не оформлено.`}
      </Copy>
      <Button
        onPress={() => {
          if (kind === "application") {
            nav.home();
            nav.selectTab("chats");
            nav.open({ name: "conversation", petId });
          } else {
            if (!state.user) {
              nav.act({ kind: "account" });
            } else {
              nav.home();
              nav.selectTab("account", "Підтримую");
            }
          }
        }}
        style={{ alignSelf: "stretch" }}
      >
        {kind === "application"
          ? "Перейти до повідомлень"
          : "Переглянути акаунт"}
      </Button>
      <Button secondary onPress={nav.home} style={{ alignSelf: "stretch" }}>
        На головну
      </Button>
    </ScrollView>
  );
}
