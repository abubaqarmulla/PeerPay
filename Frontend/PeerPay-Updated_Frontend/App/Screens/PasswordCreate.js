import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, ActivityIndicator, StyleSheet, TouchableOpacity,ImageBackground } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../urlconfig";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

// API URL for the backend
const API_URL = `https://${BASE_URL}/auth/set-password`;

const SetPasswordForm = () => {

  const navigation = useNavigation();
  const [userId, setUserId] = useState(""); // To store userId from AsyncStorage or some global state
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Function to fetch userId from AsyncStorage
  const getUserId = async () => {
    try {
      const savedUserId = await AsyncStorage.getItem("userId");
      if (savedUserId) {
        setUserId(savedUserId); // Set the userId to state
      }
    } catch (e) {
      setError("Failed to load user ID.");
    }
  };

  // Handle the form submission
  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      // Use fetch to send the POST request
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, password }),
      });

      if (!response.ok) {
        throw new Error("Failed to set password");
      }

      const data = await response.json();
      setMessage(data.message);
      navigation.navigate("Login");// Navigate to the login screen
      setError("");
    } catch (err) {
      setError(err.message || "An error occurred");
    }
    setLoading(false);
  };

  // Load userId on component mount
  useEffect(() => {
    getUserId();
  }, []);

  return (

      <SafeAreaView style={styles.safeArea}>
                        <ImageBackground 
                          source={require("../assets/06-01.jpg")}  // Add your image path here
                          style={styles.background}
                        >

    <View style={styles.container}>
      <Text style={styles.title}>Set Your Password</Text>

      {message && <Text style={styles.successMessage}>{message}</Text>}
      {error && <Text style={styles.errorMessage}>{error}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        maxLength={8} // Limit to 8 digits
        minLength={8}
        placeholderTextColor="#888"
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        maxLength={8} // Limit to 8 digits
        minLength={8}
        placeholderTextColor="#888"
        keyboardType="numeric"
      />

      {loading ? (
        <ActivityIndicator size="large" color="#FF6347" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Set Password</Text>
        </TouchableOpacity>
      )}
        </View>
        </ImageBackground>
                                    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
   justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.6)", // Semi-transparent white
    borderRadius: 10,
    padding: 20, // Added padding to give space to child elements
    width: "90%",
    maxWidth: 400, // Optional: set a max width for large screens
    borderWidth: 1,
    borderColor:"#288885",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
    color: "#1B3139", // Dark text color for title
  },
  input: {
    width: "100%", // Ensure inputs stretch fully within the container
    height: 50,
    borderColor: "#288885",
    borderWidth: 1,
    borderRadius: 25,
    marginBottom: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  successMessage: {
    color: "green",
    textAlign: "center",
    marginBottom: 12,
    fontSize: 16,
  },
  errorMessage: {
    color: "red",
    textAlign: "center",
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    width: "100%", // Make the button stretch within the container
    backgroundColor: "#288885",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: {
    color: "#fff", // White text color
    fontSize: 18,
    fontWeight: "bold",
  },
   safeArea: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16, // Add padding for safe area
  },
});

export default SetPasswordForm;
