import { Image, StyleSheet, TouchableOpacity, Modal, Dimensions, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { BarChart } from "react-native-gifted-charts";
import { useFonts } from 'expo-font';
import { useState } from 'react';

export default function HomeScreen() {
  const { width: screenWidth } = useWindowDimensions();

  const containerPadding = 20;
  const chartWidth = screenWidth - (containerPadding * 2) - 32; // 32 is total horizontal margin
  const chartHeight = chartWidth * 0.7;
  const barWidth = chartWidth * 0.07;
  const spacing = chartWidth * 0.05;

  const [fontsLoaded] = useFonts({
    'Archivo': require('@/assets/fonts/Archivo-Regular.ttf'),
    'Archivo-Medium': require('@/assets/fonts/Archivo-Medium.ttf'),
    'Archivo-Bold': require('@/assets/fonts/Archivo-Bold.ttf'),
  });

  const [selectedPeriod, setSelectedPeriod] = useState('Weekly');
  const [showPeriodModal, setShowPeriodModal] = useState(false);
  const periods = ['Weekly', 'Daily', 'Monthly'];

  if (!fontsLoaded) {
    return null;
  }
  
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}>

      {/* profile section */}
      <ThemedView style={styles.profileContainer}>
        <ThemedView style={styles.leftContent}>
          <Image 
            source={require('@/assets/images/jessy.jpeg')}
            style={styles.avatar}
          />
          <ThemedView style={styles.textContainer}>
            <ThemedText style={styles.greeting}>Hi, Jessy!</ThemedText>
            <ThemedText style={styles.subtitle}>Be healthy, always.</ThemedText>
          </ThemedView>
        </ThemedView>
        
        <TouchableOpacity style={styles.bellContainer}>
          <Ionicons name="notifications-outline" size={24} color="black" />
        </TouchableOpacity>
      </ThemedView>

      {/* profile health summary section */}

      {/* weekly consumption section */}
      <ThemedView style={styles.weeklyConsumptionContainer}>
        <ThemedView style={styles.consumptionHeader}>
          <ThemedView style={styles.consumptionLeft}>
            <Ionicons name="fast-food-outline" size={24} color="black" />
            <ThemedText style={styles.consumptionTitle}>Your Weekly Consumption</ThemedText>
          </ThemedView>
          <TouchableOpacity 
            style={styles.dropdownButton}
            onPress={() => setShowPeriodModal(true)}>
            <ThemedText style={styles.dropdownText}>{selectedPeriod}</ThemedText>
            <Ionicons name="chevron-down" size={16} color="black" />
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.chartContainer}>
          <BarChart
            data={[
              { value: 70, label: 'Mon' },
              { value: 30, label: 'Tue' },
              { value: 50, label: 'Wed' },
              { value: 80, label: 'Thu' },
              { value: 40, label: 'Fri' },
              { value: 45, label: 'Sat' },
              { value: 60, label: 'Sun' }
            ]}
            width={chartWidth}
            height={chartHeight}
            barWidth={barWidth}
            spacing={spacing}
            barBorderRadius={20}
            frontColor="#6366F1"
            maxValue={90}
            noOfSections={5}
            renderTooltip={() => null}
            disableScroll
            yAxisThickness={0}
            xAxisThickness={1}
            xAxisColor={'#EEE'}
            dashWidth={0}
            yAxisTextStyle={{ color: '#666' }}
            xAxisLabelTextStyle={{ color: '#666', textAlign: 'center' }}
            hideRules
            backgroundColor={'white'}
          />
        </ThemedView>
      </ThemedView>

      {/* period selection modal for dropdown */}
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
            {periods.map((period) => (
              <TouchableOpacity
                key={period}
                style={styles.modalItem}
                onPress={() => {
                  setSelectedPeriod(period);
                  setShowPeriodModal(false);
                }}>
                <ThemedText style={styles.modalItemText}>{period}</ThemedText>
              </TouchableOpacity>
            ))}
          </ThemedView>
        </TouchableOpacity>
      </Modal>

      {/* weekly nutritional summary section */}
      <ThemedView style={styles.summaryContainer}>
        <ThemedView style={styles.summaryBox}>
          <ThemedText style={styles.summaryTitle}>Carbo</ThemedText>
          <ThemedView style={styles.summaryValueContainer}>
            <ThemedText style={styles.summaryValue}>775</ThemedText>
            <ThemedText style={styles.summaryUnit}>Carb</ThemedText>
          </ThemedView>
        </ThemedView>
        
        <ThemedView style={styles.summaryBox}>
          <ThemedText style={styles.summaryTitle}>Fat</ThemedText>
          <ThemedView style={styles.summaryValueContainer}>
            <ThemedText style={styles.summaryValue}>775</ThemedText>
            <ThemedText style={styles.summaryUnit}>Ckal</ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.summaryBox}>
          <ThemedText style={styles.summaryTitle}>Sugar</ThemedText>
          <ThemedView style={styles.summaryValueContainer}>
            <ThemedText style={styles.summaryValue}>775</ThemedText>
            <ThemedText style={styles.summaryUnit}>Ckal</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      {/* consumption history section */}
      <ThemedView style={styles.sectionTitleContainer}>
        <ThemedView style={styles.sectionTitleContent}>
          <Ionicons name="fast-food-outline" size={24} color="black" />
          <ThemedText style={styles.sectionTitle}>Consumption History</ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.highlightCard}>
        <ThemedView style={styles.highlightHeader}>
          <Ionicons name="gift" size={20} color="#fff" />
          <ThemedText style={styles.highlightTitle}>Highlight of the Day</ThemedText>
        </ThemedView>

        <ThemedView style={styles.highlightContent}>
          <ThemedText style={styles.foodTitle}>Chicken Crispy Mrs Elly</ThemedText>
          <ThemedView style={styles.nutritionContainer}>
            <ThemedView style={styles.nutritionItem}>
              <Ionicons name="archive-sharp" size={20} color="#666" />
              <ThemedText style={styles.nutritionValue}>150</ThemedText>
              <ThemedText style={styles.nutritionUnit}>Ckal</ThemedText>
            </ThemedView>

            <ThemedView style={styles.nutritionItem}>
              <Ionicons name="archive-sharp" size={20} color="#666" />
              <ThemedText style={styles.nutritionValue}>150</ThemedText>
              <ThemedText style={styles.nutritionUnit}>Ckal</ThemedText>
            </ThemedView>

            <ThemedView style={styles.nutritionItem}>
              <Ionicons name="archive-sharp" size={20} color="#666" />
              <ThemedText style={styles.nutritionValue}>150</ThemedText>
              <ThemedText style={styles.nutritionUnit}>Ckal</ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.footerContainer}>
          <ThemedText style={styles.dateText}>Tue, 18 July • 07:00 am</ThemedText>
          <TouchableOpacity style={styles.seeMoreButton}>
            <ThemedText style={styles.seeMoreText}>See More</ThemedText>
            <Ionicons name="chevron-forward" size={16} color="#666" />
          </TouchableOpacity>
        </ThemedView>
        </ThemedView>
      </ThemedView>

      
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  // profile section
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    marginBottom: -10,
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
    fontFamily: 'Archivo-Bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Archivo',
    color: '#666',
    marginTop: 2,
  },
  bellContainer: {
    padding: 8,
  },

  // weekly consumption section
  weeklyConsumptionContainer: {
    padding: 20,
    backgroundColor: 'white',
    marginTop: 0,
    borderRadius: 24,
    marginHorizontal: 0,
    borderWidth: 2,
    borderColor: '#F0F0F0',
  },
  chartContainer: {
    alignItems: 'center',
    fontFamily: 'Archivo',
    marginTop: 16,
    marginRight: 10,
    marginLeft: -20,
  },
  consumptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
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
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  dropdownText: {
    fontFamily: 'Archivo',
    color: '#000',
  },

  // modal styles
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
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalItemText: {
    fontFamily: 'Archivo',
    fontSize: 16,
    color: '#000',
  },

// weekly nutritional summary section
sectionTitleContainer: {
  marginHorizontal: 20,
  marginTop: 0,
  marginBottom: 0,
  width: '100%',
},
sectionTitleContent: {
  flexDirection: 'row',     
  alignItems: 'center',     
  gap: 8,                   
},
sectionTitle: {
  fontSize: 16,
  fontFamily: 'Archivo',
  color: '#000',
},
summaryContainer: {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 0,
  paddingHorizontal: 20,
  width: '100%',
},
summaryBox: {
  width: '35%',
  backgroundColor: 'white',
  borderRadius: 24,
  padding: 16,
  marginRight: 6,
  marginLeft: 6,
  borderWidth: 2,
  borderColor: '#F0F0F0',
  marginHorizontal: 8, 
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

// consumption history section
historyContainer: {
  marginTop: 24,
  marginHorizontal: 20,
},
historyTitleContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
  marginBottom: 16,
},
historyTitle: {
  fontSize: 18,
  fontFamily: 'Archivo-Bold',
  color: '#000',
},
highlightCard: {
  borderRadius: 24,
  overflow: 'hidden',
  borderWidth: 2,
  borderColor: '#F0F0F0',
},
highlightHeader: {
  backgroundColor: '#6366F1',
  padding: 16,
  flexDirection: 'row',    
  alignItems: 'center',    
  gap: 8,                  
},
highlightTitle: {
  fontSize: 16,
  fontFamily: 'Archivo-Bold',
  color: 'white',
},
highlightContent: {
  padding: 16,
},
foodTitle: {
  fontSize: 18,
  fontFamily: 'Archivo-Bold',
  color: '#000',
  marginBottom: 10,
},
nutritionContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 8,
},
nutritionItem: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 4,
},
nutritionValue: {
  fontSize: 16,
  fontFamily: 'Archivo-Bold',
  color: '#000',
},
nutritionUnit: {
  fontSize: 12,
  fontFamily: 'Archivo',
  color: '#666',
},
footerContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#F3F4F6',
  padding: 12,
  borderRadius: 20,
  marginTop: 16,
},
dateText: {
  fontSize: 14,
  fontFamily: 'Archivo',
  color: '#666',
},
seeMoreButton: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 4,
},
seeMoreText: {
  fontSize: 14,
  fontFamily: 'Archivo',
  color: '#666',
},
});