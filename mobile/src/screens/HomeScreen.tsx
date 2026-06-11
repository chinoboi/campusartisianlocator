import { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, ScrollView, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { supabase, isSupabaseStub } from '../lib/supabase';
import { ArtisanCard } from '../components/ArtisanCard';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { colors, spacing, typography, radius } from '../theme';
import { HomeScreenNavigationProp } from '../types';
import { SEED_CATEGORIES, SEED_ARTISANS } from '../data/seedData';

export function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  // eslint-disable-next-line no-console
  console.log('HomeScreen render');
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [featured, setFeatured] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        if (isSupabaseStub) {
          // eslint-disable-next-line no-console
          console.warn('Supabase stub active: skipping server queries');
        }

        const categoriesPromise = isSupabaseStub
          ? Promise.resolve({ data: [], error: null })
          : supabase.from('categories').select('*').order('name');

        const featuredPromise = isSupabaseStub
          ? Promise.resolve({ data: [], error: null })
          : supabase.from('artisans').select('*').order('rating', { ascending: false }).limit(4);

        const [{ data: categoriesData }, { data: featuredData }] = await Promise.all([
          categoriesPromise,
          featuredPromise,
        ]);

        setCategories(categoriesData && categoriesData.length > 0 ? categoriesData : SEED_CATEGORIES);
        setFeatured(featuredData && featuredData.length > 0 ? featuredData : SEED_ARTISANS.slice(0, 4));
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error loading home data', err);
        setCategories(SEED_CATEGORIES);
        setFeatured(SEED_ARTISANS.slice(0, 4));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return featured;
    return featured.filter((artisan) => {
      return [artisan.name, artisan.profession, artisan.workshop_location]
        .some((value) => String(value).toLowerCase().includes(term));
    });
  }, [search, featured]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.smallLabel}>Find help on campus</Text>
        <Text style={styles.title}>Every skilled hand on campus, one search away.</Text>
        <Text style={styles.subtitle}>
          From a dripping tap in the hostel to a torn shoe before lectures — locate the right artisan, see where their workshop is, and call them in seconds.
        </Text>

        <View style={styles.searchRow}>
          <Input value={search} onChangeText={setSearch} placeholder="Search by name, profession or location…" />
          <Button title="Find" onPress={() => navigation.navigate('Artisans', { initialQuery: search })} />
        </View>

        <View style={styles.featuresRow}>
          <Pressable style={styles.featureLink} onPress={() => navigation.navigate('CampusMap')}>
            <Feather name="map-pin" size={16} color={colors.primary} style={styles.featureIcon} />
            <Text style={styles.featureLinkText}>Campus map view</Text>
          </Pressable>
          <Pressable style={styles.featureLink} onPress={() => navigation.navigate('Artisans')}>
            <Feather name="phone" size={16} color={colors.primary} style={styles.featureIcon} />
            <Text style={styles.featureLinkText}>Tap to call</Text>
          </Pressable>
          <Pressable style={styles.featureLink} onPress={() => navigation.navigate('Categories')}>
            <Feather name="search" size={16} color={colors.primary} style={styles.featureIcon} />
            <Text style={styles.featureLinkText}>Browse by trade</Text>
          </Pressable>
        </View>

        <View style={styles.ctaRow}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Button title="Register as artisan" variant="outline" onPress={() => navigation.navigate('Register')} />
          </View>
          <View style={{ flex: 1 }}>
            <Button title="Admin Panel" variant="outline" onPress={() => navigation.navigate('Admin')} />
          </View>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionLabel}>Browse by trade</Text>
          <Text style={styles.sectionTitle}>Categories</Text>
        </View>
        <Pressable onPress={() => navigation.navigate('Categories')}>
          <Text style={styles.linkText}>View all</Text>
        </Pressable>
      </View>

      <FlatList
        data={categories}
        horizontal
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryList}
        renderItem={({ item }) => (
          <Card style={styles.categoryCard as any}>
            <View>
              <Text style={styles.categoryName}>{item.name}</Text>
              <Text style={styles.categoryDescription} numberOfLines={2}>{item.description}</Text>
            </View>
          </Card>
        )}
      />

      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionLabel}>Top rated</Text>
          <Text style={styles.sectionTitle}>Trusted artisans</Text>
        </View>
        <Pressable onPress={() => navigation.navigate('Artisans')}>
          <Text style={styles.linkText}>See all</Text>
        </Pressable>
      </View>

      {filtered.length === 0 ? (
        <Card style={styles.emptyCard as any}>
          <Text style={styles.emptyTitle}>No verified artisans yet.</Text>
          <Text style={styles.emptyText}>Are you one? Register as an artisan to be listed.</Text>
          <Button title="Open campus map" onPress={() => navigation.navigate('CampusMap')} />
        </Card>
      ) : (
        <View style={styles.artisanGrid}>
          {filtered.map((artisan) => (
            <ArtisanCard
              key={artisan.id}
              artisan={artisan}
              onPress={() => navigation.navigate('ArtisanDetail', { id: artisan.id })}
            />
          ))}
        </View>
      )}

      {/* Map CTA Card */}
      <View style={styles.mapCtaCard}>
        <Text style={styles.mapCtaTitle}>See every workshop on the campus map.</Text>
        <Text style={styles.mapCtaText}>A clear, interactive map shows you exactly where each artisan is located.</Text>
        <Pressable style={styles.mapCtaButton} onPress={() => navigation.navigate('CampusMap')}>
          <Text style={styles.mapCtaButtonText}>Open campus map →</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    paddingBottom: spacing.lg * 2,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  hero: {
    marginBottom: 24,
  },
  smallLabel: {
    textTransform: 'uppercase',
    color: colors.primary,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 10,
  },
  title: {
    fontSize: typography.h1,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
  },
  subtitle: {
    color: colors.muted,
    fontSize: typography.body,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: spacing.md,
  },
  searchInput: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 18,
    paddingHorizontal: spacing.md,
    height: 50,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  featuresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.md,
    gap: 16,
  },
  featureLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginVertical: 4,
  },
  featureIcon: {
    marginRight: 6,
  },
  featureLinkText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 24,
    marginBottom: 12,
  },
  sectionLabel: {
    textTransform: 'uppercase',
    color: colors.primary,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: typography.h2,
    fontWeight: '800',
    color: colors.text,
  },
  linkText: {
    color: colors.primary,
    fontWeight: '700',
  },
  categoryList: {
    paddingBottom: 8,
  },
  categoryCard: {
    width: 200,
    borderRadius: radius.md,
    marginRight: spacing.sm,
  },
  categoryName: {
    fontSize: typography.body,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  categoryDescription: {
    color: colors.muted,
    fontSize: typography.small,
    lineHeight: 18,
  },
  emptyCard: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: typography.h3,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.muted,
    marginBottom: spacing.lg,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  ctaRow: {
    flexDirection: 'row',
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  secondaryButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    alignSelf: 'flex-start',
  },
  secondaryButtonText: {
    color: colors.primary,
    fontWeight: '700',
  },
  artisanGrid: {
    paddingBottom: 8,
  },
  mapCtaCard: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: 28,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapCtaTitle: {
    color: '#FFFFFF',
    fontSize: typography.h2,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  mapCtaText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: typography.body,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  mapCtaButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
  },
  mapCtaButtonText: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: typography.body,
  },
});
