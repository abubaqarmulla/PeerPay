// App/Screens/AboutUs.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Linking } from 'react-native';


function AboutUs() {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('Menu')}>
                        <Image source={require('../assets/Back.png')} style={styles.backImage} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>About Us</Text>
                </View>

                {/* About Us Section */}
                <View style={styles.aboutCard}>
                    <Text style={styles.aboutHeading}>Who We Are</Text>
                    <Text style={styles.aboutText}>
                        We are a passionate team dedicated to revolutionizing the NFT space. Our mission is to provide a platform that empowers artists, collectors, and enthusiasts to explore the vast potential of digital assets.
                    </Text>
                </View>

                <View style={styles.aboutCard}>
                    <Text style={styles.aboutHeading}>Our Vision</Text>
                    <Text style={styles.aboutText}>
                        To bridge the gap between creativity and technology by making NFTs accessible and user-friendly for everyone.
                    </Text>
                </View>
                <View style={styles.aboutCard}>
                    <Text style={styles.aboutHeading}>Meet the Developers</Text>
                    <Text style={styles.aboutText}>
                    <Text>Abubaqar Mulla: </Text>
                    <Text style={{ color: 'blue' }} onPress={() => Linking.openURL('https://www.linkedin.com/in/abubaqar-mulla-dev16')}>LinkedIn</Text>
                        </Text>
                    <Text style={styles.aboutText}>
                    <Text>Brahnaraj Kashatti: </Text>
                    <Text style={{ color: 'blue' }} onPress={() => Linking.openURL('https://www.linkedin.com/in/developer2')}>LinkedIn</Text>
                        </Text>
                    <Text style={styles.aboutText}>
                    <Text>Abhishek Terani: </Text>
                    <Text style={{ color: 'blue' }} onPress={() => Linking.openURL('https://www.linkedin.com/in/developer3')}>LinkedIn</Text>
                        </Text>
                    <Text style={styles.aboutText}>
                    <Text>Aman Mulla: </Text>
                    <Text style={{ color: 'blue' }} onPress={() => Linking.openURL('https://www.linkedin.com/in/developer3')}>LinkedIn</Text>
                        </Text>
                </View>

                <View style={styles.aboutCard}>
                    <Text style={styles.aboutHeading}>Contact Us</Text>
                    <Text style={styles.aboutText}>Email: support@nftplatform.com</Text>
                    <Text style={styles.aboutText}>Phone: +91 9876543210</Text>
                    <Text style={styles.aboutText}>Address: 456 Innovation Drive, Tech City, Country</Text>
                </View>
            </ScrollView>

            {/* Bottom Navigation */}
            
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
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'white',
    },
    backImage: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    aboutCard: {
        backgroundColor: 'white',
        borderRadius: 20,
        margin: 15,
        padding: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    aboutHeading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#288885',
    },
    aboutText: {
        fontSize: 16,
        color: 'black',
        marginBottom: 10,
        lineHeight: 22,
    },
    bottomNav: {
        position: 'absolute',
        bottom: 10,
        left: '7%',
        right: '7%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'white',
        padding: 5,
        borderRadius: 200,
        elevation: 5,
        shadowColor: '#000',
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

export default AboutUs;