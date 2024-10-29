import { StyleSheet, ScrollView, Image, Pressable, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useFonts } from 'expo-font';

interface SettingItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress: () => void;
}

const SettingItem: React.FC<SettingItemProps> = ({ icon, title, onPress }) => (
  <Pressable 
    onPress={onPress}
    style={styles.settingItem}
  >
    <ThemedView style={styles.settingContent}>
      <Ionicons name={icon} size={24} color="#666" style={styles.settingIcon} />
      <ThemedText style={styles.settingText}>{title}</ThemedText>
    </ThemedView>
    <Ionicons name="chevron-forward" size={24} color="#666" />
  </Pressable>
);

interface SectionTitleProps {
  title: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title }) => (
  <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
);

export default function ProfileScreen() {
  const handleSettingPress = (setting: string) => {
    console.log(`Navigating to ${setting}`);
    // navigation logic
  };

  const [fontsLoaded] = useFonts({
    'Archivo': require('@/assets/fonts/Archivo-Regular.ttf'),
    'Archivo-Medium': require('@/assets/fonts/Archivo-Medium.ttf'),
    'Archivo-Bold': require('@/assets/fonts/Archivo-Bold.ttf'),
  });

  return (
    <ThemedView style={styles.container}>
    {/* profile settings header section */}
      <ThemedView style={styles.titleContainer}>
        <ThemedView>
          <ThemedText style={styles.headerTitle}>Profile Settings</ThemedText>
          <ThemedText style={styles.headerSubtitle}>Manage your profile and settings.</ThemedText>
        </ThemedView>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={20} color="#666" />
        </TouchableOpacity>
      </ThemedView>
        

        <ThemedView style={styles.profileCard}>
          <Image
            source={{ uri: 'https://via.placeholder.com/60' }}
            style={styles.profileImage}
          />
          <ThemedView style={styles.profileInfo}>
            <ThemedText style={styles.profileName}>Jessy Raharjo Poetri</ThemedText>
            <ThemedText style={styles.profileEmail}>jessyrp@gmail.com</ThemedText>
          </ThemedView>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </ThemedView>

        <SectionTitle title="Pengaturan Umum" />
        <ThemedView style={styles.section}>
          <SettingItem 
            icon="person-outline" 
            title="Account Settings" 
            onPress={() => handleSettingPress('account')}
          />
          <SettingItem 
            icon="lock-closed-outline" 
            title="Privacy & Security" 
            onPress={() => handleSettingPress('privacy')}
          />
          <SettingItem 
            icon="notifications-outline" 
            title="Consumption Reminders" 
            onPress={() => handleSettingPress('reminders')}
          />
          <SettingItem 
            icon="nutrition-outline" 
            title="Diet & Allergy Preferences" 
            onPress={() => handleSettingPress('diet')}
          />
        </ThemedView>

        <SectionTitle title="Bantuan dan Pengaturan" />
        <ThemedView style={styles.section}>
          <SettingItem 
            icon="help-circle-outline" 
            title="Help Center" 
            onPress={() => handleSettingPress('help')}
          />
          <SettingItem 
            icon="document-text-outline" 
            title="Terms & Conditions" 
            onPress={() => handleSettingPress('terms')}
          />
          <SettingItem 
            icon="time-outline" 
            title="Consumption History" 
            onPress={() => handleSettingPress('history')}
          />
          <SettingItem 
            icon="sync-outline" 
            title="Synchronization Settings" 
            onPress={() => handleSettingPress('sync')}
          />
        </ThemedView>
      {/* </ScrollView> */}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    backgroundColor: 'white',
    marginHorizontal: 0,
    marginTop: 62,
    },
    container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 1,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 12,
  },
  profileName: {
    fontFamily: 'Archivo-Medium',
    fontSize: 18,
  },
  profileEmail: {
    fontFamily: 'Archivo',
    color: '#666',
  },
  sectionTitle: {
    fontFamily: 'Archivo-Medium',
    fontSize: 16,
    padding: 16,
    paddingBottom: 8,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingText: {
    fontFamily: 'Archivo',
    fontSize: 16,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  navItemActive: {
    backgroundColor: '#6366F1',
    borderRadius: 50,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontFamily: 'Archivo',
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  navTextActive: {
    color: '#6366F1',
  },
});