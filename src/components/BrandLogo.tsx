import React from "react";
import { Image } from "react-native";

/** Transparent adaptation of the logo supplied by the product owner. */
export function BrandLogo({ size = 48 }: { size?: number }) {
  return (
    <Image
      source={require("../../assets/brand/logo.png")}
      accessibilityLabel="Логотип Притулок: собака, кіт і сердечко"
      resizeMode="contain"
      style={{ width: size, height: size }}
    />
  );
}
