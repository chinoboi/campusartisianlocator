import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import { ArtisanCard } from '../components/ArtisanCard';
import { Artisan, ArtisansScreenNavigationProp } from '../types';

export function CampusMapScreen() {
  const navigation = useNavigation<ArtisansScreenNavigationProp>();
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('artisans').select('*').order('rating', { ascending: false });
      setArtisans((data ?? []) as Artisan[]);
      setLoading(false);
    };

    load();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0EA5E9" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Campus map</Text>
      <Text style={styles.subtitle}>Find workshops across the campus</Text>

      {/* Placeholder for map - in a real app, you'd use react-native-maps */}
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapText}>Interactive campus map would go here</Text>
        <Text style={styles.mapSubtext}>Showing {artisans.length} workshop locations</Text>
      </View>

      <Text style={styles.sectionTitle}>All workshops</Text>
      <View style={styles.artisanList}>
        {artisans.map((artisan) => (
          <ArtisanCard
            key={artisan.id}
            artisan={artisan}
            onPress={() => navigation.navigate('ArtisanDetail', { id: artisan.id })}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F8FAFC',
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  subtitle: {
    color: '#64748B',
    fontSize: 16,
    marginBottom: 24,
  },
  mapPlaceholder: {
    backgroundColor: '#E0F2FE',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#0EA5E9',
    borderStyle: 'dashed',
  },
  mapText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0EA5E9',
    marginBottom: 8,
  },
  mapSubtext: {
    color: '#64748B',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
  },
  artisanList: {
    gap: 16,
  },
});
