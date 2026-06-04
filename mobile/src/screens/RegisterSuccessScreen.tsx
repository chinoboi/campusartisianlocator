import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { colors } from '../theme';

type RouteParams = {
  RegisterSuccess: { name: string; id?: string | null };
};

export function RegisterSuccessScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RouteParams, 'RegisterSuccess'>>();
  const { name, id } = route.params ?? { name: 'Artisan', id: null };

  return (
      <View style={styles.container}>
      <Text style={styles.heading}>Registration complete</Text>
      <Text style={styles.message}>{name} has been registered successfully.</Text>

      <View style={styles.buttons}>
        <View style={styles.buttonWrap}>
          <Button title="View all artisans" color={colors.primary} onPress={() => navigation.navigate('Artisans')} />
        </View>
        {id ? (
          <View style={styles.buttonWrap}>
            <Button title="View listing" onPress={() => navigation.navigate('ArtisanDetail', { id })} />
          </View>
        ) : null}
        <View style={styles.buttonWrap}>
          <Button title="Back to home" onPress={() => navigation.navigate('Home')} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttons: {
    gap: 10,
  },
  buttonWrap: {
    marginVertical: 6,
  },
});

export default RegisterSuccessScreen;
