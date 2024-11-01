import { StyleSheet, View, ScrollView } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import Ionicons from '@expo/vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  history: undefined;
  nutritionDetail: {
    title: string;
    carbo: string;
    fats: string;
    sugar: string;
    time: string;
  };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'nutritionDetail'>;

export default function NutritionDetail() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { title, carbo, fats, sugar, time } = route.params;

  // Rest of your component stays exactly the same
  const nutritionData = {
    calories: '150 kcal',
    carbohydrates: `${carbo} gram`,
    sugar: `${sugar} gram`,
    fats: `${fats} gram`,
    protein: '2 gram',
    score: 7
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Nutrition Detail</ThemedText>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Food Title Section */}
        <ThemedView style={styles.foodTitleContainer}>
          <ThemedText style={styles.foodTitle}>{title}</ThemedText>
          <ThemedText style={styles.foodCategory}>Fast-Food</ThemedText>
        </ThemedView>

        {/* Health Overview Section */}
        <ThemedView style={styles.overviewContainer}>
          <View style={styles.overviewHeader}>
            <Ionicons name="cafe-outline" size={24} color="#666" />
            <View>
              <ThemedText style={styles.overviewTitle}>Your Health Overview Summary</ThemedText>
              <ThemedText style={styles.overviewSubtitle}>Daily Sugar Limit: 25 gram</ThemedText>
            </View>
          </View>
        </ThemedView>

        {/* Score Section */}
        <ThemedView style={styles.scoreContainer}>
          <ThemedText style={styles.scoreTitle}>Your Food's Score</ThemedText>
          <View style={styles.scoreTimeContainer}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <ThemedText style={styles.timeText}>{time}</ThemedText>
          </View>
          <View style={styles.scoreCircle}>
            <ThemedText style={styles.scoreNumber}>{nutritionData.score}</ThemedText>
            <ThemedText style={styles.scoreLabel}>Out of 10</ThemedText>
          </View>
        </ThemedView>

        {/* Nutrition Details */}
        <ThemedView style={styles.nutritionContainer}>
          {[
            { label: 'Calories', value: nutritionData.calories },
            { label: 'Carbohydrates', value: nutritionData.carbohydrates },
            { label: 'Sugar', value: nutritionData.sugar },
            { label: 'Fats', value: nutritionData.fats },
            { label: 'Protein', value: nutritionData.protein },
          ].map((item, index) => (
            <View key={index} style={styles.nutritionRow}>
              <ThemedText style={styles.nutritionLabel}>{item.label}</ThemedText>
              <ThemedText style={styles.nutritionValue}>{item.value}</ThemedText>
            </View>
          ))}
        </ThemedView>

        {/* Meal Tracker Section */}
        <ThemedView style={styles.trackerContainer}>
          <View style={styles.trackerHeader}>
            <View style={styles.trackerTitleContainer}>
              <Ionicons name="fast-food-outline" size={20} color="#000" />
              <ThemedText style={styles.trackerTitle}>Meal Tracker</ThemedText>
            </View>
            <TouchableOpacity style={styles.nutrientButton}>
              <ThemedText style={styles.nutrientButtonText}>Nutrient</ThemedText>
              <Ionicons name="chevron-down" size={16} color="#000" />
            </TouchableOpacity>
          </View>
        </ThemedView>

        {/* Recommendations Section */}
        <ThemedView style={styles.recommendationsContainer}>
          <ThemedText style={styles.recommendationsTitle}>Recommendations</ThemedText>
          <View style={styles.recommendationCard}>
            <View style={styles.recommendationIcon}>
              <Ionicons name="shield-checkmark" size={24} color="#fff" />
            </View>
            <View style={styles.recommendationContent}>
              <ThemedText style={styles.recommendationHeader}>FoodGuard AI</ThemedText>
              <ThemedText style={styles.recommendationText}>
                Based on your food intake, we suggest switching to lower sugar options to stay within your daily limit. For a healthier alternative, try a grilled vegetable wrap or a chicken salad. Keep monitoring your carbohydrate and fat intake to maintain a balanced diet and optimize energy levels throughout the day. Stay hydrated and make sure to include fiber-rich foods to aid digestion.
              </ThemedText>
            </View>
          </View>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 30,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Archivo-Medium',
  },
  foodTitleContainer: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  foodTitle: {
    fontSize: 18,
    fontFamily: 'Archivo-Medium',
    marginBottom: 4,
  },
  foodCategory: {
    color: '#666',
    fontFamily: 'Archivo',
  },
  overviewContainer: {
    marginBottom: 16,
  },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  overviewTitle: {
    fontSize: 16,
    fontFamily: 'Archivo-Medium',
  },
  overviewSubtitle: {
    color: '#666',
    fontFamily: 'Archivo',
  },
  scoreContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#F0F0F0',
  },
  scoreTitle: {
    fontSize: 16,
    fontFamily: 'Archivo-Medium',
    marginBottom: 4,
  },
  scoreTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 16,
  },
  timeText: {
    color: '#666',
    fontFamily: 'Archivo',
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  scoreNumber: {
    fontSize: 32,
    color: 'white',
    fontFamily: 'Archivo-Bold',
  },
  scoreLabel: {
    color: 'white',
    fontFamily: 'Archivo',
  },
  nutritionContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#F0F0F0',
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  nutritionLabel: {
    fontFamily: 'Archivo',
  },
  nutritionValue: {
    fontFamily: 'Archivo-Medium',
  },
  trackerContainer: {
    marginBottom: 16,
  },
  trackerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  trackerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trackerTitle: {
    fontSize: 16,
    fontFamily: 'Archivo-Medium',
  },
  nutrientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  nutrientButtonText: {
    fontFamily: 'Archivo',
  },
  recommendationsContainer: {
    marginBottom: 16,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontFamily: 'Archivo-Medium',
    marginBottom: 12,
  },
  recommendationCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    borderWidth: 2,
    borderColor: '#F0F0F0',
  },
  recommendationIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationHeader: {
    fontSize: 16,
    fontFamily: 'Archivo-Medium',
    marginBottom: 4,
  },
  recommendationText: {
    color: '#666',
    fontFamily: 'Archivo',
    lineHeight: 20,
  },
});