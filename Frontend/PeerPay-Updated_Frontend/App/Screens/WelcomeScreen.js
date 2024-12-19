import React from 'react';
import { View, Image, Text, StyleSheet, TextInput,TouchableOpacity ,ImageBackground} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
function WelcomeScreen({navigation}) {

    
    return (
        
        <SafeAreaView style={styles.safeArea}>
              <ImageBackground 
                source={require("../assets/06-01.jpg")}  // Add your image path here
                style={styles.background}
              >

        <View style={styles.container}>
            <Image style={styles.logo} source={require("../assets/Logo.png")} />
            <Text style={styles.title}>Empowering Your Financial Future Through Peer-to-Peer Lending</Text>

            <TouchableOpacity
                style={styles.loginButton}
                onPress={() => navigation.navigate('Login')}
            >
                <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.registerButton}
                onPress={() => navigation.navigate('SignUp')}
            >
                <Text style={styles.registerButtonText}>SignUp</Text>
            </TouchableOpacity>
                </View>
                </ImageBackground>
                    </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        borderColor: "#288885", // Vibrant red border color
        borderWidth: 1,
        backgroundColor: "rgba(255, 255, 255, 0.6)", // Semi-transparent white background
        borderRadius: 10,
        width: "90%",
        height: "70%",
    
    },
    logo: {
        width: 250,
        height: 150,
        borderRadius: 15,
    },
    title: {
        color: "#1B3139", // Dark text color for the title
        marginTop: 20,
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
    loginButton: {
        width: '80%',
        height: 50,
        backgroundColor: "#288885", // Vibrant red for the login button
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 15,
    },
    registerButton: {
        width: '80%',
        height: 50,
        backgroundColor: "black", // Bold red for the register button
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 10,
    },
    loginButtonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff", // White text color for contrast
    },
    registerButtonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff", // White text color for contrast
    },
    safeArea: {
    flex: 1,
    },
    background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default WelcomeScreen;
