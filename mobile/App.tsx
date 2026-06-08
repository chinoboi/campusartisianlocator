import 'react-native-url-polyfill/auto';
import Constants from 'expo-constants';
import { useMemo } from 'react';
import { NavigationContainer, DefaultTheme, Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet } from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import { CategoriesScreen } from './src/screens/CategoriesScreen';
import { CampusMapScreen } from './src/screens/CampusMapScreen';
import { ArtisansScreen } from './src/screens/ArtisansScreen';
import { ArtisanDetailScreen } from './src/screens/ArtisanDetailScreen';
import { RegisterArtisanScreen } from './src/screens/RegisterArtisanScreen';
import { RegisterSuccessScreen } from './src/screens/RegisterSuccessScreen';
import { SchoolLogo } from './src/components/SchoolLogo';
import { AdminScreen } from './src/screens/AdminScreen';
import { colors } from './src/theme';

const Stack = createNativeStackNavigator();

const MyTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
    primary: colors.primary,
  }
};

export default function App() {
  // eslint-disable-next-line no-console
  console.log('App render — NavigationContainer loading');
  const screenOptions = useMemo(
    () => ({
      headerStyle: styles.header,
      headerTitleStyle: styles.headerTitle,
      headerShadowVisible: false,
      contentStyle: styles.content,
    }),
    []
  );

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={MyTheme}>
        <Stack.Navigator screenOptions={screenOptions}>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: 'Campus Artisan Locator',
              headerTitle: () => (
                <View style={styles.headerTitleContainer}>
                  <SchoolLogo source={require('./assets/logo.png')} />
                  <Text style={styles.headerText}>Campus Artisan</Text>
                </View>
              ),
            }}
          />
          <Stack.Screen name="Categories" component={CategoriesScreen} options={{ title: 'Categories' }} />
          <Stack.Screen name="CampusMap" component={CampusMapScreen} options={{ title: 'Campus map' }} />
          <Stack.Screen name="Artisans" component={ArtisansScreen} options={{ title: 'Artisans' }} />
          <Stack.Screen name="ArtisanDetail" component={ArtisanDetailScreen} options={{ title: 'Artisan details' }} />
          <Stack.Screen name="Register" component={RegisterArtisanScreen} options={{ title: 'Register artisan' }} />
          <Stack.Screen name="RegisterSuccess" component={RegisterSuccessScreen} options={{ title: 'Registration complete' }} />
          <Stack.Screen name="Admin" component={AdminScreen} options={{ title: 'Admin Panel' }} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.background,
  },
  headerTitle: {
    fontSize: 18,
  },
  content: {
    backgroundColor: colors.background,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 8,
  },
});
