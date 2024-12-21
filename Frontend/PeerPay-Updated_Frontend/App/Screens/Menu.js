import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from "../../urlconfig";

function HomeScreen({ navigation }) {
    const images = [
        { id: '1', source: require('../assets/1.png') },
        { id: '2', source: require('../assets/2.png') },
        { id: '3', source: require('../assets/3.png') },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [user, setUser] = useState("");
    const [amount, setAmount] = useState("0");

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);

        const getUserDetails = async () => {
            try {
                const userId = await AsyncStorage.getItem('userId');
                if (userId) {
                    const response = await fetch(`https://${BASE_URL}/user/${userId}`);
                    const data = await response.json();
                    if (response.ok) {
                        setUser(data);
                        // Set the amount when the user data is fetched
                        setAmount(data?.Amount?.$numberDecimal?.toString() || "0");
                    } else {
                        console.error('Failed to fetch user data');
                    }
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        getUserDetails();

        return () => clearInterval(interval);
    }, []);

    const fetchAmount = async () => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            if (userId) {
                const response = await fetch(`https://${BASE_URL}/user/${userId}`);
                const data = await response.json();
                if (response.ok) {
                    // Update the amount on press
                    setAmount(data?.Amount?.$numberDecimal?.toString() || "0");
                } else {
                    Alert.alert('Error', 'Failed to fetch account balance.');
                }
            }
        } catch (error) {
            console.error('Error fetching amount:', error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                    <Image source={require('../assets/profile.png')} style={styles.profileImage} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('AboutUs')}>
                    <Image source={require('../assets/AboutUs.png')} style={styles.supportImage} />
                </TouchableOpacity>
            </View>

            {/* Image Slider */}
            <View style={styles.sliderWrapper}>
                <Image source={images[currentIndex].source} style={styles.sliderImage} />
            </View>

            {/* Grid Section */}
            <View style={styles.gridContainer}>
                {/* Peer List */}
                <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate('PeerList')}>
                    <Icon name="users" size={30} color="#288885" />
                    <Text style={styles.gridText}>Peer List</Text>
                    <Text style={styles.gridDescription}>
                        View all your trusted peers for lending and borrowing money securely.
                    </Text>
                </TouchableOpacity>

                {/* Account Balance */}
                <TouchableOpacity style={styles.gridItem} onPress={fetchAmount}>
                    <Icon name="money" size={30} color="#288885" />
                    <Text style={styles.gridText}>
                        Account Balance:{"\n"}
                        <Text style={styles.balanceText}>₹{amount}</Text>
                    </Text>
                    <Text style={styles.gridDescription}>
                        Check your current balance and track your transactions effortlessly.
                    </Text>
                </TouchableOpacity>

                {/* Send Money */}
                <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate('Send')}>
                    <Icon name="send" size={30} color="#288885" />
                    <Text style={styles.gridText}>Send</Text>
                    <Text style={styles.gridDescription}>
                        Transfer money instantly to your peers with a single tap.
                    </Text>
                </TouchableOpacity>

                {/* Request Money */}
                <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate('Receiver')}>
                    <Icon name="credit-card" size={30} color="#288885" />
                    <Text style={styles.gridText}>Request</Text>
                    <Text style={styles.gridDescription}>
                        Request funds easily from peers when you need financial support.
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Profile')}>
                    <Icon name="user" size={23} color="#288885" />
                </TouchableOpacity>
                
               
                <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Collection')}>
                    <Icon name="folder" size={23} color="#288885" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('PasswordCreate')}>
                    <Icon name="cog" size={23} color="#288885" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Support')}>
                    <Icon name="headphones" size={23} color="#288885" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.navButton}
                    onPress={async () => {
                        try {
                            // Clear all AsyncStorage data
                            await AsyncStorage.clear();
                            // Clear user details (if stored in state)
                            setUser("");
                            // Navigate to Login screen
                            navigation.navigate('Welcome');
                        } catch (error) {
                            console.error('Error during logout:', error);
                        }
                    }}
                >
                    <Icon name="sign-out" size={23} color="#288885" />
                </TouchableOpacity>
            </View>
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
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    supportImage: {
        width: 40,
        height: 40,
    },
    sliderWrapper: {
        width: '90%',
        height: 200,
        backgroundColor: '#ffffff',
        alignSelf: 'center',
        borderRadius: 15,
        marginVertical: 20,
        overflow: 'hidden',
        elevation: 5,
    },
    sliderImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    gridItem: {
        width: '45%',
        height: 200,
        backgroundColor: '#ffffff',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        elevation: 5,
        padding: 10, // Added padding for better content alignment
        borderColor: '#e0e0e0', // Optional: add border color for better separation
        borderWidth: 1, // Optional: add border width for better separation
    },
    gridText: {
        fontSize: 16,
        color: '#333333',
        marginTop: 10,
        fontWeight: '600',
        textAlign: 'center', // Ensure the text is centered
    },
    gridDescription: {
        fontSize: 12,
        color: '#555555',
        textAlign: 'center',
        marginTop: 5,
        lineHeight: 16, // Improved line spacing for better readability
    },
    balanceText: {
        fontSize: 18,
        color: '#288885',
        fontWeight: '700',
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#ffffff',
        padding: 10,
        borderRadius: 50,
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        width: '90%',
        elevation: 5,
    },
    navButton: {
        alignItems: 'center',
    },
});

export default HomeScreen;
