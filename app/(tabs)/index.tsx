import { Image, StyleSheet, TouchableOpacity, Modal, Dimensions, useWindowDimensions, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { BarChart } from "react-native-gifted-charts";
import { useFonts } from 'expo-font';
import { useState, useCallback, useMemo } from 'react';

interface MealItemProps {
  title: string;
  carbo: string;
  fats: string;
  sugar: string;
  time: string;
}

interface ChartDataPoint {
  value: number;
  label: string;
  frontColor: string;
  topLabelComponent?: () => JSX.Element;
}

interface NutrientData {
  [key: string]: ChartDataPoint[];
}

interface PeriodData {
  [key: string]: NutrientData;
}

interface TooltipContent {
  value: number;
  label: string;
}

interface TooltipPosition {
  x: number;
  y: number;
}

interface NutrientColors {
  [key: string]: string;
}

export default function HomeScreen() {
  const { width: screenWidth } = useWindowDimensions();

  const containerPadding = 20;
  const chartWidth = screenWidth - (containerPadding * 2) - 32;
  const chartHeight = chartWidth * 0.7;
  const barWidth = chartWidth * 0.07;
  const spacing = chartWidth * 0.05;

  const [fontsLoaded] = useFonts({
    'Archivo': require('@/assets/fonts/Archivo-Regular.ttf'),
    'Archivo-Medium': require('@/assets/fonts/Archivo-Medium.ttf'),
    'Archivo-Bold': require('@/assets/fonts/Archivo-Bold.ttf'),
  });

  const [selectedPeriod, setSelectedPeriod] = useState<string>('Weekly');
  const [selectedNutrient, setSelectedNutrient] = useState<string>('Carbo');
  const [showPeriodModal, setShowPeriodModal] = useState<boolean>(false);
  const [showNutrientModal, setShowNutrientModal] = useState<boolean>(false);
  const periods: string[] = ['Weekly', 'Daily', 'Monthly'];
  const nutrients: string[] = ['Carbo', 'Fat', 'Sugar'];

  // Chart interaction state
  const [tooltipVisible, setTooltipVisible] = useState<boolean>(false);
  const [tooltipContent, setTooltipContent] = useState<TooltipContent>({ value: 0, label: '' });
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>({ x: 0, y: 0 });
  const [selectedBarIndex, setSelectedBarIndex] = useState<number | null>(null);

  const chartData: PeriodData = {
    Daily: {
      Carbo: [
        { value: 30, label: '6am', frontColor: '#6366F1' },
        { value: 45, label: '12pm', frontColor: '#6366F1' },
        { value: 35, label: '9pm', frontColor: '#6366F1' }
      ],
      Fat: [
        { value: 12, label: '6am', frontColor: '#F59E0B' },
        { value: 15, label: '3pm', frontColor: '#F59E0B' },
        { value: 13, label: '6pm', frontColor: '#F59E0B' },
      ],
      Sugar: [
        { value: 10, label: '6am', frontColor: '#EF4444' },
        { value: 15, label: '12pm', frontColor: '#EF4444' },
        { value: 12, label: '3pm', frontColor: '#EF4444' },
        { value: 8, label: '9pm', frontColor: '#EF4444' }
      ]
    },
    Weekly: {
      Carbo: [
        { value: 105, label: 'Mon', frontColor: '#6366F1' },
        { value: 95, label: 'Tue', frontColor: '#6366F1' },
        { value: 110, label: 'Wed', frontColor: '#6366F1' },
        { value: 100, label: 'Thu', frontColor: '#6366F1' },
        { value: 90, label: 'Fri', frontColor: '#6366F1' },
        { value: 85, label: 'Sat', frontColor: '#6366F1' },
        { value: 115, label: 'Sun', frontColor: '#6366F1' }
      ],
      Fat: [
        { value: 35, label: 'Mon', frontColor: '#F59E0B' },
        { value: 40, label: 'Tue', frontColor: '#F59E0B' },
        { value: 38, label: 'Wed', frontColor: '#F59E0B' },
        { value: 42, label: 'Thu', frontColor: '#F59E0B' },
        { value: 36, label: 'Fri', frontColor: '#F59E0B' },
        { value: 34, label: 'Sat', frontColor: '#F59E0B' },
        { value: 39, label: 'Sun', frontColor: '#F59E0B' }
      ],
      Sugar: [
        { value: 42, label: 'Mon', frontColor: '#EF4444' },
        { value: 38, label: 'Tue', frontColor: '#EF4444' },
        { value: 45, label: 'Wed', frontColor: '#EF4444' },
        { value: 40, label: 'Thu', frontColor: '#EF4444' },
        { value: 36, label: 'Fri', frontColor: '#EF4444' },
        { value: 43, label: 'Sat', frontColor: '#EF4444' },
        { value: 41, label: 'Sun', frontColor: '#EF4444' }
      ]
    },
    Monthly: {
      Carbo: [
        { value: 420, label: 'W1', frontColor: '#6366F1' },
        { value: 395, label: 'W2', frontColor: '#6366F1' },
        { value: 405, label: 'W3', frontColor: '#6366F1' },
        { value: 380, label: 'W4', frontColor: '#6366F1' }
      ],
      Fat: [
        { value: 160, label: 'W1', frontColor: '#F59E0B' },
        { value: 155, label: 'W2', frontColor: '#F59E0B' },
        { value: 165, label: 'W3', frontColor: '#F59E0B' },
        { value: 150, label: 'W4', frontColor: '#F59E0B' }
      ],
      Sugar: [
        { value: 165, label: 'W1', frontColor: '#EF4444' },
        { value: 158, label: 'W2', frontColor: '#EF4444' },
        { value: 162, label: 'W3', frontColor: '#EF4444' },
        { value: 155, label: 'W4', frontColor: '#EF4444' }
      ]
    }
  };

  const nutrientColors: NutrientColors = {
    Carbo: '#6366F1',
    Fat: '#F59E0B',
    Sugar: '#EF4444'
  };

  // Calculate the maximum value dynamically for better scaling
  const getChartMaxValue = useMemo(() => {
    const currentData = chartData[selectedPeriod]?.[selectedNutrient] || [];
    const maxDataValue = Math.max(...currentData.map(item => item.value));
    
    // Add 20% padding to the max value for better visualization
    const paddedMax = maxDataValue * 1.2;
    
    // Round to a nice number
    const magnitude = Math.pow(10, Math.floor(Math.log10(paddedMax)));
    return Math.ceil(paddedMax / magnitude) * magnitude;
  }, [selectedPeriod, selectedNutrient]);

  // Calculate number of sections based on max value
  const getNoOfSections = useMemo(() => {
    const maxValue = getChartMaxValue;
    if (maxValue <= 100) return 5;
    if (maxValue <= 500) return 10;
    return Math.min(20, Math.ceil(maxValue / 100));
  }, [getChartMaxValue]);

  const handleBarPress = useCallback((item: ChartDataPoint, index: number) => {
    setSelectedBarIndex(index);
    setTooltipContent({
      value: item.value,
      label: item.label
    });
    setTooltipVisible(true);

    const barPosition = (barWidth + spacing) * index;
    const scaleFactor = chartHeight / getChartMaxValue;
    
    setTooltipPosition({
      x: barPosition + (barWidth / 2),
      y: chartHeight - (item.value * scaleFactor)
    });

    const currentData = chartData[selectedPeriod]?.[selectedNutrient] || [];
    const updatedData = currentData.map((dataPoint, i) => ({
      ...dataPoint,
      frontColor: i === index ? nutrientColors[selectedNutrient] : dataPoint.frontColor,
      opacity: i === index ? 1 : 0.8
    }));

  }, [barWidth, spacing, chartHeight, selectedPeriod, nutrientColors, selectedNutrient, getChartMaxValue]);

  const renderTooltip = useCallback(() => {
    if (!tooltipVisible) return null;

    return (
      <View style={{
        position: 'absolute',
        left: tooltipPosition.x - 40,
        top: tooltipPosition.y - 45,
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 8,
        borderRadius: 6,
        width: 80,
      }}>
        <Text style={{ color: 'white', textAlign: 'center', fontSize: 12 }}>
          {tooltipContent.value}g
        </Text>
      </View>
    );
  }, [tooltipVisible, tooltipPosition, tooltipContent]);

  // Enhanced Y-axis label formatter
  const formatYAxisLabel = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
    return value.toString();
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: 'transparent', dark: 'transparent' }}>
      {/* Profile Section */}
      <ThemedView style={styles.profileContainer}>
        <ThemedView style={styles.leftContent}>
          <Image 
            source={require('@/assets/images/home/jessy.jpeg')}
            style={styles.avatar}
          />
          <ThemedView style={styles.textContainer}>
            <ThemedText style={styles.greeting}>Hi, Jessy!</ThemedText>
            <ThemedText style={styles.subtitle}>Be healthy, always.</ThemedText>
          </ThemedView>
        </ThemedView>
        
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={20} color="#666" />
        </TouchableOpacity>
      </ThemedView>

      {/* Health Summary Section */}
      <ThemedView style={styles.healthSummaryContainer}>
        <ThemedView style={styles.healthSummaryContent}>
          <Ionicons name="cafe-outline" size={24} color="#666" />
          <ThemedView style={styles.healthTextContainer}>
            <ThemedText style={styles.healthTitle}>Your Health Overview Summary</ThemedText>
            <ThemedText style={styles.healthSubtitle}>Daily Carbo Limit: <ThemedText style={styles.healthValue}>130 gram</ThemedText></ThemedText>
            <ThemedText style={styles.healthSubtitle}>Daily Fat Limit: <ThemedText style={styles.healthValue}>45 gram</ThemedText></ThemedText>
            <ThemedText style={styles.healthSubtitle}>Daily Sugar Limit: <ThemedText style={styles.healthValue}>45 gram</ThemedText></ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      {/* Chart Section */}
      <ThemedView style={styles.weeklyConsumptionContainer}>
        <ThemedView style={styles.consumptionHeader}>
          <ThemedView style={styles.consumptionLeft}>
            <Ionicons name="fast-food-outline" size={24} color="black" />
            <ThemedText style={styles.consumptionTitle}>Meal Tracker</ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.dropdownsContainer}>
            <TouchableOpacity 
              style={styles.dropdownButton}
              onPress={() => setShowNutrientModal(true)}>
              <ThemedText style={styles.dropdownText}>{selectedNutrient}</ThemedText>
              <Ionicons name="chevron-down" size={14} color="black" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.dropdownButton}
              onPress={() => setShowPeriodModal(true)}>
              <ThemedText style={styles.dropdownText}>{selectedPeriod}</ThemedText>
              <Ionicons name="chevron-down" size={14} color="black" />
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.chartContainer}>
        <BarChart
          data={chartData[selectedPeriod]?.[selectedNutrient] || chartData.Weekly.Carbo}
          width={chartWidth}
          height={chartHeight}
          barWidth={barWidth}
          spacing={spacing}
          barBorderRadius={20}
          frontColor={nutrientColors[selectedNutrient]}
          maxValue={getChartMaxValue}
          noOfSections={getNoOfSections}
          onPress={handleBarPress}
          renderTooltip={renderTooltip}
          disableScroll
          yAxisThickness={0}
          xAxisThickness={1}
          xAxisColor={'#EEE'}
          dashWidth={0}
          yAxisTextStyle={{ color: '#666' }}
          xAxisLabelTextStyle={{ color: '#666', textAlign: 'center' }}
          hideRules
          backgroundColor={'white'}
          activeOpacity={0.8}
          yAxisLabelPrefix=""
          yAxisLabelSuffix=""
          formatYLabel={(label) => {
            const value = Number(label);
            if (value >= 1000) {
              return `${(value / 1000).toFixed(1)}k`;
            }
            return label;
          }}
          isAnimated={true}
        />

          <ThemedView style={styles.chartStats}>
            <ThemedView style={styles.statItem}>
              <ThemedText style={styles.statLabel}>Average</ThemedText>
              <ThemedText style={[styles.statValue, { color: nutrientColors[selectedNutrient] }]}>
                {Math.round((chartData[selectedPeriod]?.[selectedNutrient]?.reduce((acc: number, curr: ChartDataPoint) => acc + curr.value, 0) ?? 0) / 
                  (chartData[selectedPeriod]?.[selectedNutrient]?.length || 1)
                )}g
              </ThemedText>
            </ThemedView>
            
            <ThemedView style={styles.statItem}>
              <ThemedText style={styles.statLabel}>Highest</ThemedText>
              <ThemedText style={[styles.statValue, { color: nutrientColors[selectedNutrient] }]}>
                {Math.max(...(chartData[selectedPeriod]?.[selectedNutrient]?.map((item: ChartDataPoint) => item.value) ?? [0]))}g
              </ThemedText>
            </ThemedView>
            
            <ThemedView style={styles.statItem}>
              <ThemedText style={styles.statLabel}>Lowest</ThemedText>
              <ThemedText style={[styles.statValue, { color: nutrientColors[selectedNutrient] }]}>
                {Math.min(...(chartData[selectedPeriod]?.[selectedNutrient]?.map((item: ChartDataPoint) => item.value) ?? [0]))}g
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      {/* Period Selection Modal */}
      <Modal
        visible={showPeriodModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPeriodModal(false)}>
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowPeriodModal(false)}>
          <ThemedView style={styles.modalContent}>
            {periods.map((period: string) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.modalItem,
                  selectedPeriod === period && styles.selectedModalItem
                ]}
                onPress={() => {
                  setSelectedPeriod(period);
                  setShowPeriodModal(false);
                  setTooltipVisible(false);
                }}>
                <ThemedText 
                  style={[
                    styles.modalItemText,
                    selectedPeriod === period && styles.selectedModalItemText
                  ]}>
                  {period}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ThemedView>
        </TouchableOpacity>
      </Modal>

      {/* Nutrient Selection Modal */}
      <Modal
        visible={showNutrientModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowNutrientModal(false)}>
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowNutrientModal(false)}>
          <ThemedView style={styles.modalContent}>
            {nutrients.map((nutrient: string) => (
              <TouchableOpacity
                key={nutrient}
                style={[
                  styles.modalItem,
                  selectedNutrient === nutrient && styles.selectedModalItem
                ]}
                onPress={() => {
                  setSelectedNutrient(nutrient);
                  setShowNutrientModal(false);
                  setTooltipVisible(false);
                }}>
                <ThemedText 
                  style={[
                    styles.modalItemText,
                    selectedNutrient === nutrient && styles.selectedModalItemText
                  ]}>
                  {nutrient}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ThemedView>
        </TouchableOpacity>
      </Modal>

      {/* Summary Section */}
      <ThemedView style={styles.summaryContainer}>
        <ThemedView style={styles.summaryBox}>
          <ThemedText style={styles.summaryTitle}>Carbo</ThemedText>
          <ThemedView style={styles.summaryValueContainer}>
            <ThemedText style={styles.summaryValue}>775</ThemedText>
            <ThemedText style={styles.summaryUnit}>g</ThemedText>
          </ThemedView>
        </ThemedView>
        
        <ThemedView style={styles.summaryBox}>
          <ThemedText style={styles.summaryTitle}>Fat</ThemedText>
          <ThemedView style={styles.summaryValueContainer}>
            <ThemedText style={styles.summaryValue}>264</ThemedText>
            <ThemedText style={styles.summaryUnit}>g</ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.summaryBox}>
          <ThemedText style={styles.summaryTitle}>Sugar</ThemedText>
          <ThemedView style={styles.summaryValueContainer}>
            <ThemedText style={styles.summaryValue}>285</ThemedText>
            <ThemedText style={styles.summaryUnit}>g</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      {/* AI Recommendation */}
      <ThemedText style={styles.healthSummary}>
        AI Recommendation: Your {selectedNutrient.toLowerCase()} intake is {
          selectedPeriod === 'Daily' ? 'well-distributed throughout the day' :
          selectedPeriod === 'Weekly' ? 'consistent across the week' : 'stable across the month'
        }. Consider having a small protein-rich snack between meals to help maintain steady blood sugar levels.
      </ThemedText>
      
      {/* Highlight Section */}
      <ThemedView style={styles.mealsList}>
        <ThemedView style={styles.highlightContainer}>
          <ThemedView style={styles.highlightHeader}>
            <Ionicons name="gift" size={20} color="white" />
            <ThemedText style={styles.highlightTitle}>Highlight of the Day</ThemedText>
          </ThemedView>
          <MealItem
            title="Grilled Chicken with Quinoa"
            carbo="25"
            fats="8"
            sugar="3"
            time="Tue, 18 July • 07.00 am"
          />
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}

// Meal Item Component
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
  // Profile section
  profileContainer: {
    marginTop: -13,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    marginBottom: -10,
    marginHorizontal: -12,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: -15,
    marginRight: 20,
  },
  textContainer: {
    justifyContent: 'center',
  },
  greeting: {
    fontSize: 18,
    fontFamily: 'Archivo-Medium',
    color: '#000',
  },
  subtitle: {
    fontSize: 15,
    fontFamily: 'Archivo',
    color: '#666',
    marginTop: 2,
  },
  notificationButton: {
    padding: 8,
    marginTop: -3,
    marginBottom: 16,
    marginLeft: 147,
  },

  // Health summary section
  healthSummaryContainer: {
    backgroundColor: 'white',
    marginHorizontal: -12,
    marginVertical: 16,
    borderRadius: 16,
    padding: 14,
    borderWidth: 2,
    borderColor: '#F0F0F0',
    marginTop: 2,
    marginBottom: 2,
  },
  healthSummaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  healthTextContainer: {
    flex: 1,
  },
  healthTitle: {
    fontSize: 16,
    fontFamily: 'Archivo-Medium',
    color: '#000',
    marginBottom: 4,
  },
  healthSubtitle: {
    fontSize: 14,
    fontFamily: 'Archivo',
    color: '#666',
  },
  healthValue: {
    fontFamily: 'Archivo-Medium',
    fontSize: 13,
    color: '#000',
  },
  healthSummary: {
    fontSize: 14,
    fontFamily: 'Archivo',
    color: '#666',
    padding: 16,
  },

  // Weekly consumption section
  weeklyConsumptionContainer: {
    padding: 20,
    backgroundColor: 'white',
    marginTop: 0,
    borderRadius: 24,
    marginHorizontal: -12,
    borderWidth: 2,
    borderColor: '#F0F0F0',
  },
  chartContainer: {
    alignItems: 'center',
    fontFamily: 'Archivo',
    marginTop: 16,
    marginRight: 10,
    marginLeft: -20,
    position: 'relative',
  },
  consumptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginLeft: 0,
  },
  consumptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  consumptionTitle: {
    fontSize: 16,
    fontFamily: 'Archivo-Medium',
  },
  dropdownsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  dropdownText: {
    fontFamily: 'Archivo',
    fontSize: 13,
    color: '#000',
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 8,
    width: '80%',
    maxWidth: 300,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    borderRadius: 8,
  },
  selectedModalItem: {
    backgroundColor: '#F3F4F6',
  },
  modalItemText: {
    fontFamily: 'Archivo',
    fontSize: 16,
    color: '#000',
  },
  selectedModalItemText: {
    color: '#6366F1',
    fontFamily: 'Archivo-Bold',
  },

  // Chart statistics
  chartStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    color: '#000',
    fontSize: 15,
    padding: 16,
    fontFamily: 'Archivo-Bold',
  },
  statValue: {
    fontSize: 16,
    fontFamily: 'Archivo-Medium',
  },

  // Summary section
  summaryContainer: {
    marginHorizontal: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 20,
    gap: 11,
    width: '100%',
  },
  summaryBox: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 16,
    borderWidth: 2,
    borderColor: '#F0F0F0',
  },
  summaryTitle: {
    fontSize: 14,
    fontFamily: 'Archivo-Medium',
    color: '#000',
    marginBottom: 12,
    textAlign: 'center',
  },
  summaryValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 5,
    justifyContent: 'center',
  },
  summaryValue: {
    fontSize: 24,
    fontFamily: 'Archivo-Bold',
    color: '#000',
  },
  summaryUnit: {
    fontSize: 12,
    fontFamily: 'Archivo',
    color: '#666',
  },

  // Meals list section
  mealsList: {
    padding: 16,
    gap: 16,
    marginHorizontal: -16,
  },
  highlightContainer: {
    marginTop: -15,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'white',
    marginHorizontal: -12,
    borderWidth: 2,
    borderColor: '#F0F0F0',
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

  // Meal item styles
  mealItem: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 0,
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