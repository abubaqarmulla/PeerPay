import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';

function WelcomeScreen({navigation}) {

    
    return (
        
        <View style={styles.container}>
            <Image style={styles.logo} source={require("../assets/Logo.png")} />
            <Text style={styles.title}>Empowering Your Financial Future Through Peer-to-Peer Lending</Text>

            <TouchableOpacity
                style={styles.loginButton}
                onPress={() => navigation.navigate('Menu')}
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
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f7f7f7", // Light background color for a clean look
        padding: 20,
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
});

export default WelcomeScreen;
