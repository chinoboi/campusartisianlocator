import { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import { ArtisanCard } from '../components/ArtisanCard';
import { Artisan, RootStackParamList } from '../types';

type ArtisansRouteProp = RouteProp<RootStackParamList, 'Artisans'>;

export function ArtisansScreen() {
  const navigation = useNavigation();
  const route = useRoute<ArtisansRouteProp>();
  const { initialQuery = '', initialCategory } = route.params ?? {};

  const [search, setSearch] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState<string | undefined>(initialCategory);
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [{ data: artisanData }, { data: categoryData }] = await Promise.all([
        supabase.from('artisans').select('*, categories(slug, name)').order('rating', { ascending: false }),
        supabase.from('categories').select('*').order('name'),
      ]);

      setArtisans((artisanData ?? []) as Artisan[]);
      setCategories(categoryData ?? []);
      setLoading(false);
    };

    load();
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return artisans.filter((art) => {
      if (activeCategory && art.categories?.slug !== activeCategory) return false;
      if (!term) return true;
      return [art.name, art.profession, art.workshop_location].some((value) =>
        String(value).toLowerCase().includes(term)
      );
    });
  }, [artisans, search, activeCategory]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0EA5E9" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>All artisans</Text>

      <View style={styles.searchContainer}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search by name, profession or location…"
          style={styles.searchInput}
        />
      </View>

      <View style={styles.categoriesRow}>
        <Pressable
          style={[styles.chip, !activeCategory && styles.chipActive]}
          onPress={() => setActiveCategory(undefined)}
        >
          <Text style={[styles.chipText, !activeCategory && styles.chipTextActive]}>All</Text>
        </Pressable>
        {categories.map((category) => (
          <Pressable
            key={category.id}
            style={[styles.chip, activeCategory === category.slug && styles.chipActive]}
            onPress={() => setActiveCategory(category.slug)}
          >
            <Text style={[styles.chipText, activeCategory === category.slug && styles.chipTextActive]}>{category.name}</Text>
          </Pressable>
        ))}
      </View>

      {filtered.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyHeading}>No artisans listed yet</Text>
          <Text style={styles.emptyText}>The directory shows real, verified artisans. Are you a skilled worker on campus?</Text>
          <Pressable style={styles.primaryButton} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.primaryButtonText}>Back to home</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ArtisanCard artisan={item} onPress={() => navigation.navigate('ArtisanDetail', { id: item.id })} />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8FAFC',
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
    marginBottom: 16,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoriesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 10,
    marginBottom: 10,
  },
  chipActive: {
    backgroundColor: '#0EA5E9',
    borderColor: '#0EA5E9',
  },
  chipText: {
    color: '#0F172A',
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#fff',
  },
  emptyState: {
    marginTop: 48,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyHeading: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    color: '#0F172A',
  },
  emptyText: {
    color: '#64748B',
    lineHeight: 22,
    marginBottom: 18,
  },
  primaryButton: {
    backgroundColor: '#0EA5E9',
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  list: {
    paddingBottom: 24,
  },
});
