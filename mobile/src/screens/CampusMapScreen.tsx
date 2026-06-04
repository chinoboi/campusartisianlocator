import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Pressable, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase, isSupabaseStub } from '../lib/supabase';
import { ArtisanCard } from '../components/ArtisanCard';
import CampusMap from '../components/CampusMap';
import { colors } from '../theme';
import { Artisan, ArtisansScreenNavigationProp } from '../types';

export function CampusMapScreen() {
  const navigation = useNavigation<ArtisansScreenNavigationProp>();
  // eslint-disable-next-line no-console
  console.log('CampusMapScreen render');
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDemo, setShowDemo] = useState(true);
  const [supabaseAvailable] = useState(!isSupabaseStub);
  const [supabaseWarningShown, setSupabaseWarningShown] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase.from('artisans').select('*').order('rating', { ascending: false });
        const mapped = (data ?? []).map((a: any) => {
          let lat = a.latitude;
          let lon = a.longitude;
          if (lat === null || lat === undefined || lon === null || lon === undefined) {
            const mapX = a.map_x ?? 50;
            const mapY = a.map_y ?? 50;
            lat = 5.052114 + (mapX - 50) * 0.0001;
            lon = 7.67045 + (mapY - 50) * 0.0001;
          }
          return {
            ...a,
            latitude: lat,
            longitude: lon,
          };
        }) as Artisan[];
        setArtisans(mapped);
      } catch (err) {
        console.error('Error loading artisans', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    if (showDemo) return;

    const loadReal = async () => {
      if (isSupabaseStub) {
        // nothing to fetch — warn once
        if (!supabaseWarningShown) {
          // eslint-disable-next-line no-console
          console.warn('Supabase keys missing — cannot load real artisan coordinates.');
          setSupabaseWarningShown(true);
        }
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const { data } = await supabase.from('artisans').select('*').order('rating', { ascending: false });
        const mapped = (data ?? []).map((a: any) => {
          let lat = a.latitude;
          let lon = a.longitude;
          if (lat === null || lat === undefined || lon === null || lon === undefined) {
            const mapX = a.map_x ?? 50;
            const mapY = a.map_y ?? 50;
            lat = 5.052114 + (mapX - 50) * 0.0001;
            lon = 7.67045 + (mapY - 50) * 0.0001;
          }
          return {
            ...a,
            latitude: lat,
            longitude: lon,
          };
        }) as Artisan[];
        setArtisans(mapped);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error loading artisans from Supabase', err);
      } finally {
        setLoading(false);
      }
    };

    loadReal();
  }, [showDemo]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Campus map</Text>
      <Text style={styles.subtitle}>Find workshops across the campus</Text>

      <View style={styles.mapControlsRow}>
        <Text style={styles.controlLabel}>Use demo pins</Text>
        <Switch value={showDemo} onValueChange={setShowDemo} />
      </View>

      {!supabaseAvailable && !showDemo ? (
        <Text style={{ color: colors.danger, marginBottom: 12 }}>Real data unavailable — set SUPABASE_URL and SUPABASE_ANON_KEY in app.json.extra or env</Text>
      ) : null}

      <CampusMap
        pins={artisans.map((a) => ({ id: a.id, name: a.name, latitude: (a as any).latitude, longitude: (a as any).longitude }))}
        height={360}
        showDemo={showDemo}
      />

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
    backgroundColor: colors.background,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 16,
    marginBottom: 24,
  },
  mapPlaceholder: {
    backgroundColor: colors.primary + '20',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  mapText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
  },
  mapSubtext: {
    color: colors.muted,
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  artisanList: {
    gap: 16,
  },
  mapControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 12,
  },
  controlLabel: {
    marginRight: 8,
    color: colors.text,
    fontWeight: '600',
  },
});
