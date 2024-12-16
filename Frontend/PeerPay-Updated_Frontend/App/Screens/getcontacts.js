import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, Platform } from 'react-native';
import * as Contacts from 'expo-contacts';

const getContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    requestContactsPermission();
  }, []);

  const requestContactsPermission = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === 'granted') {
      setPermissionGranted(true);
      fetchContacts();
    } else {
      console.log('Permission denied');
    }
  };

  const fetchContacts = async () => {
    try {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
      });

      if (data.length > 0) {
        setContacts(data);
      } else {
        console.log('No contacts found');
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const renderContact = ({ item }) => (
    <View style={{ padding: 10, borderBottomWidth: 1, borderColor: '#ccc' }}>
      <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.name}</Text>
      {item.phoneNumbers &&
        item.phoneNumbers.map((phone, index) => (
          <Text key={index} style={{ fontSize: 14, color: 'gray' }}>
            {phone.number}
          </Text>
        ))}
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Phone Contacts</Text>
      {permissionGranted ? (
        <FlatList
          data={contacts}
          keyExtractor={(item) => item.id}
          renderItem={renderContact}
        />
      ) : (
        <Button title="Grant Permission" onPress={requestContactsPermission} />
      )}
    </View>
  );
};

export default getContacts;
