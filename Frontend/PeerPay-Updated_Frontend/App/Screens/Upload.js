// App/Screens/Upload.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

function Upload() {
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

                {/* Upload Documents Section */}
                <View style={styles.profileCard}>
                    <Image source={require('../assets/profile.png')} style={styles.profilePic} />
                    <Text style={styles.profileName}>Upload Documents</Text>
                </View>

                {/* Document Upload Fields */}
                <View style={styles.detailsCard}>
                    <Text style={styles.detailsText}>Aadhaar Card:</Text>
                    <TouchableOpacity style={styles.uploadButton}>
                        <Text style={styles.uploadButtonText}>Choose File</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.detailsCard}>
                    <Text style={styles.detailsText}>PAN Card:</Text>
                    <TouchableOpacity style={styles.uploadButton}>
                        <Text style={styles.uploadButtonText}>Choose File</Text>
                    </TouchableOpacity>
                </View>

                

                

                <View style={styles.submitSection}>
                    <TouchableOpacity style={styles.submitButton}>
                        <Text style={styles.submitButtonText}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.navigate('Menu')}>
                    <Text style={styles.bottomButtonText}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.navigate('Profile')}>
                    <Text style={styles.bottomButtonText}>Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.navigate('Notifications')}>
                    <Icon name="bell" size={20} color="grey" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.navigate('NFT')}>
                    <Text style={styles.bottomButtonText}>NFT</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.navigate('Support')}>
                    <Text style={styles.bottomButtonText}>Support</Text>
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
        marginBottom: 10,
    },
    profileName: {
        fontSize: 18,
        color: 'white',
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
        color: 'black',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
        fontFamily: 'Courier New',
    },
    uploadButton: {
        backgroundColor: '#288885',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    uploadButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    submitSection: {
        alignItems: 'center',
        marginVertical: 20,
    },
    submitButton: {
        backgroundColor: '#288885',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 25,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
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

export default Upload;