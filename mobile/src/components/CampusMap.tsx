import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, alpha } from '../theme';

type Pin = { id: string; name?: string; latitude?: number; longitude?: number };

export function CampusMap({ pins, height = 420, showDemo = true }: { pins: Pin[]; height?: number; showDemo?: boolean }) {
  const hasCoords = pins.some((p) => typeof p.latitude === 'number' && typeof p.longitude === 'number');

  return (
    <View style={[styles.placeholder, { height }]}>
      <Text style={styles.title}>Interactive campus map not available on native yet</Text>
      {hasCoords ? (
        <Text style={styles.sub}>Showing {pins.filter((p) => p.latitude && p.longitude).length} workshop locations</Text>
      ) : (
        <Text style={styles.sub}>{showDemo ? 'No workshop coordinates found — showing demo location (Mkpatak)' : 'No workshop coordinates available'}</Text>
      )}
    </View>
  );
}

export default CampusMap;

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: alpha(colors.primary, 0.08),
    borderRadius: radius.md,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: alpha(colors.primary, 0.18),
  },
  title: {
    color: colors.primary,
    fontWeight: '700',
    marginBottom: 8,
  },
  sub: {
    color: colors.muted,
  },
});
