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
import { SchoolLogo } from './src/components/SchoolLogo';

const Stack = createNativeStackNavigator();

const MyTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#F8FAFC',
    card: '#FFFFFF',
    text: '#0F172A',
    border: '#E2E8F0',
    primary: '#0EA5E9'
  }
};

export default function App() {
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
                  <SchoolLogo size={28} uri={Constants.expoConfig?.extra?.SCHOOL_LOGO_URI ?? undefined} />
                  <Text style={styles.headerText}>Campus Artisan</Text>
                </View>
              ),
            }}
          />
          <Stack.Screen name="Categories" component={CategoriesScreen} options={{ title: 'Categories' }} />
          <Stack.Screen name="CampusMap" component={CampusMapScreen} options={{ title: 'Campus map' }} />
          <Stack.Screen name="Artisans" component={ArtisansScreen} options={{ title: 'Artisans' }} />
          <Stack.Screen name="ArtisanDetail" component={ArtisanDetailScreen} options={{ title: 'Artisan details' }} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#F8FAFC',
  },
  headerTitle: {
    fontSize: 18,
  },
  content: {
    backgroundColor: '#F8FAFC',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginLeft: 8,
  },
});
