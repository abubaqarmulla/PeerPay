import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { BASE_URL } from "../../urlconfig";

const PanVerify = () => {
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigation = useNavigation();
  

 
   const handleImagePicker = async () => {
     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
 
     if (status !== "granted") {
       Alert.alert("Permission Required", "Please allow media access to upload an image.");
       return;
     }
 
     const result = await ImagePicker.launchImageLibraryAsync({
       mediaTypes: ImagePicker.MediaTypeOptions.Images,
       allowsEditing: false,
       quality: 1,
     });
 
     if (!result.canceled) {
       const selectedImageUri = result.assets[0]?.uri; // Correct URI for the new API
       if (selectedImageUri) {
         setImage(selectedImageUri);
         console.log("Image selected:", selectedImageUri);
       }
     }
   };

   const handleSubmit = async () => {
    if (!image) {
      Alert.alert("Error", "Please select an Aadhaar image.");
      return;
    }
  
    setIsSubmitting(true);
    const userId = await AsyncStorage.getItem("userId");
  
    if (!userId) {
      Alert.alert("Error", "User ID not found. Please register again.");
      setIsSubmitting(false);
      return;
    }
  
    const formData = new FormData();
    const localUri = Platform.OS === "android" ? image : image.replace("file://", "");
    const filename = localUri.split("/").pop();
    const type = `image/${filename.split(".").pop()}`;
  
    formData.append("userId", userId);
    formData.append("panImage", {
      uri: localUri,
      name: filename,
      type:type,
    });
    try {
      const response = await fetch(`http://${BASE_URL}/auth/verify-pan`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });
  
      const responseJson = await response.json();
  
      if (response.ok) {
        Alert.alert("Verification Successful", responseJson.message);
        navigation.navigate("PasswordCreate");
      } else {
        Alert.alert("Verification Failed", responseJson.message || "Unknown error occurred");
        console.log("Server response:", responseJson);
      }
    } catch (error) {
      console.error("Error during Aadhaar verification:", error);
      Alert.alert("Error", error.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LinearGradient
      colors={["#6A11CB", "#2575FC"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Ionicons name="document-text-outline" size={50} color="white" />
          <Text style={styles.title}>PAN Verification</Text>
        </View>

        <View style={styles.imagePickerContainer}>
          {image ? (
            <Image source={{ uri: image }} style={styles.previewImage} />
          ) : (
            <View style={styles.placeholderContainer}>
              <AntDesign name="cloudupload" size={50} color="#6A11CB" />
              <Text style={styles.placeholderText}>Upload PAN Document</Text>
            </View>
          )}

          <TouchableOpacity style={styles.selectButton} onPress={handleImagePicker}>
            <Text style={styles.selectButtonText}>
              {image ? "Change Image" : "Select Image"}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, (isSubmitting || !image) && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting || !image}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <View style={styles.submitButtonContent}>
              <Text style={styles.submitButtonText}>Verify PAN</Text>
              <Ionicons name="arrow-forward" size={20} color="white" />
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.disclaimerText}>
          Ensure your PAN document is clear and readable.
        </Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    width: "90%",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginTop: 10,
  },
  imagePickerContainer: {
    width: "100%",
    alignItems: "center",
  },
  previewImage: {
    width: 250,
    height: 150,
    borderRadius: 10,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  placeholderContainer: {
    width: 250,
    height: 150,
    backgroundColor: "white",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  placeholderText: {
    marginTop: 10,
    color: "#6A11CB",
    fontWeight: "600",
  },
  selectButton: {
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  selectButtonText: {
    color: "#6A11CB",
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "#2575FC",
    width: "100%",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#A9A9A9",
  },
  submitButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
    marginRight: 10,
  },
  disclaimerText: {
    marginTop: 15,
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    textAlign: "center",
  },
});

export default PanVerify;
