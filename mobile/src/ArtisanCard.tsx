import { Pressable, View, Text, StyleSheet, Image, Linking } from 'react-native';
import { Artisan } from './types';
import { colors, spacing, radius, typography, alpha } from './theme';

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

  const imageSource = artisan.photo_url ? { uri: artisan.photo_url } : null;

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.topRow}>
        {imageSource ? (
          <Image source={imageSource as any} style={styles.photo} />
        ) : (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        )}

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

      <View style={styles.actionsRow}>
        {artisan.phone ? (
          <Pressable
            onPress={() => {
              try {
                Linking.openURL(`tel:${artisan.phone}`);
              } catch (e) {
                // noop
              }
            }}
            style={({ pressed }) => [styles.callButton, pressed && styles.callPressed]}
            accessibilityRole="button"
            accessibilityLabel={`Call ${artisan.name}`}
          >
            <Text style={styles.callText}>📞 Call</Text>
          </Pressable>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: alpha(colors.text, 0.06),
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 999,
    backgroundColor: alpha(colors.primary, 0.12),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    color: colors.text,
    fontWeight: '800',
    fontSize: typography.h3,
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
    fontSize: typography.body,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  profession: {
    color: colors.muted,
    fontSize: typography.small,
  },
  status: {
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  available: {
    backgroundColor: alpha(colors.primary, 0.12),
    color: colors.primary,
  },
  offline: {
    backgroundColor: colors.border,
    color: colors.muted,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaText: {
    color: colors.muted,
    fontSize: 13,
    flex: 1,
    marginRight: 8,
  },
  actionsRow: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  callButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: alpha(colors.text, 0.12),
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 14,
    elevation: 4,
  },
  callPressed: {
    opacity: 0.9,
  },
  callText: {
    color: '#fff',
    fontWeight: '700',
  },
  rating: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  photo: {
    width: 76,
    height: 76,
    borderRadius: 12,
    marginRight: spacing.md,
    backgroundColor: alpha(colors.primary, 0.06),
  },
});
