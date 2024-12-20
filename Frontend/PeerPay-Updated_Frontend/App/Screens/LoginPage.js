import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet,ImageBackground } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../urlconfig";
import { SafeAreaView } from "react-native-safe-area-context";

// Replace this with your backend API URL
const API_URL = `http://${BASE_URL}/auth/login`;

const LoginPage = ({ navigation }) => {
  const [userId, setUserId] = useState(null); // Initially set to null, as we'll get it from AsyncStorage
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState("");
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


    const getUserDetails = async () => {
            try {
                const userId = await AsyncStorage.getItem('userId');
                if (userId) {
                    const response = await fetch(`http://${BASE_URL}/user/${userId}`);
                    const data = await response.json();
                    if (response.ok) {
                        setUser(data);
                    } else {
                        console.error('Failed to fetch user data');
                    }
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
            } finally {
                setLoading(false);
            }
        };

        getUserDetails();
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
     <SafeAreaView style={styles.safeArea}>
                  <ImageBackground 
                    source={require("../assets/06-01.jpg")}  // Add your image path here
                    style={styles.background}
                  >
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      {error ? <Text style={styles.errorMessage}>{error}</Text> : null}
      {message ? <Text style={styles.successMessage}>{message}</Text> : null}

      
          <Text style={styles.bodyText} >{user.name ? `Welcome, ${user.name}` : loading ? "Loading..." : "Enter Details"}</Text>
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
        keyboardType="numeric"
        minLength={8}
        maxLength={8}
      />
      
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>
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
    color: "#1B3139",
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
  button: {
    width: "100%", // Make the button stretch within the container
    backgroundColor: "#288885",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  bodyText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 12,
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


export default LoginPage;
