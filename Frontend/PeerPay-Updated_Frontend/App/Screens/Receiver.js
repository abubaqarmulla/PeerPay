import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // Import SafeAreaView
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from "../../urlconfig";
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../../context';
import { RefreshControl } from 'react-native';

const TransactionCard = ({ transaction, selectedTransaction, onPress, onApprove, onReject }) => {
  return (
    <TouchableOpacity
      style={[
        styles.transactionCard,
        selectedTransaction?._id === transaction._id && styles.selectedCard,
      ]}
      onPress={onPress}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.transactionId}>Transaction ID: {transaction._id}</Text>
      </View>
      <View style={styles.cardHeader}>
        <Text style={styles.transactionState}>{transaction.transaction_state}</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.transactionText}>Sender: {transaction.senderName}</Text>
        <Text style={styles.transactionText}>Receiver: {transaction.receiverName}</Text>
        <Text style={styles.transactionText}>Amount: {transaction.amount.$numberDecimal}</Text>
        <Text style={styles.transactionText}>Due Date: {new Date(transaction.due_date).toLocaleDateString()}</Text>
        <Text style={styles.transactionText}>Description: {transaction.description}</Text>
      </View>
      {transaction.transaction_state === 'APPROVED' && (
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

const Receiver = () => {
  const { changeT, updatechangeT } = useAppContext();
  const navigation = useNavigation();
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

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
    const receiverId = await AsyncStorage.getItem('userId');
    if (!receiverId) {
      Alert.alert('Error', 'User ID not found. Please log in again.');
      return;
    }

    setLoading(true);
    try {
      let url = `https://${BASE_URL}/alltransactions/receiver/${receiverId}`;
      if (filter !== 'ALL') {
        url = `https://${BASE_URL}/transaction/${filter.toLowerCase()}/receiver/${receiverId}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        Alert.alert('Error', `Failed to fetch transactions. (${response.status})`);
        setTransactions([]);
        return;
      }

      const data = await response.json();
      if (!data || data.length === 0) {
        setTransactions([]);
        return;
      }

      const transactionsWithNames = await Promise.all(
        data.map(async (transaction) => ({
          ...transaction,
          senderName: await fetchUserById(transaction.sender_id) || 'Unknown Sender',
          receiverName: await fetchUserById(transaction.receiver_id) || 'Unknown Receiver',
        }))
      );

      setTransactions(transactionsWithNames);
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred while fetching transactions.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (transactionId) => {
    try {
      const response = await fetch(`https://${BASE_URL}/transaction/approve-receiver`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transaction_id: transactionId }),
      });
      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', result.message);
        fetchTransactions();
        updatechangeT();
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to approve the transaction.');
    }
  };

  const handleReject = async (transactionId) => {
    try {
      const response = await fetch(`https://${BASE_URL}/transaction/rejected-receiver`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transaction_id: transactionId }),
      });
      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', result.message);
        fetchTransactions();
        updatechangeT();
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to reject the transaction.');
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
      <Text style={styles.title}>Request Users</Text>
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
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchTransactions} />
          }
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
  header: {
    flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: '#ffffff',
        elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#288885',
    textAlign: 'center',
    marginVertical: 10,
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
  },
  backImage: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginRight: 10,
  },
  transactionCard: {
    padding: 16,
    backgroundColor: '#ffffff',
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  selectedCard: {
    borderColor: '#00796b',
    borderWidth: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  transactionId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  transactionState: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  cardContent: {
    marginBottom: 12,
  },
  transactionText: {
    fontSize: 14,
    color: '#2c3e50',
    marginBottom: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  approveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#388e3c',
  },
  rejectButton: {
    backgroundColor: '#f44336',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d32f2f',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionList: {
    paddingHorizontal: 16,
  },
});

export default Receiver;
