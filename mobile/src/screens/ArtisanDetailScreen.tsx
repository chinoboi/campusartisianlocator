import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable, Linking, ScrollView } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { getLocalArtisans } from '../lib/localStore';
import Card from '../components/ui/Card';
import ReviewForm from '../components/ui/ReviewForm';
import { colors } from '../theme';
import { Artisan, RootStackParamList, Review } from '../types';
import { getLocalReviews, saveLocalReview } from '../lib/localStore';
import { supabase, isSupabaseStub } from '../lib/supabase';
import { SEED_ARTISANS } from '../data/seedData';

type ArtisanDetailRouteProp = RouteProp<RootStackParamList, 'ArtisanDetail'>;

export function ArtisanDetailScreen() {
  const route = useRoute<ArtisanDetailRouteProp>();
  // eslint-disable-next-line no-console
  console.log('ArtisanDetailScreen render', { params: route.params });
  const { id } = route.params;
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        if (String(id).startsWith('local-')) {
          const local = await getLocalArtisans();
          const found = local.find((l) => l.id === id) as any;
          setArtisan(
            found
              ? ({ id: found.id, name: found.name, profession: found.category ?? null, phone: found.phone ?? '', workshop_location: found.address ?? '', latitude: found.latitude ?? null, longitude: found.longitude ?? null } as Artisan)
              : null
          );
          setLoading(false);
          return;
        }

        let art = null;
        try {
          const res = await supabase.from('artisans').select('*, categories(name, slug)').eq('id', id).maybeSingle();
          art = res.data;
        } catch (e) {
          console.warn('Supabase fetch failed, looking in seed data', e);
        }

        if (!art) {
          const seedFound = SEED_ARTISANS.find((s) => s.id === id);
          if (seedFound) {
            art = seedFound;
          }
        }
        setArtisan(art as Artisan | null);
        // load reviews from server when available
        try {
          const reviewsRes = isSupabaseStub
            ? { data: [] }
            : await supabase.from('reviews').select('*').eq('artisan_id', id).order('created_at', { ascending: false }).limit(50);
          setReviews((reviewsRes as any).data ?? []);
        } catch (e) {
          // ignore server review errors
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error loading artisan detail', err);
        setArtisan(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
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

  const loadLocalReviews = async () => {
    try {
      const local = await getLocalReviews(id);
      setReviews(local as Review[]);
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    loadLocalReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card>
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
          <Pressable style={[styles.callButton, { backgroundColor: colors.primary }]} onPress={() => Linking.openURL(phoneUri)}>
            <Text style={styles.buttonText}>Call now</Text>
          </Pressable>
          <Pressable style={styles.messageButton} onPress={() => Linking.openURL(smsUri)}>
            <Text style={styles.messageButtonText}>Send SMS</Text>
          </Pressable>
        </View>
        <View style={{ marginTop: 18 }}>
          <ReviewForm
            submitting={submittingReview}
            onSubmit={async ({ rating, text, author }) => {
              if (!artisan) return;
              setSubmittingReview(true);
              const payload = { artisan_id: artisan.id, rating, text: text || null, author: author || null } as any;

              // Try saving to Supabase first, fall back to local store
              try {
                if (!isSupabaseStub) {
                  const res = await supabase.from('reviews').insert([payload]);
                  if ((res as any).error) throw (res as any).error;
                  // re-fetch reviews from server
                  const list = await supabase.from('reviews').select('*').eq('artisan_id', artisan.id).order('created_at', { ascending: false }).limit(50);
                  setReviews((list as any).data ?? []);
                } else {
                  throw new Error('Supabase stub');
                }
              } catch (err) {
                // fallback: save locally
                try {
                  const saved = await saveLocalReview(payload);
                  setReviews((r) => [saved as Review, ...r]);
                } catch (e) {
                  // eslint-disable-next-line no-console
                  console.error('Failed to save review', e);
                }
              } finally {
                setSubmittingReview(false);
              }
            }}
          />

          {/* Reviews list */}
          <View style={{ marginTop: 18 }}>
            <Text style={{ fontWeight: '700', marginBottom: 8 }}>Reviews</Text>
            {reviews.length === 0 ? (
              <Text style={{ color: colors.muted }}>No reviews yet — be the first to leave feedback.</Text>
            ) : (
              reviews.map((rev) => (
                <View key={rev.id} style={{ marginBottom: 12 }}>
                  <Text style={{ fontWeight: '700' }}>{rev.author ?? 'A student'} <Text style={{ fontWeight: '700', color: colors.primary }}>· {rev.rating}★</Text></Text>
                  {rev.text ? <Text style={{ color: colors.muted }}>{rev.text}</Text> : null}
                  <Text style={{ color: colors.muted, fontSize: 12 }}>{rev.created_at ? new Date(rev.created_at).toLocaleString() : ''}</Text>
                </View>
              ))
            )}
          </View>
        </View>
      </Card>
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
    padding: 20,
    backgroundColor: colors.background,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    color: colors.text,
  },
  errorText: {
    color: colors.muted,
    textAlign: 'center',
  },
  card: {
    // Card styling now provided by shared `Card` component
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
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 18,
  },
  headerInfo: {
    flex: 1,
  },
  categoryLabel: {
    color: colors.primary,
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 6,
    fontSize: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  profession: {
    color: colors.muted,
    fontSize: 16,
    marginBottom: 6,
  },
  rating: {
    color: colors.primary,
    fontWeight: '700',
  },
  detailsRow: {
    marginBottom: 18,
  },
  detailItem: {
    marginBottom: 14,
  },
  detailLabel: {
    color: colors.muted,
    fontWeight: '700',
    marginBottom: 4,
    fontSize: 12,
  },
  detailText: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 22,
  },
  bio: {
    marginTop: 18,
    color: colors.muted,
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  callButton: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingVertical: 14,
    flex: 1,
    alignItems: 'center',
    marginRight: 10,
  },
  messageButton: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 14,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.surface,
    fontWeight: '700',
  },
  messageButtonText: {
    color: colors.text,
    fontWeight: '700',
  },
});
