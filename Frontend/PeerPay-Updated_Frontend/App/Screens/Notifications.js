import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet ,Image} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { BASE_URL } from '../../urlconfig';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppContext } from '../../context';
import Icon from 'react-native-vector-icons/FontAwesome';

const Notifications = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const { changeT } = useAppContext();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const receiverId = await AsyncStorage.getItem("userId");
        if (receiverId) {
          const response = await axios.get(`http://${BASE_URL}/notifications/${receiverId}`);
          setNotifications(response.data);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, [changeT]);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={[styles.notificationItem, item.read ? styles.read : styles.unread]}>
      <View style={styles.transactionInfo}>
        <Text style={styles.message}>{item.message}</Text>
        <Text style={styles.transactionDetails}>
          {item.transaction_id?.amount} due on {new Date(item.transaction_id?.dueDate).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
     {/* Header */}
                     <View style={styles.header}>
                         <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('Menu')}>
                             <Image source={require('../assets/Back.png')} style={styles.backImage} />
                         </TouchableOpacity>
                     </View>

      {/* Notifications */}
      <View style={styles.content}>
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No notifications yet!</Text>
          </View>
        ) : (
          <FlatList
            data={notifications}
            renderItem={renderItem}
            keyExtractor={item => item._id}
          />
        )}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Profile')}>
          <Icon name="user" size={23} color="#288885" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('AadharVerify')}>
          <Icon name="folder" size={23} color="#288885" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Notifications')}>
          <Icon name="bell" size={23} color="#288885" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('PasswordCreate')}>
          <Icon name="cog" size={23} color="#288885" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Support')}>
          <Icon name="headphones" size={23} color="#288885" />
        </TouchableOpacity>
      </View>
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
   backImage: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
        marginRight: 10,
    },
  content: {
    flex: 1,
    padding: 15,
  },
  notificationItem: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 5,
  },
  unread: {
    borderLeftWidth: 5,
    borderColor: '#288885', // Highlight unread notifications
  },
  read: {
    borderLeftWidth: 5,
    borderColor: '#B0BEC5', // Subtle color for read notifications
  },
  transactionInfo: {
    flex: 1,
  },
  message: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  transactionDetails: {
    fontSize: 12,
    color: '#555',
    marginTop: 5,
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  emptyText: {
    fontSize: 20,
    color: '#555',
    textAlign: 'center',
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

export default Notifications;
