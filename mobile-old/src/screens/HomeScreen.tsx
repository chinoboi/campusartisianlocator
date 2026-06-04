import { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, FlatList, ActivityIndicator, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import { ArtisanCard } from '../components/ArtisanCard';
import { HomeScreenNavigationProp } from '../types';

export function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [featured, setFeatured] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [{ data: categoriesData }, { data: featuredData }] = await Promise.all([
        supabase.from('categories').select('*').order('name'),
        supabase.from('artisans').select('*').order('rating', { ascending: false }).limit(4),
      ]);

      setCategories(categoriesData ?? []);
      setFeatured(featuredData ?? []);
      setLoading(false);
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
        <ActivityIndicator size="large" color="#0EA5E9" />
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
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search by name, profession or location…"
            style={styles.searchInput}
          />
          <Pressable style={styles.searchButton} onPress={() => navigation.navigate('Artisans', { initialQuery: search })}>
            <Text style={styles.searchButtonText}>Find</Text>
          </Pressable>
        </View>

        <View style={styles.featuresRow}>
          <Text style={styles.featureItem}>Campus map view</Text>
          <Text style={styles.featureItem}>Tap to call</Text>
          <Text style={styles.featureItem}>Browse by trade</Text>
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
          <Pressable
            style={styles.categoryCard}
            onPress={() => navigation.navigate('Artisans', { initialCategory: item.slug })}
          >
            <Text style={styles.categoryName}>{item.name}</Text>
            <Text style={styles.categoryDescription} numberOfLines={2}>{item.description}</Text>
          </Pressable>
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
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No verified artisans yet.</Text>
          <Text style={styles.emptyText}>Are you one? Register as an artisan to be listed.</Text>
          <Pressable style={styles.primaryButton} onPress={() => navigation.navigate('CampusMap')}>
            <Text style={styles.primaryButtonText}>Open campus map</Text>
          </Pressable>
        </View>
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
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#F8FAFC',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  hero: {
    marginBottom: 24,
  },
  smallLabel: {
    textTransform: 'uppercase',
    color: '#0EA5E9',
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  subtitle: {
    color: '#475569',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  searchRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingHorizontal: 16,
    height: 50,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: '#0EA5E9',
    borderRadius: 18,
    paddingHorizontal: 18,
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
    color: '#64748B',
    marginRight: 10,
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
    color: '#0EA5E9',
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  linkText: {
    color: '#0EA5E9',
    fontWeight: '700',
  },
  categoryList: {
    paddingBottom: 8,
  },
  categoryCard: {
    width: 200,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  categoryDescription: {
    color: '#64748B',
    fontSize: 13,
    lineHeight: 18,
  },
  emptyCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#64748B',
    marginBottom: 18,
  },
  primaryButton: {
    backgroundColor: '#0EA5E9',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  artisanGrid: {
    paddingBottom: 8,
  },
});
