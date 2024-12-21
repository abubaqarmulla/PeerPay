import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView, Image
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from "../../urlconfig";
import { useAppContext } from '../../context';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const TransactionCard = ({ transaction, selectedTransaction, onPress, onApprove, onReject }) => {
  return (
    <TouchableOpacity
      style={[styles.transactionCard, selectedTransaction?._id === transaction._id && styles.selectedCard]}
      onPress={onPress}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.transactionId}>Transaction ID: {transaction.transaction_id}</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.transactionState}>{transaction.transaction_state}</Text>
        <Text style={styles.transactionText}>Sender: {transaction.senderName}</Text>
        <Text style={styles.transactionText}>Receiver: {transaction.receiverName}</Text>
        <Text style={styles.transactionText}>Amount: ₹{transaction.amount.$numberDecimal}</Text>
        <Text style={styles.transactionText}>Due Date: {new Date(transaction.due_date).toLocaleDateString()}</Text>
        <Text style={styles.transactionText}>Description: {transaction.description}</Text>
      </View>
      {transaction.transaction_state === 'PENDING' && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.approveButton} onPress={onApprove}>
            <Text style={styles.buttonText}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rejectButton} onPress={onReject}>
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

const Send = () => {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const navigation = useNavigation();

  const { changeT, updatechangeT } = useAppContext();

  useEffect(() => {
    fetchTransactions();
  }, [filter, changeT]);

  const fetchUserById = async (userId) => {
    try {
      const response = await fetch(`https://${BASE_URL}/user/${userId}`);
      const data = await response.json();
      return data.name;
    } catch (error) {
      console.error(`Failed to fetch user details for ID: ${userId}`, error);
      return 'Unknown';
    }
  };

  const fetchTransactions = async () => {
    const senderId = await AsyncStorage.getItem('userId');
    setLoading(true);
    try {
      let url = `https://${BASE_URL}/alltransactions/sender/${senderId}`;
      if (filter !== 'ALL') {
        url = `https://${BASE_URL}/transaction/${filter.toLowerCase()}/sender/${senderId}`;
      }

      const response = await fetch(url);

      if (response.status === 404) {
        Alert.alert('No transactions available');
        setTransactions([]);
        return;
      }

      const data = await response.json();

      const transactionsWithNames = await Promise.all(
        data.map(async (transaction) => ({
          ...transaction,
          senderName: await fetchUserById(transaction.sender_id),
          receiverName: await fetchUserById(transaction.receiver_id),
        }))
      );

      setTransactions(transactionsWithNames);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (transactionId) => {
    try {
      const response = await fetch(`https://${BASE_URL}/transaction/approve-sender`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transaction_id: transactionId }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', data.message);
        fetchTransactions();
      } else {
        Alert.alert('Error', data.error);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleReject = async (transactionId) => {
  try {
    const response = await fetch(`https://${BASE_URL}/transaction/rejected-sender`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transaction_id: transactionId }),
    });

    const data = await response.json();

    if (response.ok) {
      Alert.alert('Success', data.message || 'Transaction rejected successfully.');
      fetchTransactions(); // Refresh the transaction list
    } else {
      console.error('Error response:', data); // Log the error for debugging
      Alert.alert('Error', data.error || 'Failed to reject the transaction.');
    }
  } catch (error) {
    console.error('Error during rejection:', error); // Log any unexpected errors
    Alert.alert('Error', error.message || 'An error occurred while processing the rejection.');
  }
};

  const processOverdueTransactions = async () => {
    const senderId = await AsyncStorage.getItem('userId');
    if (!senderId) {
      Alert.alert('Error', 'Sender ID not found');
      return;
    }

    try {
      const response = await fetch(`https://${BASE_URL}/api/transaction/overdue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderId }),
      });

      const responseText = await response.text();
      let data;

      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        Alert.alert('Error', 'Invalid server response');
        return;
      }

      if (response.ok) {
        Alert.alert('Success', data.message);
        fetchTransactions();
        updatechangeT();
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('Menu')}>
          <Image source={require('../assets/Back.png')} style={styles.backImage} />
        </TouchableOpacity>
        
      </View>

      <Text style={styles.title}>User Transaction Sent</Text>
      <Picker
        selectedValue={filter}
        onValueChange={(value) => setFilter(value)}
        style={styles.picker}
      >
        <Picker.Item label="All" value="ALL" />
        <Picker.Item label="Pending" value="PENDING" />
        <Picker.Item label="Approved" value="APPROVED" />
        <Picker.Item label="Rejected (Sender)" value="REJECTED_SENDER" />
        <Picker.Item label="Rejected (Receiver)" value="REJECTED_RECEIVER" />
        <Picker.Item label="Completed" value="COMPLETED" />
        <Picker.Item label="Defaulted" value="DEFAULTED" />
        <Picker.Item label="Returned" value="RETURNED" />
      </Picker>

      <TouchableOpacity style={styles.overdueButton} onPress={processOverdueTransactions}>
        <Text style={styles.buttonText}>Process Overdue Transactions</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TransactionCard
              transaction={item}
              selectedTransaction={selectedTransaction}
              onPress={() => setSelectedTransaction(item)}
              onApprove={() => handleApprove(item.transaction_id)}
              onReject={() => handleReject(item.transaction_id)}
            />
          )}
          contentContainerStyle={styles.transactionList}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eafbfa',
  },
  picker: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccd1d9',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    paddingVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#288885',
    textAlign: 'center',
    marginVertical: 10,
  },
  transactionCard: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCard: {
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  transactionId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  transactionState: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  cardContent: {
    paddingVertical: 8,
  },
  transactionText: {
    fontSize: 14,
    color: '#555',
    marginVertical: 2,
  },
  loader: {
    marginTop: 20,
  },
  transactionList: {
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center',
  },
  rejectButton: {
    backgroundColor: '#f44336',
    padding: 12,
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
   overdueButton: {
    backgroundColor: '#FF9800', // A more vibrant color
    paddingVertical: 15, // Increased height for a better button size
    borderRadius: 10, // Softer rounded corners for a modern look
    alignItems: 'center',
    marginVertical: 20, // More spacing above and below the button
    elevation: 4, // Added shadow for a more elevated look
    shadowColor: '#000', // Shadow for better depth
    shadowOpacity: 0.1,
    shadowRadius: 5,
    width: '90%', // 90% of the screen width
    alignSelf: 'center', // Centers the button horizontally
  },
  overdueButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff', // White text for contrast
    letterSpacing: 1, // Spacing out the letters for better readability
  
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
  pageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  cardHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
  }
});

export default Send;
