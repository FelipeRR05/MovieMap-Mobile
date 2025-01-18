import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator} from 'react-native';
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import Login from '../pages/Login';
import MainTabNavigator from './MainTabNavigator';
import MovieDetails from '../pages/MovieDetails';
import PersonDetails from '../pages/PersonDetails';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { isAuthenticated, loading, login } = useAuth();

  useEffect(() => {
    const revalidateAuth = async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        login(token);
      }
    };

    revalidateAuth();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Login" component={Login} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabNavigator} />
            <Stack.Screen name="MovieDetails" component={MovieDetails} />
            <Stack.Screen name="PersonDetails" component={PersonDetails} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}