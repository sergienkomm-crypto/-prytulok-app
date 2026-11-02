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
  Button,
  Copy,
  Heading,
  Icon,
  IconButton,
  VisualFilterCard,
  u,
} from "../components/ui";
import { pets } from "../data/pets";
import { useStore } from "../state/store";
import { toggleItem } from "../state/domain";
import { theme } from "../theme";
import { BrandLogo } from "../components/BrandLogo";
const c = theme.color;
export function Onboarding({
  onFinish,
}: {
  onFinish: (kind: string, compatible: string[], size: string) => void;
}) {
  const { setState } = useStore();
  const [step, setStep] = useState(0);
  const [kind, setKind] = useState("");
  const [compatible, setCompatible] = useState<string[]>([]);
  const [small, setSmall] = useState(false);
  const selected = (value: string) =>
    value === "small"
      ? small
      : value
        ? compatible.includes(value)
        : compatible.length === 0 && !small;
  function finish() {
    setState((s) => ({
      ...s,
      onboarded: true,
      preferences: { kind, compatible, size: small ? "S" : "" },
    }));
    onFinish(kind, compatible, small ? "S" : "");
  }
  return (
    <View style={{ flex: 1 }}>
      <View style={[u.between, { paddingHorizontal: 16, paddingTop: 8 }]}>
        {step > 0 ? (
          <IconButton
            name="arrow-back"
            label="Попередній крок"
            onPress={() => setStep(step - 1)}
          />
        ) : (
          <View style={u.row}>
            <BrandLogo size={44} />
            <Text style={s.brand}>Притулок</Text>
          </View>
        )}
        <Pressable
          accessibilityRole="button"
          onPress={finish}
          style={{ padding: 12 }}
        >
          <Copy muted>Пропустити</Copy>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={s.content}>
        {step < 2 ? (
          <>
            <View style={s.hero}>
              <Image source={pets[step === 0 ? 0 : 2].photo} style={s.photo} />
              <View style={s.photoLabel}>
                <Text style={{ fontSize: 18 }}>🐾</Text>
                <Copy>
                  {step === 0
                    ? "Кожному потрібна своя людина"
                    : "Маленька допомога. Великі зміни."}
                </Copy>
              </View>
            </View>
            <Text style={s.eyebrow}>БЛИЖЧЕ ДО СВОЇХ</Text>
            <Text style={s.title}>
              {step === 0
                ? "Знайди свого\nдруга"
                : "Любов має\nбагато способів"}
            </Text>
            <Copy muted style={{ textAlign: "center" }}>
              {step === 0
                ? "Тварини з притулків України в одному застосунку. Ваша зустріч може змінити два життя."
                : "Знайди друга для своєї родини або підтримай тих, хто ще чекає на дім."}
            </Copy>
            {step === 1 && (
              <View style={[u.row, { gap: 12, marginTop: 12 }]}>
                <View style={s.option}>
                  <Text style={{ fontSize: 28 }}>🏠</Text>
                  <Copy>Знайти друга</Copy>
                </View>
                <View style={s.option}>
                  <Text style={{ fontSize: 28 }}>🫶</Text>
                  <Copy>Допомогти</Copy>
                </View>
              </View>
            )}
          </>
        ) : (
          <>
            <View style={s.stepIcon}>
              <Icon name="paw-outline" size={42} color={c.primary} />
            </View>
            <Heading large>
              {step === 2 ? "Кого шукаєте?" : "Що для вас важливо?"}
            </Heading>
            <Copy muted style={{ textAlign: "center" }}>
              {step === 2
                ? "Допоможемо знайти того самого друга."
                : "Оберіть те, що підходить вашій родині. Це можна змінити пізніше."}
            </Copy>
            {step === 2 ? (
              <View style={[u.row, { gap: 10, marginTop: 24 }]}>
                {[
                  ["Собака", "🐶"],
                  ["Кіт", "🐱"],
                  ["", "🐾"],
                ].map(([value, icon]) => (
                  <VisualFilterCard
                    key={value}
                    label={value || "Не важливо"}
                    icon={icon}
                    selected={kind === value}
                    onPress={() => setKind(value)}
                  />
                ))}
              </View>
            ) : (
              <View style={{ gap: 12, marginTop: 24, width: "100%" }}>
                {[
                  ["Діти", "🧒", "Для сім’ї з дітьми"],
                  ["Собаки", "🐶", "Може жити із собакою"],
                  ["Коти", "🐱", "Може жити з котом"],
                  ["small", "🏠", "Невеликий розмір"],
                  ["", "🐾", "Не важливо"],
                ].map(([value, emoji, label]) => (
                  <Pressable
                    key={value}
                    accessibilityRole="button"
                    accessibilityLabel={label}
                    accessibilityState={{
                      selected: selected(value),
                    }}
                    onPress={() =>
                      value === "small"
                        ? setSmall(!small)
                        : value
                          ? setCompatible(toggleItem(compatible, value))
                          : (setCompatible([]), setSmall(false))
                    }
                    style={[s.choice, selected(value) && s.selected]}
                  >
                    <Text style={{ fontSize: 26 }}>{emoji}</Text>
                    <Copy style={{ flex: 1 }}>{label}</Copy>
                    <Icon
                      name={
                        selected(value) ? "checkmark-circle" : "ellipse-outline"
                      }
                      color={c.primary}
                    />
                  </Pressable>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
      <View style={s.footer}>
        <View
          style={[u.row, { gap: 6, alignSelf: "center", marginBottom: 20 }]}
        >
          {[0, 1, 2, 3].map((i) => (
            <View
              key={i}
              style={{
                height: 6,
                width: i === step ? 24 : 6,
                borderRadius: 3,
                backgroundColor: i === step ? c.primary : c.border,
              }}
            />
          ))}
        </View>
        <Button onPress={() => (step === 3 ? finish() : setStep(step + 1))}>
          {step === 3 ? "Показати тварин" : "Далі"}
        </Button>
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  brand: { fontSize: 23, fontWeight: "600", color: c.primary, marginLeft: 8 },
  content: { flexGrow: 1, padding: 24, alignItems: "center", gap: 16 },
  hero: {
    width: "100%",
    height: 280,
    borderRadius: 160,
    overflow: "hidden",
    backgroundColor: c.peach,
    marginVertical: 8,
  },
  photo: { width: "100%", height: "100%", resizeMode: "cover" },
  photoLabel: {
    position: "absolute",
    bottom: 18,
    alignSelf: "center",
    backgroundColor: c.surface,
    borderRadius: 25,
    padding: 10,
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    color: c.orangeDark,
  },
  title: {
    fontSize: 36,
    lineHeight: 40,
    fontWeight: "600",
    letterSpacing: -1.4,
    color: c.text,
    textAlign: "center",
  },
  option: {
    flex: 1,
    alignItems: "center",
    backgroundColor: c.surface,
    padding: 16,
    borderRadius: 20,
    gap: 8,
  },
  stepIcon: {
    marginTop: 24,
    marginBottom: 12,
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: c.peach,
    alignItems: "center",
    justifyContent: "center",
  },
  choice: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
    padding: 18,
    borderRadius: 20,
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: "transparent",
  },
  selected: { borderColor: c.orange },
  footer: { padding: 20, paddingTop: 12 },
});
