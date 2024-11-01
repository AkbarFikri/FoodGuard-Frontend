import { StyleSheet, TouchableOpacity, TextInput, View } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { useFonts } from 'expo-font';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define the navigation parameter list
type RootStackParamList = {
  Home: undefined;
  NutritionDetail: {
    title: string;
    carbo: string;
    fats: string;
    sugar: string;
    time: string;
  };
};

// Create a typed navigation prop
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface MealItemProps {
  title: string;
  carbo: string;
  fats: string;
  sugar: string;
  time: string;
  isHighlighted?: boolean;
}

export default function HistoryScreen() {
  const [fontsLoaded] = useFonts({
    'Archivo': require('@/assets/fonts/Archivo-Regular.ttf'),
    'Archivo-Medium': require('@/assets/fonts/Archivo-Medium.ttf'),
    'Archivo-Bold': require('@/assets/fonts/Archivo-Bold.ttf'),
  });

  const [selectedPeriod, setSelectedPeriod] = useState('Weekly');
  const [searchQuery, setSearchQuery] = useState('');

  if (!fontsLoaded) {
    return null;
  }
  
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: 'transparent', dark: 'transparent' }}>
      {/* consumption history header section */}
      <ThemedView style={styles.titleContainer}>
        <ThemedView>
          <ThemedText style={styles.headerTitle}>Consumption History</ThemedText>
          <ThemedText style={styles.headerSubtitle}>Monitor your meals and nutrients.</ThemedText>
        </ThemedView>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={20} color="#666" />
        </TouchableOpacity>
      </ThemedView>

      {/* search section */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search-outline" size={16} color="#666" style={styles.searchIcon} />
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
        {['Monthly', 'Weekly', 'Daily'].map((period) => (
          <TouchableOpacity 
            key={period}
            style={[
              styles.periodButton,
              selectedPeriod === period && styles.periodButtonActive
            ]}
            onPress={() => setSelectedPeriod(period)}>
            <ThemedText style={[
              styles.periodButtonText,
              selectedPeriod === period && styles.periodButtonTextActive
            ]}>{period}</ThemedText>
          </TouchableOpacity>
        ))}
      </ThemedView>

      {/* overall meal items section */}
      <ThemedView style={styles.mealsList}>
        {/* Highlight of the Day */}
        <ThemedView style={styles.highlightContainer}>
          <ThemedView style={styles.highlightHeader}>
            <Ionicons name="gift" size={20} color="white" />
            <ThemedText style={styles.highlightTitle}>Highlight of the Day</ThemedText>
          </ThemedView>
          <MealItem
            title="Chicken Crispy Mrs Elly"
            carbo="30"
            fats="12"
            sugar="5"
            time="Tue, 18 July • 07.00 am"
            isHighlighted={true}
          />
        </ThemedView>

        {/* regular meals */}
        <MealItem
          title="Wagyu Tenderloin A5"
          carbo="29"
          fats="14"
          sugar="9"
          time="Tue, 17 July • 09.17 am"
        />

        <MealItem
          title="Lagsa Singapore Noodles"
          carbo="16"
          fats="12"
          sugar="5"
          time="Tue, 17 July • 07.00 am"
        />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const MealItem = ({ title, carbo, fats, sugar, time, isHighlighted = false }: MealItemProps) => {
  const navigation = useNavigation<NavigationProp>();
  
  const handleNavigation = () => {
    navigation.navigate('NutritionDetail', {
      title,
      carbo,
      fats,
      sugar,
      time,
    });
  };
  
  return (
    <TouchableOpacity 
      onPress={handleNavigation}
      activeOpacity={0.7}
    >
      <ThemedView style={[
        styles.mealItem, 
        isHighlighted && {
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
        }
      ]}>
        <ThemedText style={styles.mealTitle}>{title}</ThemedText>
        <ThemedView style={styles.nutritionInfo}>
          <ThemedText style={styles.nutritionText}>Carbo: {carbo} <ThemedText style={styles.unit}>gram</ThemedText></ThemedText>
          <ThemedText style={styles.nutritionText}>Fats: {fats} <ThemedText style={styles.unit}>gram</ThemedText></ThemedText>
          <ThemedText style={styles.nutritionText}>Sugar: {sugar} <ThemedText style={styles.unit}>gram</ThemedText></ThemedText>
        </ThemedView>
        <ThemedView style={styles.mealFooter}>
          <ThemedText style={styles.timeText}>{time}</ThemedText>
          <View style={styles.seeMoreButton}>
            <ThemedText style={styles.seeMoreText}>See More</ThemedText>
            <Ionicons name="chevron-forward" size={16} color="#666" />
          </View>
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  /* -------------------- */
  /* Header Section       */
  /* -------------------- */
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 0,
    backgroundColor: 'white',
    marginHorizontal: -12,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Archivo-Medium',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#666',
    fontFamily: 'Archivo',
  },
  notificationButton: {
    padding: 8,
    marginBottom: 15,
  },

  /* -------------------- */
  /* Search Section       */
  /* -------------------- */
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 20,
    backgroundColor: 'white',
    marginHorizontal: -12,
    borderRadius: 12,
    gap: 8,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0000',
    borderRadius: 8,
    borderColor: '#F0F0F0',
    borderWidth: 2,
    paddingHorizontal: 0,
  },
  searchIcon: {
    paddingLeft: 10,
    marginRight: 2,
  },
  searchInput: {
    fontFamily: 'Archivo',
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
    flexDirection: 'row',
    marginTop: -10,
    marginBottom: -10,
    backgroundColor: '#F3F4F6',
    marginHorizontal: -12,
    borderRadius: 12,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  periodButtonActive: {
    backgroundColor: 'white',
  },
  periodButtonText: {
    fontFamily: 'Archivo',
    color: '#666',
  },
  periodButtonTextActive: {
    color: '#000',
    fontFamily: 'Archivo-Medium',
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
    backgroundColor: 'white',
    marginHorizontal: 0,
    borderColor: '#F0F0F0',
  },
  highlightHeader: {
    marginHorizontal: -12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#6366F1',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  highlightTitle: {
    color: 'white',
    fontFamily: 'Archivo-Bold',
    fontSize: 16,
  },

  // meal item component
  mealItem: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: -12,
    borderWidth: 2,
    borderColor: '#F0F0F0',
  },
  mealTitle: {
    fontSize: 18,
    fontFamily: 'Archivo-Medium',
    marginBottom: 8,
  },
  nutritionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  nutritionText: {
    fontFamily: 'Archivo-Medium',
    fontSize: 14,
  },
  unit: {
    color: '#666',
    fontFamily: 'Archivo',
  },

  // footer section
  mealFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 12,
  },
  timeText: {
    color: '#666',
    fontFamily: 'Archivo',
  },
  seeMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeMoreText: {
    color: '#666',
    fontFamily: 'Archivo',
  },
});