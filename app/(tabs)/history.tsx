import { StyleSheet, TouchableOpacity, TextInput, View } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useFonts } from "expo-font";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useMemo, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import * as SecureStore from "expo-secure-store";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useFocusEffect } from "expo-router";
import { Skeleton } from "moti/skeleton";

// Define the navigation parameter list
type RootStackParamList = {
  Home: undefined;
  NutritionDetail: NutritionResponse;
};

export interface NutritionResponse {
  id: string;
  type: string;
  name: string;
  calorie?: number;
  carbohydrates?: number;
  fats?: number;
  sugar?: number;
  protein?: number;
  createdAt: string;
  score: number;
  recommendation: string;
  // Add other fields as needed
}

const BASE_URL = "https://foodguard-api.akbarfikri.my.id";
// Create a typed navigation prop
type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;

interface MealItemProps {
  title?: string;
  carbo?: string;
  fats?: string;
  sugar?: string;
  time?: string;
  data?: NutritionResponse;
  isHighlighted?: boolean;
  isLoading?: boolean;
}

const fetchNutritions = async (): Promise<NutritionResponse[]> => {
  try {
    const token = await SecureStore.getItemAsync("userToken"); // Adjust the key as necessary

    const response = await fetch(`${BASE_URL}/api/v1/nutritions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch nutritions");
    }

    const data: NutritionResponse[] = await response.json();
    console.log(data);
    console.log(Date.now());
    console.log(data[0].createdAt);
    return data;
  } catch (error) {
    console.error("Error fetching nutrition data:", error);
    throw error;
  }
};

export default function HistoryScreen() {
  dayjs.extend(utc);
  dayjs.extend(timezone);

  const [fontsLoaded] = useFonts({
    Archivo: require("@/assets/fonts/Archivo-Regular.ttf"),
    "Archivo-Medium": require("@/assets/fonts/Archivo-Medium.ttf"),
    "Archivo-Bold": require("@/assets/fonts/Archivo-Bold.ttf"),
  });

  const [selectedPeriod, setSelectedPeriod] = useState("Weekly");
  const [searchQuery, setSearchQuery] = useState("");
  const [nutritionData, setNutritionData] = useState<NutritionResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const historyPlaceHolderList = useMemo(() => {
    return Array.from({ length: 5 }, (_, index) => index);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const loadNutritionData = async () => {
        try {
          setLoading(true);
          const data = await fetchNutritions();
          setNutritionData(data);
        } catch (err) {
          setError("Failed to load nutrition data");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      loadNutritionData();
    }, [])
  );

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "transparent", dark: "transparent" }}
    >
      {/* consumption history header section */}
      <ThemedView style={styles.titleContainer}>
        <ThemedView>
          <ThemedText style={styles.headerTitle}>
            Consumption History
          </ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            Monitor your meals and nutrients.
          </ThemedText>
        </ThemedView>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={20} color="#666" />
        </TouchableOpacity>
      </ThemedView>

      {/* search section */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons
            name="search-outline"
            size={16}
            color="#666"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search your meals..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* period toggle section */}
      <ThemedView style={styles.periodToggleContainer}>
        {["Monthly", "Weekly", "Daily"].map((period) => (
          <TouchableOpacity
            key={period}
            style={[
              styles.periodButton,
              selectedPeriod === period && styles.periodButtonActive,
            ]}
            onPress={() => setSelectedPeriod(period)}
          >
            <ThemedText
              style={[
                styles.periodButtonText,
                selectedPeriod === period && styles.periodButtonTextActive,
              ]}
            >
              {period}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ThemedView>

      {/* overall meal items section */}
      <ThemedView style={styles.mealsList}>
        {loading ? (
          <>
            {historyPlaceHolderList.map((_, index) => (
              <MealItem isLoading={loading} key={index} />
            ))}
          </>
        ) : (
          <>
            {/* Highlight of the Day */}
            {nutritionData.length > 0 && (
              <ThemedView style={styles.highlightContainer}>
                <ThemedView style={styles.highlightHeader}>
                  <Ionicons name="gift" size={20} color="white" />
                  <ThemedText style={styles.highlightTitle}>
                    Highlight of the Day
                  </ThemedText>
                </ThemedView>
                <MealItem
                  title={nutritionData[0].name}
                  carbo={nutritionData[0].carbohydrates?.toString() || "0"}
                  fats={nutritionData[0].fats?.toString() || "0"}
                  sugar={nutritionData[0].sugar?.toString() || "0"}
                  time={dayjs(parseInt(nutritionData[0].createdAt))
                    .tz("Asia/Jakarta", true)
                    .format("ddd, DD MMMM • hh.mm A")}
                  isHighlighted={true}
                  data={nutritionData[0]}
                />
              </ThemedView>
            )}

            {/* Regular meals */}
            {nutritionData
              .slice(1) // Skip the first item since it's highlighted
              .map((item) => (
                <MealItem
                  data={item}
                  key={item.id}
                  title={item.name}
                  carbo={item.carbohydrates?.toString() || "0"}
                  fats={item.fats?.toString() || "0"}
                  sugar={item.sugar?.toString() || "0"}
                  time={dayjs(parseInt(item.createdAt))
                    .tz("Asia/Jakarta", true)
                    .format("ddd, DD MMMM • hh.mm A")}
                />
              ))}
          </>
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const SkeletonCommonProps = {
  colorMode: "light",
  transition: {
    type: "timing",
    duration: 2000,
  },
  backgroundColor: "#D4D4D4",
};

const MealItem = ({
  title,
  carbo,
  fats,
  sugar,
  time,
  data,
  isHighlighted = false,
  isLoading = false,
}: MealItemProps) => {
  const navigation = useNavigation<NavigationProp>();

  console.log(isLoading);

  const handleNavigation = () => {
    if (data) {
      navigation.navigate("NutritionDetail", data);
    }
  };

  return (
    <TouchableOpacity onPress={handleNavigation} activeOpacity={0.7}>
      <ThemedView
        style={[
          styles.mealItem,
          isHighlighted && {
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
          },
        ]}
      >
        <Skeleton.Group show={isLoading}>
          <Skeleton height={24} width={96} {...SkeletonCommonProps}>
            <ThemedText style={styles.mealTitle}>{title}</ThemedText>
          </Skeleton>
          <ThemedView style={styles.nutritionInfo}>
            <Skeleton height={18} width={96} {...SkeletonCommonProps}>
              <ThemedText style={styles.nutritionText}>
                Carbo: {carbo} <ThemedText style={styles.unit}>gram</ThemedText>
              </ThemedText>
            </Skeleton>
            <Skeleton height={18} width={96} {...SkeletonCommonProps}>
              <ThemedText style={styles.nutritionText}>
                Fats: {fats} <ThemedText style={styles.unit}>gram</ThemedText>
              </ThemedText>
            </Skeleton>
            <Skeleton height={18} width={96} {...SkeletonCommonProps}>
              <ThemedText style={styles.nutritionText}>
                Sugar: {sugar} <ThemedText style={styles.unit}>gram</ThemedText>
              </ThemedText>
            </Skeleton>
          </ThemedView>
          <ThemedView style={styles.mealFooter}>
            <Skeleton height={24} width={192} {...SkeletonCommonProps}>
              <ThemedText style={styles.timeText}>{time}</ThemedText>
            </Skeleton>
            <Skeleton height={24} width={96} {...SkeletonCommonProps}>
              <View style={styles.seeMoreButton}>
                <ThemedText style={styles.seeMoreText}>See More</ThemedText>
                <Ionicons name="chevron-forward" size={16} color="#666" />
              </View>
            </Skeleton>
          </ThemedView>
        </Skeleton.Group>
      </ThemedView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  /* -------------------- */
  /* Header Section       */
  /* -------------------- */
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 0,
    backgroundColor: "white",
    marginHorizontal: -12,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Archivo-Medium",
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 15,
    color: "#666",
    fontFamily: "Archivo",
  },
  notificationButton: {
    padding: 8,
    marginBottom: 15,
  },

  /* -------------------- */
  /* Search Section       */
  /* -------------------- */
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 0,
    marginBottom: 20,
    backgroundColor: "white",
    marginHorizontal: -12,
    borderRadius: 12,
    gap: 8,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0000",
    borderRadius: 8,
    borderColor: "#F0F0F0",
    borderWidth: 2,
    paddingHorizontal: 0,
  },
  searchIcon: {
    paddingLeft: 10,
    marginRight: 2,
  },
  searchInput: {
    fontFamily: "Archivo",
    flex: 1,
    padding: 10,
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },

  /* -------------------- */
  /* Period Toggle        */
  /* -------------------- */
  periodToggleContainer: {
    flexDirection: "row",
    marginTop: -10,
    marginBottom: -10,
    backgroundColor: "#F3F4F6",
    marginHorizontal: -12,
    borderRadius: 12,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 8,
  },
  periodButtonActive: {
    backgroundColor: "white",
  },
  periodButtonText: {
    fontFamily: "Archivo",
    color: "#666",
  },
  periodButtonTextActive: {
    color: "#000",
    fontFamily: "Archivo-Medium",
  },

  // meals list section
  mealsList: {
    padding: 16,
    gap: 16,
    marginHorizontal: -16,
  },

  // highlight section
  highlightContainer: {
    borderRadius: 16,
    backgroundColor: "white",
    marginHorizontal: 0,
    borderColor: "#F0F0F0",
  },
  highlightHeader: {
    marginHorizontal: -12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#6366F1",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  highlightTitle: {
    color: "white",
    fontFamily: "Archivo-Bold",
    fontSize: 16,
  },

  // meal item component
  mealItem: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: -12,
    borderWidth: 2,
    borderColor: "#F0F0F0",
  },
  mealTitle: {
    fontSize: 18,
    fontFamily: "Archivo-Medium",
    marginBottom: 8,
  },
  nutritionInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  nutritionText: {
    fontFamily: "Archivo-Medium",
    fontSize: 14,
  },
  unit: {
    color: "#666",
    fontFamily: "Archivo",
  },

  // footer section
  mealFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    padding: 12,
    borderRadius: 12,
  },
  timeText: {
    color: "#666",
    fontFamily: "Archivo",
  },
  seeMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  seeMoreText: {
    color: "#666",
    fontFamily: "Archivo",
  },
});
