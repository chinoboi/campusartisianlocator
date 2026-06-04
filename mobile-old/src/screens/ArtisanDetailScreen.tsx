import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable, Linking, ScrollView } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import { Artisan, RootStackParamList } from '../types';

type ArtisanDetailRouteProp = RouteProp<RootStackParamList, 'ArtisanDetail'>;

export function ArtisanDetailScreen() {
  const route = useRoute<ArtisanDetailRouteProp>();
  const { id } = route.params;
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('artisans').select('*, categories(name, slug)').eq('id', id).maybeSingle();
      setArtisan(data as Artisan | null);
      setLoading(false);
    };

    load();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0EA5E9" />
      </View>
    );
  }

  if (!artisan) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTitle}>Artisan not found.</Text>
        <Text style={styles.errorText}>Please go back to the directory and select another profile.</Text>
      </View>
    );
  }

  const phoneUri = `tel:${artisan.phone.replace(/\s/g, '')}`;
  const smsUri = `sms:${artisan.phone.replace(/\s/g, '')}`;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.topRow}>
          <View style={styles.avatar}>{artisan.name.slice(0, 2).toUpperCase()}</View>
          <View style={styles.headerInfo}>
            <Text style={styles.categoryLabel}>{artisan.categories?.name ?? 'Artisan'}</Text>
            <Text style={styles.name}>{artisan.name}</Text>
            <Text style={styles.profession}>{artisan.profession}</Text>
            {artisan.rating ? <Text style={styles.rating}>⭐ {Number(artisan.rating).toFixed(1)}</Text> : null}
          </View>
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Workshop</Text>
            <Text style={styles.detailText}>{artisan.workshop_location}</Text>
          </View>
          {artisan.available_hours ? (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Hours</Text>
              <Text style={styles.detailText}>{artisan.available_hours}</Text>
            </View>
          ) : null}
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Phone</Text>
            <Text style={styles.detailText}>{artisan.phone}</Text>
          </View>
        </View>

        {artisan.bio ? <Text style={styles.bio}>{artisan.bio}</Text> : null}

        <View style={styles.buttonRow}>
          <Pressable style={styles.callButton} onPress={() => Linking.openURL(phoneUri)}>
            <Text style={styles.buttonText}>Call now</Text>
          </Pressable>
          <Pressable style={styles.messageButton} onPress={() => Linking.openURL(smsUri)}>
            <Text style={styles.messageButtonText}>Send SMS</Text>
          </Pressable>
        </View>
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
    padding: 20,
    backgroundColor: '#F8FAFC',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    color: '#0F172A',
  },
  errorText: {
    color: '#64748B',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 18,
  },
  headerInfo: {
    flex: 1,
  },
  categoryLabel: {
    color: '#0EA5E9',
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 6,
    fontSize: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  profession: {
    color: '#475569',
    fontSize: 16,
    marginBottom: 6,
  },
  rating: {
    color: '#0EA5E9',
    fontWeight: '700',
  },
  detailsRow: {
    marginBottom: 18,
  },
  detailItem: {
    marginBottom: 14,
  },
  detailLabel: {
    color: '#94A3B8',
    fontWeight: '700',
    marginBottom: 4,
    fontSize: 12,
  },
  detailText: {
    color: '#0F172A',
    fontSize: 16,
    lineHeight: 22,
  },
  bio: {
    marginTop: 18,
    color: '#475569',
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  callButton: {
    backgroundColor: '#0EA5E9',
    borderRadius: 18,
    paddingVertical: 14,
    flex: 1,
    alignItems: 'center',
    marginRight: 10,
  },
  messageButton: {
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 14,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
  messageButtonText: {
    color: '#0F172A',
    fontWeight: '700',
  },
});
