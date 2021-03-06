import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Home from './Home/Home';
import AutomatedTransactions from './AutomatedTransactions/AutomatedTransactions';
import Stats from './Stats/Stats';
import Settings from './Settings';
import vars from '../shared/globalVars';

const Tab = createBottomTabNavigator();
export default function TabContainer({navigation}) {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Schedule') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Stats') {
            iconName = focused ? 'pie-chart' : 'pie-chart-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        showLabel: false,
        activeTintColor: vars.colors.highlight,
        inactiveTintColor: 'gray',
        style: {height: 65},
      }}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Schedule" component={AutomatedTransactions} />
      <Tab.Screen name="Stats" component={Stats} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
}
