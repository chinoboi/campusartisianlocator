import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Input from './Input';
import Button from './Button';
import { colors, spacing } from '../../theme';

type Props = {
  onSubmit: (payload: { rating: number; text: string; author?: string }) => Promise<void> | void;
  submitting?: boolean;
};

export default function ReviewForm({ onSubmit, submitting }: Props) {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('');

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>Leave a review</Text>
      <View style={styles.starRow}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Pressable
            key={i}
            onPress={() => setRating(i)}
            accessibilityRole="button"
            accessibilityLabel={`Rate ${i} star${i > 1 ? 's' : ''}`}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <Text style={[styles.star, i <= rating ? styles.starActive : styles.starInactive]}>★</Text>
          </Pressable>
        ))}
      </View>

      <Input label="Your name (optional)" value={author} onChangeText={setAuthor} placeholder="e.g. A student" />
      <Input label="Your review" value={text} onChangeText={setText} placeholder="How was the service?" multiline />

      <Button title={submitting ? 'Saving…' : 'Submit review'} onPress={() => onSubmit({ rating, text, author })} disabled={submitting} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginTop: spacing.md },
  label: { fontWeight: '700', marginBottom: 8 },
  starRow: { flexDirection: 'row', marginBottom: 8 },
  star: { fontSize: 26, marginRight: 6 },
  starActive: { color: colors.primary },
  starInactive: { color: colors.border },
});
