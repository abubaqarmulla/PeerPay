import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../urlconfig";

// Replace this with your backend API URL
const API_URL = `http://${BASE_URL}/auth/login`;

const LoginPage = ({ navigation }) => {
  const [userId, setUserId] = useState(null); // Initially set to null, as we'll get it from AsyncStorage
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch userId from AsyncStorage when the component mounts
    const getUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        if (storedUserId) {
          setUserId(storedUserId); // If userId exists in AsyncStorage, set it to state
        }
      } catch (err) {
        console.error("Failed to fetch userId from AsyncStorage", err);
      }
    };

    getUserId(); // Call the function on component mount
  }, []);

  // Handle the login process using fetch API
  const handleLogin = async () => {
    if (!userId) {
        setError("User ID is missing");
        return;
    }

    setLoading(true);
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId, password }),
        });

        const data = await response.json();
        if (response.ok) {
            setMessage(data.message);
            const userid =  await AsyncStorage.getItem("userId")
            if(!userid){
                await AsyncStorage.setItem("userId", userId); 
            
            }
            setPassword(""); // Clear the password field
            navigation.navigate("Menu"); // Navigate to the Menu screen
            setError(""); // Clear any previous errors
        } else {
            // Display server-side error message
            setError(data.message || "An error occurred");
        }
    } catch (err) {
        console.error("Request failed:", err); // Log the error in console
        setError("An error occurred while making the request: " + err.message); // Display detailed error message
    }
    setLoading(false);
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      {error ? <Text style={styles.errorMessage}>{error}</Text> : null}
      {message ? <Text style={styles.successMessage}>{message}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="User ID"
        value={userId || ""}
        onChangeText={(text) => setUserId(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f7f7f7", // Light background color
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
    color: "#1B3139", // Dark text color for title
  },
  input: {
    height: 50,
    borderColor: "#FF6347", // Vibrant red border color
    borderWidth: 1,
    borderRadius: 25,
    marginBottom: 16,
    paddingLeft: 16,
    fontSize: 16,
    backgroundColor: "#fff", // White background for inputs
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
    backgroundColor: "#FF6347", // Vibrant button color
    paddingVertical: 14,
    borderRadius: 25,
    marginTop: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff", // White text color
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default LoginPage;
