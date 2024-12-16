// App/Screens/Support.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

function Support() {
    const navigation = useNavigation(); // Access navigation

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('Menu')}>
                        <Image source={require('../assets/Back.png')} style={styles.backImage} />
                    </TouchableOpacity>
                </View>

                {/* Support Title */}
                <View style={styles.supportTitleCard}>
                    <Text style={styles.supportTitle}>Need Help? We're here for you!</Text>
                </View>

                {/* FAQs Section */}
                <View style={styles.detailsCard}>
                    <Text style={styles.detailsTitle}>Frequently Asked Questions</Text>
                    <Text style={styles.detailsText}>1. How can I reset my password?</Text>
                    <Text style={styles.detailsTextAnswer}>Go to the login page and click "Forgot Password" to reset your password.</Text>
                    <Text style={styles.detailsText}>2. How do I contact customer support?</Text>
                    <Text style={styles.detailsTextAnswer}>You can reach us via the contact details provided below.</Text>
                </View>

                {/* Contact Details Section */}
                <View style={styles.detailsCard}>
                    <Text style={styles.detailsTitle}>Contact Us</Text>
                    <Text style={styles.detailsText}>Phone Number: +91 9876543210</Text>
                    <Text style={styles.detailsText}>Email: support@yourapp.com</Text>
                    <Text style={styles.detailsText}>Address: 123 Main Street, City, Country</Text>
                </View>

                {/* Feedback Section */}
                <View style={styles.detailsCard}>
                    <Text style={styles.detailsTitle}>We Value Your Feedback</Text>
                    <TextInput 
                        style={styles.textInput}
                        placeholder="Write your feedback here..."
                        placeholderTextColor="#888"
                        multiline
                    />
                    <TouchableOpacity style={styles.submitButton}>
                        <Text style={styles.submitButtonText}>Submit Feedback</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

           
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eafbfa',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        padding: 10,
        alignItems: 'center',
        backgroundColor: 'white',
    },
    backImage: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
        marginRight: 10,
    },
    supportTitleCard: {
        alignItems: 'center',
        margin: 15,
    },
    supportTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#288885',
    },
    detailsCard: {
        backgroundColor: 'white',
        borderRadius: 20,
        margin: 15,
        padding: 20,
        elevation: 3, // For shadow on Android
        shadowColor: '#000', // For shadow on iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    detailsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 10,
    },
    detailsText: {
        color: 'black',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
    },
    detailsTextAnswer: {
        color: '#555',
        fontSize: 14,
        marginBottom: 10,
    },
    textInput: {
        height: 100,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        backgroundColor: '#f9f9f9',
        marginBottom: 10,
    },
    submitButton: {
        backgroundColor: '#288885',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    bottomNav: {
        position: 'absolute',
        bottom: 10,  // Adjust the bottom position as needed
        left: '7%',  // Add horizontal margin to reduce width
        right: '7%',  // Add horizontal margin to reduce width
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'white',
        padding: 5,
        borderRadius: 200,  // Rounded shape
        elevation: 5, // For shadow on Android
        shadowColor: '#000', // For shadow on iOS
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    bottomButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
    },
    bottomButtonText: {
        color: 'grey',
        fontSize: 15,
        fontWeight: '500',
    },
});

export default Support;