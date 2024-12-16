import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from "../../urlconfig";
import { useAppContext } from '../../context';

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

  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, [filter, changeT]);

  const fetchUserById = async (userId) => {
    try {
      const response = await fetch(`http://${BASE_URL}/user/${userId}`);
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
      let url = `http://${BASE_URL}/alltransactions/receiver/${receiverId}`;
      if (filter !== 'ALL') {
        url = `http://${BASE_URL}/transaction/${filter.toLowerCase()}/receiver/${receiverId}`;
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
      const response = await fetch(`http://${BASE_URL}/transaction/approve-receiver`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transaction_id: transactionId }),
      });
      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', result.message);
        fetchTransactions();
        updatechangeT()
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to approve the transaction.');
    }
  };

  const handleReject = async (transactionId) => {
    try {
      const response = await fetch(`http://${BASE_URL}/transaction/rejected-receiver`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transaction_id: transactionId }),
      });
      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', result.message);
        fetchTransactions();
        updatechangeT()
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to reject the transaction.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Transaction List as Loan Receiver</Text>
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
          contentContainerStyle={styles.transactionList}
        />
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  picker: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  transactionCard: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    fontSize: 16,
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
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  rejectButton: {
    backgroundColor: '#F44336',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Receiver;