import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { useFonts } from 'expo-font';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function HistoryScreen() {
  const [fontsLoaded] = useFonts({
    'Archivo': require('@/assets/fonts/Archivo-Regular.ttf'),
    'Archivo-Medium': require('@/assets/fonts/Archivo-Medium.ttf'),
    'Archivo-Bold': require('@/assets/fonts/Archivo-Bold.ttf'),
  });
  
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}>

      {/* title section */}
      <ThemedView style={styles.titleContainer}>
        <ThemedView style={styles.leftContent}>
        <Ionicons name="notifications-outline" size={24} color="black"
        />

        <ThemedText style={styles.textContainer}>
          <ThemedText style={styles.title}>Halo</ThemedText>
          <ThemedText style={styles.subtitle}>Saysa</ThemedText>
        </ThemedText>
      </ThemedView>
      <TouchableOpacity style={styles.bellContainer}>
          <Ionicons name="notifications-outline" size={24} color="black" />
      </TouchableOpacity>
      </ThemedView>

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
titleContainer: {
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
title: {
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
textContainer: {
  justifyContent: 'center',
},
bellContainer: {
  padding: 8,
},
});

