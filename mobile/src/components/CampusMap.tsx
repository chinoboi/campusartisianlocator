import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { colors, radius, spacing, alpha } from '../theme';

type Pin = { id: string; name?: string; latitude?: number; longitude?: number; profession?: string };

export function CampusMap({ pins, height = 360, showDemo = true }: { pins: Pin[]; height?: number; showDemo?: boolean }) {
  // Center at Topfaith University (Mkpatak, Essien Udim, Akwa Ibom, Nigeria)
  const initialRegion = {
    latitude: 5.052114,
    longitude: 7.67045,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };

  const validPins = pins.filter((p) => typeof p.latitude === 'number' && typeof p.longitude === 'number');

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.webPlaceholder, { height }]}>
        <Text style={styles.title}>Interactive map running in Web mode</Text>
        <Text style={styles.sub}>Showing {validPins.length} workshop locations on campus</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { height }]}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        mapType="hybrid"
      >
        {validPins.map((pin) => (
          <Marker
            key={pin.id}
            coordinate={{
              latitude: pin.latitude!,
              longitude: pin.longitude!,
            }}
            pinColor={colors.primary}
          >
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{pin.name || 'Artisan'}</Text>
                {pin.profession ? <Text style={styles.calloutSub}>{pin.profession}</Text> : null}
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

export default CampusMap;

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: radius.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  webPlaceholder: {
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
  callout: {
    padding: 6,
    minWidth: 120,
  },
  calloutTitle: {
    fontWeight: '700',
    color: colors.text,
    fontSize: 14,
    marginBottom: 2,
  },
  calloutSub: {
    color: colors.muted,
    fontSize: 12,
  },
});
