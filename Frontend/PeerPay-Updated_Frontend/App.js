// App.js
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './App/Screens/AppNavigator'; // Import your AppNavigator
import { AppProvider } from './context.js'; // Import the provider

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <View style={styles.container}>
          <AppNavigator />
        </View>
      </NavigationContainer>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
