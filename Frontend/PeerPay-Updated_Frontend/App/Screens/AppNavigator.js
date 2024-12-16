// App/Screens/AppNavigator.js

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from './WelcomeScreen';
import LoginPage from './LoginPage';
import SignUp from './SignUp';
import Menu from './Menu'; // Correcting to use Menu.js instead of Home
import PeerList from './PeerList'; 
import Send from './Send'; 
import Notifications from './Notifications'; 
import Support from './Support'; 
import AboutUs from './AboutUs'; 

import PanVerify from './PanVerify'; 
import PasswordCreate from './PasswordCreate';
import Receiver from './Receiver'; // Path to your Receiver screen
import Profile from './Profile'; // Path to your Profile screen
import AadhaarVerify from './AadharVerify';
import getContacts from './getcontacts';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Welcome">
      {/* Properly defined each Screen */}
      <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginPage} options={{ headerShown: false }} />
      <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
      <Stack.Screen name="Menu" component={Menu} options={{ headerShown: false }} /> 
      <Stack.Screen name="PeerList" component={PeerList} options={{ headerShown: false }} /> 
      <Stack.Screen name="Notifications" component={Notifications} options={{ headerShown: false }} /> 
      <Stack.Screen name="Send" component={Send} options={{ headerShown: false }} />
      <Stack.Screen name="Receiver" component={Receiver} options={{ headerShown: false }} />
      <Stack.Screen name="Support" component={Support} options={{ headerShown: false }} />
      <Stack.Screen name="AboutUs" component={AboutUs} options={{ headerShown: false }} />
      <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
      <Stack.Screen name="AadharVerify" component={AadhaarVerify} options={{ headerShown: false }} />
      <Stack.Screen name="PanVerify" component={PanVerify} options={{ headerShown: false }} />
      <Stack.Screen name="PasswordCreate" component={PasswordCreate} options={{ headerShown: false }} />
     
    </Stack.Navigator>
  );
}

export default AppNavigator;
