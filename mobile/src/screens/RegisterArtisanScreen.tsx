import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { supabase, isSupabaseStub } from '../lib/supabase';
import { saveLocalArtisan } from '../lib/localStore';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { colors } from '../theme';

export function RegisterArtisanScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const submit = async () => {
    // clear previous errors
    setNameError(null);
    setPhoneError(null);
    setLocationError(null);

    if (!name.trim()) {
      setNameError('Please enter the artisan name');
      return;
    }

    // phone validation: enforce Nigerian numbers and normalize to E.164
    const phoneTrim = phone.trim();
    let normalizedPhone = '';
    if (phoneTrim) {
      const digits = phoneTrim.replace(/\D/g, '');
      const isLocal = digits.length === 11 && digits.startsWith('0');
      const isIntl234 = digits.length === 13 && digits.startsWith('234');
      if (!isLocal && !isIntl234) {
        setPhoneError('Enter a Nigerian number, e.g. 08023456789 or +2348023456789');
        return;
      }
      if (isLocal) normalizedPhone = '+234' + digits.slice(1);
      if (isIntl234) normalizedPhone = '+' + digits;
    }

    // require either address or both coords
    const lat = latitude.trim();
    const lon = longitude.trim();
    if (!address.trim() && (!lat || !lon)) {
      setLocationError('Provide an address or both latitude and longitude');
      return;
    }

    setLoading(true);

    // Build payload for local storage (used when Supabase is unavailable or insert fails)
    const localPayload: any = {
      name: name.trim(),
      category: category.trim() || null,
      phone: normalizedPhone || null,
      address: address.trim() || null,
    };
    if (lat && lon) {
      const latNum = parseFloat(lat);
      const lonNum = parseFloat(lon);
      if (!Number.isNaN(latNum) && !Number.isNaN(lonNum)) {
        localPayload.latitude = latNum;
        localPayload.longitude = lonNum;
      }
    }

    // Build payload mapped to Supabase schema
    const dbPayload: any = {
      name: name.trim(),
      profession: category.trim() || 'Unknown',
      // DB schema requires phone NOT NULL — use empty string when not provided
      phone: normalizedPhone || '',
      workshop_location: address.trim() || (lat && lon ? `${lat},${lon}` : 'Unknown'),
      is_approved: false,
      phone_verified: false,
    };
    if (lat && lon) {
      const latNum = parseFloat(lat);
      const lonNum = parseFloat(lon);
      if (!Number.isNaN(latNum) && !Number.isNaN(lonNum)) {
        dbPayload.latitude = latNum;
        dbPayload.longitude = lonNum;
        dbPayload.map_x = 50;
        dbPayload.map_y = 50;
      }
    }

    try {
      if (isSupabaseStub) {
        // Supabase keys missing — save locally so the app still works offline
        // eslint-disable-next-line no-console
        console.warn('Supabase keys missing — saving artisan locally', localPayload);
        const localId = `local-${Date.now()}`;
        const saved = await saveLocalArtisan({ id: localId, name: localPayload.name, category: localPayload.category ?? null, phone: localPayload.phone ?? null, address: localPayload.address ?? null, latitude: localPayload.latitude ?? null, longitude: localPayload.longitude ?? null });
        // eslint-disable-next-line no-console
        console.log('Saved local artisan', saved);
        Alert.alert('Saved locally', `Saved artisan ${saved.name} (id: ${saved.id})`);
        navigation.navigate('Artisans');
        return;
      }

      const { data, error } = await supabase.from('artisans').insert([dbPayload]).select().single();
      if (error) throw error;
      // eslint-disable-next-line no-console
      console.log('Registered artisan', data);
      Alert.alert('Registered', `Registered artisan ${dbPayload.name}`);
      navigation.navigate('Artisans');
    } catch (err: any) {
      // If Supabase insert fails (for example due to RLS or constraint), fall back to saving locally
      // eslint-disable-next-line no-console
      console.error('Error registering artisan via Supabase, saving locally', err);
      const supabaseMsg = err?.message || err?.error || String(err);
      const supabaseDetails = err?.details ? `\nDetails: ${err.details}` : '';
      try {
        const localId = `local-${Date.now()}`;
        const saved = await saveLocalArtisan({ id: localId, name: localPayload.name, category: localPayload.category ?? null, phone: localPayload.phone ?? null, address: localPayload.address ?? null, latitude: localPayload.latitude ?? null, longitude: localPayload.longitude ?? null });
        // eslint-disable-next-line no-console
        console.log('Saved local artisan after Supabase failure', saved);
        Alert.alert('Saved locally', `Saved artisan ${saved.name} (id: ${saved.id}). Supabase error: ${supabaseMsg}${supabaseDetails}`);
        navigation.navigate('Artisans');
      } catch (localErr) {
        // eslint-disable-next-line no-console
        console.error('Failed to save locally after Supabase error', localErr);
        Alert.alert('Error', `${supabaseMsg}${supabaseDetails}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Register Artisan</Text>

      <Input label="Name" value={name} onChangeText={(v) => { setName(v); setNameError(null); }} placeholder="Full name or business" compact />
      {nameError ? <Text style={styles.error}>{nameError}</Text> : null}

      <Input label="Category" value={category} onChangeText={setCategory} placeholder="e.g. Carpentry, Tailoring" compact />

      <Input label="Phone" value={phone} onChangeText={(v) => { setPhone(v); setPhoneError(null); }} placeholder="Phone number" keyboardType="phone-pad" compact />
      {phoneError ? <Text style={styles.error}>{phoneError}</Text> : null}

      <Input label="Address / Notes" value={address} onChangeText={(v) => { setAddress(v); setLocationError(null); }} placeholder="Location on campus" multiline compact />

      <Input label="Latitude" value={latitude} onChangeText={(v) => { setLatitude(v); setLocationError(null); }} placeholder="5.052114" keyboardType="numeric" compact />

      <Input label="Longitude" value={longitude} onChangeText={(v) => { setLongitude(v); setLocationError(null); }} placeholder="7.67045" keyboardType="numeric" compact />
      {locationError ? <Text style={styles.error}>{locationError}</Text> : null}

      <View style={styles.submitRow}>
        {loading ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <Button title="Register" onPress={submit} />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.background,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 12,
    color: colors.text,
  },
  label: {
    color: colors.text,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    color: colors.text,
  },
  submitRow: {
    marginTop: 18,
    alignItems: 'flex-start',
  },
  error: {
    color: colors.danger,
    marginTop: 6,
    marginBottom: -6,
  },
});

export default RegisterArtisanScreen;
