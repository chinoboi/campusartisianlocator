import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Alert,
  ActivityIndicator,
  Pressable,
  Modal,
  Platform,
} from 'react-native';
import { supabase, isSupabaseStub } from '../lib/supabase';
import { colors, spacing, radius, typography } from '../theme';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Feather } from '@expo/vector-icons';
import { SEED_ARTISANS, SEED_CATEGORIES } from '../data/seedData';

const emptyForm = {
  id: '',
  name: '',
  profession: '',
  phone: '',
  workshop_location: '',
  available_hours: '',
  bio: '',
  category_id: '',
  latitude: '',
  longitude: '',
  is_available: true,
  is_approved: true,
  phone_verified: false,
};

export function AdminScreen() {
  const [artisans, setArtisans] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      let arts = [];
      let cats = [];

      try {
        const res = await supabase.from('categories').select('*').order('name');
        cats = res.data ?? [];
      } catch (e) {
        cats = SEED_CATEGORIES;
      }
      setCategories(cats);

      try {
        const res = await supabase.from('artisans').select('*, categories(name)').order('created_at', { ascending: false });
        arts = res.data ?? [];
      } catch (e) {
        arts = SEED_ARTISANS;
      }

      // Sort: unapproved (pending) first, then by rating
      arts.sort((x: any, y: any) => {
        if (x.is_approved === y.is_approved) {
          return (y.rating || 0) - (x.rating || 0);
        }
        return x.is_approved ? 1 : -1;
      });

      setArtisans(arts);
    } catch (err) {
      console.error('Error loading admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!editing) return;
    if (!editing.name.trim()) {
      Alert.alert('Error', 'Please enter a name');
      return;
    }

    const payload: any = {
      name: editing.name.trim(),
      profession: editing.profession.trim() || 'Unknown',
      phone: editing.phone.trim(),
      workshop_location: editing.workshop_location.trim(),
      available_hours: editing.available_hours.trim() || null,
      bio: editing.bio.trim() || null,
      is_available: editing.is_available,
      is_approved: editing.is_approved,
      phone_verified: editing.phone_verified,
    };

    if (editing.latitude && editing.longitude) {
      payload.latitude = parseFloat(editing.latitude);
      payload.longitude = parseFloat(editing.longitude);
      payload.map_x = 50;
      payload.map_y = 50;
    }

    try {
      if (editing.id) {
        // Update
        const { error } = await supabase.from('artisans').update(payload).eq('id', editing.id);
        if (error) throw error;
        Alert.alert('Success', 'Artisan updated successfully');
      } else {
        // Create new
        const { error } = await supabase.from('artisans').insert([payload]);
        if (error) throw error;
        Alert.alert('Success', 'Artisan created successfully');
      }
      setEditing(null);
      load();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to save');
    }
  };

  const verifyPhone = async (a: any) => {
    const runVerify = async () => {
      try {
        const { error } = await supabase
          .from('artisans')
          .update({ phone_verified: true, phone_verified_at: new Date().toISOString() })
          .eq('id', a.id);
        if (error) throw error;
        Alert.alert('Success', 'Phone marked verified');
        load();
      } catch (err: any) {
        Alert.alert('Error', err.message || 'Failed to verify phone');
      }
    };

    Alert.alert(
      'Verify Phone',
      `Confirm you have called ${a.phone} and verified identity?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Verify', onPress: runVerify },
      ]
    );
  };

  const approveArtisan = async (a: any) => {
    try {
      const { error } = await supabase.from('artisans').update({ is_approved: true }).eq('id', a.id);
      if (error) throw error;
      Alert.alert('Success', 'Artisan approved');
      load();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to approve');
    }
  };

  const deleteArtisan = async (a: any) => {
    const runDelete = async () => {
      try {
        const { error } = await supabase.from('artisans').delete().eq('id', a.id);
        if (error) throw error;
        Alert.alert('Success', 'Artisan deleted');
        load();
      } catch (err: any) {
        Alert.alert('Error', err.message || 'Failed to delete');
      }
    };

    Alert.alert('Delete Artisan', `Are you sure you want to delete ${a.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: runDelete },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Manage Artisans</Text>
        <Button
          title="New Artisan"
          onPress={() => setEditing({ ...emptyForm })}
        />
      </View>

      <FlatList
        data={artisans}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.artisanCard as any}>
            <View style={styles.cardHeader}>
              <View style={styles.nameBlock}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.profession}>{item.profession}</Text>
              </View>
              <View style={styles.badgeRow}>
                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor: item.is_approved
                        ? alpha(colors.success, 0.1)
                        : alpha(colors.accent, 0.1),
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      { color: item.is_approved ? colors.success : colors.accent },
                    ]}
                  >
                    {item.is_approved ? 'Approved' : 'Pending'}
                  </Text>
                </View>
                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor: item.phone_verified
                        ? alpha(colors.primary, 0.1)
                        : alpha(colors.muted, 0.1),
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      { color: item.phone_verified ? colors.primary : colors.muted },
                    ]}
                  >
                    {item.phone_verified ? 'Verified' : 'Unverified'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.detailsBlock}>
              <Text style={styles.detailText}>
                <Feather name="phone" size={12} color={colors.muted} /> {item.phone}
              </Text>
              <Text style={styles.detailText}>
                <Feather name="map-pin" size={12} color={colors.muted} />{' '}
                {item.workshop_location}
              </Text>
            </View>

            <View style={styles.actionsRow}>
              {!item.phone_verified && (
                <Pressable
                  style={[styles.actionBtn, styles.primaryBtnOutline]}
                  onPress={() => verifyPhone(item)}
                >
                  <Feather name="check-circle" size={16} color={colors.primary} />
                  <Text style={styles.actionBtnTextPrimary}>Verify Phone</Text>
                </Pressable>
              )}
              {!item.is_approved && (
                <Pressable
                  style={[styles.actionBtn, styles.successBtnOutline]}
                  onPress={() => approveArtisan(item)}
                >
                  <Feather name="check" size={16} color={colors.success} />
                  <Text style={styles.actionBtnTextSuccess}>Approve</Text>
                </Pressable>
              )}
              <Pressable
                style={[styles.actionBtn, styles.editBtnOutline]}
                onPress={() =>
                  setEditing({
                    id: item.id,
                    name: item.name,
                    profession: item.profession,
                    phone: item.phone,
                    workshop_location: item.workshop_location,
                    available_hours: item.available_hours || '',
                    bio: item.bio || '',
                    latitude: item.latitude ? String(item.latitude) : '',
                    longitude: item.longitude ? String(item.longitude) : '',
                    is_available: item.is_available,
                    is_approved: item.is_approved,
                    phone_verified: item.phone_verified,
                  })
                }
              >
                <Feather name="edit-2" size={16} color={colors.text} />
                <Text style={styles.actionBtnText}>Edit</Text>
              </Pressable>
              <Pressable
                style={[styles.actionBtn, styles.dangerBtnOutline]}
                onPress={() => deleteArtisan(item)}
              >
                <Feather name="trash-2" size={16} color={colors.danger} />
              </Pressable>
            </View>
          </Card>
        )}
        contentContainerStyle={styles.list}
      />

      {editing && (
        <Modal visible={true} animationType="slide">
          <ScrollView contentContainerStyle={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {editing.id ? 'Edit Artisan' : 'New Artisan'}
            </Text>

            <Input
              label="Name"
              value={editing.name}
              onChangeText={(v) => setEditing({ ...editing, name: v })}
              placeholder="Full name or business"
            />
            <Input
              label="Profession"
              value={editing.profession}
              onChangeText={(v) => setEditing({ ...editing, profession: v })}
              placeholder="e.g. Electrician"
            />
            <Input
              label="Phone"
              value={editing.phone}
              onChangeText={(v) => setEditing({ ...editing, phone: v })}
              placeholder="0801 234 5678"
              keyboardType="phone-pad"
            />
            <Input
              label="Workshop Location"
              value={editing.workshop_location}
              onChangeText={(v) => setEditing({ ...editing, workshop_location: v })}
              placeholder="Workshop address on campus"
            />
            <Input
              label="Available Hours"
              value={editing.available_hours}
              onChangeText={(v) => setEditing({ ...editing, available_hours: v })}
              placeholder="e.g. Mon–Sat, 9am–6pm"
            />
            <Input
              label="Latitude (Optional)"
              value={editing.latitude}
              onChangeText={(v) => setEditing({ ...editing, latitude: v })}
              placeholder="5.052114"
              keyboardType="numeric"
            />
            <Input
              label="Longitude (Optional)"
              value={editing.longitude}
              onChangeText={(v) => setEditing({ ...editing, longitude: v })}
              placeholder="7.67045"
              keyboardType="numeric"
            />
            <Input
              label="Bio"
              value={editing.bio}
              onChangeText={(v) => setEditing({ ...editing, bio: v })}
              placeholder="Short bio description..."
              multiline
            />

            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Approved (Visible Publicly)</Text>
              <Pressable
                style={[
                  styles.toggleBtn,
                  editing.is_approved ? styles.toggleOn : styles.toggleOff,
                ]}
                onPress={() => setEditing({ ...editing, is_approved: !editing.is_approved })}
              >
                <Text style={editing.is_approved ? styles.toggleTextOn : styles.toggleTextOff}>
                  {editing.is_approved ? 'YES' : 'NO'}
                </Text>
              </Pressable>
            </View>

            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Phone Verified</Text>
              <Pressable
                style={[
                  styles.toggleBtn,
                  editing.phone_verified ? styles.toggleOn : styles.toggleOff,
                ]}
                onPress={() => setEditing({ ...editing, phone_verified: !editing.phone_verified })}
              >
                <Text style={editing.phone_verified ? styles.toggleTextOn : styles.toggleTextOff}>
                  {editing.phone_verified ? 'YES' : 'NO'}
                </Text>
              </Pressable>
            </View>

            <View style={styles.modalBtns}>
              <Button
                title="Cancel"
                variant="outline"
                onPress={() => setEditing(null)}
              />
              <Button title="Save" onPress={save} />
            </View>
          </ScrollView>
        </Modal>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.h1,
    fontWeight: '800',
    color: colors.text,
  },
  list: {
    paddingBottom: spacing.lg * 2,
  },
  artisanCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
    borderRadius: radius.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  nameBlock: {
    flex: 1,
  },
  name: {
    fontSize: typography.h3,
    fontWeight: '700',
    color: colors.text,
  },
  profession: {
    fontSize: typography.small,
    color: colors.muted,
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  detailsBlock: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    marginBottom: spacing.md,
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radius.sm,
    borderWidth: 1,
    gap: 6,
  },
  primaryBtnOutline: {
    borderColor: colors.primary,
  },
  successBtnOutline: {
    borderColor: colors.success,
  },
  editBtnOutline: {
    borderColor: colors.border,
  },
  dangerBtnOutline: {
    borderColor: colors.danger,
    paddingHorizontal: 8,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  actionBtnTextPrimary: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  actionBtnTextSuccess: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.success,
  },
  modalContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.lg * 2,
    backgroundColor: colors.background,
  },
  modalTitle: {
    fontSize: typography.h1,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.lg,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  toggleBtn: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  toggleOn: {
    backgroundColor: colors.primary,
  },
  toggleOff: {
    backgroundColor: colors.border,
  },
  toggleTextOn: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  toggleTextOff: {
    color: colors.muted,
    fontWeight: '700',
  },
  modalBtns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginTop: 28,
  },
});
