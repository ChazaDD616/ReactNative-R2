import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Button, View, Text } from 'react-native';
import ProfileScreen from './src/components/ProfileScreen';
import DocumentScanner from './src/components/DocumentScanner';
import * as AuthSession from 'expo-auth-session';

const Stack = createStackNavigator();
const GOOGLE_CLIENT_ID = '73918348659p13qr52stu62vwx.apps.googleusercontent.com';

const HomeScreen = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState(null);
  
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: GOOGLE_CLIENT_ID,
      scopes: ['profile', 'email'],
      redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    },
    { authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth' }
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      fetchUserInfo(authentication.accessToken);
    }
  }, [response]);

  const fetchUserInfo = async (token) => {
    try {
      const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await res.json();
      setUserInfo(userData);
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  return (
    <View style={styles.container}>
      {userInfo ? (
        <>
          <Text>Welcome, {userInfo.name}</Text>
          <Text>Email: {userInfo.email}</Text>
          <Button title="Go to Profile" onPress={() => navigation.navigate('Profile')} />
        </>
      ) : (
        <Button disabled={!request} title="Login with Google" onPress={promptAsync} />
      )}
    </View>
  );
};

const App = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="DocumentScanner" component={DocumentScanner} />
    </Stack.Navigator>
  </NavigationContainer>
);

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default App;
