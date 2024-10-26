import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Image, Platform } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from '@expo/vector-icons';

export default function ScanScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [galleryPermission, requestGalleryPermission] = ImagePicker.useMediaLibraryPermissions();
  const [image, setImage] = useState<string | null>(null);
  const cameraRef = useRef<CameraView | null>(null);
  if (!permission || !galleryPermission) {
    return <View />;
  }

  if (!permission.granted || !galleryPermission.granted) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.message}>We need your permission to use the camera and access gallery</ThemedText>
        <TouchableOpacity 
          style={styles.permissionButton} 
          onPress={() => {
            requestPermission();
            requestGalleryPermission();
          }}>
          <ThemedText style={styles.permissionButtonText}>Grant Permission</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        if (photo) {
          await MediaLibrary.saveToLibraryAsync(photo.uri);
          setImage(photo.uri);
        }
      } catch (e) {
        console.error('Failed to take picture:', e);
      }
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const retryPhoto = () => {
    setImage(null);
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Scan</ThemedText>
        <TouchableOpacity>
          <Ionicons name="flash-outline" size={24} color="black" />
        </TouchableOpacity>
      </ThemedView>

      {/* Camera View */}
      <ThemedView style={styles.cameraContainer}>
        {!image ? (
          <CameraView
            ref={cameraRef}
            style={styles.camera} 
            facing={facing}
          >
            <View style={styles.scanLineContainer}>
              <View style={styles.scanLine} />
            </View>
            <View style={styles.cornerOverlay}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
          </CameraView>
        ) : (
          <Image source={{ uri: image }} style={styles.camera} />
        )}
      </ThemedView>

      {/* Content */}
      <ThemedView style={styles.contentContainer}>
        <ThemedText style={styles.contentTitle}>Scan Your Food</ThemedText>
        <ThemedText style={styles.contentSubtitle}>
          Scan the food and discover its nutrients instantly.
        </ThemedText>
        <TouchableOpacity style={styles.manualButton}>
          <ThemedText style={styles.manualButtonText}>
            Can't scan? Add nutrition data here.
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {/* Footer */}
      <ThemedView style={styles.footer}>
        <TouchableOpacity style={styles.sideButton} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.thumbnail} />
          ) : (
            <Ionicons name="images" size={24} color="#666" />
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
          <Ionicons name="camera" size={32} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.sideButton} onPress={retryPhoto}>
          <Ionicons name="refresh" size={24} color="#666" />
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 44 : 16,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Archivo-Medium',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    fontFamily: 'Archivo',
    fontSize: 16,
  },
  cameraContainer: {
    flex: 1,
    maxHeight: '50%',
  },
  camera: {
    flex: 1,
  },
  scanLineContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanLine: {
    width: '80%',
    height: 2,
    backgroundColor: '#6366F1',
  },
  cornerOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: 'white',
  },
  topLeft: {
    top: 20,
    left: 20,
    borderLeftWidth: 3,
    borderTopWidth: 3,
  },
  topRight: {
    top: 20,
    right: 20,
    borderRightWidth: 3,
    borderTopWidth: 3,
  },
  bottomLeft: {
    bottom: 20,
    left: 20,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
  },
  bottomRight: {
    bottom: 20,
    right: 20,
    borderRightWidth: 3,
    borderBottomWidth: 3,
  },
  contentContainer: {
    padding: 20,
  },
  contentTitle: {
    fontSize: 24,
    fontFamily: 'Archivo-Medium',
    marginBottom: 8,
  },
  contentSubtitle: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Archivo',
    marginBottom: 16,
  },
  manualButton: {
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  manualButtonText: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Archivo',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  sideButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
  },
  permissionButton: {
    padding: 16,
    backgroundColor: '#6366F1',
    borderRadius: 12,
    marginTop: 16,
    marginHorizontal: 20,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Archivo',
    textAlign: 'center',
  },
});