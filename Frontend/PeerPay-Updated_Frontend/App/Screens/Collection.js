// App/Screens/Collection.js
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from "../../urlconfig";
import AsyncStorage from '@react-native-async-storage/async-storage';

function Collection() {
    const navigation = useNavigation();
    const [rewardTokens, setRewardTokens] = useState(0);
    const [completedTransactions, setCompletedTransactions] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchCompletedTransactions = async () => {
        const receiverId = await AsyncStorage.getItem('userId');
        if (!receiverId) {
            Alert.alert('Error', 'User ID not found. Please log in again.');
            return;
        }

        setLoading(true);
        try {
            const url = `https://${BASE_URL}/alltransactions/receiver/${receiverId}`;
            const response = await fetch(url);

            if (!response.ok) {
                Alert.alert('Error', `Failed to fetch transactions. (${response.status})`);
                return;
            }

            const data = await response.json();
            if (data && data.length > 0) {
                const completed = data.filter(
                    (transaction) => transaction.transaction_state === 'COMPLETED'
                );
                const earnedTokens = completed.length * 10; // Assume 10 tokens per transaction
                setRewardTokens(earnedTokens);
                setCompletedTransactions(completed.length);
            } else {
                setRewardTokens(0);
                setCompletedTransactions(0); // No completed transactions
            }
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred while fetching transactions.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompletedTransactions();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('Menu')}>
                        <Image source={require('../assets/Back.png')} style={styles.backImage} />
                    </TouchableOpacity>
                </View>

                {/* Rewards Title */}
                <View style={styles.rewardsTitleCard}>
                    <Text style={styles.rewardsTitle}>Reward Collection</Text>
                </View>

                {/* Reward Balance Display */}
                <View style={styles.detailsCard}>
                    <Text style={styles.detailsTitle}>Your Reward Tokens</Text>
                    {loading ? (
                        <Text style={styles.rewardBalance}>Loading...</Text>
                    ) : (
                        <Text style={styles.rewardBalance}>{rewardTokens} Tokens</Text>
                    )}
                </View>

                {/* Completed Transactions Display */}
                <View style={styles.detailsCard}>
                    <Text style={styles.detailsTitle}>Total Completed Transactions</Text>
                    {loading ? (
                        <Text style={styles.rewardBalance}>Loading...</Text>
                    ) : (
                        <Text style={styles.rewardBalance}>{completedTransactions}</Text>
                    )}
                </View>

                {/* Info Section */}
                <View style={styles.detailsCard}>
                    <Text style={styles.detailsText}>
                        Your reward tokens are based on completed transactions. Every transaction earns you 10 tokens.
                    </Text>
                    <TouchableOpacity
                        style={styles.sendButton}
                        onPress={() => navigation.navigate('Receiver')}
                    >
                        <Text style={styles.sendButtonText}>Go to Transactions</Text>
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
    rewardsTitleCard: {
        alignItems: 'center',
        margin: 15,
    },
    rewardsTitle: {
        fontSize: 24,
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
    rewardBalance: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#288885',
        textAlign: 'center',
        marginVertical: 20,
    },
    detailsText: {
        color: 'black',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 15,
    },
    sendButton: {
        backgroundColor: '#288885',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    sendButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default Collection;
