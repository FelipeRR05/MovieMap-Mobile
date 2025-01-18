import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import Home from '../pages/Home';
import Favorites from '../pages/Favorites';
import Quiz from '../pages/Quiz';
import RegionalContent from '../pages/RegionalContent';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Favorites') {
            iconName = 'heart';
          } else if (route.name === 'Quiz') {
            iconName = 'help-circle';
          } else if (route.name === 'Regional') {
            iconName = 'map';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Favorites" component={Favorites} />
      <Tab.Screen name="Quiz" component={Quiz} />
      <Tab.Screen name="Regional" component={RegionalContent} />
    </Tab.Navigator>
  );
}
