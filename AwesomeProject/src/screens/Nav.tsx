import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRoute } from '@react-navigation/native';
import Home from './Home';
import Patterns from './Patterns';
import Welcome from './Welcome';

const Tab = createBottomTabNavigator();

function Nav() {
  const route = useRoute();

  return (
    <Tab.Navigator
      initialRouteName='Welcome'
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 60,
          position: 'absolute',
          bottom: 32,
          right: 16,
          left: 16,
          borderRadius: 15,
          elevation: 5,
          backgroundColor: '#FF6666',
          paddingBottom: 10, 
          paddingTop: 10
        },
        tabBarItemStyle: {
          justifyContent: 'center',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },

      }}>
      <Tab.Screen
        name='Home'
        component={Home}
        options={{
          tabBarIcon: ({ color, size= 20, focused }) => (
            <MaterialCommunityIcons
              name="home"
              color={focused ? 'white' : '#FCAEAE'}
              size={size}
            />
          ),
          tabBarLabel: 'Home',
          tabBarLabelStyle: {
            color: 'white',
          },
        }}
      />
      <Tab.Screen
        name='Patterns'
        component={Patterns}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name="grid"
              color={focused ? 'white' : '#FCAEAE'}
              size={size}
            />
          ),
          tabBarLabel: 'Patterns',
          tabBarLabelStyle: {
            color: 'white',
          },
        }}
      />
    </Tab.Navigator>
  );
}

export default Nav;
