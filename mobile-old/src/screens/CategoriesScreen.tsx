import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import { ArtisansScreenNavigationProp } from '../types';

export function CategoriesScreen() {
  const navigation = useNavigation<ArtisansScreenNavigationProp>();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('categories').select('*').order('name');
      setCategories(data ?? []);
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
    marginBottom: 8,
  },
  subtitle: {
    color: '#64748B',
    fontSize: 16,
    marginBottom: 24,
  },
  grid: {
    paddingBottom: 24,
  },
  categoryCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 20,
    margin: 6,
    minHeight: 120,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  categoryDescription: {
    color: '#64748B',
    fontSize: 14,
    lineHeight: 20,
  },
});
