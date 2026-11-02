import React, { ComponentProps, ReactNode } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { theme } from "../theme";
import { Pet } from "../data/pets";
const c = theme.color;
export type IconName = ComponentProps<typeof Ionicons>["name"];
export function Icon({
  name,
  size = 24,
  color = c.text,
}: {
  name: IconName;
  size?: number;
  color?: string;
}) {
  return <Ionicons name={name} size={size} color={color} />;
}
export function Copy({
  children,
  muted = false,
  style,
}: {
  children: ReactNode;
  muted?: boolean;
  style?: ComponentProps<typeof Text>["style"];
}) {
  return (
    <Text style={[u.copy, muted && { color: c.muted }, style]}>{children}</Text>
  );
}
export function Heading({
  children,
  large = false,
}: {
  children: ReactNode;
  large?: boolean;
}) {
  return <Text style={[u.heading, large && u.large]}>{children}</Text>;
}
export function Button({
  children,
  onPress,
  secondary = false,
  disabled = false,
  loading = false,
  style,
}: {
  children: ReactNode;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        u.button,
        secondary && u.secondary,
        disabled && { opacity: 0.4 },
        pressed && { opacity: 0.75, transform: [{ scale: 0.98 }] },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={c.surface} />
      ) : (
        <Text style={[u.buttonText, secondary && { color: c.orangeDark }]}>
          {children}
        </Text>
      )}
    </Pressable>
  );
}
export function IconButton({
  name,
  onPress,
  label,
  active = false,
  inverse = false,
}: {
  name: IconName;
  onPress: () => void;
  label: string;
  active?: boolean;
  inverse?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      onPress={onPress}
      hitSlop={4}
      style={({ pressed }) => [
        u.iconButton,
        inverse && { backgroundColor: c.primary },
        pressed && { opacity: 0.6 },
      ]}
    >
      <Icon
        name={name}
        color={inverse ? c.surface : active ? c.orange : c.text}
      />
    </Pressable>
  );
}
export function FavoriteButton({
  active,
  onPress,
}: {
  active: boolean;
  onPress: () => void;
}) {
  return (
    <IconButton
      name={active ? "heart" : "heart-outline"}
      label={active ? "Видалити з обраного" : "Додати в обране"}
      onPress={onPress}
      active={active}
    />
  );
}
export function FilterChip({
  label,
  selected = false,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        u.chip,
        selected && u.chipSelected,
        pressed && { opacity: 0.7 },
      ]}
    >
      <Text style={[u.chipText, selected && { color: c.surface }]}>
        {label}
      </Text>
    </Pressable>
  );
}
export function PetTag({ label }: { label: string }) {
  return (
    <View style={u.tag}>
      <Text style={u.tagText}>{label}</Text>
    </View>
  );
}
export function Tags({ items }: { items: string[] }) {
  return (
    <View style={u.wrap}>
      {items.map((t) => (
        <PetTag key={t} label={t} />
      ))}
    </View>
  );
}
export function VisualFilterCard({
  label,
  icon,
  selected,
  onPress,
  caption,
  scale = 30,
}: {
  label: string;
  icon?: string;
  selected: boolean;
  onPress: () => void;
  caption?: string;
  scale?: number;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[u.visual, selected && u.visualSelected]}
    >
      {icon && <Text style={{ fontSize: scale, lineHeight: 44 }}>{icon}</Text>}
      <Text style={[u.visualLabel, selected && { color: c.orangeDark }]}>
        {label}
      </Text>
      {caption && <Text style={u.caption}>{caption}</Text>}
    </Pressable>
  );
}
export function SearchBar({
  value,
  onChange,
  onPress,
  placeholder = "Пошук тварини",
  onFilter,
}: {
  value?: string;
  onChange?: (s: string) => void;
  onPress?: () => void;
  placeholder?: string;
  onFilter?: () => void;
}) {
  return (
    <View style={u.search}>
      <Icon name="search-outline" size={22} color={c.muted} />
      {onPress ? (
        <Pressable
          accessibilityRole="button"
          onPress={onPress}
          style={{ flex: 1, paddingVertical: 14 }}
        >
          <Copy muted>{placeholder}</Copy>
        </Pressable>
      ) : (
        <TextInput
          accessibilityLabel={placeholder}
          placeholder={placeholder}
          placeholderTextColor={c.muted}
          value={value}
          onChangeText={onChange}
          style={u.searchInput}
        />
      )}
      <IconButton
        name="options-outline"
        label="Параметри пошуку"
        onPress={onFilter ?? onPress ?? (() => {})}
      />
    </View>
  );
}
export function SectionHeader({
  title,
  action,
  onPress,
}: {
  title: string;
  action?: string;
  onPress?: () => void;
}) {
  return (
    <View style={u.section}>
      <Heading>{title}</Heading>
      {action && (
        <Pressable accessibilityRole="button" onPress={onPress} style={u.link}>
          <Text style={u.linkText}>{action}</Text>
          <Icon name="chevron-forward" size={16} color={c.orangeDark} />
        </Pressable>
      )}
    </View>
  );
}
export function ShelterBadge({
  name,
  small = false,
}: {
  name?: string;
  small?: boolean;
}) {
  return (
    <View style={[u.row, { gap: 8 }]}>
      <View style={[u.shelter, small && { width: 26, height: 26 }]}>
        <Icon name="paw" size={small ? 15 : 22} color={c.surface} />
      </View>
      {name && (
        <Copy muted style={{ flexShrink: 1, fontSize: 14 }}>
          Притулок «{name}»
        </Copy>
      )}
    </View>
  );
}
export function PetCard({
  pet,
  onPress,
  favorite,
  onFavorite,
  wide = false,
}: {
  pet: Pet;
  onPress: () => void;
  favorite: boolean;
  onFavorite: () => void;
  wide?: boolean;
}) {
  return (
    <View style={[u.petCard, wide && { width: 180 }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Відкрити профіль: ${pet.name}`}
        onPress={onPress}
      >
        <Image
          source={pet.photo}
          accessibilityLabel={pet.name}
          style={u.cardPhoto}
        />
      </Pressable>
      <View style={u.cardBody}>
        <View style={u.between}>
          <Pressable accessibilityRole="button" onPress={onPress}>
            <Text style={u.petName}>{pet.name}</Text>
          </Pressable>
          <FavoriteButton active={favorite} onPress={onFavorite} />
        </View>
        <Text style={u.caption}>
          {pet.age} · {pet.city}
        </Text>
        <Tags items={pet.tags.slice(0, 2)} />
      </View>
    </View>
  );
}
export function PetStory({
  pet,
  onPress,
  index = 0,
}: {
  pet: Pet;
  onPress: () => void;
  index?: number;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Історія тварини ${pet.name}`}
      onPress={onPress}
      style={u.story}
    >
      <Image source={pet.photo} style={u.storyPhoto} />
      <View
        style={[
          u.storyBadge,
          { backgroundColor: index % 2 ? c.orange : c.primary },
        ]}
      >
        <Icon name={index % 2 ? "heart" : "paw"} size={14} color={c.surface} />
      </View>
      <Text style={u.storyName}>{pet.name}</Text>
    </Pressable>
  );
}
export function StoryRow({
  items,
  onOpen,
}: {
  items: Pet[];
  onOpen: (p: Pet) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        gap: 14,
        paddingHorizontal: 16,
        paddingVertical: 6,
      }}
    >
      {items.map((p, i) => (
        <PetStory key={p.id} pet={p} index={i} onPress={() => onOpen(p)} />
      ))}
    </ScrollView>
  );
}
export function EmptyState({
  title,
  text,
  action,
  onPress,
  icon = "paw-outline",
}: {
  title: string;
  text: string;
  action?: string;
  onPress?: () => void;
  icon?: IconName;
}) {
  return (
    <View style={u.empty}>
      <View style={u.emptyIcon}>
        <Icon name={icon} size={34} />
      </View>
      <Heading>{title}</Heading>
      <Copy muted style={{ textAlign: "center" }}>
        {text}
      </Copy>
      {action && onPress && <Button onPress={onPress}>{action}</Button>}
    </View>
  );
}
export function Field({
  label,
  error,
  ...props
}: TextInputProps & { label: string; error?: boolean }) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={u.fieldLabel}>{label}</Text>
      <TextInput
        {...props}
        accessibilityLabel={label}
        placeholderTextColor={c.muted}
        style={[
          u.field,
          props.multiline && { minHeight: 100, textAlignVertical: "top" },
          error && { borderColor: c.error },
        ]}
      />
    </View>
  );
}
export function ActionCard({
  emoji,
  title,
  subtitle,
  onPress,
}: {
  emoji: string;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={u.actionCard}
    >
      <View style={u.actionEmoji}>
        <Text style={{ fontSize: 22 }}>{emoji}</Text>
      </View>
      <View style={{ flex: 1, gap: 3 }}>
        <Text style={u.petName}>{title}</Text>
        <Text style={u.caption}>{subtitle}</Text>
      </View>
      <Icon name="chevron-forward" color={c.muted} size={20} />
    </Pressable>
  );
}
export function NotificationBadge({ count }: { count: number }) {
  return count > 0 ? (
    <View style={u.notification}>
      <Text style={{ color: c.surface, fontSize: 11, fontWeight: "700" }}>
        {count}
      </Text>
    </View>
  ) : null;
}
export const u = StyleSheet.create({
  copy: { fontSize: theme.type.body, lineHeight: 24, color: c.text },
  heading: {
    fontSize: theme.type.h2,
    fontWeight: "600",
    color: c.text,
    letterSpacing: -0.5,
  },
  large: { fontSize: theme.type.h1, lineHeight: 34 },
  row: { flexDirection: "row", alignItems: "center" },
  between: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  button: {
    backgroundColor: c.primary,
    borderRadius: theme.radius.pill,
    minHeight: 54,
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  secondary: {
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.orange,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: c.surface,
    textAlign: "center",
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  chip: {
    borderWidth: 1,
    borderColor: c.orange,
    borderRadius: 24,
    paddingHorizontal: 16,
    minHeight: 38,
    justifyContent: "center",
    backgroundColor: c.surface,
  },
  chipSelected: { backgroundColor: c.primary, borderColor: c.primary },
  chipText: { fontSize: 14, color: c.text, fontWeight: "500" },
  tag: {
    borderWidth: 0.7,
    borderColor: c.orange,
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  tagText: { fontSize: 12, color: c.text },
  visual: {
    flex: 1,
    minHeight: 90,
    borderRadius: theme.radius.md,
    backgroundColor: c.surface,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    gap: 3,
    borderWidth: 1,
    borderColor: "transparent",
  },
  visualSelected: { borderColor: c.orange, backgroundColor: "#FFFDFA" },
  visualLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: c.text,
    textAlign: "center",
  },
  caption: { fontSize: 12, lineHeight: 17, color: c.muted },
  search: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: c.surface,
    borderRadius: 30,
    paddingLeft: 20,
    paddingRight: 7,
    minHeight: 56,
    boxShadow: "0 4px 18px #163A2510",
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    fontSize: 16,
    color: c.text,
    paddingVertical: 16,
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginTop: 24,
    marginBottom: 14,
  },
  link: { flexDirection: "row", alignItems: "center", gap: 2, minHeight: 32 },
  linkText: { color: c.orangeDark, fontSize: 14 },
  shelter: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: c.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  petCard: {
    flex: 1,
    backgroundColor: c.surface,
    borderRadius: theme.radius.md,
    overflow: "hidden",
    boxShadow: "0 2px 5px #163A2508",
  },
  cardPhoto: { width: "100%", height: 144, resizeMode: "cover" },
  cardBody: { paddingHorizontal: 12, paddingBottom: 14, gap: 7 },
  petName: { fontSize: 16, fontWeight: "600", color: c.text },
  story: {
    width: 78,
    height: 110,
    borderWidth: 0.8,
    borderColor: c.orange,
    borderRadius: 42,
    backgroundColor: c.surface,
    alignItems: "center",
    paddingTop: 5,
  },
  storyPhoto: { width: 66, height: 66, borderRadius: 35 },
  storyBadge: {
    width: 29,
    height: 29,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: c.surface,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -18,
  },
  storyName: { fontSize: 12, fontWeight: "600", color: c.text, marginTop: 3 },
  empty: {
    paddingHorizontal: 20,
    paddingVertical: 36,
    gap: 16,
    alignItems: "center",
  },
  emptyIcon: {
    width: 72,
    height: 72,
    backgroundColor: c.peach,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  fieldLabel: { fontSize: 14, fontWeight: "600", color: c.text },
  field: {
    backgroundColor: c.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: c.border,
    padding: 16,
    color: c.text,
    fontSize: 16,
    minHeight: 54,
  },
  actionCard: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    backgroundColor: c.surface,
    borderRadius: 32,
    padding: 8,
    paddingRight: 16,
    minHeight: 64,
    boxShadow: "0 4px 15px #163A2508",
  },
  actionEmoji: {
    width: 44,
    height: 44,
    borderRadius: 24,
    backgroundColor: c.peach,
    alignItems: "center",
    justifyContent: "center",
  },
  notification: {
    backgroundColor: c.orange,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: 0,
    top: 1,
  },
});
