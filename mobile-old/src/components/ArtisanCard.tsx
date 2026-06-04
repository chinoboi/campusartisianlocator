import { Pressable, View, Text, StyleSheet } from 'react-native';
import { Artisan } from '../types';

interface ArtisanCardProps {
  artisan: Artisan;
  onPress: () => void;
}

export function ArtisanCard({ artisan, onPress }: ArtisanCardProps) {
  const initials = artisan.name
    .split(' ')
    .map((segment) => segment[0])
    .slice(0, 2)
    .join('');

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.topRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.info}>
          <View style={styles.titleRow}>
            <Text style={styles.name}>{artisan.name}</Text>
            <Text style={[styles.status, artisan.is_available ? styles.available : styles.offline]}>
              {artisan.is_available ? 'Available' : 'Off'}
            </Text>
          </View>
          <Text style={styles.profession}>{artisan.profession}</Text>
        </View>
      </View>
      <View style={styles.metaRow}>
        <Text style={styles.metaText}>{artisan.workshop_location}</Text>
        {artisan.rating ? <Text style={styles.rating}>⭐ {Number(artisan.rating).toFixed(1)}</Text> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 18,
    marginBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    color: '#0F172A',
    fontWeight: '800',
    fontSize: 18,
  },
  info: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    marginRight: 8,
  },
  profession: {
    color: '#64748B',
    fontSize: 14,
  },
  status: {
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  available: {
    backgroundColor: '#DBEAFE',
    color: '#0EA5E9',
  },
  offline: {
    backgroundColor: '#E2E8F0',
    color: '#64748B',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaText: {
    color: '#64748B',
    fontSize: 13,
    flex: 1,
    marginRight: 8,
  },
  rating: {
    color: '#0EA5E9',
    fontWeight: '700',
    fontSize: 13,
  },
});
