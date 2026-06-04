import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import { ArtisansScreenNavigationProp } from '../types';
import { colors } from '../theme';
import { SEED_CATEGORIES } from '../data/seedData';

export function CategoriesScreen() {
  const navigation = useNavigation<ArtisansScreenNavigationProp>();
  // eslint-disable-next-line no-console
  console.log('CategoriesScreen render');
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase.from('categories').select('*').order('name');
        setCategories(data && data.length > 0 ? data : SEED_CATEGORIES);
      } catch (err) {
        setCategories(SEED_CATEGORIES);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Browse by trade</Text>
      <Text style={styles.subtitle}>Find artisans by their profession</Text>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
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
  grid: {
    paddingBottom: 24,
  },
  categoryCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    margin: 6,
    minHeight: 120,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  categoryDescription: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
});
