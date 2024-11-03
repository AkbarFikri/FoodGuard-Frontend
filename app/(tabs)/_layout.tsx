import { SplashScreen, Tabs, useSegments } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet, Pressable } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

interface TabIconProps {
  color?: string;
  focused: boolean;
  size?: number;
}

export default function TabLayout() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  //   useEffect(() => {
  //     checkAuth();

  //     if (!isAuthenticated) {
  //       router.replace("/(auth)/login");
  //     }
  //   }, []);

  //   const checkAuth = async () => {
  //     try {
  //       const token = await SecureStore.getItemAsync("userToken");
  //       setIsAuthenticated(!!token);
  //     } catch (error) {
  //       console.error("Error checking auth:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#6366F1",
        headerShown: false,
        tabBarStyle: {
          height: 50,
          position: "relative",
        },
        tabBarItemStyle: {
          marginTop: 5,
          paddingVertical: -15,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          paddingVertical: -10,
          marginBottom: 5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }: TabIconProps) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={20}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color, focused }: TabIconProps) => (
            <Ionicons
              name={focused ? "time" : "time-outline"}
              size={20}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="scan"
        options={{
          title: "",
          tabBarIcon: ({ focused }: TabIconProps) => (
            <View style={styles.scanButton}>
              <Ionicons name="qr-code-outline" size={20} color="white" />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="education"
        options={{
          title: "Education",
          tabBarIcon: ({ color, focused }: TabIconProps) => (
            <Ionicons
              name={focused ? "book" : "book-outline"}
              size={20}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }: TabIconProps) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={20}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  scanButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#6366F1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
