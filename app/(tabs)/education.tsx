import React from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';

interface CourseCardProps {
  image: string;
  category: string;
  title: string;
  duration: string;
  author: string;
  rating: number;
}

const CourseCard: React.FC<CourseCardProps> = ({ image, category, title, duration, author, rating }) => (
    <TouchableOpacity style={styles.card}>
      <Image 
        source={typeof image === 'string' ? { uri: image } : image} 
        style={styles.cardImage} 
      />
      <View style={styles.cardContent}>
        <Text style={styles.category}>{category}</Text>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.metaInfo}>
          <View style={styles.durationContainer}>
            <Ionicons name="time-outline" size={14} color="#666" />
            <Text style={styles.duration}>{duration}</Text>
          </View>
          <View style={styles.authorContainer}>
            <Image 
              source={{ uri: 'https://via.placeholder.com/24' }} 
              style={styles.authorImage} 
            />
            <Text style={styles.authorName}>{author}</Text>
          </View>
        </View>
      </View>
      <View style={styles.rightContent}>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#6366F1" />
          <Text style={styles.rating}>{rating}</Text>
        </View>
        <TouchableOpacity style={styles.bookmarkButton}>
          <Ionicons name="bookmark-outline" size={20} color="#666" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
);

export default function EducationScreen(): React.JSX.Element {
const [fontsLoaded] = useFonts({
    'Archivo': require('@/assets/fonts/Archivo-Regular.ttf'),
    'Archivo-Medium': require('@/assets/fonts/Archivo-Medium.ttf'),
    'Archivo-Bold': require('@/assets/fonts/Archivo-Bold.ttf'),
    });

  const courses: CourseCardProps[] = [
    {
      image: require('@/assets/images/education/posts/food-ingredient-facts.jpg'),
      category: 'Ingredients',
      title: 'Food Ingredient Facts',
      duration: '5 Minutes',
      author: 'Zayn Malique',
      rating: 4.9
    },
    {
      image: require('@/assets/images/education/posts/tips-for-healthy-snacking.jpg'),
      category: 'Snack',
      title: 'Tips for Healthy Snacking',
      duration: '3 Minutes',
      author: 'Roy Ananda Aulia',
      rating: 4.9
    },
    {
      image: require('@/assets/images/education/posts/boost-your-nutrition-knowledge.jpg'),
      category: 'Nutrition',
      title: 'Boost Your Nutrition Knowledge',
      duration: '3 Minutes',
      author: 'Hernandez Putra',
      rating: 4.9
    },
    {
      image: require('@/assets/images/education/posts/healthy-foods.jpg'),
      category: 'Nutrition',
      title: 'Healthy Foods',
      duration: '3 Minutes',
      author: 'Millea Zaneta',
      rating: 4.9
    }
  ];

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Education</Text>
          <Text style={styles.headerSubtitle}>Healthier choices start here.</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={20} color="#666" />
        </TouchableOpacity>
      </View>

        <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
                <Ionicons name="search-outline" size={16} color="#666" style={styles.searchIcon} />
                <TextInput
                style={styles.searchInput}
                placeholder="Explore tips and articles..."
                placeholderTextColor="#666"
                />
            </View>
        </View>

      <ScrollView style={styles.scrollView}>
        {courses.map((course, index) => (
          <CourseCard key={index} {...course} />
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
// Container styles
container: {
    marginHorizontal: 0,
    flex: 1,
    backgroundColor: '#fff',
},

// Header section styles
header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 16,
},
headerTitle: {
    fontFamily: 'Archivo-Medium',
    fontSize: 18,
    color: '#000',
},
headerSubtitle: {
    fontFamily: 'Archivo',
    fontSize: 15,
    color: '#666',
    marginTop: 4,
},
notificationButton: {
    padding: 8,
    marginBottom: 15,
},

// Search section styles
searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 0,
},
searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0000',
    borderRadius: 8,
    borderColor: '#F0F0F0',
    borderWidth: 2,
    paddingHorizontal: 12,
},
searchIcon: {
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

// Course card styles
card: {
    flexDirection: 'row',
    marginTop: 10,
    // marginBottom: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
},
cardImage: {
    width: 130,
    height: 130,
    borderRadius: 10,
    margin: 12,
},
cardContent: {
    flex: 1,
    padding: 12,
},

// Course card text styles
category: {
    fontFamily: 'Archivo',
    fontSize: 14,
    color: '#666',
},
title: {
    fontFamily: 'Archivo-Medium',
    fontSize: 16,
    marginTop: 4,
},

// Course metadata styles
metaInfo: {
marginTop: 8,
},
durationContainer: {
flexDirection: 'row',
alignItems: 'center',
marginBottom: 10,
},
duration: {
fontFamily: 'Archivo',
fontSize: 12,
color: '#666',
marginLeft: 4,
},

// Author section styles
authorContainer: {
flexDirection: 'row',
alignItems: 'center',
},
authorImage: {
width: 24,
height: 24,
marginRight: 8,
borderRadius: 12,
},
authorName: {
fontFamily: 'Archivo',
fontSize: 12,
color: '#666',
},

// Card right content styles
rightContent: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingLeft: 12,
},
bookmarkButton: {
    padding: 12,
    justifyContent: 'center',
},
ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginRight: 20,
},
rating: {
    fontFamily: 'Archivo-Medium',
    fontSize: 14,
    color: '#6366F1',
    marginLeft: 4,
}
});