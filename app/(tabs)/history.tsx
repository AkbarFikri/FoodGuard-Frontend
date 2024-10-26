import { StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { useFonts } from 'expo-font';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';

interface MealItemProps {
  title: string;
  carbo: string;
  fats: string;
  sugar: string;
  time: string;
}

export default function HistoryScreen() {
  const [fontsLoaded] = useFonts({
    'Archivo': require('@/assets/fonts/Archivo-Regular.ttf'),
    'Archivo-Medium': require('@/assets/fonts/Archivo-Medium.ttf'),
    'Archivo-Bold': require('@/assets/fonts/Archivo-Bold.ttf'),
  });

  const [selectedPeriod, setSelectedPeriod] = useState('Weekly');
  
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}>

      {/* consumption history header section */}
      <ThemedView style={styles.titleContainer}>
        <ThemedView>
          <ThemedText style={styles.headerTitle}>Consumption History</ThemedText>
          <ThemedText style={styles.headerSubtitle}>Monitor your meals and nutrients.</ThemedText>
        </ThemedView>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={20} color="black" />
        </TouchableOpacity>
      </ThemedView>

      {/* search section */}
      <ThemedView style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#666" />
        <TextInput 
          placeholder="Search your meals..."
          style={styles.searchInput}
          placeholderTextColor="#666"
        />
      </ThemedView>

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

// meal item component
const MealItem = ({ title, carbo, fats, sugar, time }: MealItemProps) => (
  <ThemedView style={styles.mealItem}>
    <ThemedText style={styles.mealTitle}>{title}</ThemedText>
    <ThemedView style={styles.nutritionInfo}>
      <ThemedText style={styles.nutritionText}>Carbo: {carbo} <ThemedText style={styles.unit}>gram</ThemedText></ThemedText>
      <ThemedText style={styles.nutritionText}>Fats: {fats} <ThemedText style={styles.unit}>gram</ThemedText></ThemedText>
      <ThemedText style={styles.nutritionText}>Sugar: {sugar} <ThemedText style={styles.unit}>gram</ThemedText></ThemedText>
    </ThemedView>
    <ThemedView style={styles.mealFooter}>
      <ThemedText style={styles.timeText}>{time}</ThemedText>
      <TouchableOpacity style={styles.seeMoreButton}>
        <ThemedText style={styles.seeMoreText}>See More</ThemedText>
        <Ionicons name="chevron-forward" size={16} color="#666" />
      </TouchableOpacity>
    </ThemedView>
  </ThemedView>
);

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

  /* -------------------- */
  /* Search Section       */
  /* -------------------- */
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 0,
    backgroundColor: 'white',
    marginHorizontal: 0,
    marginVertical: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Archivo',
    fontSize: 15,
  },

  /* -------------------- */
  /* Period Toggle        */
  /* -------------------- */
  periodToggleContainer: {
    flexDirection: 'row',
    marginTop: 0,
    marginBottom: 0,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 0,
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
    overflow: 'hidden',
    backgroundColor: 'white',
    marginHorizontal: 0,
  },
  highlightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#6366F1',
    padding: 16,
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
    marginHorizontal: 0,
    borderWidth: 2,
    borderColor: '#F0F0F0',
  },
  mealTitle: {
    fontSize: 18,
    fontFamily: 'Archivo-Bold',
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