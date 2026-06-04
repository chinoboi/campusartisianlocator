import { useEffect, useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { supabase, isSupabaseStub } from '../lib/supabase';
import { getLocalArtisans, clearLocalArtisans } from '../lib/localStore';
import { ArtisanCard } from '../components/ArtisanCard';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { colors, spacing, typography, radius } from '../theme';
import { Artisan, ArtisansScreenNavigationProp, RootStackParamList } from '../types';

type ArtisansRouteProp = RouteProp<RootStackParamList, 'Artisans'>;

export function ArtisansScreen() {
  const navigation = useNavigation<ArtisansScreenNavigationProp>();
  const route = useRoute<ArtisansRouteProp>();
  // eslint-disable-next-line no-console
  console.log('ArtisansScreen render', { params: route.params });
  const { initialQuery = '', initialCategory } = route.params ?? {};

  const [search, setSearch] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState<string | undefined>(initialCategory);
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [localArtisans, setLocalArtisans] = useState<any[]>([]);
  const [showLocalOnly, setShowLocalOnly] = useState(false);
  const [migrating, setMigrating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [{ data: artisanData }, { data: categoryData }] = await Promise.all([
        supabase.from('artisans').select('*, categories(slug, name)').order('rating', { ascending: false }),
        supabase.from('categories').select('*').order('name'),
      ]);

      let artisansList = (artisanData ?? []) as Artisan[];

      // always include locally saved artisans (merge on top) so registrations are visible
      try {
        const local = await getLocalArtisans();
        const mapped = local.map((l) => ({
          id: l.id,
          name: l.name,
          profession: l.category ?? null,
          phone: l.phone ?? null,
          workshop_location: l.address ?? null,
          latitude: l.latitude ?? null,
          longitude: l.longitude ?? null,
        } as any as Artisan));
        if (mapped.length) {
          artisansList = [...mapped, ...artisansList];
        }
        setLocalArtisans(local);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error loading local artisans', err);
      }

      setArtisans(artisansList);
      setCategories(categoryData ?? []);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error loading artisans/categories', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Load local artisans for the banner even when not stubbed
    (async () => {
      try {
        const local = await getLocalArtisans();
        setLocalArtisans(local);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error loading local artisans for banner', err);
      }
    })();
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

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
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.localBanner, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
        <View style={styles.localInfo}>
          <Text style={styles.localText}>Local saved: {localArtisans.length}</Text>
          <Text style={styles.localText}>Supabase: {isSupabaseStub ? 'disabled (stub)' : 'enabled'}</Text>
        </View>
        <View style={styles.localButtonsRow}>
          <Button title={showLocalOnly ? 'Show All' : 'Show Local'} variant="outline" onPress={() => setShowLocalOnly((s) => !s)} />
          {!isSupabaseStub && localArtisans.length > 0 ? (
            <Button title={migrating ? 'Migrating…' : 'Migrate'} variant="outline" onPress={async () => {
              const ok = confirm('Migrate local saved artisans to Supabase?');
              if (!ok) return;
              setMigrating(true);
              try {
                const payload = localArtisans.map((l) => ({
                  name: l.name,
                  profession: l.category ?? null,
                  phone: l.phone ?? null,
                  workshop_location: l.address ?? null,
                  latitude: l.latitude ?? null,
                  longitude: l.longitude ?? null,
                }));
                const { error } = await supabase.from('artisans').insert(payload);
                if (error) throw error;
                await clearLocalArtisans();
                setLocalArtisans([]);
                load();
                alert('Migration successful.');
              } catch (err) {
                console.error('Migration error', err);
                alert('Migration failed. See console for details.');
              } finally {
                setMigrating(false);
              }
            }} />
          ) : (
            <Button title="Clear local" variant="outline" onPress={async () => {
              const ok = confirm('Clear local saved artisans? This cannot be undone.');
              if (!ok) return;
              await clearLocalArtisans();
              setLocalArtisans([]);
              load();
            }} />
          )}
        </View>
      </View>
      <Text style={styles.heading}>All artisans</Text>

      <View style={styles.searchContainer}>
        <Input value={search} onChangeText={setSearch} placeholder="Search by name, profession or location…" />
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
          data={showLocalOnly ? filtered.filter((a) => String(a.id).startsWith('local-')) : filtered}
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
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  heading: {
    fontSize: typography.h1,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.md,
  },
  searchContainer: {
    marginBottom: spacing.md,
  },
  searchInput: {
    height: 50,
    backgroundColor: colors.surface,
    borderRadius: 18,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoriesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  chip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.text,
    fontWeight: '600',
  },
  chipTextActive: {
    color: colors.surface,
  },
  emptyState: {
    marginTop: spacing.lg * 2,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyHeading: {
    fontSize: typography.h3,
    fontWeight: '700',
    marginBottom: spacing.sm,
    color: colors.text,
  },
  emptyText: {
    color: colors.muted,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: colors.surface,
    fontWeight: '700',
  },
  list: {
    paddingBottom: spacing.lg,
  },
  localBanner: {
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  localText: {
    color: colors.text,
    fontWeight: '700',
  },
  localInfo: {
    flexDirection: 'column',
  },
  localButtonsRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    alignItems: 'center',
  },
  smallButtonText: {
    color: colors.text,
    fontWeight: '700',
  },
});
