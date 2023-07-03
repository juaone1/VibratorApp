import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Home from "./src/screens/Home";
import Welcome from './src/screens/Welcome';
import Nav from './src/screens/Nav';
import EditPatterns from './src/screens/EditPattern';

const Stack = createNativeStackNavigator();

function App() {
  

  return (
    <NavigationContainer>
      <Stack.Navigator
      initialRouteName='Welcome'
      screenOptions={ {headerShown: false}}>
        <Stack.Screen name = "Welcome" component = {Nav}/>
        <Stack.Screen name = "Home" component = {Home}/>
        {/* <Stack.Screen name="EditPatterns" component={EditPatterns} /> */}
      </Stack.Navigator>
    </NavigationContainer>

  );
}


export default App;
