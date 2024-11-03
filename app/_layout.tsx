import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import * as SecureStore from "expo-secure-store";
import { useColorScheme } from "@/hooks/useColorScheme";
import React from "react";
import { View } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [initialized, setInitialized] = useState(false);

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    async function initialize() {
      try {
        // Load fonts and check authentication simultaneously
        const token = await SecureStore.getItemAsync("userToken");

        if (loaded) {
          await SplashScreen.hideAsync();
          // Navigate based on authentication state
          if (token) {
            router.replace("/(tabs)");
          } else {
            router.replace("/(auth)/login");
          }
        }
      } catch (error) {
        console.error("Initialization error:", error);
        router.replace("/(auth)/login"); // Fallback to login on error
      } finally {
        setInitialized(true);
      }
    }

    initialize();
  }, [loaded]);

  // Show nothing until everything is initialized
  if (!loaded || !initialized) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Slot />
    </ThemeProvider>
  );
}
