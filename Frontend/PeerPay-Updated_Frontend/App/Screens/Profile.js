import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from "../../urlconfig";

function Profile() {
    const navigation = useNavigation();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch user details on component mount
    useEffect(() => {
        const getUserDetails = async () => {
            try {
                const userId = await AsyncStorage.getItem('userId');
                if (userId) {
                    const response = await fetch(`https://${BASE_URL}/user/${userId}`);
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

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="#F47C26" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('Menu')}>
                        <Image source={require('../assets/Back.png')} style={styles.backImage} />
                    </TouchableOpacity>
                </View>

                {/* Profile Photo Card */}
                <View style={styles.profileCard}>
                    <Image source={require('../assets/profile.png')} style={styles.profilePic} />
                    <Text style={styles.profileName}>{user.name}</Text>
                </View>

                {/* Profile Details Section */}
                <View style={styles.detailsCard}>
                    <Text style={styles.detailsText}>Phone Number: {user.phone}</Text>
                </View>
                <View style={styles.detailsCard}>
                    <Text style={styles.detailsText}>Address: {user.address.street}, {user.address.city}, {user.address.state}</Text>
                </View>
                <View style={styles.detailsCard}>
                <Text style={styles.detailsText}>
                 Account Balance: {user.Amount.$numberDecimal} INR
                </Text>
                </View>
                <View style={styles.detailsCard}>
                <Text style={styles.detailsText}>Aadhaar Number: {user.aadhaar}</Text>
                <Image
                    source={require('../assets/Verify.png')} // Replace with your verification image
                    style={styles.verificationImage}
                    />
                </View>
                <View style={styles.detailsCard}>
                <Text style={styles.detailsText}>PAN Card Number: {user.pan}</Text>
                <Image
                    source={require('../assets/Verify.png')} // Replace with your verification image
                    style={styles.verificationImage}
                    />
                </View>

                <View style={styles.detailsCard}>

                    <Text style={styles.detailsText}>Email: {user.email}</Text>
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
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: '#ffffff',
        elevation: 3,
    },
    backImage: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
        marginRight: 10,
    },
    profileCard: {
        alignItems: 'center',
        backgroundColor: '#288885',
        borderRadius: 20,
        margin: 15,
        padding: 20,
        elevation: 3, // For shadow on Android
        shadowColor: '#000', // For shadow on iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    profilePic: {
        width: 150,
        height: 150,
        borderRadius: 50,
        borderColor: 'gray',
        marginBottom: 10,
    },
    profileName: {
        fontSize: 22,
        color: 'white',
        fontWeight: 'bold',
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
    detailsText: {
        
        fontSize: 16,
        fontWeight: '800',
        marginBottom: 10,
        fontFamily: 'Courier New',
    },
    bottomNav: {
        position: 'absolute',
        bottom: 10,  // Adjust the bottom position as needed
        left: '7%',  // Add horizontal margin to reduce width
        right: '7%',  // Add horizontal margin to reduce width
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#FFB74D',
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
    verificationImage: {
    width: 20, // Adjust the size of the verification image
    height: 20,
    marginLeft: 10, // Add space between the text and the image
},

});

export default Profile;
