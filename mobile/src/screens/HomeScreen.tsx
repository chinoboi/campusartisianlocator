import { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase, isSupabaseStub } from '../lib/supabase';
import { ArtisanCard } from '../components/ArtisanCard';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { colors, spacing, typography, radius } from '../theme';
import { HomeScreenNavigationProp } from '../types';

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
          // When Supabase is stubbed, avoid chaining query helpers that
          // may not be present on the runtime client. Return empty datasets
          // so the app can render local/demo content without crashing.
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

        setCategories(categoriesData ?? []);
        setFeatured(featuredData ?? []);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error loading home data', err);
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
          <Text style={styles.featureItem}>Campus map view</Text>
          <Text style={styles.featureItem}>Tap to call</Text>
          <Text style={styles.featureItem}>Browse by trade</Text>
        </View>

        <View style={styles.ctaRow}>
          <Button title="Register as artisan" variant="outline" onPress={() => navigation.navigate('Register')} />
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
  },
  featureItem: {
    color: colors.muted,
    marginRight: spacing.sm,
    marginBottom: 6,
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
});
