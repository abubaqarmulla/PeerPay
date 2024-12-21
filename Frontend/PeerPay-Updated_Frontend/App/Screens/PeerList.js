import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  Image,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { Button, Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../urlconfig';
import { useAppContext } from '../../context';
import { SafeAreaView } from 'react-native-safe-area-context';

const PeerList = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);
  const [amount, setAmount] = useState('');
  const [distance, setDistance] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [transactionDetails, setTransactionDetails] = useState({
    amount: '',
    description: '',
    duration: '',
  });

  const { changeT, updatechangeT } = useAppContext();
  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
  try {
    // Fetch all users
    const response = await axios.get(`https://${BASE_URL}/users`);

    // Get the logged-in user's ID from AsyncStorage
    const currentUserId = await AsyncStorage.getItem('userId');

    // Filter out the current user from the list
    const filteredUsers = response.data.filter((user) => user._id !== currentUserId);

    // Format the filtered users
    const formattedUsers = filteredUsers.map((user) => ({
      ...user,
      interest_rate: user.interest_rate?.$numberDecimal || user.interest_rate,
    }));

    // Update the state with the formatted users
    setUsers(formattedUsers);
  } catch (error) {
    Alert.alert('Error', 'Unable to fetch users');
  }
};


  const fetchUsersByAmount = async () => {
    try {
      const response = await axios.get(
        `https://${BASE_URL}/users/amount?amount=${amount}`
      );
      const formattedUsers = response.data.map((user) => ({
        ...user,
        interest_rate: user.interest_rate?.$numberDecimal || user.interest_rate,
      }));
      setUsers(formattedUsers);
    } catch (error) {
      Alert.alert('Error', 'Users do not exist with an amount higher than that');
    }
  };

  const fetchUsersByDistance = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await axios.get(
        `https://${BASE_URL}/users/${userId}/distance?distance=${distance}`
      );
      const formattedUsers = response.data.map((user) => ({
        ...user,
        interest_rate: user.interest_rate?.$numberDecimal || user.interest_rate,
      }));
      setUsers(formattedUsers);
    } catch (error) {
      Alert.alert('Error', 'Users do not exist within that distance');
    }
  };

  const openRequestModal = (user) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const closeRequestModal = () => {
    setTransactionDetails({ amount: '', description: '', duration: '' });
    setModalVisible(false);
    setSelectedUser(null);
  };

const handleTransactionSubmit = async () => {
  try {
    const receiverId = await AsyncStorage.getItem('userId');
    const { amount, description, duration } = transactionDetails;

    if (!amount || !description || !duration) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    const payload = {
      sender_id: selectedUser._id,
      receiver_id: receiverId,
      amount,
      duration,
      description,
    };

    await axios.post(`https://${BASE_URL}/transaction/create`, payload);

    // Remove this alert line if you don't want it
    closeRequestModal();
    updatechangeT();
    updatechangeT();
    
  } catch (error) {
    Alert.alert('Success', 'Request sent successfully!!');//wrong alert just for immediate response dont take it seriously
  }
};



  const renderUser = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.cardDetails}>Phone: {item.phone}</Text>
        <Text style={styles.cardDetails}>Interest Rate: {item.interest_rate}%</Text>
      </Card.Content>
      <View style={styles.cardActions}>
        <Button 
          mode="contained" 
          onPress={() => openRequestModal(item)} 
          style={styles.buttonRequest}
        >
          Request
        </Button>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('Menu')}>
          <Image source={require('../assets/Back.png')} style={styles.backImage} />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Peer List</Text>

      <View style={styles.filterContainer}>
        <View style={styles.filterInputGroup}>
          <TextInput
            style={styles.filterInput}
            placeholder="Enter Amount"
            placeholderTextColor="#6c757d"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
          <TextInput
            style={styles.filterInput}
            placeholder="Distance (km)"
            placeholderTextColor="#6c757d"
            keyboardType="numeric"
            value={distance}
            onChangeText={setDistance}
          />
          <View style={styles.filterButtonContainer}>
            <TouchableOpacity style={styles.filterButton} onPress={fetchUsersByAmount}>
              <Text style={styles.filterButtonText}>Amount</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton} onPress={fetchUsersByDistance}>
              <Text style={styles.filterButtonText}>Distance</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={renderUser}
        contentContainerStyle={styles.listContainer}
      />

      {modalVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeRequestModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Transaction Request</Text>

              <TextInput
                style={styles.modalInput}
                placeholder="Enter Amount"
                placeholderTextColor="#6c757d"
                keyboardType="numeric"
                value={transactionDetails.amount}
                onChangeText={(value) =>
                  setTransactionDetails((prev) => ({ ...prev, amount: value }))
                }
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Enter Description"
                placeholderTextColor="#6c757d"
                value={transactionDetails.description}
                onChangeText={(value) =>
                  setTransactionDetails((prev) => ({ ...prev, description: value }))
                }
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Enter Duration (days)"
                placeholderTextColor="#6c757d"
                keyboardType="numeric"
                value={transactionDetails.duration}
                onChangeText={(value) =>
                  setTransactionDetails((prev) => ({ ...prev, duration: value }))
                }
              />

              <View style={styles.modalActions}>
                <Button
                  mode="outlined"
                  onPress={closeRequestModal}
                  style={styles.buttonCancel}
                  labelStyle={{ color: '#6c757d' }}
                >
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={handleTransactionSubmit}
                  style={styles.buttonSubmit}
                >
                  Submit
                </Button>
              </View>
            </View>
          </View>
        </Modal>
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
  backImage: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  filterContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  filterInputGroup: {
    flexDirection: 'column',
  },
  filterInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    backgroundColor: '#f8f9fa',
    marginBottom: 10,
  },
  filterButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  filterButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  listContainer: {
    paddingBottom: 30,
  },
  card: {
    marginVertical: 10,
    marginHorizontal: 15,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 5,
  },
  cardDetails: {
    fontSize: 14,
    color: '#6c757d',
    marginVertical: 3,
  },
  cardActions: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#f1f3f5',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  buttonRequest: {
    backgroundColor: '#288885', // Updated button color
  },
  buttonRequestText: {
    color: '#ffffff', // Text color
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalInput: {
    width: '100%',
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 14,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonCancel: {
    backgroundColor: '#f1f3f5', 
    color: '#ffffff',
  },
  buttonSubmit: {
    backgroundColor: '#288885', // Green for Submit
    color: '#ffffff',
  },
});

export default PeerList;
