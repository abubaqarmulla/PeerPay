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
        <Text style={styles.transactionId}>Transaction ID: {transaction.transaction_id}</Text>
        <Text style={styles.transactionState}>{transaction.transaction_state}</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.transactionText}>Sender: {transaction.senderName}</Text>
        <Text style={styles.transactionText}>Receiver: {transaction.receiverName}</Text>
      <Text style={styles.transactionText}>Amount: {transaction.amount.$numberDecimal}</Text>
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
  const [filter, setFilter] = useState('ALL'); // Default filter
  const [loading, setLoading] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const { changeT, updatechangeT } = useAppContext();

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
    const senderId = await AsyncStorage.getItem('userId');
    setLoading(true);
    try {
      let url = `http://${BASE_URL}/alltransactions/sender/${senderId}`;
      if (filter !== 'ALL') {
        url = `http://${BASE_URL}/transaction/${filter.toLowerCase()}/sender/${senderId}`;
      }

      const response = await fetch(url);

      // Check for 404 status and handle empty transactions
      if (response.status === 404) {
        Alert.alert('No transactions available');
        setTransactions([]); // Set transactions to an empty array if no data is found
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
      const response = await fetch(`http://${BASE_URL}/transaction/approve-sender`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
      const response = await fetch(`http://${BASE_URL}/transaction/rejected-sender`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
  const processOverdueTransactions = async () => {
    const senderId = await AsyncStorage.getItem('userId');
    
    if (!senderId) {
        Alert.alert('Error', 'Sender ID not found');
        return;
    }

    try {
        const response = await fetch(`http://${BASE_URL}/api/transaction/overdue`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ senderId }),
        });

        // Log the raw response text before parsing
        const responseText = await response.text();
        console.log('Raw Response:', responseText);

        let data;
        try {
            data = JSON.parse(responseText);
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError);
            Alert.alert('Error', 'Invalid server response');
            return;
        }

        if (response.ok) {
            Alert.alert('Success', data.message);
            fetchTransactions();
            updatechangeT(); // Refresh the transaction list
        } else if (response.status === 505) {
            Alert.alert('Defaulted Transactions', data.message);
        } else {
            Alert.alert('No overdue transactions found', data.message);
        }
    } catch (error) {
        console.error('Fetch Error:', error);
        Alert.alert('Error', error.message);
    }
};
  

  
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Transaction List as Loan Provider</Text>
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
      <TouchableOpacity
      style={styles.overdueButton}
      onPress={processOverdueTransactions}
      >
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
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 16,
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
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 2,
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
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center',
  },
  rejectButton: {
    backgroundColor: '#f44336',
    padding: 10,
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
    backgroundColor: '#FF9800',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
});

export default Send;
